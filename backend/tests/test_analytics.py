import pytest
from app.schemas.ranking import SectionRanking
from app.services.analytics.analytics_engine import generate_analytics

def test_generate_analytics_empty():
    analytics = generate_analytics([])
    assert analytics.total_sections == 0
    assert analytics.total_subjects == 0
    assert analytics.average_score == 0.0
    assert analytics.green_percentage == 0.0
    assert len(analytics.top_5_sections) == 0

def test_generate_analytics_calculations():
    # Provide rankings (they should already be sorted as per ranking_engine, but we just test the math here)
    rankings = [
        SectionRanking(
            section="Sec1", score=10, greens=2, yellows=1, reds=0, whites=0, subjects=[{}, {}, {}]
        ),
        SectionRanking(
            section="Sec2", score=5, greens=1, yellows=0, reds=1, whites=0, subjects=[{}, {}]
        ),
        SectionRanking(
            section="Sec3", score=0, greens=0, yellows=0, reds=0, whites=3, subjects=[{}, {}, {}]
        ),
        SectionRanking(
            section="Sec4", score=-2, greens=0, yellows=0, reds=1, whites=0, subjects=[{}]
        ),
        SectionRanking(
            section="Sec5", score=-4, greens=0, yellows=0, reds=2, whites=1, subjects=[{}, {}, {}]
        ),
        SectionRanking(
            section="Sec6", score=-10, greens=0, yellows=0, reds=5, whites=0, subjects=[{}, {}, {}, {}, {}]
        )
    ]
    
    analytics = generate_analytics(rankings)
    
    assert analytics.total_sections == 6
    # Subjects = 3 + 2 + 3 + 1 + 3 + 5 = 17
    assert analytics.total_subjects == 17
    
    assert analytics.highest_score == 10
    assert analytics.lowest_score == -10
    # sum = 10 + 5 + 0 - 2 - 4 - 10 = -1
    # avg = -1 / 6 = -0.1666...
    assert analytics.average_score == -0.17
    
    # Greens: 2 + 1 = 3 -> 3/17 * 100 = 17.65%
    assert analytics.green_percentage == 17.65
    
    # Yellows: 1 -> 1/17 * 100 = 5.88%
    assert analytics.yellow_percentage == 5.88
    
    # Reds: 0 + 1 + 0 + 1 + 2 + 5 = 9 -> 9/17 * 100 = 52.94%
    assert analytics.red_percentage == 52.94
    
    # Whites: 0 + 0 + 3 + 0 + 1 + 0 = 4 -> 4/17 * 100 = 23.53%
    assert analytics.white_percentage == 23.53
    
    # Top 5 sections should be the first 5 names
    assert analytics.top_5_sections == ["Sec1", "Sec2", "Sec3", "Sec4", "Sec5"]
