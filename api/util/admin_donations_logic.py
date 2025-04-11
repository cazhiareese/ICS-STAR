from config.config import STORAGE_STRING
import datetime
from uuid import UUID
from schemas.donation_schema import (
    AdminDonationDriveOut, AdminOneDonationDriveOut, PercentOut,
    PendingInKindDonationsOut, PendingMonetaryDonationsOut,
    VerifiedInKindDonationsOut, VerifiedMonetaryDonationsOut,
    AdminOverviewDonationDrive
)

# NEED YUNG ASYNC DEF KEYWORD
async def search_donation_drives(
    supabase_client,
    search_string: str = "", 
    date_filter: str = None,
    custom_start_date: datetime.date = None,
    custom_end_date: datetime.date = None
) -> list[AdminDonationDriveOut]:
    
    # base query
    query = supabase_client.from_("donation_drive").select("*")
    
    # same logic as alumni search
    if search_string:
        query = query.ilike("title", f"%{search_string}%")
    
    # Apply date filters
    today = datetime.date.today()
    
    if date_filter == "last_7_days":
        seven_days_ago = today - datetime.timedelta(days=7)
        query = query.gte("created_at", seven_days_ago.isoformat())
    elif date_filter == "this_week":
        start_of_week = today - datetime.timedelta(days=today.weekday() + 1)
        query = query.gte("created_at", start_of_week.isoformat())
    elif date_filter == "this_month":
        start_of_month = today.replace(day=1)
        query = query.gte("created_at", start_of_month.isoformat())
    elif date_filter == "this_year":
        start_of_year = today.replace(month=1, day=1)
        query = query.gte("created_at", start_of_year.isoformat())
    elif date_filter == "custom" and custom_start_date and custom_end_date:
        query = query.gte("created_at", custom_start_date.isoformat()).lte("created_at", custom_end_date.isoformat())
    
    # Execute the query
    drives_response = query.execute()
    drives = drives_response.data
    
    if not drives: # Para ma flag yung 404
        return []
    
    # Get all drive IDs
    drive_ids = [drive["drive_id"] for drive in drives]
    
    # Fetch all monetary donations for these drives in one batch
    monetary_response = supabase_client.from_("monetary_donation") \
        .select("drive_id, amount") \
        .in_("drive_id", drive_ids) \
        .eq("is_acknowledged", True) \
        .execute()
    
    # Fetch all in-kind donations for these drives in one batch
    inkind_response = supabase_client.from_("in_kind_donation") \
        .select("drive_id") \
        .in_("drive_id", drive_ids) \
        .execute()
    
    # APPARENTLY MAS MABILIS PAG GANITO AHAHDSHH
    monetary_data = {}
    for donation in monetary_response.data:
        drive_id = donation["drive_id"]
        if drive_id not in monetary_data:
            monetary_data[drive_id] = {"count": 0, "total": 0}
        monetary_data[drive_id]["count"] += 1
        monetary_data[drive_id]["total"] += donation.get("amount", 0)
    
    inkind_counts = {}
    for donation in inkind_response.data:
        drive_id = donation["drive_id"]
        if drive_id not in inkind_counts:
            inkind_counts[drive_id] = 0
        inkind_counts[drive_id] += 1
    
    # Get target costs for all drives
    target_costs_response = supabase_client.from_("donation_drive") \
        .select("drive_id, target_cost") \
        .in_("drive_id", drive_ids) \
        .execute()
    
    target_costs = {item["drive_id"]: item.get("target_cost", 0) for item in target_costs_response.data}
    
    drive_out_list = []
    for drive in drives:
        drive_id = drive["drive_id"]
        
        # Get monetary counts and totals from our prepared data
        monetary_count = monetary_data.get(drive_id, {}).get("count", 0)
        total_amount = monetary_data.get(drive_id, {}).get("total", 0)
        
        # Get in-kind count from our prepared data
        inkind_count = inkind_counts.get(drive_id, 0)
        
        total_count = monetary_count + inkind_count
        
        # Calculate percentage
        target_cost = target_costs.get(drive_id, 0)
        total_percentage = (total_amount / target_cost) * 100 if target_cost else 0
        remaining_percentage = 100 - total_percentage if total_percentage <= 100 else 0
        
        # Format created_at date to Month DD, YYYY
        created_at = drive.get("created_at")
        date_created = None
        if created_at:
            created_date = datetime.datetime.fromisoformat(created_at.replace("Z", "+00:00"))
            date_created = created_date.strftime("%B %d, %Y")
        
        drive_out = AdminDonationDriveOut(
            drive_id=drive_id,
            title=drive.get("title"),
            created_at=date_created,
            donation_count=total_count,
            percent_funded=round(total_percentage, 2),
            amount_raised=total_amount,
            remaining_percent=round(remaining_percentage, 2),
        )
        drive_out_list.append(drive_out)
    
    return drive_out_list

async def get_all_open_drives(supabase_client) -> list[AdminDonationDriveOut]:
    # Get all open drives
    drives_response = supabase_client.from_("donation_drive") \
        .select("*") \
        .eq("is_closed", False) \
        .execute()
    
    drives = drives_response.data
    
    if not drives:
        return []
    
    drive_ids = [drive["drive_id"] for drive in drives]
    
    monetary_response = supabase_client.from_("monetary_donation") \
        .select("drive_id, amount") \
        .in_("drive_id", drive_ids) \
        .eq("is_acknowledged", True) \
        .execute()
    
    inkind_response = supabase_client.from_("in_kind_donation") \
        .select("drive_id") \
        .in_("drive_id", drive_ids) \
        .execute()
    
    monetary_data = {}
    for donation in monetary_response.data:
        drive_id = donation["drive_id"]
        if drive_id not in monetary_data:
            monetary_data[drive_id] = {"count": 0, "total": 0}
        monetary_data[drive_id]["count"] += 1
        monetary_data[drive_id]["total"] += donation.get("amount", 0)
    
    inkind_counts = {}
    for donation in inkind_response.data:
        drive_id = donation["drive_id"]
        if drive_id not in inkind_counts:
            inkind_counts[drive_id] = 0
        inkind_counts[drive_id] += 1
    
    target_costs_response = supabase_client.from_("donation_drive") \
        .select("drive_id, target_cost") \
        .in_("drive_id", drive_ids) \
        .execute()
    
    target_costs = {item["drive_id"]: item.get("target_cost", 0) for item in target_costs_response.data}
    
    drive_out_list = []
    for drive in drives:
        drive_id = drive["drive_id"]
        
        # Get monetary counts and totals from our prepared data
        monetary_count = monetary_data.get(drive_id, {}).get("count", 0)
        total_amount = monetary_data.get(drive_id, {}).get("total", 0)
        
        # Get in-kind count from our prepared data
        inkind_count = inkind_counts.get(drive_id, 0)
        
        total_count = monetary_count + inkind_count
        
        # Calculate percentage
        target_cost = target_costs.get(drive_id, 0)
        total_percentage = (total_amount / target_cost) * 100 if target_cost else 0
        remaining_percentage = 100 - total_percentage if total_percentage <= 100 else 0
        
        # Format created_at date (Month DD, YYYY)
        created_at = drive.get("created_at")
        date_created = None
        if created_at:
            created_date = datetime.datetime.fromisoformat(created_at.replace("Z", "+00:00"))
            date_created = created_date.strftime("%B %d, %Y")
        
        drive_out = AdminDonationDriveOut(
            drive_id=drive_id,
            title=drive.get("title"),
            created_at=date_created,
            donation_count=total_count,
            percent_funded=round(total_percentage, 2),
            amount_raised=total_amount,
            remaining_percent=round(remaining_percentage, 2),
        )
        drive_out_list.append(drive_out)
    
    return drive_out_list

async def get_all_closed_drives(supabase_client) -> list[AdminDonationDriveOut]:
    # same as get_all_open_drives but with is_closed=True
    drives_response = supabase_client.from_("donation_drive") \
        .select("*") \
        .eq("is_closed", True) \
        .execute()
    
    drives = drives_response.data
    
    if not drives:
        return []
    
    drive_ids = [drive["drive_id"] for drive in drives]
    
    monetary_response = supabase_client.from_("monetary_donation") \
        .select("drive_id, amount") \
        .in_("drive_id", drive_ids) \
        .eq("is_acknowledged", True) \
        .execute()
    
    inkind_response = supabase_client.from_("in_kind_donation") \
        .select("drive_id") \
        .in_("drive_id", drive_ids) \
        .execute()
    
    monetary_data = {}
    for donation in monetary_response.data:
        drive_id = donation["drive_id"]
        if drive_id not in monetary_data:
            monetary_data[drive_id] = {"count": 0, "total": 0}
        monetary_data[drive_id]["count"] += 1
        monetary_data[drive_id]["total"] += donation.get("amount", 0)
    
    inkind_counts = {}
    for donation in inkind_response.data:
        drive_id = donation["drive_id"]
        if drive_id not in inkind_counts:
            inkind_counts[drive_id] = 0
        inkind_counts[drive_id] += 1
    
    target_costs_response = supabase_client.from_("donation_drive") \
        .select("drive_id, target_cost") \
        .in_("drive_id", drive_ids) \
        .execute()
    
    target_costs = {item["drive_id"]: item.get("target_cost", 0) for item in target_costs_response.data}
    
    drive_out_list = []
    for drive in drives:
        drive_id = drive["drive_id"]
        
        monetary_count = monetary_data.get(drive_id, {}).get("count", 0)
        total_amount = monetary_data.get(drive_id, {}).get("total", 0)
        
        inkind_count = inkind_counts.get(drive_id, 0)
        
        total_count = monetary_count + inkind_count
        
        # Calculate percentage
        target_cost = target_costs.get(drive_id, 0)
        total_percentage = (total_amount / target_cost) * 100 if target_cost else 0
        remaining_percentage = 100 - total_percentage if total_percentage <= 100 else 0
        
        created_at = drive.get("created_at")
        date_created = None
        if created_at:
            created_date = datetime.datetime.fromisoformat(created_at.replace("Z", "+00:00"))
            date_created = created_date.strftime("%B %d, %Y")
        
        drive_out = AdminDonationDriveOut(
            drive_id=drive_id,
            title=drive.get("title"),
            created_at=date_created,
            donation_count=total_count,
            percent_funded=round(total_percentage, 2),
            amount_raised=total_amount,
            remaining_percent=round(remaining_percentage, 2),
        )
        drive_out_list.append(drive_out)
    
    return drive_out_list

async def view_donation_drive(supabase_client, drive_id: UUID) -> AdminOneDonationDriveOut:
    drive_response = supabase_client.from_("donation_drive") \
        .select("*") \
        .eq("drive_id", str(drive_id)) \
        .single() \
        .execute()
    
    drive = drive_response.data
    
    if not drive:
        return []
    
    monetary_response = supabase_client.from_("monetary_donation") \
        .select("donation_id, amount, date_donated, is_acknowledged, users!inner(first_name, last_name)") \
        .eq("drive_id", str(drive_id)) \
        .execute()
    
    inkind_response = supabase_client.from_("in_kind_donation") \
        .select("donation_id, description, date_donated, is_acknowledged, users!inner(first_name, last_name)") \
        .eq("drive_id", str(drive_id)) \
        .execute()
    
    # monetary donations
    total_amount = 0
    pending_monetary = []
    verified_monetary = []
    
    for donation in monetary_response.data:
        user = donation.get("users", {})
        name = f"{user.get('first_name', '')} {user.get('last_name', '')}"
        amount = donation.get("amount", 0)
        date_donated = donation.get("date_donated")
        formatted_date = None
        if date_donated:
            date_obj = datetime.datetime.fromisoformat(date_donated.replace("Z", "+00:00"))
            formatted_date = date_obj.strftime("%m/%d/%Y")
        
        if donation.get("is_acknowledged", False):
            total_amount += amount
            verified_monetary.append({
                "donation_id": donation.get("donation_id"),
                "date_donated": formatted_date,
                "name": name,
                "donation_type": "Monetary",
                "donation_details": f"₱{amount:,.2f}"
            })
        else:
            pending_monetary.append({
                "donation_id": donation.get("donation_id"),
                "name": name,
                "donation_details": f"₱{amount:,.2f}",
                "date_donated": formatted_date,
            })
    
    # in-kind donations
    pending_inkind = []
    verified_inkind = []
    
    for donation in inkind_response.data:
        user = donation.get("users", {})
        name = f"{user.get('first_name', '')} {user.get('last_name', '')}"
        description = donation.get("description", "")
        date_donated = donation.get("date_donated")
        formatted_date = None
        if date_donated:
            date_obj = datetime.datetime.fromisoformat(date_donated.replace("Z", "+00:00"))
            formatted_date = date_obj.strftime("%m/%d/%Y")
        
        if donation.get("is_acknowledged", False):
            verified_inkind.append({
                "donation_id": donation.get("donation_id"),
                "date_donated": formatted_date,
                "name": name,
                "donation_type": "In-kind",
                "donation_details": description
            })
        else:
            pending_inkind.append({
                "donation_id": donation.get("donation_id"),
                "name": name,
                "donation_details": description,
                "date_donated": formatted_date,
            })
    
    pending_verifications = pending_monetary + pending_inkind
    verified_donations = verified_monetary + verified_inkind
    
    target_cost = drive.get("target_cost", 0)
    total_percentage = (total_amount / target_cost) * 100 if target_cost else 0
    remaining_percentage = 100 - total_percentage if total_percentage <= 100 else 0
    
    return AdminOneDonationDriveOut(
        drive_id=drive_id,
        title=drive.get("title"),
        percent_funded=round(total_percentage, 2),
        pending_list=pending_verifications,
        verified_list=verified_donations,
        current_amount=total_amount,
        target_cost=target_cost,
        is_closed=drive.get("is_closed"),
        remaining_percent=round(remaining_percentage, 2),
    )

async def donation_drive_overview(supabase_client, drive_id: UUID) -> AdminOverviewDonationDrive:
    drive_response = supabase_client.from_("donation_drive") \
        .select("*") \
        .eq("drive_id", str(drive_id)) \
        .single() \
        .execute()
    
    drive = drive_response.data
    
    if not drive:
        return []
    
    links_response = supabase_client.from_("donation_drive_link") \
        .select("link") \
        .eq("drive_id", str(drive_id)) \
        .execute()
    
    drive_links = [link.get("link") for link in links_response.data] if links_response.data else []
    
    created_at = None
    if drive.get("created_at"):
        created_at = datetime.datetime.fromisoformat(drive.get("created_at").replace("Z", "+00:00"))
    
    return AdminOverviewDonationDrive(
        donation_id=drive.get("drive_id"),
        image=f"{STORAGE_STRING}{drive.get('image')}" if drive.get("image") else None,
        created_at=created_at,
        description=drive.get("description"),
        links=drive_links
    )