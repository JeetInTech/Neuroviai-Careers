import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    DEBUG_MODE: bool = os.getenv("DEBUG_MODE", "false").lower() in ("true", "1", "yes")
    
    def validate(self) -> list[str]:
        """Validate required settings and return list of missing ones"""
        missing = []
        if not self.SUPABASE_URL:
            missing.append("SUPABASE_URL")
        if not self.SUPABASE_KEY:
            missing.append("SUPABASE_KEY")
        if not self.SUPABASE_SERVICE_KEY:
            missing.append("SUPABASE_SERVICE_KEY")
        return missing
    
settings = Settings()
