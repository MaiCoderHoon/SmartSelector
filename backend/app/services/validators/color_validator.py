def normalize_color(color: str) -> str:
    """
    Normalizes color string.
    Allowed output colors: green, yellow, red, white.
    Any unknown colors must become white.
    """
    if not color:
        return "white"
        
    color_normalized = color.strip().lower()
    allowed_colors = {"green", "yellow", "red", "white"}
    
    if color_normalized in allowed_colors:
        return color_normalized
        
    return "white"
