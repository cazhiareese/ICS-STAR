from fastapi import  HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, distinct
from typing import Optional, List
from models.newsletter_model import Newsletter, NewsletterTag


def fetch_newsletter_suggestions(
    db: Session,
    title: Optional[str],
    tags: Optional[List[str]],
    limit: int = 5
) -> List[dict]:
    query = db.query(Newsletter).filter(Newsletter.is_deleted.is_(False))

    if title:
        query = query.filter(Newsletter.title.ilike(f"%{title}%"))
        
    if tags:
        # query = query.outerjoin(NewsletterTag).filter(
        #     or_(
        #         NewsletterTag.tag.in_(tags),
        #         NewsletterTag.tag.is_(None)
        #     )
        # )
        
        query = query.outerjoin(NewsletterTag).filter(NewsletterTag.tag.in_(tags))

    newsletters = query.order_by(Newsletter.date_posted.desc()).limit(limit).all()

    results = [
        {
            "newsletter_id": str(n.newsletter_id),
            "title": n.title,
            "date_posted": n.date_posted.strftime("%b %d, %Y %I:%M%p"),
            "content": n.content,
            "tags": [tag.tag for tag in n.tags]
        }
        for n in newsletters
    ]

    return results