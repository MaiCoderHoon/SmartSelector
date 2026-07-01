from fastapi import APIRouter, File, UploadFile, HTTPException, status
from app.schemas.ranking import UnifiedResponse
from app.schemas.schedule import SectionData
from app.utils.file_validation import validate_file
from app.services.upload_service import save_upload_file
from app.services.parsers.image_parser import ImageParser
from app.services.normalizers.schedule_normalizer import ScheduleNormalizer
from app.services.response.response_builder import build_response
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=UnifiedResponse)
async def upload_file(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file sent")
        
    # Validation
    validate_file(file)
    
    # Save the file
    try:
        file_path = await save_upload_file(file)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
        
    try:
        # Parse image
        parser = ImageParser()
        parsed_data = parser.parse(file_path)
        
        # Normalize data
        normalized_data = ScheduleNormalizer.normalize(parsed_data)
        
        # Build SectionData objects
        sections = [SectionData(**s) for s in normalized_data["sections"]]
        
        # Build Response
        response_dict = build_response(sections)
        return UnifiedResponse(**response_dict)
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process image: {str(e)}"
        )
