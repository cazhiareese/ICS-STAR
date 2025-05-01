from fastapi import HTTPException
from typing import List, Optional
from sqlalchemy import distinct, or_, asc, func
from sqlalchemy.orm import Session
from models.event_model import Event, EventConfirmedBy, EventDate, EventVisibleTo
from uuid import UUID
from datetime import datetime, timezone, date, timedelta
from schemas.events_schema import OneEventOut, EventOut
from util.admin_events_util import add_user_clicks


def fetch_event_suggestions(db: Session, query_text: str, limit: int = 5) -> List[str]:
    results = (
        db.query(distinct(Event.title))
        .filter(
            Event.is_deleted.is_(False),
            or_(
                Event.title.ilike(f"%{query_text}%"),
                Event.description.ilike(f"%{query_text}%")
            )
        )
        .filter(Event.title.isnot(None))
        .order_by(Event.title)
        .limit(limit)
        .all()
    )
    return [result[0] for result in results]

def confirm_event_rsvp(db: Session, user_id: UUID, event_id: UUID) -> EventConfirmedBy:
    
    existing_rsvp = db.query(EventConfirmedBy).filter_by(user_id=user_id, event_id=event_id).first()

    if existing_rsvp:
        raise ValueError("User has already confirmed RSVP for this event.")
    
    rsvp = EventConfirmedBy(user_id=user_id, event_id=event_id)
    
    db.add(rsvp)
    db.commit()
    db.refresh(rsvp)
    
    return {"success": True, "message": "RSVP confirmed"}

def cancel_event_rsvp(db: Session, user_id: UUID, event_id: UUID):
    rsvp = db.query(EventConfirmedBy).filter_by(user_id=user_id, event_id=event_id).first()

    if not rsvp:
        raise ValueError("RSVP does not exist.")

    db.delete(rsvp)
    db.commit()

    return {"success": True, "message": "RSVP cancelled"}

def get_confirmed_events_by_user(user_id: UUID, db: Session):
    now = datetime.now(timezone.utc)

    events = (
        db.query(Event)
        .join(EventConfirmedBy, Event.event_id == EventConfirmedBy.event_id)
        .filter(EventConfirmedBy.user_id == user_id)
        .filter(Event.is_deleted == False)
        .filter(Event.is_concluded == False)
        .all()
    )

    event_list = []

    for event in events:
        future_dates = sorted(
            [dt.date for dt in event.dates if dt.date >= now]
        )
        if not future_dates:
            if not event.is_concluded:
                event.is_concluded = True
                db.add(event)
            continue

        tags = [tag.tag for tag in event.tags]
        
        going_count = len(event.confirmed_by)
        
        if user_id:
            visible_event_ids = (
                db.query(EventVisibleTo.event_id)
                .filter(EventVisibleTo.user_id == user_id)
                .all()
            )
            visible_event_ids = {event_id for event_id, in visible_event_ids}

            rsvp_closed = event.event_id not in visible_event_ids and not event.is_all
        else:
            rsvp_closed = not event.is_all

        event_list.append({
            "event_id": event.event_id,
            "title": event.title,
            "image": event.image,
            "description": event.description,
            "location": event.location,
            "dates": [d.isoformat() for d in future_dates],
            "tags": tags,
            "rsvp_closed":rsvp_closed,
            "going_count": going_count
        })
    db.commit()
    sorted_events = sorted(event_list, key=lambda e: e["dates"][0])

    return [EventOut(**e) for e in sorted_events]

def get_event_by_id(event_id: UUID, db: Session, user_id: Optional[UUID] = None) -> OneEventOut:
    event = (
        db.query(Event)
        .filter(Event.event_id == event_id)
        .filter(Event.is_deleted == False)
        .first()
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    dates = event.dates
    
    # add_user_clicks(event.event_id, db)
    going_count = len(event.confirmed_by)
        
    visible_event_ids = set()
    if user_id:
        visible_event_ids = {
            event_id for (event_id,) in db.query(EventVisibleTo.event_id)
            .filter(EventVisibleTo.user_id == user_id)
            .all()
        }
        
    if user_id:
        if event.is_all:
            rsvp_closed = False
        else:
            rsvp_closed = event.event_id not in visible_event_ids
    else:
        rsvp_closed = True

    return OneEventOut(
        event_id=event.event_id,
        title=event.title,
        description=event.description,
        image=event.image,
        location=event.location,
        datetimes=[d.date for d in dates],
        links=[link.link for link in event.links],
        tags=[tag.tag for tag in event.tags],
        going_count = going_count,
        rsvp_closed=rsvp_closed
    )

def get_visible_events_for_user(
    db: Session,
    user_id: Optional[UUID],
    date_filter: Optional[str] = None
) -> List[EventOut]:
    
    now = datetime.now(timezone.utc).date()
    
    visible_event_ids = set()
    if user_id:
        visible_event_ids = set(
            event_id for (event_id,) in db.query(EventVisibleTo.event_id)
            .filter(EventVisibleTo.user_id == user_id)
            .all()
        )

    events = (
        db.query(Event)
        .filter(Event.is_deleted == False)
        .all()
    )

    event_list = []

    for event in events:
        future_dates = sorted([dt.date for dt in event.dates if dt.date.date() >= now])

        if not future_dates:
            if not event.is_concluded:
                event.is_concluded = True
                db.add(event)
            continue
        
        filtered_dates = []
        if date_filter == "today":
            filtered_dates = [d for d in future_dates if d.date() == now]
        elif date_filter == "tomorrow":
            filtered_dates = [d for d in future_dates if d.date() == now + timedelta(days=1)]
        elif date_filter == "this_weekend":
            filtered_dates = [d for d in future_dates if d.weekday() in (5, 6)]
        else:
            try:
                custom_date = datetime.strptime(date_filter, "%Y-%m-%d").date()
                filtered_dates = [d for d in future_dates if d.date() == custom_date]
            except (ValueError, TypeError):
                filtered_dates = future_dates
        if not filtered_dates:
            continue

        tags = [tag.tag for tag in event.tags]
        if user_id:
            if event.is_all:
                rsvp_closed = False
            else:
                rsvp_closed = event.event_id not in visible_event_ids
        else:
            rsvp_closed = True
        

        going_count = len(event.confirmed_by)
        
        event_list.append({
            "event_id": event.event_id,
            "title": event.title,
            "image": event.image,
            "description": event.description,
            "location": event.location,
            "dates": filtered_dates,
            "tags": tags,
            "rsvp_closed": rsvp_closed,
            "going_count": going_count
        })

    db.commit()
    sorted_events = sorted(event_list, key=lambda e: e["dates"][0])

    return [EventOut(**e) for e in sorted_events]