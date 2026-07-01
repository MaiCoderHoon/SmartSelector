from typing import List, Dict, Any
from app.schemas.schedule import SectionData
from app.schemas.ranking import UnifiedResponse
from app.services.ranking.ranking_engine import rank_sections
from app.services.analytics.analytics_engine import generate_analytics

def build_response(sections: List[SectionData]) -> Dict[str, Any]:
    """
    Builds the final unified API response containing statistics,
    top sections, and the full rankings list.
    """
    rankings = rank_sections(sections)
    statistics = generate_analytics(rankings)
    
    # We take the top 5 SectionRanking objects for 'topSections'
    top_sections = rankings[:5]
    
    response = UnifiedResponse(
        statistics=statistics,
        topSections=top_sections,
        rankings=rankings
    )
    
    return response.model_dump()
