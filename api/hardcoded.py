from datetime import datetime, timedelta, timezone
from typing import Annotated
import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from pydantic import BaseModel

SECRET_KEY = "c85f7f6d5009815e7b69bf6eabc655fb1a2533d1f808fe1e950961f2b5add6da"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

users_db = [
    {
        "userid": "1001",
        "name": {"fName": "John", "lName": "Doe"},
        "mobile": "09123456789",
        "age": "21",
        "gender": "male",
        "base": {"city": "Sta. Cruz", "state": "Laguna", "country": "Philippines"},
        "isBanned": False,
        "studNo": "201087561",
        "maritalStatus": "single",
        "email": "johndoe@example.com",
        "password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "role":"alum"
    },
    {
        "userid": "1002",
        "name": {"fName": "Maria", "lName": "de la Cruz"},
        "mobile": "09123456789",
        "age": "25",
        "gender": "female",
        "base": {"city": "Taguig City", "state": "Metro Manila", "country": "Philippines"},
        "isBanned": False,
        "studNo": "201087561",
        "maritalStatus": "single",
        "email": "mariadelacruz@example.com",
        "password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "role":"student"
    },
    {
        "userid": "0000",
        "name": {"fName": "ICS", "lName": "Admin"},
        "mobile": "09123456789",
        "age": "00",
        "gender": "NA",
        "base": {"city": "Los Banos", "state": "Laguna", "country": "Philippines"},
        "isBanned": False,
        "studNo": "NA",
        "maritalStatus": "NA",
        "email": "icsadmin@example.com",
        "password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "role":"admin"
    },
]


class BaseLocation(BaseModel):
    city: str
    state: str
    country: str
    
class Name(BaseModel):
    fName: str
    lName: str

class User(BaseModel):
    userid: str
    name: Name
    email: str
    mobile: str
    age: str
    gender: str
    base: BaseLocation
    isBanned: bool
    studNo: str
    maritalStatus: str
    role: str


class UserInDB(User):
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    userid: str | None = None


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_user(db, email: str):
    for user in db:
        if user["email"] == email:
            return UserInDB(**user)
    return None



def authenticate_user(fake_db, email: str, password: str):
    user = get_user(fake_db, email)
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



async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        userid = payload.get("sub")
        role = payload.get("role")
        if userid is None or role is None:
            raise credentials_exception
        token_data = TokenData(username=userid)
    except InvalidTokenError:
        raise credentials_exception

    user_data = next((user for user in users_db if user["userid"] == userid), None)
    if user_data is None:
        raise credentials_exception

    return User(
        userid=user_data["userid"],
        name=Name(**user_data["name"]),
        email=user_data["email"],
        mobile=user_data["mobile"],
        age=user_data["age"],
        gender=user_data["gender"],
        base=BaseLocation(**user_data["base"]),
        isBanned=user_data["isBanned"],
        studNo=user_data["studNo"],
        maritalStatus=user_data["maritalStatus"],
        role=user_data["role"]
    )



async def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]):
    if current_user.isBanned:
        raise HTTPException(status_code=400, detail="User is banned")
    return current_user

async def require_student(user_data: Annotated[dict, Depends(get_current_active_user)]):
    if user_data.role != "student":
        raise HTTPException(status_code=403, detail="Forbidden: Students only")
    return user_data

async def require_alum(user_data: Annotated[dict, Depends(get_current_active_user)]):
    if user_data.role != "alum":
        raise HTTPException(status_code=403, detail="Forbidden: Alumni only")
    return user_data

async def require_admin(user_data: Annotated[dict, Depends(get_current_active_user)]):
    if user_data.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden: Admin only")
    return user_data


@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    email = form_data.username
    
    user = authenticate_user(users_db, email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.userid, "role":user.role}, expires_delta=access_token_expires)
    
    return Token(access_token=access_token, token_type="bearer")



@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
    return current_user

@app.get("/student/dashboard")
async def student_dashboard(
    current_user: Annotated[User, Depends(require_student)]
):
    return {"message": "Welcome to the student dashboard", "user": current_user}

@app.get("/alum/dashboard")
async def alum_dashboard(
    current_user: Annotated[User, Depends(require_alum)]
):
    return {"message": "Welcome to the alumni dashboard", "user": current_user}

@app.get("/admin/dashboard")
async def admin_dashboard(
    current_user: Annotated[User, Depends(require_admin)]
):
    return {"message": "Welcome to the admin dashboard", "user": current_user}
