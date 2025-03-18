from fastapi import FastAPI
from routers import userlogs_routes, reports_routes

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

app.include_router(userlogs_routes.router)
app.include_router(reports_routes.router)
