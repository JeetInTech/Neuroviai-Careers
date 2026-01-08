from supabase import create_client, Client
from .config import settings
from typing import Optional

# Singleton instances for Supabase clients
_supabase_client: Optional[Client] = None
_supabase_admin: Optional[Client] = None


def get_supabase_client() -> Client:
    """Get Supabase client with anon key for regular operations (singleton)"""
    global _supabase_client
    if _supabase_client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be configured")
        _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return _supabase_client


def get_supabase_admin() -> Client:
    """Get Supabase client with service role key for admin operations (singleton)"""
    global _supabase_admin
    if _supabase_admin is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be configured")
        _supabase_admin = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    return _supabase_admin


def reset_clients() -> None:
    """Reset singleton clients (useful for testing)"""
    global _supabase_client, _supabase_admin
    _supabase_client = None
    _supabase_admin = None
