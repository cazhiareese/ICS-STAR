from pydantic import BaseModel

class User(BaseModel):
    user_id : str
    first_name : str
    last_name : str
    mobile_number : str
    age : int
    gender : str
    city : str
    state : str
    country : str
    marital_status : str
    image : str
    password : str
    email : str
    user_type : str

    class Config:
        orm_mode = True

class UserAdmin(User):
    position : str

class UserAlumni(User):
    verification_file : str
    is_banned : bool
    student_number : str
    graduation_year : int
    graduation_semester : str
    employment_status : str
    job_title : str
    work_location : str
    work_mode : str
    employer_class : str
    tenured_status : str
    salary_grade : str

class UserStudent(User):
    verification_file : str
    is_banned : bool
    student_number : str
    standing : str