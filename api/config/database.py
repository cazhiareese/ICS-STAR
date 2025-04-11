from config import config

def get_db():
    db = config.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_supabase_client():
    # Assuming supabase_client is a global variable in the config module
    return config.supabase_client