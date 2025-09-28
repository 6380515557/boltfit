import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "BOLT FIT Backend API")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    
    # Firebase
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID")
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH")
    
    # Google Auth - ✅ These must be set
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID")
    
    # Admin - ✅ This must match your Google account
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "workingprojectjagan123@gmail.com")
    
    # CORS
    ALLOWED_ORIGINS: list = [
        "https://boldfit-admin.onrender.com",
        "https://boldfit-g24k.onrender.com",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ]

settings = Settings()
