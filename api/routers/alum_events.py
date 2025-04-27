from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List, Literal
from config.database import get_db
from util.alum_events_util import fetch_event_suggestions, confirm_event_rsvp, get_confirmed_events_by_user, cancel_event_rsvp, get_event_by_id, get_visible_events_for_user
from uuid import UUID
from models.usermodel import User
from util.userutil import get_current_user
from schemas.events_schema import EventOut, OneEventOut
from datetime import date

router = APIRouter()


@router.get("/search-event")
def get_event_suggestions(
    q: str = Query(..., min_length=1, description="Search event title"),
    limit: Optional[int] = Query(5, ge=1, le=20, description="Maximum number of results"),
    db: Session = Depends(get_db)
):
    return fetch_event_suggestions(db, q, limit)

@router.post("/events/{event_id}/confirm-rsvp", status_code=status.HTTP_201_CREATED)
def rsvp_to_event(event_id: UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    
    if user.user_type != user.user_type.alumni:
        raise HTTPException(status_code=400, detail="For alumni only")
    
    try:
        rsvp = confirm_event_rsvp(db, user_id=user.user_id, event_id=event_id)
        return rsvp
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.delete("/events/{event_id}/cancel-rsvp", status_code=200)
def cancel_rsvp(event_id: UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    if user.user_type != user.user_type.alumni:
        raise HTTPException(status_code=400, detail="For alumni only")
    
    try:
        result = cancel_event_rsvp(db, user_id=user.user_id, event_id=event_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/events/confirmed", response_model=List[EventOut])
def get_user_confirmed_events(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    
    if user.user_type != user.user_type.alumni:
        raise HTTPException(status_code=400, detail="For alumni only")
    
    events = get_confirmed_events_by_user(user.user_id, db)
    return events

@router.get("/one-event/{event_id}", response_model=OneEventOut)
def get_event(event_id: UUID, db: Session = Depends(get_db)):
    return get_event_by_id(event_id, db)

@router.get("/events-visible-to", response_model=List[EventOut])
def get_visible_events(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    date_filter: Optional[str] = Query(
        default=None,
        description='Filter events by date: "today", "tomorrow", "this_weekend", or a date in YYYY-MM-DD format'
    )
):
    
    return get_visible_events_for_user(user.user_id, db, date_filter)