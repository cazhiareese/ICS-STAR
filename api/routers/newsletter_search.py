from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from config.database import get_db
from util.newsletter_search_util import fetch_newsletter_suggestions


router = APIRouter()


@router.get("/search-newsletters")
def search_newsletters(
    title: Optional[str] = Query(None, description="Search by newsletter title"),
    tags: Optional[List[str]] = Query(None, description="List of tags"),
    limit: int = Query(5, ge=1, le=50, description="Max number of results"),
    db: Session = Depends(get_db)
):
    return fetch_newsletter_suggestions(db, title, tags, limit)