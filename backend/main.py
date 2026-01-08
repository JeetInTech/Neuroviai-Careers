import uvicorn
import os

if __name__ == "__main__":
    # Disable reload in production (Render sets RENDER=true)
    is_production = os.getenv("RENDER", "false").lower() == "true"
    port = int(os.getenv("PORT", 8000))
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=not is_production
    )
