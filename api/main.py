from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import log_route, auth, userinfo, admin_user_stats, reporting, admin_account_management, alumni_search_route, alumni_search_autocomplete_route, alumni_search_suggestions_route, alum_donation, admin_donation_drive, admin_donations_route, job_posting, job_search_route, alum_events, admin_events_route, admin_newsletter_route


app = FastAPI()
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

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)