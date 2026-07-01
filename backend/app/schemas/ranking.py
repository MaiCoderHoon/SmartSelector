from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.schemas.schedule import SectionData

class SectionRanking(BaseModel):
    section: str
    score: int
    greens: int
    yellows: int
    reds: int
    whites: int
    subjects: List[Dict[str, Any]]  # Include original subject data for completeness, or keep it strictly typed

class AnalyticsData(BaseModel):
    highest_score: int
    lowest_score: int
    average_score: float
    total_sections: int
    total_subjects: int
    green_percentage: float
    yellow_percentage: float
    red_percentage: float
    white_percentage: float
    top_5_sections: List[str]

class UnifiedResponse(BaseModel):
    statistics: AnalyticsData
    topSections: List[SectionRanking]
    rankings: List[SectionRanking]
