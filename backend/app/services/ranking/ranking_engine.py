from typing import List
from app.schemas.schedule import SectionData
from app.schemas.ranking import SectionRanking

SCORE_MAP = {
    "green": 3,
    "yellow": 1,
    "white": 0,
    "red": -2
}

def rank_sections(sections: List[SectionData]) -> List[SectionRanking]:
    """
    Ranks sections based on the fixed scoring rules:
    green = +3, yellow = +1, white = 0, red = -2
    
    Sorts descending by:
    1. Higher score
    2. More green
    3. Fewer red
    4. Alphabetical section name
    """
    rankings = []
    for section_data in sections:
        score = 0
        greens = 0
        yellows = 0
        reds = 0
        whites = 0
        
        for subject in section_data.subjects:
            color = subject.color.lower()
            if color == "green":
                greens += 1
                score += SCORE_MAP["green"]
            elif color == "yellow":
                yellows += 1
                score += SCORE_MAP["yellow"]
            elif color == "red":
                reds += 1
                score += SCORE_MAP["red"]
            elif color == "white":
                whites += 1
                score += SCORE_MAP["white"]
                
        ranking = SectionRanking(
            section=section_data.section,
            score=score,
            greens=greens,
            yellows=yellows,
            reds=reds,
            whites=whites,
            subjects=[s.model_dump() for s in section_data.subjects]
        )
        rankings.append(ranking)
        
    # Sort descending
    # Higher score: -r.score (descending)
    # More green: -r.greens (descending)
    # Fewer red: r.reds (ascending)
    # Alphabetical section name: r.section (ascending)
    rankings.sort(key=lambda r: (
        -r.score,
        -r.greens,
        r.reds,
        r.section
    ))
    
    return rankings
