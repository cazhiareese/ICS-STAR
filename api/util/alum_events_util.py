from typing import List
from sqlalchemy import distinct, or_, asc, func
from sqlalchemy.orm import Session
from models.event_model import Event, EventConfirmedBy, EventDate
from uuid import UUID
from datetime import datetime, timezone


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

def get_confirmed_events_by_user(user_id: str, db: Session):
    now = datetime.now(timezone.utc)

    subquery = (
        db.query(
            EventDate.event_id,
            func.min(EventDate.date).label("next_event_date")
        )
        .filter(EventDate.date >= now)
        .group_by(EventDate.event_id)
        .subquery()
    )

    query = (
        db.query(
            Event.event_id,
            Event.title,
            Event.description,
            Event.location,
            subquery.c.next_event_date.label("event_datetime")
        )
        .join(EventConfirmedBy, Event.event_id == EventConfirmedBy.event_id)
        .join(subquery, Event.event_id == subquery.c.event_id)
        .filter(EventConfirmedBy.user_id == user_id)
        .filter(Event.is_deleted == False)
        .order_by(asc(subquery.c.next_event_date))
    )

    return query.all()
