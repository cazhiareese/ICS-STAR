from fastapi import APIRouter, Depends, HTTPException
from typing import List
from schemas.donation_schema import (
    AdminDonationDriveOut, AdminOneDonationDriveOut, PercentOut, 
    GenericDriveOut, PendingInKindDonationsOut, PendingMonetaryDonationsOut, 
    VerifiedInKindDonationsOut, VerifiedMonetaryDonationsOut, AdminOverviewDonationDrive
)
from config.database import get_supabase_client
from util.admin_donations_logic import (
    search_donation_drives, view_donation_drive,  
    get_all_closed_drives, get_all_open_drives,  
    donation_drive_overview
)
import datetime
from uuid import UUID

router = APIRouter()

@router.get("/admin/donations/search", response_model=List[AdminDonationDriveOut])
async def search_drives(
    title: str = "",
    filter_type: str = None,
    custom_start: str = None, 
    custom_end: str = None,
    supabase = Depends(get_supabase_client)
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
    
    results = await search_donation_drives(
        supabase, 
        search_string=title, 
        date_filter=filter_type, 
        custom_start_date=custom_start_date, 
        custom_end_date=custom_end_date
    )

    return results

# TODO: Uncomment if implementing this route
# @router.get("/admin/donations/update-generic-drive", response_model=GenericDriveOut)
# async def update_generic_drive(
#     drive_id: UUID,
#     supabase = Depends(get_supabase_client)
# ):
#     drive_id = UUID("98ba9554-28e1-4ad8-a199-7ecd3a57b384")
#
#     results = update_generic_drive_stats(supabase, drive_id)
#
#     if results is None:
#         raise HTTPException(status_code=404, detail="Drive not found")
#
#     return results

@router.get("/admin/donations/closed-drives", response_model=List[AdminDonationDriveOut])
async def closed_drives(
    supabase = Depends(get_supabase_client)
):
    results = await get_all_closed_drives(supabase)

    if not results:
        raise HTTPException(status_code=404, detail="No closed drives found")

    return results

@router.get("/admin/donations/open-drives", response_model=List[AdminDonationDriveOut])
async def open_drives(
    supabase = Depends(get_supabase_client)
):
    results = await get_all_open_drives(supabase)

    if not results:
        raise HTTPException(status_code=404, detail="No open drives found")

    return results

# @router.get("/admin/donations/pending-inkind", response_model=List[PendingInKindDonationsOut])
# async def pending_inkind(
#     drive_id: UUID,
#     supabase = Depends(get_supabase_client)
# ):
#     results = get_all_pending_inkind_donations(supabase, drive_id)

#     if not results:
#         raise HTTPException(status_code=404, detail="No pending in-kind donations found")

#     return results

# @router.get("/admin/donations/pending-monetary", response_model=List[PendingMonetaryDonationsOut])
# async def pending_monetary(
#     drive_id: UUID,
#     supabase = Depends(get_supabase_client)
# ):
#     results = get_all_pending_monetary_donations(supabase, drive_id)

#     if not results:
#         raise HTTPException(status_code=404, detail="No pending monetary donations found")

#     return results

# @router.get("/admin/donations/verified-inkind", response_model=List[VerifiedInKindDonationsOut])
# async def verified_inkind(
#     drive_id: UUID,
#     supabase = Depends(get_supabase_client)
# ):
#     results = get_all_verified_inkind_donations(supabase, drive_id)

#     if not results:
#         raise HTTPException(status_code=404, detail="No verified in-kind donations found")

#     return results

# @router.get("/admin/donations/verified-monetary", response_model=List[VerifiedMonetaryDonationsOut])
# async def verified_monetary(
#     drive_id: UUID,
#     supabase = Depends(get_supabase_client)
# ):
#     results = get_all_verified_monetary_donations(supabase, drive_id)

#     if not results:
#         raise HTTPException(status_code=404, detail="No verified monetary donations found")

#     return results

@router.get("/admin/donations/view/{drive_id}", response_model=AdminOneDonationDriveOut)
async def view_drive(
    drive_id: UUID,
    supabase = Depends(get_supabase_client)
):
    results = await view_donation_drive(supabase, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="Drive not found")

    return results

# @router.get("/admin/donations/percent-funded/{drive_id}", response_model=PercentOut)
# async def percent_funded(
#     drive_id: UUID,
#     supabase = Depends(get_supabase_client)
# ):
#     percent = get_percent_funded(supabase, drive_id)

#     if not percent:
#         raise HTTPException(status_code=404, detail="Drive not found")

#     return percent

@router.get("/admin/donations/overview/{drive_id}", response_model=AdminOverviewDonationDrive)
async def overview(
    drive_id: UUID,
    supabase = Depends(get_supabase_client)
):
    results = await donation_drive_overview(supabase, drive_id)

    if not results:
        raise HTTPException(status_code=404, detail="No donation drives found")

    return results