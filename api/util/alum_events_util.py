from typing import List
from sqlalchemy import distinct, or_
from sqlalchemy.orm import Session
from models.event_model import Event, EventConfirmedBy
from sqlalchemy.exc import IntegrityError
from uuid import UUID


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
