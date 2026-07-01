from typing import List, Optional, Literal
from pydantic import BaseModel, Field

ColorType = Literal["green", "yellow", "red", "white"]

class SubjectData(BaseModel):
    course: Optional[str] = None
    faculty: Optional[str] = None
    color: ColorType = Field(default="white")

class SectionData(BaseModel):
    section: str
    subjects: List[SubjectData]

class TimetableExtraction(BaseModel):
    sections: List[SectionData]
