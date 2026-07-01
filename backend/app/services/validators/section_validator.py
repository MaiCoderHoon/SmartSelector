import re

def is_valid_section(section: str) -> bool:
    """
    Validates section names.
    Allows any string containing alphanumeric characters, up to 30 chars.
    """
    if not section or not isinstance(section, str):
        return False
        
    section = section.strip()
    if not section or len(section) > 30:
        return False
        
    return bool(re.search(r'[A-Za-z0-9]', section))
