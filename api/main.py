from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import log_route, auth, userinfo, admin_user_stats, reporting, admin_account_management, alumni_search_route, alumni_search_autocomplete_route


app = FastAPI()
app.include_router(log_route.router)
app.include_router(auth.router)
app.include_router(reporting.router)
app.include_router(admin_account_management.router)
app.include_router(admin_user_stats.router)
app.include_router(userinfo.router)
app.include_router(alumni_search_route.router)
app.include_router(alumni_search_autocomplete_route.router)


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,

    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)