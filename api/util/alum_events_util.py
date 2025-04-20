from typing import List
from sqlalchemy import distinct, or_
from sqlalchemy.orm import Session
from models.event_model import Event


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
