import re

def is_valid_section(section: str) -> bool:
    """
    Validates section names.
    Valid section names follow: ^[A-Z][0-9]{1,2}$
    """
    if not section:
        return False
        
    pattern = r"^[A-Z][0-9]{1,2}$"
    return bool(re.match(pattern, section.strip()))
