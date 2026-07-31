from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Table, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    original_filename = Column(String(255), nullable=False)
    generated_filename = Column(String(255), nullable=False)
    caption = Column(Text)
    category = Column(String(100), index=True)
    image_path = Column(String(500), nullable=False)
    compressed_path = Column(String(500))
    thumbnail_path = Column(String(500))
    width = Column(Integer)
    height = Column(Integer)
    file_size = Column(Integer)          # original (pre-compression) size, in bytes
    compressed_size = Column(Integer)    # size after lossless compression, in bytes
    
    # --- AI METADATA FIELDS ADDED BELOW ---
    detections = Column(JSON, nullable=True)  # Stores YOLO [x, y, w, h] and labels
    colors = Column(JSON, nullable=True)      # Stores hex codes and color names
    # --------------------------------------
    
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    owner = relationship("User", backref="images")
    tags = relationship("Tag", secondary="image_tags", backref="images")


class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    tag_name = Column(String(100), unique=True, nullable=False)


image_tags = Table(
    "image_tags",
    Base.metadata,
    Column("image_id", Integer, ForeignKey("images.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)


class Download(Base):
    __tablename__ = "downloads"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    image_id = Column(Integer, ForeignKey("images.id", ondelete="CASCADE"), nullable=False)
    downloaded_at = Column(DateTime(timezone=True), server_default=func.now())


class SearchHistory(Base):
    __tablename__ = "search_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    search_query = Column(String(500), nullable=False)
    searched_at = Column(DateTime(timezone=True), server_default=func.now())
