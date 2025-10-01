from google.oauth2 import id_token
from google.auth.transport import requests
from app.config import settings
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer
import logging

logger = logging.getLogger(__name__)
security = HTTPBearer()

class GoogleAuth:
    def __init__(self):
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.admin_emails = settings.ADMIN_EMAIL_LIST  # Now a list

    def verify_admin_token(self, token: str):
        """
        Verify Google ID token and check if user is one of the authorized admins
        """
        try:
            # Verify the token with Google
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                self.client_id
            )

            # Get user email from verified token
            user_email = idinfo.get('email', '').lower().strip()

            # Check if this email is in our admin list
            if user_email not in self.admin_emails:
                logger.warning(f"Access denied for email: {user_email}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Access denied. Email not authorized as admin."
                )

            # Return admin user info
            return {
                "email": user_email,
                "name": idinfo.get('name'),
                "picture": idinfo.get('picture'),
                "is_admin": True,
                "verified": True
            }

        except ValueError as e:
            logger.error(f"Token verification failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired Google token"
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected authentication error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication failed"
            )

# Create global instance
google_auth = GoogleAuth()

# ✅ This is the function your products.py is looking for
async def get_current_admin(credentials = Depends(security)):
    """
    Dependency to get current authenticated admin
    This is what products.py is trying to import
    """
    try:
        token = credentials.credentials
        admin_user = google_auth.verify_admin_token(token)
        logger.info(f"Admin authenticated successfully: {admin_user['email']}")
        return admin_user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Admin verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate admin credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )

# Alias for backwards compatibility
verify_admin = get_current_admin
