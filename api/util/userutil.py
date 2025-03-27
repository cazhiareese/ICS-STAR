from datetime import datetime, timedelta, timezone
import jwt
import uuid
import supabase
from fastapi import Depends, FastAPI, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from config.config import SECRET_KEY, ALGORITHM, SessionLocal, supabase_client, STORAGE_STRING
from config.database import get_db
from models.usermodel import User, UserTypeEnum

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

ALLOWED_EXTENSIONS = {"jpeg", "jpg", "png", "pdf", "heic", "docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

async def register_user(
    first_name: str,
    last_name: str,
    email: str,
    password: str,
    student_number: str,
    user_type: UserTypeEnum,
    verification_file: UploadFile = File(None),
    graduation_year: str = None,
    graduation_semester: str = None,
    db: Session = Depends(get_db)
):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if verification_file:
        file_content = await verification_file.read()
        if len(file_content) > MAX_FILE_SIZE or verification_file.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid verification file")

        verification_ext = verification_file.filename.split(".")[-1]
        verification_name = f"verification_files/{uuid.uuid4()}.{verification_ext}"
        try:
            supabase_client.storage.from_("128storage").upload(verification_name, file_content)
        except Exception as e:
            print("Upload Error:", e)
        verification_url = f"{STORAGE_STRING}{verification_name}"
    else:
        verification_url = None
        
    hashed_password = hash_password(password)
    graduation_year = int(graduation_year) if graduation_year else None
    
    new_user = User(
        user_id=uuid.uuid4(),
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=hashed_password,
        student_number=student_number,
        graduation_year=graduation_year,
        graduation_semester=graduation_semester,
        verification_file=verification_url,
        user_type=user_type
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Account created successfully"}

async def upload_profile(profile_picture, user, db):
    file_content = await profile_picture.read()

    if len(file_content) > MAX_FILE_SIZE or profile_picture.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid verification file")

    profile_picture_ext = profile_picture.filename.split(".")[-1]
    profile_picture_name = f"profile_pictures/{uuid.uuid4()}.{profile_picture_ext}"

    try:
        supabase_client.storage.from_("128storage").upload(profile_picture_name, file_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload Error: {str(e)}")

    profile_picture_url = f"{STORAGE_STRING}{profile_picture_name}"
    user.image = profile_picture_url

    db.commit()
    db.refresh(user)

    return profile_picture_url

def get_user(db, email: str):
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    return user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user(db, email)
    if not user or not verify_password(password, user.password):
        return None
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception

    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise credentials_exception

    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.is_banned:
        raise HTTPException(status_code=400, detail="User is banned")
    return current_user

async def require_student(user: User = Depends(get_current_active_user)):
    if user.user_type.value != "student":
        raise HTTPException(status_code=403, detail="Forbidden: Students only")
    return user

async def require_alum(user: User = Depends(get_current_active_user)):
    if user.user_type.value != "alumni":
        raise HTTPException(status_code=403, detail="Forbidden: Alumni only")
    return user

async def require_admin(user: User = Depends(get_current_active_user)):
    if user.user_type.value != "admin":
        raise HTTPException(status_code=403, detail="Forbidden: Admin only")
    return user