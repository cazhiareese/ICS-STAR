from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://{}")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
SECRET_KEY = "c85f7f6d5009815e7b69bf6eabc655fb1a2533d1f808fe1e950961f2b5add6da"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
