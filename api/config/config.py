from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
from sqlalchemy.pool import NullPool
import supabase
from models import *  

load_dotenv()
DATABASE_URL = os.getenv('DB_STRING')
engine = create_engine(DATABASE_URL, client_encoding='utf8', poolclass=NullPool)
try:
   connection = engine.connect()
   print("Successfully connected to the database!")
   connection.close()
except Exception as e:
   print(f"Error connecting to database: {e}")
   
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
Base.metadata.create_all(bind=engine)
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = 60

STORAGE_URL = os.getenv("STORAGE_URL")
STORAGE_STRING = os.getenv("STORAGE_STRING")
STORAGE_API_KEY = os.getenv("STORAGE_API_KEY")
supabase_client = supabase.create_client(STORAGE_URL, STORAGE_API_KEY)
SUPABASE_BUCKET = os.getenv("BUCKET_NAME")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
MAYA_PUBLIC_KEY = os.getenv("MAYA_PUBLIC")
MAYA_SUCCESS = os.getenv("MAYA_SUCCESS")
MAYA_FAIL = os.getenv("MAYA_FAIL")
MAYA_CANCEL = os.getenv("MAYA_CANCEL")
MAYA_URL = os.getenv("MAYA_URL")