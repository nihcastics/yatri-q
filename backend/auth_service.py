# Authentication Service for YATRI-Q
import os
import secrets
import string
from datetime import datetime, timedelta
from typing import Optional
import bcrypt
import jwt
from motor.motor_asyncio import AsyncIOMotorDatabase
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from auth_models import UserDocument, OTPDocument

class AuthService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.users_collection = db.users
        self.otps_collection = db.otps
        self.secret_key = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
        self.sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
        self.sender_email = os.getenv('SENDER_EMAIL', 'noreply@yatri-q.com')
    
    def hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def generate_otp(self) -> str:
        """Generate 6-digit OTP"""
        return ''.join(secrets.choice(string.digits) for _ in range(6))
    
    def create_access_token(self, user_id: str, email: str) -> str:
        """Create JWT access token"""
        payload = {
            'user_id': user_id,
            'email': email,
            'exp': datetime.utcnow() + timedelta(days=7)  # 7 days expiry
        }
        return jwt.encode(payload, self.secret_key, algorithm='HS256')
    
    def verify_token(self, token: str) -> Optional[dict]:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    async def send_otp_email(self, email: str, otp: str) -> bool:
        """Send OTP via email using SendGrid"""
        if not self.sendgrid_api_key:
            print("Warning: SendGrid API key not configured, OTP would be:", otp)
            return True  # For development, assume success
        
        try:
            subject = "Your YATRI-Q Login Code"
            html_content = f"""
            <html>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; margin: 0; padding: 20px; background-color: #f8fafc;">
                    <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">YATRI-Q</h1>
                            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your smart travel companion</p>
                        </div>
                        
                        <div style="padding: 40px 30px;">
                            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Your Login Code</h2>
                            
                            <p style="color: #64748b; margin: 0 0 30px 0; line-height: 1.6;">
                                Enter this 6-digit code to complete your login to YATRI-Q:
                            </p>
                            
                            <div style="background: #f1f5f9; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                                <div style="font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 4px; font-family: 'SF Mono', Monaco, monospace;">
                                    {otp}
                                </div>
                            </div>
                            
                            <p style="color: #64748b; margin: 30px 0 0 0; font-size: 14px; line-height: 1.5;">
                                This code will expire in <strong>10 minutes</strong>. If you didn't request this code, you can safely ignore this email.
                            </p>
                        </div>
                        
                        <div style="background: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                                YATRI-Q - Plan, predict, and travel smarter
                            </p>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            message = Mail(
                from_email=self.sender_email,
                to_emails=email,
                subject=subject,
                html_content=html_content
            )
            
            sg = SendGridAPIClient(self.sendgrid_api_key)
            response = sg.send(message)
            return response.status_code == 202
            
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
    
    async def register_user(self, email: str, password: str, name: str) -> dict:
        """Register a new user"""
        # Check if user exists
        existing_user = await self.users_collection.find_one({"email": email})
        if existing_user:
            raise ValueError("User with this email already exists")
        
        # Create user document
        user_doc = {
            "email": email,
            "password_hash": self.hash_password(password),
            "name": name,
            "is_verified": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await self.users_collection.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        
        # Send OTP for verification
        await self.send_otp_for_verification(email)
        
        return {
            "id": str(result.inserted_id),
            "email": email,
            "name": name,
            "is_verified": False,
            "message": "Registration successful! Please check your email for verification code."
        }
    
    async def send_otp_for_verification(self, email: str) -> bool:
        """Send OTP for email verification"""
        # Generate OTP
        otp_code = self.generate_otp()
        expires_at = datetime.utcnow() + timedelta(minutes=10)
        
        # Save OTP to database
        otp_doc = {
            "email": email,
            "otp_code": otp_code,
            "expires_at": expires_at,
            "is_used": False,
            "created_at": datetime.utcnow()
        }
        
        await self.otps_collection.insert_one(otp_doc)
        
        # Send email
        return await self.send_otp_email(email, otp_code)
    
    async def verify_otp(self, email: str, otp_code: str) -> dict:
        """Verify OTP and activate user"""
        # Find valid OTP
        otp_doc = await self.otps_collection.find_one({
            "email": email,
            "otp_code": otp_code,
            "is_used": False,
            "expires_at": {"$gt": datetime.utcnow()}
        })
        
        if not otp_doc:
            raise ValueError("Invalid or expired OTP")
        
        # Mark OTP as used
        await self.otps_collection.update_one(
            {"_id": otp_doc["_id"]},
            {"$set": {"is_used": True}}
        )
        
        # Verify user
        user = await self.users_collection.find_one_and_update(
            {"email": email},
            {"$set": {"is_verified": True, "updated_at": datetime.utcnow()}},
            return_document=True
        )
        
        if not user:
            raise ValueError("User not found")
        
        # Generate access token
        access_token = self.create_access_token(str(user["_id"]), user["email"])
        
        return {
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "name": user["name"],
                "is_verified": user["is_verified"],
                "created_at": user["created_at"]
            },
            "access_token": access_token,
            "token_type": "bearer"
        }
    
    async def login_with_password(self, email: str, password: str) -> dict:
        """Login with email and password"""
        # Find user
        user = await self.users_collection.find_one({"email": email})
        if not user:
            raise ValueError("Invalid email or password")
        
        # Verify password
        if not self.verify_password(password, user["password_hash"]):
            raise ValueError("Invalid email or password")
        
        # Check if verified
        if not user.get("is_verified", False):
            raise ValueError("Please verify your email first")
        
        # Generate access token
        access_token = self.create_access_token(str(user["_id"]), user["email"])
        
        return {
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "name": user["name"],
                "is_verified": user["is_verified"],
                "created_at": user["created_at"]
            },
            "access_token": access_token,
            "token_type": "bearer"
        }
    
    async def login_with_otp(self, email: str) -> dict:
        """Send OTP for passwordless login"""
        # Check if user exists and is verified
        user = await self.users_collection.find_one({"email": email})
        if not user:
            raise ValueError("No account found with this email")
        
        if not user.get("is_verified", False):
            raise ValueError("Please complete registration first")
        
        # Send OTP
        success = await self.send_otp_for_verification(email)
        if not success:
            raise ValueError("Failed to send OTP")
        
        return {"message": "OTP sent to your email", "status": "success"}
    
    async def get_current_user(self, token: str) -> dict:
        """Get current user from token"""
        payload = self.verify_token(token)
        if not payload:
            raise ValueError("Invalid or expired token")
        
        user = await self.users_collection.find_one({"_id": payload["user_id"]})
        if not user:
            raise ValueError("User not found")
        
        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "is_verified": user["is_verified"],
            "created_at": user["created_at"]
        }