from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from config.database import get_db
from util.alum_events_util import fetch_event_suggestions

router = APIRouter()


@router.get("/get-event")
def get_event_suggestions(
    q: str = Query(..., min_length=1, description="Search event title"),
    limit: Optional[int] = Query(5, ge=1, le=20, description="Maximum number of results"),
    db: Session = Depends(get_db)
):
    return fetch_event_suggestions(db, q, limit)
