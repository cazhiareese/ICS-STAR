from operator import is_not
from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session
from models.usermodel import User
from schemas.user import UserOut


def get_user_filtered_city (db: Session):
    # [location : {alumni: [{}], student: [{}]}]
    cities = db.query(User.city).distinct().where(User.city.is_not(None), User.user_type != 'admin').all()

    if cities is None:
        raise HTTPException(status_code=404, detail="No locations found")
    city_list = [loc[0] for loc in cities]

    alum_with_loc = []
    stud_with_loc = []
    for loc in city_list:
        alum_loc = db.query(User.user_id, User.user_type).filter(User.city == loc, User.user_type=='alumni').all()
        stud_loc = db.query(User.user_id, User.user_type).filter(User.city == loc, User.user_type=='student').all()

        if alum_loc is None:
            raise HTTPException(status_code=404, detail=f"No alum from this {loc}")

        if stud_loc is None:
            raise HTTPException(status_code=404, detail=f"No stud from this {loc}")
        

        
        alum_loc_dict = {loc: [user[0] for user in alum_loc]}
        stud_loc_dict = {loc: [user[0] for user in stud_loc]}
        alum_with_loc.append(alum_loc_dict)
        stud_with_loc.append(stud_loc_dict)

    
    return {'students': stud_with_loc, 'alumni': alum_with_loc}

def get_user_filtered_state (db: Session):
    # [location : {alumni: [{}], student: [{}]}]
    states = db.query(User.state).distinct().where(User.state.is_not(None), User.user_type != 'admin').all()

    if states is None:
        raise HTTPException(status_code=404, detail="No locations found")
    state_list = [loc[0] for loc in states]

    alum_with_loc = []
    stud_with_loc = []
    for loc in state_list:
        alum_loc = db.query(User.user_id, User.user_type).filter(User.state == loc, User.user_type=='alumni').all()
        stud_loc = db.query(User.user_id, User.user_type).filter(User.state == loc, User.user_type=='student').all()

        if alum_loc is None:
            raise HTTPException(status_code=404, detail=f"No alum from this {loc}")

        if stud_loc is None:
            raise HTTPException(status_code=404, detail=f"No stud from this {loc}")
        

        
        alum_loc_dict = {loc: [user[0] for user in alum_loc]}
        stud_loc_dict = {loc: [user[0] for user in stud_loc]}
        alum_with_loc.append(alum_loc_dict)
        stud_with_loc.append(stud_loc_dict)

    
    return {'students': stud_with_loc, 'alumni': alum_with_loc}

def get_user_filtered_country (db: Session):
    # [location : {alumni: [{}], student: [{}]}]
    countries = db.query(User.country).distinct().where(User.country.is_not(None), User.user_type != 'admin').all()

    if countries is None:
        raise HTTPException(status_code=404, detail="No locations found")
    country_list = [loc[0] for loc in countries]

    alum_with_loc = []
    stud_with_loc = []
    for loc in country_list:
        alum_loc = db.query(User.user_id, User.user_type).filter(User.country== loc, User.user_type=='alumni').all()
        stud_loc = db.query(User.user_id, User.user_type).filter(User.country == loc, User.user_type=='student').all()

        if alum_loc is None:
            raise HTTPException(status_code=404, detail=f"No alum from this {loc}")

        if stud_loc is None:
            raise HTTPException(status_code=404, detail=f"No stud from this {loc}")
        

        
        alum_loc_dict = {loc: [user[0] for user in alum_loc]}
        stud_loc_dict = {loc: [user[0] for user in stud_loc]}
        alum_with_loc.append(alum_loc_dict)
        stud_with_loc.append(stud_loc_dict)

    
    return {'students': stud_with_loc, 'alumni': alum_with_loc}



