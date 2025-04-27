import math
from fastapi import APIRouter, Depends, HTTPException, Query
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
    AdminGenericDriveView,
    AdminClosedDonationDriveOut,
    AdminDonationDriveOut,
    PaginatedDonationDrivesResponse,
    PaginatedClosedDonationDrivesResponse
    )
from models.donationmodel import DonationDrive
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
                                        get_weekly_donation_amounts,
                                        get_all_open_drives_by_amount_raised_descending,
                                        get_all_open_drives_by_amount_raised_ascending,
                                        get_all_open_drives_by_percent_funded_ascending,
                                        get_all_open_drives_by_percent_funded_descending,
                                        get_all_open_drives_by_date_created_newest,
                                        get_all_open_drives_by_date_created_oldest,
                                        get_all_open_drives_by_donation_count_ascending,
                                        get_all_open_drives_by_donation_count_descending,
                                        get_all_closed_drives_by_amount_raised_ascending,
                                        get_all_closed_drives_by_amount_raised_descending,
                                        get_all_closed_drives_by_date_closed_newest,
                                        get_all_closed_drives_by_date_closed_oldest,
                                        get_all_closed_drives_by_date_created_newest,
                                        get_all_closed_drives_by_date_created_oldest,
                                        get_all_closed_drives_by_donation_count_ascending,
                                        get_all_closed_drives_by_donation_count_descending,
                                        get_all_closed_drives_by_percent_funded_ascending,
                                        get_all_closed_drives_by_percent_funded_descending,
                                        get_all_closed_drives_by_target_cost_ascending,
                                        get_all_closed_drives_by_target_cost_descending,
                                        update_generic_drive_stats_custom_range,
                                        update_generic_drive_stats_last_seven_days,
                                        update_generic_drive_stats_this_month,
                                        update_generic_drive_stats_this_week,
                                        update_generic_drive_stats_this_year,
                                        get_top_drives_with_goals_reached,
                                        get_top_performing_drives
                                        )
from datetime import datetime
from uuid import UUID

router = APIRouter(tags=["Admin Donations View"])

def paginate_results(results: list, page: int, page_size: int):
    total_items = len(results)
    total_pages = (total_items + page_size - 1) // page_size

    if page > total_pages and total_pages != 0:
        raise HTTPException(status_code=404, detail="Page not found")

    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_results = results[start_idx:end_idx]

    return total_pages, paginated_results

@router.get("/admin/donations/search", response_model=List[AdminDonationDriveOut])
def search_drives(
    title: str = "",
    db: Session = Depends(get_db)
):
    
    results = search_donation_drives(db, title)

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

@router.get("/admin/donations/update-generic-drive-custom-range", response_model=GenericDriveOut)
def update_generic_drive_custom_range(
    start_date: str,
    end_date: str,
    db: Session = Depends(get_db)
):

    drive_id = UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384")

    results = update_generic_drive_stats_custom_range(db, drive_id, start_date, end_date)

    if results is None:
        raise HTTPException(status_code=404, detail="Drive not found")

    return results

@router.get("/admin/donations/update-generic-drive-last-seven-days", response_model=GenericDriveOut)
def update_generic_drive_last_seven_days(
    db: Session = Depends(get_db)
):

    drive_id = UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384")

    results = update_generic_drive_stats_last_seven_days(db, drive_id)

    if results is None:
        raise HTTPException(status_code=404, detail="Drive not found")

    return results

@router.get("/admin/donations/update-generic-drive-this-month", response_model=GenericDriveOut)
def update_generic_drive_this_month(
    db: Session = Depends(get_db)
):

    drive_id = UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384")

    results = update_generic_drive_stats_this_month(db, drive_id)

    if results is None:
        raise HTTPException(status_code=404, detail="Drive not found")

    return results

@router.get("/admin/donations/update-generic-drive-this-week", response_model=GenericDriveOut)
def update_generic_drive_this_week(
    db: Session = Depends(get_db)
):

    drive_id = UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384")

    results = update_generic_drive_stats_this_week(db, drive_id)

    if results is None:
        raise HTTPException(status_code=404, detail="Drive not found")

    return results

@router.get("/admin/donations/update-generic-drive-this-year", response_model=GenericDriveOut)
def update_generic_drive_this_year(
    db: Session = Depends(get_db)
):

    drive_id = UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384")

    results = update_generic_drive_stats_this_year(db, drive_id)

    if results is None:
        raise HTTPException(status_code=404, detail="Drive not found")

    return results

@router.get("/admin/donations/closed-drives", response_model=PaginatedClosedDonationDrivesResponse)
def closed_drives(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number")
):
    results = get_all_closed_drives(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedClosedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/closed-drives-by-amount-raised-descending", response_model=PaginatedClosedDonationDrivesResponse)
def closed_drives_by_amount_raised(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number")
):
    results = get_all_closed_drives_by_amount_raised_descending(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedClosedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/closed-drives-by-amount-raised-ascending", response_model=PaginatedClosedDonationDrivesResponse)
def closed_drives_by_amount_raised_ascending(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number")
):
    results = get_all_closed_drives_by_amount_raised_ascending(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedClosedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/closed-drives-by-date-closed-newest", response_model=PaginatedClosedDonationDrivesResponse)
def closed_drives_by_date_closed_newest(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number")
):
    results = get_all_closed_drives_by_date_closed_newest(db)
    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedClosedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/closed-drives-by-date-closed-oldest", response_model=PaginatedClosedDonationDrivesResponse)
def closed_drives_by_date_closed_oldest(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number")
):
    results = get_all_closed_drives_by_date_closed_oldest(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedClosedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/closed-drives-by-date-created-newest", response_model=PaginatedClosedDonationDrivesResponse)
def closed_drives_by_date_created_newest(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number")
):
    results = get_all_closed_drives_by_date_created_newest(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedClosedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/closed-drives-by-date-created-oldest", response_model=PaginatedClosedDonationDrivesResponse)
def closed_drives_by_date_created_oldest(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number")
):
    results = get_all_closed_drives_by_date_created_oldest(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedClosedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/closed-drives-by-donation-count-descending", response_model=PaginatedClosedDonationDrivesResponse)
def closed_drives_by_donation_count_descending(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number")
):
    results = get_all_closed_drives_by_donation_count_descending(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedClosedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/closed-drives-by-donation-count-ascending", response_model=PaginatedClosedDonationDrivesResponse)
def closed_drives_by_donation_count_ascending(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number")
):
    results = get_all_closed_drives_by_donation_count_ascending(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedClosedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/closed-drives-by-percent-funded-descending", response_model=PaginatedClosedDonationDrivesResponse)
def closed_drives_by_percent_funded_descending(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number")
):
    results = get_all_closed_drives_by_percent_funded_descending(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedClosedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/closed-drives-by-percent-funded-ascending", response_model=PaginatedClosedDonationDrivesResponse)
def closed_drives_by_percent_funded_ascending(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number")
):
    results = get_all_closed_drives_by_percent_funded_ascending(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedClosedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/closed-drives-by-target-cost-ascending", response_model=PaginatedClosedDonationDrivesResponse)
def closed_drives_by_target_cost_ascending(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number")
):
    results = get_all_closed_drives_by_target_cost_ascending(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedClosedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/closed-drives-by-target-cost-descending", response_model=List[AdminClosedDonationDriveOut])
def closed_drives_by_target_cost_descending(
    db: Session = Depends(get_db)
):
    results = get_all_closed_drives_by_target_cost_descending(db)

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")

    return results

@router.get("/admin/donations/closed-drives-by-date-created-oldest", response_model=List[AdminClosedDonationDriveOut])
def closed_drives_by_date_created_oldest(
    db: Session = Depends(get_db)
):
    results = get_all_closed_drives_by_date_created_oldest(db)

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")

    return results


@router.get("/admin/donations/open-drives", response_model=PaginatedDonationDrivesResponse)
def open_drives(
    page: int = Query(1, ge=1, description="Page number"),
    db: Session = Depends(get_db)
):
    page_size = 10
    
    # Get the total count for pagination
    total_count = db.query(DonationDrive).filter(DonationDrive.is_closed == False).count()
    total_pages = math.ceil(total_count / page_size) if total_count > 0 else 1
    
    # Get paginated results
    results = get_all_open_drives(db, page=page, page_size=page_size)

    if not results and page > 1:
        raise HTTPException(status_code=404, detail="Page not found")

    # Return the formatted response
    return PaginatedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=results
    )

@router.get("/admin/donations/open-drives-by-amount-raised-descending", response_model=PaginatedDonationDrivesResponse)
def open_drives_by_amount_raised(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
):
    results = get_all_open_drives_by_amount_raised_descending(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No open drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/open-drives-by-amount-raised-ascending", response_model=PaginatedDonationDrivesResponse)
def open_drives_by_amount_raised_ascending(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
):
    results = get_all_open_drives_by_amount_raised_ascending(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No open drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/open-drives-by-percent-funded-descending", response_model=PaginatedDonationDrivesResponse)
def open_drives_by_percent_funded_descending(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
):
    results = get_all_open_drives_by_percent_funded_descending(db)
    
    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No open drives found")

    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/open-drives-by-percent-funded-ascending", response_model=PaginatedDonationDrivesResponse)
def open_drives_by_percent_funded_ascending(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
):
    results = get_all_open_drives_by_percent_funded_ascending(db)
    
    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No open drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/open-drives-by-donation-count-descending", response_model=PaginatedDonationDrivesResponse)
def open_drives_by_donation_count_descending(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
):
    results = get_all_open_drives_by_donation_count_descending(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No open drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/open-drives-by-donation-count-ascending", response_model=PaginatedDonationDrivesResponse)
def open_drives_by_donation_count_ascending(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
):
    results = get_all_open_drives_by_donation_count_ascending(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No open drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/open-drives-by-date-created-newest", response_model=PaginatedDonationDrivesResponse)
def open_drives_by_date_created_newest(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
):
    results = get_all_open_drives_by_date_created_newest(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No open drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

@router.get("/admin/donations/open-drives-by-date-created-oldest", response_model=PaginatedDonationDrivesResponse)
def open_drives_by_date_created_oldest(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
):
    results = get_all_open_drives_by_date_created_oldest(db)

    page_size = 10

    if not results:
        raise HTTPException(status_code=404, detail="No open drives found")
    
    total_pages, paginated_results = paginate_results(results, page, page_size)

    return PaginatedDonationDrivesResponse(
        message="success",
        page=page,
        total_pages=total_pages,
        data=paginated_results
    )

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

@router.put("/admin/donations/verify-inkind/{donation_id}", response_model=InKindDonationOut)
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

@router.put("/admin/donations/verify-monetary/{donation_id}", response_model=MonetaryDonationOut)
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

@router.put("/admin/donations/close-drive/{drive_id}", response_model=dict)
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

# Get the top drives with goals reached
@router.get("/admin/donations/top-drives-with-goals-reached", tags=["Donations"])
def top_drives_with_goals_reached(
    time_filter: str = Query(..., description="Filter type: 'last_7_days', 'last_30_days', or 'monthly'"),
    month: int = Query(None, description="Month number (1-12) - required for monthly filter", ge=1, le=12),
    year: int = Query(None, description="Year - required for monthly filter", ge=2000),
    db: Session = Depends(get_db)
):
    try:
        results = get_top_drives_with_goals_reached(db, time_filter, month, year)
        
        if not results:
            raise HTTPException(status_code=404, detail="No drives found with goals reached")
        
        return results
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Get the top performing drives
@router.get("/admin/donations/top-performing-drives", tags=["Donations"])
def top_performing_drives(
    time_filter: str = Query(..., description="Filter type: 'last_7_days', 'last_30_days', or 'monthly'"),
    month: int = Query(None, description="Month number (1-12) - required for monthly filter", ge=1, le=12),
    year: int = Query(None, description="Year - required for monthly filter", ge=2000),
    db: Session = Depends(get_db)
):
    try:
        results = get_top_performing_drives(db, time_filter, month, year)
        
        if not results:
            raise HTTPException(status_code=404, detail="No drives found")
        
        return results
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))