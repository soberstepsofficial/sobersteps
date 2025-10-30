from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean, Text, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime, date
import enum

Base = declarative_base()

class MoodType(enum.Enum):
    GREAT = "great"
    GOOD = "good"
    OKAY = "okay"
    STRUGGLING = "struggling"
    CRITICAL = "critical"

class UserDB(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    disabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    sobriety_start_date = Column(Date, nullable=True)
    
    check_ins = relationship("DailyCheckIn", back_populates="user", cascade="all, delete-orphan")
    milestones = relationship("Milestone", back_populates="user", cascade="all, delete-orphan")
    relapses = relationship("Relapse", back_populates="user", cascade="all, delete-orphan")

class DailyCheckIn(Base):
    __tablename__ = "daily_check_ins"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    stayed_sober = Column(Boolean, default=True)
    mood = Column(Enum(MoodType), nullable=True)
    activities = Column(Text, nullable=True)
    triggers = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    gratitude = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("UserDB", back_populates="check_ins")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'date', name='unique_user_checkin_date'),
    )

class Milestone(Base):
    __tablename__ = "milestones"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    days_sober = Column(Integer, nullable=False)
    achieved_date = Column(Date, nullable=False)
    celebration_note = Column(Text, nullable=True)
    
    user = relationship("UserDB", back_populates="milestones")

class Relapse(Base):
    __tablename__ = "relapses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    trigger = Column(Text, nullable=True)
    what_happened = Column(Text, nullable=True)
    lesson_learned = Column(Text, nullable=True)
    reached_out_for_help = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("UserDB", back_populates="relapses")