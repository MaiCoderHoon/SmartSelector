import json
import logging
import PIL.Image
from pydantic import ValidationError
from fastapi import HTTPException
from app.schemas.schedule import TimetableExtraction
from app.services.parsers.gemini_service import GeminiService
from app.services.image_processing.image_preprocessor import ImagePreprocessor
from app.services.image_processing.image_chunker import ImageChunker
from app.services.image_processing.chunk_merger import ChunkMerger

logger = logging.getLogger(__name__)

class ImageParser:
    def __init__(self, gemini_service: GeminiService = None):
        self.gemini_service = gemini_service or GeminiService()

    def parse(self, image_paths: list[str]) -> dict:
        """
        Parses images by preprocessing, chunking, extracting each chunk, and merging results.
        """
        all_parsed_chunks = []
        
        for image_path in image_paths:
            try:
                original_image = PIL.Image.open(image_path)
            except Exception as e:
                logger.error(f"Failed to open image {image_path}: {str(e)}")
                raise HTTPException(status_code=400, detail=f"Failed to open image {image_path}: {str(e)}")

            # 1. Preprocess
            processed_img = ImagePreprocessor.process(original_image)
            
            # 2. Chunk
            chunks = ImageChunker.chunk(processed_img)
            
            # 3. Process each chunk
            for idx, chunk in enumerate(chunks):
                chunk_data = self._parse_single_chunk(chunk, chunk_index=idx)
                if chunk_data:
                    all_parsed_chunks.append(chunk_data)
                    
        if not all_parsed_chunks:
            raise HTTPException(status_code=422, detail="Failed to parse any chunks successfully.")
            
        # 4. Merge
        merged_data = ChunkMerger.merge(all_parsed_chunks)
        
        # 5. Validate final merged data
        try:
            validated_data = TimetableExtraction(**merged_data)
            return validated_data.model_dump()
        except ValidationError as e:
            logger.error(f"Final merged validation failed: {str(e)}")
            raise HTTPException(
                status_code=422,
                detail={"error": "validation_failed", "message": "Failed to validate merged AI response."}
            )

    def _parse_single_chunk(self, chunk: PIL.Image.Image, chunk_index: int) -> dict:
        attempts = 0
        max_attempts = 2
        
        while attempts < max_attempts:
            try:
                raw_response = self.gemini_service.extract_timetable_json_from_image(chunk)
                data = json.loads(raw_response)
                
                if "sections" in data and isinstance(data["sections"], list):
                    data["sections"] = [s for s in data["sections"] if s.get("section")]
                    
                # Validate with Pydantic per chunk to ensure well-formedness
                TimetableExtraction(**data)
                return data
                
            except (json.JSONDecodeError, ValidationError) as e:
                attempts += 1
                logger.warning(f"Chunk {chunk_index} parsing attempt {attempts} failed: {str(e)}")
            except Exception as e:
                logger.error(f"Chunk {chunk_index} failed with system error: {str(e)}")
                break
                
        logger.error(f"Chunk {chunk_index} failed completely after {max_attempts} attempts. Returning partial results.")
        return None
