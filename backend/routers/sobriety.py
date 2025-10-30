from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, func, select
from datetime import date, timedelta
from typing import List, Optional

from database import get_db
from models.sobriety import UserDB, DailyCheckIn, Milestone, Relapse, MoodType as MoodTypeDB
from models.sobriety_schemas import (
    DailyCheckInCreate, DailyCheckInResponse,
    RelapseCreate, RelapseResponse,
    SobrietyStats, GraphProgress, MilestoneResponse,
    StartJourneyRequest, MoodType
)
from models.user import User

router = APIRouter(prefix="/sobriety", tags=["sobriety"])

# Placeholder dependency (you'll import this from your main app)
def get_current_active_user() -> User:
    """Dependency stub: replaced by actual current_user injection from main.py"""
    raise NotImplementedError


# -------------------------------------------------------------------
# Utility Functions
# -------------------------------------------------------------------

def check_and_create_milestone(user_id: int, db: Session) -> None:
    """Check if user hit a milestone and create it if missing."""
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        return
    if user.sobriety_start_date is None:
        return

    days_sober = (date.today() - user.sobriety_start_date).days
    milestone_days = [1, 3, 7, 14, 30, 60, 90, 180, 365, 730, 1095]

    for milestone in milestone_days:
        if days_sober == milestone:
            existing = db.query(Milestone).filter(
                and_(
                    Milestone.user_id == user_id,
                    Milestone.days_sober == milestone
                )
            ).first()
            if not existing:
                new_milestone = Milestone(
                    user_id=user_id,
                    days_sober=milestone,
                    achieved_date=date.today()
                )
                db.add(new_milestone)


def calculate_current_streak(check_ins: List[DailyCheckIn]) -> int:
    """Calculate current consecutive days of sobriety."""
    if not check_ins:
        return 0

    streak = 0
    current_date = date.today()
    sober_dates = {c.date for c in check_ins if bool(c.stayed_sober)}

    while current_date in sober_dates:
        streak += 1
        current_date -= timedelta(days=1)

    return streak


def calculate_longest_streak(check_ins: List[DailyCheckIn]) -> int:
    """Calculate longest streak ever."""
    if not check_ins:
        return 0

    sober_dates = sorted([c.date for c in check_ins if bool(c.stayed_sober)])
    if not sober_dates:
        return 0

    longest = current = 1
    for i in range(1, len(sober_dates)):
        delta = sober_dates[i] - sober_dates[i - 1]
        if delta.days == 1:
            current += 1
            longest = max(longest, current)
        else:
            current = 1
    return longest


# -------------------------------------------------------------------
# Routes
# -------------------------------------------------------------------

@router.post("/start", status_code=status.HTTP_201_CREATED)
async def start_sobriety_journey(
    request: StartJourneyRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Start tracking sobriety journey."""
    user = db.query(UserDB).filter(UserDB.username == current_user.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found in database"
        )

    start_date = request.start_date if request.start_date else date.today()
    db.execute(
        UserDB.__table__.update()
        .where(UserDB.id == user.id)
        .values(sobriety_start_date=start_date)
    )
    db.commit()
    db.refresh(user)

    return {
        "message": "Sobriety journey started!",
        "start_date": start_date
    }


@router.post("/check-in", response_model=DailyCheckInResponse)
async def daily_check_in(
    check_in: DailyCheckInCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Daily check-in for sobriety tracking."""
    user = db.query(UserDB).filter(UserDB.username == current_user.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found in database")

    check_date = check_in.check_in_date or date.today()

    existing = db.query(DailyCheckIn).filter(
        and_(DailyCheckIn.user_id == user.id, DailyCheckIn.date == check_date)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already checked in for this date")

    mood_value: Optional[MoodTypeDB] = None
    if check_in.mood:
        try:
            mood_value = MoodTypeDB[check_in.mood.value.upper()]
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid mood type")

    db_check_in = DailyCheckIn(
        user_id=db.scalar(UserDB.__table__.select().where(UserDB.id == user.id).with_only_columns(UserDB.id)),
        date=check_date,
        stayed_sober=check_in.stayed_sober,
        mood=mood_value,
        activities=check_in.activities,
        triggers=check_in.triggers,
        notes=check_in.notes,
        gratitude=check_in.gratitude
    )

    db.add(db_check_in)
    check_and_create_milestone(db.scalar(UserDB.__table__.select().where(UserDB.id == user.id).with_only_columns(UserDB.id)), db)
    db.commit()
    db.refresh(db_check_in)

    return db_check_in


@router.get("/stats", response_model=SobrietyStats)
async def get_sobriety_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive sobriety statistics."""
    user = db.query(UserDB).filter(UserDB.username == current_user.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    start_date = db.scalar(
        UserDB.__table__.select()
        .where(UserDB.id == user.id)
        .with_only_columns(UserDB.sobriety_start_date)
    )
    if start_date is None:
        raise HTTPException(status_code=404, detail="Sobriety journey not started yet")

    days_sober = (date.today() - start_date).days
    check_ins = db.query(DailyCheckIn).filter(DailyCheckIn.user_id == user.id).order_by(DailyCheckIn.date).all()

    total_check_ins = len(check_ins)
    check_in_rate = round((total_check_ins / max(days_sober, 1)) * 100, 2) if days_sober > 0 else 0.0

    current_streak = calculate_current_streak(check_ins)
    longest_streak = calculate_longest_streak(check_ins)

    relapses_count = db.query(func.count(Relapse.id)).filter(Relapse.user_id == user.id).scalar() or 0

    milestones = db.query(Milestone.days_sober).filter(Milestone.user_id == user.id).order_by(Milestone.days_sober).all()
    milestones_achieved = [m.days_sober for m in milestones]

    return SobrietyStats(
        days_sober=days_sober,
        sobriety_start_date=start_date,
        current_streak=current_streak,
        longest_streak=longest_streak,
        total_check_ins=total_check_ins,
        check_in_rate=check_in_rate,
        relapses_count=relapses_count,
        milestones_achieved=milestones_achieved
    )


@router.get("/graph", response_model=List[GraphProgress])
async def get_sobriety_graph(
    days: int = 90,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get data for visual sobriety graph."""
    user = db.query(UserDB).filter(UserDB.username == current_user.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    start_date = db.scalar(
        UserDB.__table__.select()
        .where(UserDB.id == user.id)
        .with_only_columns(UserDB.sobriety_start_date)
    )
    if start_date is None:
        raise HTTPException(status_code=404, detail="Sobriety journey not started yet")

    end_date = date.today()
    start_date = max(start_date, end_date - timedelta(days=days))

    check_ins = db.query(DailyCheckIn).filter(
        and_(
            DailyCheckIn.user_id == user.id,
            DailyCheckIn.date >= start_date,
            DailyCheckIn.date <= end_date
        )
    ).order_by(DailyCheckIn.date).all()

    check_in_map = {c.date: c for c in check_ins}
    graph_data: List[GraphProgress] = []
    current_date = start_date
    day_number = 1

    while (current_date - end_date).days <= 0:  # Safe date comparison
        check_in = check_in_map.get(current_date)
        if check_in is not None:
            # Use scalar subquery to get primitive values
            stayed_sober = bool(db.scalar(DailyCheckIn.__table__.select().where(
                DailyCheckIn.id == check_in.id
            ).with_only_columns(DailyCheckIn.stayed_sober)))
            
            mood_value = db.scalar(DailyCheckIn.__table__.select().where(
                DailyCheckIn.id == check_in.id
            ).with_only_columns(DailyCheckIn.mood))
            mood = MoodType[mood_value.name] if mood_value is not None else None
            has_checkin = True
        else:
            stayed_sober = True
            mood = None
            has_checkin = False

        graph_data.append(
            GraphProgress(
                progress_date=current_date,
                stayed_sober=stayed_sober,
                mood=mood,
                has_check_in=has_checkin,
                day_number=day_number
            )
        )
        current_date += timedelta(days=1)
        day_number += 1

    return graph_data
@router.get("/milestones", response_model=List[MilestoneResponse])
async def get_milestones(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all achieved milestones."""
    user = db.query(UserDB).filter(UserDB.username == current_user.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    milestones = db.query(Milestone).filter(Milestone.user_id == user.id).order_by(Milestone.days_sober).all()
    return milestones
