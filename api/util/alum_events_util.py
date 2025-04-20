from fastapi import HTTPException
from typing import List
from sqlalchemy import distinct, or_, asc, func
from sqlalchemy.orm import Session
from models.event_model import Event, EventConfirmedBy, EventDate, EventVisibleTo
from uuid import UUID
from datetime import datetime, timezone
from schemas.events_schema import OneEventOut, EventOut


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
        .all()
    )

    event_list = []

    for event in events:
        future_dates = sorted(
            [dt.date for dt in event.dates if dt.date >= now]
        )
        if not future_dates:
            continue

        tags = [tag.tag for tag in event.tags]

        event_list.append({
            "event_id": event.event_id,
            "title": event.title,
            "image": event.image,
            "description": event.description,
            "location": event.location,
            "is_closed": event.is_closed,
            "dates": [d.isoformat() for d in future_dates],
            "tags": tags
        })

    sorted_events = sorted(event_list, key=lambda e: e["dates"][0])

    return [EventOut(**e) for e in sorted_events]

def get_event_by_id(event_id: UUID, db: Session) -> OneEventOut:
    event = (
        db.query(Event)
        .filter(Event.event_id == event_id)
        .filter(Event.is_deleted == False)
        .first()
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    dates = event.dates

    return OneEventOut(
        event_id=event.event_id,
        title=event.title,
        description=event.description,
        image=event.image,
        location=event.location,
        is_closed=event.is_closed,
        datetimes=[d.date for d in dates],
        links=[link.link for link in event.links],
        tags=[tag.tag for tag in event.tags],
    )

def get_visible_events_for_user(user_id: UUID, db: Session):
    now = datetime.now(timezone.utc)

    visible_event_ids = (
        db.query(EventVisibleTo.event_id)
        .filter(EventVisibleTo.user_id == user_id)
        .subquery()
    )

    events = (
        db.query(Event)
        .filter(Event.is_deleted == False)
        .filter(
            or_(
                Event.is_all == True,
                Event.event_id.in_(visible_event_ids.select())
            )
        )
        .all()
    )

    event_list = []

    for event in events:
        future_dates = sorted(
            [dt.date for dt in event.dates if dt.date >= now]
        )
        if not future_dates:
            continue

        tags = [tag.tag for tag in event.tags]

        event_list.append({
            "event_id": event.event_id,
            "title": event.title,
            "image": event.image,
            "description": event.description,
            "location": event.location,
            "is_closed": event.is_closed,
            "dates": [d for d in future_dates],
            "tags": tags
        })

    sorted_events = sorted(event_list, key=lambda e: e["dates"][0])

    return [EventOut(**e) for e in sorted_events]