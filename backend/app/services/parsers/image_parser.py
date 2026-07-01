import json
import logging
from pydantic import ValidationError
from fastapi import HTTPException
from app.schemas.schedule import TimetableExtraction
from app.services.parsers.gemini_service import GeminiService

logger = logging.getLogger(__name__)

class ImageParser:
    def __init__(self, gemini_service: GeminiService = None):
        self.gemini_service = gemini_service or GeminiService()

    def parse(self, image_path: str) -> dict:
        """
        Parses the image using Gemini, validates the JSON output against the Pydantic schema,
        and implements a 1-retry mechanism on validation failure.
        """
        attempts = 0
        max_attempts = 2
        last_error = None
        
        while attempts < max_attempts:
            try:
                raw_response = self.gemini_service.extract_timetable_json(image_path)
                data = json.loads(raw_response)
                
                # Pre-processing: handle "Missing section: Skip the entry."
                if "sections" in data and isinstance(data["sections"], list):
                    data["sections"] = [s for s in data["sections"] if s.get("section")]
                    
                # Validate with Pydantic
                validated_data = TimetableExtraction(**data)
                return validated_data.model_dump()
                
            except (json.JSONDecodeError, ValidationError) as e:
                attempts += 1
                last_error = str(e)
                logger.warning(f"Parsing attempt {attempts} failed due to validation/JSON error: {last_error}")
            except Exception as e:
                # System or API errors
                raise HTTPException(status_code=500, detail={"error": "extraction_failed", "message": str(e)})
                
        # If we reach here, we exhausted our retries
        raise HTTPException(
            status_code=422,
            detail={
                "error": "validation_failed",
                "message": f"Failed to validate AI response after {max_attempts} attempts.",
                "details": last_error
            }
        )
