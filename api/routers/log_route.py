from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from util import reports_logic
from util.userutil import require_admin

router = APIRouter()

@router.get("/report/thirty_days", dependencies=[Depends(require_admin)], response_model=None)
def get_30_days_report(db: Session = Depends(reports_logic.get_db)):
    return reports_logic.logic_30_days_report(db)

@router.get("/report/batch", dependencies=[Depends(require_admin)], response_model=None)
def get_batch_visits(db: Session = Depends(reports_logic.get_db)):
    return reports_logic.logic_batch_visits(db)