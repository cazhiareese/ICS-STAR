from config import config

def get_db():
    db = config.SessionLocal()
    try:
        yield db
    finally:
        db.close()