from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
from sqlalchemy.pool import NullPool
import secrets

load_dotenv()

DATABASE_URL = "postgresql://postgres.ocmxiyulokpueycaxbuv:cmsc128@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

engine = create_engine(DATABASE_URL, client_encoding='utf8', poolclass=NullPool)

try:
   connection = engine.connect()
   print("Successfully connected to the database!")
   connection.close()
except Exception as e:
   print(f"Error connecting to database: {e}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

Base.metadata.create_all(engine)

SECRET_KEY = secrets.token_hex(32)
SECRET_KEY = os.getenv("SECRET_KEY")