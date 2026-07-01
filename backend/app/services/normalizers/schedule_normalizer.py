from typing import Dict, Any
from fastapi import HTTPException, status
from app.services.validators.text_normalizer import normalize_faculty_name, normalize_course_name
from app.services.validators.color_validator import normalize_color
from app.services.validators.section_validator import is_valid_section

class ScheduleNormalizer:
    @staticmethod
    def normalize(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Takes raw dictionary (from Gemini/Pydantic) and normalizes it.
        Removes invalid sections, duplicate subjects, normalizes names and colors.
        Returns a dictionary ready for the ranking engine.
        """
        sections_data = data.get("sections", [])
        
        normalized_sections = []
        stats = {
            "total_sections": 0,
            "total_subjects": 0,
            "total_faculty": 0,
            "duplicate_rows_removed": 0,
            "unknown_colors": 0,
            "missing_faculty": 0
        }
        
        unique_faculty = set()
        
        for section in sections_data:
            section_name = section.get("section", "")
            if isinstance(section_name, str):
                section_name = section_name.strip()
            else:
                section_name = str(section_name).strip()
            
            if not is_valid_section(section_name):
                continue
                
            subjects = section.get("subjects", [])
            normalized_subjects = []
            seen_subjects = set()
            
            for subject in subjects:
                # Ignore empty rows
                course_raw = subject.get("course", "")
                faculty_raw = subject.get("faculty", "")
                
                # Check for completely empty rows
                if not course_raw and not faculty_raw:
                    continue
                    
                course = normalize_course_name(course_raw)
                faculty = normalize_faculty_name(faculty_raw)
                color_raw = subject.get("color", "")
                color = normalize_color(color_raw)
                
                if color_raw and isinstance(color_raw, str) and color_raw.strip().lower() not in {"green", "yellow", "red", "white"}:
                    stats["unknown_colors"] += 1
                
                if not faculty:
                    stats["missing_faculty"] += 1
                else:
                    unique_faculty.add(faculty)
                
                # Track duplicates by course name. If no course name, use faculty to avoid filtering distinct empty-course rows
                subject_key = course if course else f"__no_course_faculty_{faculty}__"
                
                if subject_key in seen_subjects:
                    stats["duplicate_rows_removed"] += 1
                    continue
                    
                seen_subjects.add(subject_key)
                
                normalized_subjects.append({
                    "course": course,
                    "faculty": faculty,
                    "color": color
                })
            
            # Sort subjects alphabetically by course name
            normalized_subjects.sort(key=lambda x: x["course"] if x["course"] else "")
            stats["total_subjects"] += len(normalized_subjects)
            
            normalized_sections.append({
                "section": section_name,
                "subjects": normalized_subjects
            })
            
        # Sort sections alphabetically
        normalized_sections.sort(key=lambda x: x["section"])
        
        stats["total_sections"] = len(normalized_sections)
        stats["total_faculty"] = len(unique_faculty)
        
        if not normalized_sections:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail={
                    "error": "normalization_failed",
                    "message": "No valid sections could be extracted from the timetable."
                }
            )
            
        return {
            "sections": normalized_sections,
            "stats": stats
        }
