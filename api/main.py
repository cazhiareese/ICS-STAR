from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import (log_route, 
                     auth, 
                     userinfo, 
                     admin_user_stats, 
                     reporting, 
                     admin_account_management, 
                     alumni_search_route, 
                     alumni_search_autocomplete_route, 
                     alumni_search_suggestions_route, 
                     alum_donation, admin_donation_drive, 
                     admin_donations_route, 
                     job_posting, 
                     job_search_route, 
                     alum_events, 
                     admin_events_route, 
                     admin_newsletter_route, 
                     alumni_newsletter, 
                     newsletter_search, 
                     admin_engagement_statistics, 
                     admin_dashboard_routes
                     )


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,

    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],

)

app.include_router(log_route.router)
app.include_router(auth.router)
app.include_router(reporting.router)
app.include_router(admin_account_management.router)
app.include_router(admin_user_stats.router)
app.include_router(userinfo.router)
app.include_router(alumni_search_route.router)
app.include_router(alumni_search_autocomplete_route.router)
app.include_router(alumni_search_suggestions_route.router)
app.include_router(alum_donation.router)
app.include_router(admin_donation_drive.router)
app.include_router(admin_donations_route.router)
app.include_router(job_posting.router)
app.include_router(alum_events.router)
app.include_router(admin_events_route.event_router)
app.include_router(job_search_route.router)
app.include_router(admin_newsletter_route.newsletter_router)
app.include_router(alumni_newsletter.router)
app.include_router(newsletter_search.router)
app.include_router(admin_engagement_statistics.router)
app.include_router(admin_dashboard_routes.router)

