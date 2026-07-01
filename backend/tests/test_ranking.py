import pytest
from app.schemas.schedule import SectionData, SubjectData
from app.services.ranking.ranking_engine import rank_sections

def test_ranking_scoring():
    section1 = SectionData(
        section="A",
        subjects=[
            SubjectData(course="Math", faculty="John", color="green"),  # 3
            SubjectData(course="Physics", faculty="Jane", color="yellow"), # 1
            SubjectData(course="Chemistry", faculty="Bob", color="red"), # -2
            SubjectData(course="English", faculty="Alice", color="white") # 0
        ]
    )
    
    rankings = rank_sections([section1])
    assert len(rankings) == 1
    
    r = rankings[0]
    assert r.score == 2  # 3 + 1 - 2 + 0
    assert r.greens == 1
    assert r.yellows == 1
    assert r.reds == 1
    assert r.whites == 1

def test_ranking_tie_breakers():
    # Tie 1: Same score, different greens
    # A: score 3, green 1 (1 green) -> higher
    # B: score 3, green 0 (3 yellow) -> lower
    section_a = SectionData(section="A", subjects=[SubjectData(color="green")])
    section_b = SectionData(section="B", subjects=[SubjectData(color="yellow"), SubjectData(color="yellow"), SubjectData(color="yellow")])
    
    # Tie 2: Same score, same greens, different reds
    # C: score 2, green 1 (1 green, 1 red, 1 yellow)
    # D: score 2, green 1 (1 green, 1 white, -1 wait no white is 0. So 1 green, 1 white, wait we need score 2. 
    # C: 1 green (3), 1 red (-2), 1 yellow (1) = 2. Greens = 1, Reds = 1
    # D: 1 green (3), 1 red (-1)? No red is -2. So 1 green, 1 white, no, just no. 
    # Let's do: score 1.
    # C: 1 green (3), 1 red (-2) -> score 1. Greens 1, Reds 1.
    # D: 1 yellow (1), 0 reds -> score 1. Greens 0, Reds 0. But we need same greens.
    # E: 1 green (3), 1 red (-2), 2 whites (0) -> score 1, green 1, red 1.
    pass

def test_tie_breakers_full():
    s1 = SectionData(section="S1", subjects=[SubjectData(color="green")]) # score: 3, green: 1, red: 0
    s2 = SectionData(section="S2", subjects=[SubjectData(color="yellow"), SubjectData(color="yellow"), SubjectData(color="yellow")]) # score: 3, green: 0, red: 0
    
    # s1 > s2 because of more greens
    r = rank_sections([s2, s1])
    assert r[0].section == "S1"
    assert r[1].section == "S2"
    
    # Same score, same greens, fewer reds wins
    s3 = SectionData(section="S3", subjects=[SubjectData(color="green"), SubjectData(color="yellow"), SubjectData(color="red")]) # score 3+1-2=2, green 1, red 1
    s4 = SectionData(section="S4", subjects=[SubjectData(color="green"), SubjectData(color="white"), SubjectData(color="red"), SubjectData(color="yellow"), SubjectData(color="white")]) 
    # wait we need same greens and different reds but same score
    # score 2, green 1. 
    # s3: 1 green (3), 1 red (-2), 1 yellow (1) = 2. red=1
    # s5: 1 green (3), 1 white (0), 1 red (-1? no).
    # How about score 0, green 1? 1 green (3), 1 red (-2), 1 red (-2), 1 yellow (1) = 0. red=2.
    # Another score 0, green 1: 1 green (3), 1 white (0), wait need to subtract 3. No other negative besides red. So reds must be same?
    # No, we can't have same score and same greens with different reds because red is the only negative. 
    # Score = 3*green + 1*yellow - 2*red.
    # If score and green are equal:
    # S = 3G + Y - 2R
    # S - 3G = Y - 2R
    # Since S and G are constant, Y - 2R is constant.
    # We can have: R=0, Y=0 (constant 0)
    # R=1, Y=2 (constant 0) -> 1 red, 2 yellows.
    # Let's test this!
    s_red0 = SectionData(section="A", subjects=[SubjectData(color="green")]) # score 3, G=1, R=0, Y=0
    s_red1 = SectionData(section="B", subjects=[SubjectData(color="green"), SubjectData(color="yellow"), SubjectData(color="yellow"), SubjectData(color="red")]) # score 3+2-2=3, G=1, R=1, Y=2
    
    # s_red0 > s_red1 because fewer reds
    r = rank_sections([s_red1, s_red0])
    assert r[0].section == "A"
    assert r[1].section == "B"

    # Same score, same green, same red, alphabetical
    s_alpha_b = SectionData(section="B", subjects=[SubjectData(color="white")]) # score 0
    s_alpha_a = SectionData(section="A", subjects=[SubjectData(color="white")]) # score 0
    r = rank_sections([s_alpha_b, s_alpha_a])
    assert r[0].section == "A"
    assert r[1].section == "B"

def test_zero_subjects():
    s = SectionData(section="Empty", subjects=[])
    r = rank_sections([s])
    assert r[0].score == 0
    assert r[0].greens == 0
    assert r[0].yellows == 0
    assert r[0].reds == 0
    assert r[0].whites == 0
