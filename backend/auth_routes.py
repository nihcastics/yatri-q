# Authentication Routes for YATRI-Q
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase
from auth_service import AuthService
from auth_models import (
    UserCreate, UserLogin, OTPRequest, OTPVerify,
    UserResponse, LoginResponse, MessageResponse
)
import os

router = APIRouter(prefix="/api/auth", tags=["authentication"])
security = HTTPBearer()

# Dependency to get database
async def get_database():
    from server import db  # Import from main server file
    return db

# Dependency to get auth service
async def get_auth_service(db: AsyncIOMotorDatabase = Depends(get_database)):
    return AuthService(db)

# Dependency to get current user
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
):
    try:
        token = credentials.credentials
        user = await auth_service.get_current_user(token)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/register", response_model=dict)
async def register(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Register a new user"""
    try:
        result = await auth_service.register_user(
            email=user_data.email,
            password=user_data.password,
            name=user_data.name
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Registration failed")

@router.post("/verify-email", response_model=LoginResponse)
async def verify_email(
    otp_data: OTPVerify,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Verify email with OTP"""
    try:
        result = await auth_service.verify_otp(
            email=otp_data.email,
            otp_code=otp_data.otp
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Verification failed")

@router.post("/login", response_model=LoginResponse)
async def login_password(
    login_data: UserLogin,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Login with email and password"""
    try:
        result = await auth_service.login_with_password(
            email=login_data.email,
            password=login_data.password
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Login failed")

@router.post("/send-otp", response_model=MessageResponse)
async def send_otp(
    otp_request: OTPRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Send OTP for passwordless login"""
    try:
        result = await auth_service.login_with_otp(email=otp_request.email)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to send OTP")

@router.post("/verify-otp", response_model=LoginResponse)
async def verify_otp_login(
    otp_data: OTPVerify,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Verify OTP for passwordless login"""
    try:
        result = await auth_service.verify_otp(
            email=otp_data.email,
            otp_code=otp_data.otp
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="OTP verification failed")

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@router.post("/logout", response_model=MessageResponse)
async def logout():
    """Logout user (client-side token removal)"""
    return {"message": "Logged out successfully", "status": "success"}

@router.post("/resend-otp", response_model=MessageResponse)
async def resend_otp(
    otp_request: OTPRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Resend OTP for verification"""
    try:
        success = await auth_service.send_otp_for_verification(otp_request.email)
        if success:
            return {"message": "OTP sent successfully", "status": "success"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send OTP")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to resend OTP")