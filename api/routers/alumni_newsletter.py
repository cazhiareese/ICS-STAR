from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, Query
from uuid import UUID
from config.database import get_db
from typing import Optional, List
from schemas.newsletter_schema import NewsLetterOut, SingleNewsLetterOut
from models.newsletter_model import Newsletter, NewsletterLink, NewsletterTag

router = APIRouter(
    prefix="/api/newsletter",
    tags=["Alumni and Student Newsletter"],
    responses={404: {"description": "Not found"}},
)

# Get all tags
@router.get("/tags", response_model=List[str])
def get_all_tags(
    db=Depends(get_db),
):
    # Get all unique tags from the NewsletterTag table
    tags = db.query(NewsletterTag.tag).distinct().all()

    if not tags:
        raise HTTPException(status_code=404, detail="No tags found")

    return [tag[0] for tag in tags]

# Get all newsletters
@router.get("/all", response_model=List[NewsLetterOut])
def get_all_newsletters(
    db=Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    sort_by: str = Query("newest", description="Sort by: newest or oldest"),
    tags: List[str] = Query(None, description="Filter by tags (can specify multiple)")
):
    # Create the base query
    query = db.query(Newsletter).filter(Newsletter.is_deleted == False)
    
    # Apply tag filtering if tags are provided
    if tags and len(tags) > 0:
        # For each tag in the list, filter newsletters that have that tag
        for tag in tags:
            query = query.filter(
                Newsletter.newsletter_id.in_(
                    db.query(NewsletterTag.newsletter_id)
                    .filter(NewsletterTag.tag == tag)
                )
            )
    
    # Apply sorting - just newest or oldest
    if sort_by.lower() == "oldest":
        query = query.order_by(Newsletter.date_posted.asc())
    else:  # Default to newest
        query = query.order_by(Newsletter.date_posted.desc())
    
    # Apply pagination and get results
    newsletters = query.offset(skip).limit(limit).all()
    
    if not newsletters:
        raise HTTPException(status_code=404, detail="No newsletters found")
    
    result = []
    for newsletter in newsletters:
        newsletter_data = {
            "newsletter_id": newsletter.newsletter_id,
            "title": newsletter.title,
            "image": newsletter.image,
            "date_posted": newsletter.date_posted.strftime("%B %d, %Y, %I:%M %p"),
            "content": newsletter.content,
            "tags": [tag.tag for tag in newsletter.tags]
        }
        result.append(newsletter_data)
    
    return result

# Get a single newsletter by ID
@router.get("/{newsletter_id}", response_model=SingleNewsLetterOut)
def get_newsletter_by_id(
    newsletter_id: UUID,
    db=Depends(get_db),
):
    newsletter = db.query(Newsletter).filter(Newsletter.newsletter_id == newsletter_id, Newsletter.is_deleted == False).first()
    
    if not newsletter:
        raise HTTPException(status_code=404, detail="Newsletter not found")
    
    # Create a dict with the newsletter data
    newsletter_data = {
        "newsletter_id": newsletter.newsletter_id,
        "title": newsletter.title,
        "image": newsletter.image,
        "date_posted": newsletter.date_posted.strftime("%B %d, %Y, %I:%M %p"),
        "content": newsletter.content,
        "tags": [tag.tag for tag in newsletter.tags],
        "links": [link.link for link in newsletter.links]
    }
    
    return newsletter_data

# Get more like this newsletters based on the tags of a given newsletter
@router.get("/more_like_this/{newsletter_id}", response_model=List[NewsLetterOut])
def get_more_like_this(
    newsletter_id: UUID,
    db=Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    # Get the tags of the given newsletter
    newsletter = db.query(Newsletter).filter(Newsletter.newsletter_id == newsletter_id, Newsletter.is_deleted == False).first()
    
    if not newsletter:
        raise HTTPException(status_code=404, detail="Newsletter not found")
    
    tags = [tag.tag for tag in newsletter.tags]
    
    # Create the base query
    query = db.query(Newsletter).filter(Newsletter.is_deleted == False)

    # Apply tag filtering if tags are provided
    if tags:
        query = query.filter(
            Newsletter.newsletter_id.in_(
                db.query(NewsletterTag.newsletter_id)
                .filter(NewsletterTag.tag.in_(tags))
            )
        )

    # Exclude the current newsletter from the results
    query = query.filter(Newsletter.newsletter_id != newsletter_id)

    # Apply pagination and get results
    newsletters = query.offset(skip).limit(limit).all()
    
    if not newsletters:
        raise HTTPException(status_code=404, detail="No newsletters found")
    
    result = []
    for newsletter in newsletters:
        newsletter_data = {
            "newsletter_id": newsletter.newsletter_id,
            "title": newsletter.title,
            "image": newsletter.image,
            "date_posted": newsletter.date_posted.strftime("%B %d, %Y, %I:%M %p"),
            "content": newsletter.content,
            "tags": [tag.tag for tag in newsletter.tags]
        }
        result.append(newsletter_data)
    
    return result
