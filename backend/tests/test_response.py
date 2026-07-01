import pytest
from app.schemas.schedule import SectionData, SubjectData
from app.services.response.response_builder import build_response

def test_build_response():
    section1 = SectionData(
        section="Section A",
        subjects=[
            SubjectData(course="Math", faculty="John", color="green"),
            SubjectData(course="Physics", faculty="Jane", color="yellow")
        ]
    )
    
    section2 = SectionData(
        section="Section B",
        subjects=[
            SubjectData(course="Chemistry", faculty="Bob", color="red"),
            SubjectData(course="English", faculty="Alice", color="white")
        ]
    )
    
    sections = [section1, section2]
    
    response = build_response(sections)
    
    # Check structure
    assert "statistics" in response
    assert "topSections" in response
    assert "rankings" in response
    
    # Check statistics
    stats = response["statistics"]
    assert stats["total_sections"] == 2
    assert stats["total_subjects"] == 4
    assert stats["highest_score"] == 4  # A: 3 + 1
    assert stats["lowest_score"] == -2  # B: -2 + 0
    assert stats["top_5_sections"] == ["Section A", "Section B"]
    
    # Check rankings order (A should be first because 4 > -2)
    rankings = response["rankings"]
    assert len(rankings) == 2
    assert rankings[0]["section"] == "Section A"
    assert rankings[0]["score"] == 4
    assert rankings[1]["section"] == "Section B"
    assert rankings[1]["score"] == -2
    
    # Check topSections (same as rankings since total sections = 2 < 5)
    top = response["topSections"]
    assert len(top) == 2
    assert top[0]["section"] == "Section A"
