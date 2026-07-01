from typing import List
from app.schemas.ranking import SectionRanking, AnalyticsData

def generate_analytics(rankings: List[SectionRanking]) -> AnalyticsData:
    if not rankings:
        return AnalyticsData(
            highest_score=0,
            lowest_score=0,
            average_score=0.0,
            total_sections=0,
            total_subjects=0,
            green_percentage=0.0,
            yellow_percentage=0.0,
            red_percentage=0.0,
            white_percentage=0.0,
            top_5_sections=[]
        )

    total_sections = len(rankings)
    scores = [r.score for r in rankings]
    highest_score = max(scores)
    lowest_score = min(scores)
    average_score = sum(scores) / total_sections

    total_subjects = 0
    total_greens = 0
    total_yellows = 0
    total_reds = 0
    total_whites = 0

    for r in rankings:
        total_subjects += len(r.subjects)
        total_greens += r.greens
        total_yellows += r.yellows
        total_reds += r.reds
        total_whites += r.whites

    # Calculate percentages
    if total_subjects > 0:
        green_percentage = (total_greens / total_subjects) * 100
        yellow_percentage = (total_yellows / total_subjects) * 100
        red_percentage = (total_reds / total_subjects) * 100
        white_percentage = (total_whites / total_subjects) * 100
    else:
        green_percentage = 0.0
        yellow_percentage = 0.0
        red_percentage = 0.0
        white_percentage = 0.0

    # Top 5 sections
    top_5 = [r.section for r in rankings[:5]]

    return AnalyticsData(
        highest_score=highest_score,
        lowest_score=lowest_score,
        average_score=round(average_score, 2),
        total_sections=total_sections,
        total_subjects=total_subjects,
        green_percentage=round(green_percentage, 2),
        yellow_percentage=round(yellow_percentage, 2),
        red_percentage=round(red_percentage, 2),
        white_percentage=round(white_percentage, 2),
        top_5_sections=top_5
    )
