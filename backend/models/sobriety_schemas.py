from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional, List
from enum import Enum

class MoodType(str, Enum):
    GREAT = "great"
    GOOD = "good"
    OKAY = "okay"
    STRUGGLING = "struggling"
    CRITICAL = "critical"

# Daily Check-in Models
class DailyCheckInCreate(BaseModel):
    check_in_date: Optional[date] = None
    stayed_sober: bool = True
    mood: Optional[MoodType] = None
    activities: Optional[str] = None
    triggers: Optional[str] = None
    notes: Optional[str] = None
    gratitude: Optional[str] = None

class DailyCheckInResponse(BaseModel):
    id: int
    check_in_date: date
    stayed_sober: bool
    mood: Optional[MoodType]
    activities: Optional[str]
    triggers: Optional[str]
    notes: Optional[str]
    gratitude: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Relapse Models
class RelapseCreate(BaseModel):
    relapse_date: Optional[date] = None
    trigger: Optional[str] = None
    what_happened: Optional[str] = None
    lesson_learned: Optional[str] = None
    reached_out_for_help: bool = False

class RelapseResponse(BaseModel):
    id: int
    relapse_date: date
    trigger: Optional[str]
    what_happened: Optional[str]
    lesson_learned: Optional[str]
    reached_out_for_help: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Stats Models
class SobrietyStats(BaseModel):
    days_sober: int
    sobriety_start_date: Optional[date]
    current_streak: int
    longest_streak: int
    total_check_ins: int
    check_in_rate: float
    relapses_count: int
    milestones_achieved: List[int]

class GraphProgress(BaseModel):
    progress_date: date
    stayed_sober: bool
    mood: Optional[MoodType]
    has_check_in: bool
    day_number: int

class MilestoneResponse(BaseModel):
    id: int
    days_sober: int
    achieved_date: date
    celebration_note: Optional[str]
    
    class Config:
        from_attributes = True

class StartJourneyRequest(BaseModel):
    start_date: Optional[date] = None