from fastapi import APIRouter, HTTPException, Depends, status
from app.auth.google_auth import get_current_admin, google_auth  # ✅ Correct imports
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])

class GoogleLoginRequest(BaseModel):
    id_token: str

class LoginResponse(BaseModel):
    message: str
    admin: dict
    access_token: str

@router.post("/google-login", response_model=LoginResponse)
async def admin_google_login(login_data: GoogleLoginRequest):
    """Admin login with Google authentication"""
    try:
        admin_user = google_auth.verify_admin_token(login_data.id_token)
        
        logger.info(f"Successful admin login: {admin_user['email']}")
        
        return LoginResponse(
            message=f"Welcome back, {admin_user['name']}!",
            admin=admin_user,
            access_token=login_data.id_token
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.get("/me")
async def get_current_admin_info(current_admin = Depends(get_current_admin)):
    """Get current authenticated admin user info"""
    return {
        "message": "Admin verified successfully",
        "admin": current_admin,
        "permissions": ["read_products", "create_products", "update_products", "delete_products"]
    }

@router.post("/logout")
async def logout():
    """Logout endpoint"""
    return {
        "message": "Logout successful. Please remove token from client storage.",
        "action": "clear_token"
    }
