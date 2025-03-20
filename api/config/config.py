from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
from sqlalchemy.pool import NullPool

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
SECRET_KEY = "c85f7f6d5009815e7b69bf6eabc655fb1a2533d1f808fe1e950961f2b5add6da"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
