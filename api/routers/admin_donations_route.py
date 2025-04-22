from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.donation_schema import (
    AdminDonationDriveOut, 
    AdminOneDonationDriveOut, 
    PercentOut, 
    GenericDriveOut, 
    AdminOverviewDonationDrive, 
    MonetaryDonationOut, 
    InKindDonationOut, 
    ShortenedInKindDonationsOut, 
    ShortenedMonetaryDonationsOut,
    AdminGenericDriveView
    )
from config.database import get_db
from util.admin_donations_logic import (search_donation_drives, 
                                        view_donation_drive, 
                                        get_percent_funded, 
                                        get_all_closed_drives,
                                        get_all_open_drives, 
                                        get_all_links_by_drive_id, 
                                        get_all_pending_inkind_donations, 
                                        get_all_pending_monetary_donations, 
                                        get_all_verified_inkind_donations, 
                                        get_all_verified_monetary_donations, 
                                        donation_drive_overview,
                                        verify_inkind_donation,
                                        verify_monetary_donation,
                                        close_donation_drive,
                                        update_generic_drive_stats,
                                        view_generic_drive,
                                        get_donor_counts_by_batch_for_drive,
                                        get_total_donors_for_drive,
                                        get_top_and_other_donor_batches_monetary_amount,
                                        get_donation_totals_with_percentages,
                                        get_weekly_donation_amounts
                                        )
import datetime
from uuid import UUID

router = APIRouter()

@router.get("/admin/donations/search", response_model=List[AdminDonationDriveOut])
def search_drives(
    title: str = "",
    filter_type: str = None,
    custom_start: str = None, 
    custom_end: str = None,
    db: Session = Depends(get_db)
):
    # String date input format is MM/DD/YYYY
    # Convert string dates to datetime objects if custom filter is selected
    custom_start_date = None
    custom_end_date = None
    if filter_type == "custom" and custom_start and custom_end:
        try:
            custom_start_date = datetime.datetime.strptime(custom_start, "%m/%d/%Y").date()
            custom_end_date = datetime.datetime.strptime(custom_end, "%m/%d/%Y").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Please use MM/DD/YYYY.")
    
    results = search_donation_drives(db, title, date_filter=filter_type, custom_start_date=custom_start_date, custom_end_date=custom_end_date)

    return results

@router.get("/admin/donations/update-generic-drive", response_model=GenericDriveOut)
def update_generic_drive(
    db: Session = Depends(get_db)
):

    drive_id = UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384")

    results = update_generic_drive_stats(db, drive_id)

    if results is None:
        raise HTTPException(status_code=404, detail="Drive not found")

    return results

@router.get("/admin/donations/closed-drives", response_model=List[AdminDonationDriveOut])
def closed_drives(
    db: Session = Depends(get_db)
):
    results = get_all_closed_drives(db)

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")

    return results

@router.get("/admin/donations/open-drives", response_model=List[AdminDonationDriveOut])
def open_drives(
    db: Session = Depends(get_db)
):
    results = get_all_open_drives(db)

    if not results:
        raise HTTPException(status_code=404, detail="No open drives found")

    return results

@router.get("/admin/donations/pending-inkind", response_model=List[ShortenedInKindDonationsOut])
def pending_inkind(
    drive_id: UUID,
    db: Session = Depends(get_db)
):
    results = get_all_pending_inkind_donations(db, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="No pending in-kind donations found")

    return results

@router.get("/admin/donations/pending-monetary", response_model=List[ShortenedMonetaryDonationsOut])
def pending_monetary(
    drive_id: UUID,
    db: Session = Depends(get_db)
):
    results = get_all_pending_monetary_donations(db, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="No pending monetary donations found")

    return results

@router.get("/admin/donations/verified-inkind", response_model=List[ShortenedInKindDonationsOut])
def verified_inkind(
    drive_id: UUID,
    db: Session = Depends(get_db)
):
    results = get_all_verified_inkind_donations(db, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="No verified in-kind donations found")

    return results

@router.get("/admin/donations/verified-monetary", response_model=List[ShortenedMonetaryDonationsOut])
def verified_monetary(
    drive_id: UUID,
    db: Session = Depends(get_db)
):
    results = get_all_verified_monetary_donations(db, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="No verified monetary donations found")

    return results

@router.get("/admin/donations/view/generic-drive", response_model=AdminGenericDriveView)
def view_generic_donation_drive(
    db: Session = Depends(get_db)
):
    
    drive_id = UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384")
    results = view_generic_drive(db, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="Drive not found")

    return results

@router.get("/admin/donations/view/{drive_id}", response_model=AdminOneDonationDriveOut)
def view_drive(
    drive_id: UUID,
    db: Session = Depends(get_db)
):
    results = view_donation_drive(db, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="Drive not found")

    return results

@router.get("/admin/donations/percent-funded/{drive_id}", response_model=PercentOut)
def percent_funded(
    drive_id: UUID,
    db: Session = Depends(get_db)
):
    percent = get_percent_funded(db, drive_id)

    if not percent:
        raise HTTPException(status_code=404, detail="Drive not found")

    return percent

@router.get("/admin/donations/overview/{drive_id}", response_model=AdminOverviewDonationDrive)
def overview(
    drive_id: UUID,
    db: Session = Depends(get_db)
):
    results = donation_drive_overview(db, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="No donation drives found")

    return results

@router.post("/admin/donations/verify-inkind/{donation_id}", response_model=InKindDonationOut)
def verify_inkind(
    donation_id: UUID,
    choice: str,
    db: Session = Depends(get_db)
):
    results = verify_inkind_donation(db, donation_id, choice)

    if results is None:
        raise HTTPException(status_code=404, detail="Donation not found or invalid donation.")
    elif results is False:
        raise HTTPException(status_code=400, detail="Invalid choice. Please choose 'approve' or 'disapprove'.")

    return results

@router.post("/admin/donations/verify-monetary/{donation_id}", response_model=MonetaryDonationOut)
def verify_monetary(
    donation_id: UUID,
    choice: str,
    db: Session = Depends(get_db)
):
    results = verify_monetary_donation(db, donation_id, choice)

    if results is None:
        raise HTTPException(status_code=404, detail="Donation not found or invalid donation.")
    elif results is False:
        raise HTTPException(status_code=400, detail="Invalid choice. Please choose 'approve' or 'disapprove'.")

    return results

@router.post("/admin/donations/close-drive/{drive_id}", response_model=dict)
def close_drive(
    drive_id: UUID,
    db: Session = Depends(get_db)
):
    results = close_donation_drive(db, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="Drive not found")

    return results

# Get the donor counts per batch for a specific drive
@router.get("/admin/donations/drive-donor-counts", tags=["Donations"])
def donor_counts(
    drive_id: UUID = None,
    db: Session = Depends(get_db)
):
    
    results = get_donor_counts_by_batch_for_drive(db, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="No donor counts found")
    
    return results

# Get the total number of donors for a specific drive
@router.get("/admin/donations/drive-total-donors", tags=["Donations"])
def total_donors(
    drive_id: UUID = None,
    db: Session = Depends(get_db)
):
    
    results = get_total_donors_for_drive(db, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="No donor counts found")
    
    return results

# Get the top and other donor batches monetary amount for a specific drive
@router.get("/admin/donations/top-monetary-donors", tags=["Donations"])
def donor_batch_breakdown_with_amount_only(
    drive_id: UUID, 
    db: Session = Depends(get_db)
):

    results = get_top_and_other_donor_batches_monetary_amount(db, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="No donor batches found")

    return results    

# Get the total donations of a drive
@router.get("/admin/donations/donation-totals", tags=["Donations"])
def donation_totals_with_percentages(
    drive_id: UUID, 
    db: Session = Depends(get_db)
):
    results = get_donation_totals_with_percentages(db, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="No donation totals found")

    return results

# Get the weekly monetary donations for a specific drive
@router.get("/admin/donations/weekly-amounts", tags=["Donations"])
def weekly_monetary_donations(
    drive_id: UUID, 
    db: Session = Depends(get_db)
):
    results = get_weekly_donation_amounts(db, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="No weekly amounts found")
    
    return results
