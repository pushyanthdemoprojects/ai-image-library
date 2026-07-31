from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    
    # --- STORAGE LIMIT FIELD ADDED BELOW ---
    storage_limit = Column(Integer, server_default="52428800", nullable=False) # Default 50MB
    # ---------------------------------------
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
