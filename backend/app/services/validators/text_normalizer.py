def normalize_text(text: str) -> str:
    """Trims whitespace and normalizes internal spaces."""
    if not text:
        return ""
    return " ".join(text.split())

def normalize_faculty_name(name: str) -> str:
    """Converts faculty name to proper title case."""
    if not name:
        return ""
    return normalize_text(name).title()

def normalize_course_name(name: str) -> str:
    """Converts course name to title case."""
    if not name:
        return ""
    return normalize_text(name).title()
