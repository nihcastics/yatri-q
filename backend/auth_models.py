# Authentication Models for YATRI-Q
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import uuid

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=2, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    is_verified: bool
    created_at: datetime

class LoginResponse(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str = "bearer"

class MessageResponse(BaseModel):
    message: str
    status: str = "success"

# Database Models (for MongoDB)
class UserDocument:
    def __init__(self):
        self.id = str(uuid.uuid4())
        self.email = None
        self.password_hash = None
        self.name = None
        self.is_verified = False
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

class OTPDocument:
    def __init__(self):
        self.id = str(uuid.uuid4())
        self.email = None
        self.otp_code = None
        self.expires_at = None
        self.is_used = False
        self.created_at = datetime.utcnow()