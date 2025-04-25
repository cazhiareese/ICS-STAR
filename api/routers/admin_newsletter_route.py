from typing import List, Optional, Literal
from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, Query

from models.usermodel import User
from models.newsletter_model import Newsletter

