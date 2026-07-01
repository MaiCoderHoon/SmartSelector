import pytest
from fastapi import HTTPException
from app.services.validators.color_validator import normalize_color
from app.services.validators.section_validator import is_valid_section
from app.services.validators.text_normalizer import normalize_faculty_name, normalize_course_name
from app.services.normalizers.schedule_normalizer import ScheduleNormalizer

def test_color_normalization():
    assert normalize_color("green") == "green"
    assert normalize_color("YELLOW ") == "yellow"
    assert normalize_color("Red") == "red"
    assert normalize_color("white") == "white"
    assert normalize_color("blue") == "white" # unknown
    assert normalize_color(None) == "white"
    assert normalize_color("") == "white"

def test_section_validation():
    assert is_valid_section("A1") is True
    assert is_valid_section("Z99") is True
    assert is_valid_section("B0") is True
    
    assert is_valid_section("a1") is False # lowercase
    assert is_valid_section("AA1") is False # two letters
    assert is_valid_section("A123") is False # three digits
    assert is_valid_section("1A") is False
    assert is_valid_section("") is False
    assert is_valid_section(None) is False

def test_text_normalization():
    assert normalize_faculty_name(" john  doe ") == "John Doe"
    assert normalize_course_name(" math  101 ") == "Math 101"
    assert normalize_faculty_name("") == ""
    assert normalize_course_name(None) == ""

def test_duplicate_removal_and_empty_filtering():
    raw_data = {
        "sections": [
            {
                "section": "A1",
                "subjects": [
                    {"course": "Math", "faculty": "John", "color": "red"},
                    {"course": "Math", "faculty": "John", "color": "red"}, # Exact duplicate
                    {"course": "Math", "faculty": "Jane", "color": "green"}, # Duplicate course
                    {"course": "Physics", "faculty": "Albert", "color": "blue"}, # Valid, blue -> white
                    {"course": "", "faculty": "", "color": "red"} # Empty row
                ]
            }
        ]
    }
    
    result = ScheduleNormalizer.normalize(raw_data)
    sections = result["sections"]
    stats = result["stats"]
    
    assert len(sections) == 1
    assert sections[0]["section"] == "A1"
    assert len(sections[0]["subjects"]) == 2 # Math and Physics
    
    assert stats["duplicate_rows_removed"] == 2
    assert stats["unknown_colors"] == 1
    assert stats["total_subjects"] == 2
    
def test_no_valid_sections():
    raw_data = {
        "sections": [
            {
                "section": "invalid_section",
                "subjects": []
            }
        ]
    }
    
    with pytest.raises(HTTPException) as exc_info:
        ScheduleNormalizer.normalize(raw_data)
        
    assert exc_info.value.status_code == 422
    assert exc_info.value.detail["error"] == "normalization_failed"

def test_sorting():
    raw_data = {
        "sections": [
            {
                "section": "B1",
                "subjects": [
                    {"course": "Zebra", "faculty": "Zoo"},
                    {"course": "Apple", "faculty": "Ape"}
                ]
            },
            {
                "section": "A1",
                "subjects": [
                    {"course": "Math", "faculty": "John"}
                ]
            }
        ]
    }
    
    result = ScheduleNormalizer.normalize(raw_data)
    sections = result["sections"]
    
    # Check section sorting
    assert sections[0]["section"] == "A1"
    assert sections[1]["section"] == "B1"
    
    # Check subject sorting inside B1
    b1_subjects = sections[1]["subjects"]
    assert b1_subjects[0]["course"] == "Apple"
    assert b1_subjects[1]["course"] == "Zebra"
