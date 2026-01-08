from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import auth, profile, cv, ats, document, linkedin, ai
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI(
    title="CV Forge API",
    description="Backend API for CV Forge - AI-Powered Resume Builder",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://neuroviacareer.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(cv.router)
app.include_router(ats.router)
app.include_router(document.router)
app.include_router(linkedin.router)
app.include_router(ai.router)

@app.get("/")
async def root():
    return {
        "name": "CV Forge API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Debug endpoints - only available in development mode
if settings.DEBUG_MODE:
    @app.get("/debug/config")
    async def debug_config():
        """Debug endpoint to check config (only available in development)"""
        return {
            "supabase_url_set": bool(settings.SUPABASE_URL),
            "supabase_key_set": bool(settings.SUPABASE_KEY),
            "service_key_set": bool(settings.SUPABASE_SERVICE_KEY),
        }

    @app.get("/debug/test-supabase")
    async def test_supabase():
        """Test Supabase connection (only available in development)"""
        from .database import get_supabase_admin
        try:
            supabase = get_supabase_admin()
            # Try to list users (admin operation)
            result = supabase.auth.admin.list_users()
            return {
                "success": True,
                "user_count": len(result) if result else 0,
                "message": "Supabase admin connection works!"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "error_type": type(e).__name__
            }
