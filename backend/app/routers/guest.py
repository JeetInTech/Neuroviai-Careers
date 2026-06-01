from fastapi import APIRouter, HTTPException, status, Request
from pydantic import BaseModel
import os
import json

router = APIRouter(prefix="/guest", tags=["Guest"])

# We will use a simple, robust JSON-based file persistence stored in the backend directory.
# This ensures it survives restarts, is fully persistent, fast, and does not require complex Supabase schema migrations.
DB_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "guest_limits.json")

def load_guest_db():
    if not os.path.exists(DB_FILE):
        return {}
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {}

def save_guest_db(db):
    try:
        with open(DB_FILE, "w") as f:
            json.dump(db, f, indent=4)
    except Exception as e:
        print(f"Error saving guest DB: {e}")

@router.get("/status")
async def get_guest_status(request: Request):
    """Check if this IP has already selected and used a template before logging in."""
    client_ip = request.client.host
    db = load_guest_db()
    
    if client_ip in db:
        return {
            "used": True,
            "template_id": db[client_ip].get("template_id"),
            "used_at": db[client_ip].get("used_at")
        }
    
    return {"used": False}

class GuestUseRequest(BaseModel):
    template_id: str

@router.post("/use-template")
async def use_guest_template(request: Request, body: GuestUseRequest):
    """Record a guest template selection by IP."""
    client_ip = request.client.host
    db = load_guest_db()
    
    # If this IP already selected a template before, they are locked to that template only!
    if client_ip in db:
        existing_template = db[client_ip].get("template_id")
        if existing_template != body.template_id:
            raise HTTPException(
                status_code=status.HTTP_430_VERY_COOL_GUEST_LIMIT if hasattr(status, 'HTTP_430_VERY_COOL_GUEST_LIMIT') else 403,
                detail=f"You can only use one template ({existing_template}) before logging in. Please sign up or log in to unlock unlimited templates!"
            )
        return {"success": True, "template_id": existing_template, "message": "Using already selected template"}
    
    # Save the entry for this IP
    from datetime import datetime
    db[client_ip] = {
        "template_id": body.template_id,
        "used_at": datetime.utcnow().isoformat()
    }
    save_guest_db(db)
    
    return {"success": True, "template_id": body.template_id, "message": "Template selected successfully for guest"}
