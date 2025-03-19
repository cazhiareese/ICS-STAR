from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import log_route

app = FastAPI()
app.include_router(log_route.router)

@app.get("/")
def read_root():
    return {"ICS-STAR API": "Welcome to the ICS-STAR API!"}

origins = [
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)