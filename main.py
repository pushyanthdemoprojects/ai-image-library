from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.user import User
from models.image import Image, Download
from sqlalchemy import func

app = FastAPI(title="AI Image Library - Admin API")

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users")
def get_all_users_json(db: Session = Depends(get_db)):
    """
    Returns a JSON list of all registered users with their details
    and activity stats (uploads and downloads).
    """
    # Query users and join with stats
    users = db.query(User).all()
    
    results = []
    for user in users:
        # Calculate stats for each user
        upload_count = db.query(func.count(Image.id)).filter(Image.user_id == user.id).scalar()
        download_count = db.query(func.count(Download.id)).filter(Download.user_id == user.id).scalar()
        
        results.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "storage_limit": user.storage_limit,
            "total_uploads": upload_count,
            "total_downloads": download_count,
            "registered_at": user.created_at.isoformat() if user.created_at else None
        })
    
    return {
        "total_users": len(results),
        "users": results
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
