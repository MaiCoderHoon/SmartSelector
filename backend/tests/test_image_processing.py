import pytest
from PIL import Image
from app.services.image_processing.image_preprocessor import ImagePreprocessor
from app.services.image_processing.image_chunker import ImageChunker
from app.services.image_processing.chunk_merger import ChunkMerger
from app.core.config import settings
import math

def test_image_preprocessing():
    # Create a dummy image 100x100
    img = Image.new('RGB', (100, 100), color='white')
    
    processed = ImagePreprocessor.process(img)
    
    expected_width = int(100 * settings.UPSCALE_FACTOR)
    expected_height = int(100 * settings.UPSCALE_FACTOR)
    
    assert processed.width == expected_width
    assert processed.height == expected_height

def test_image_chunking():
    # Dummy image: 1000 height
    img = Image.new('RGB', (500, 1000), color='white')
    
    chunks = ImageChunker.chunk(img)
    
    # Check if we get expected number of chunks based on default config
    estimated_total_rows = 60
    num_chunks = max(1, math.ceil(estimated_total_rows / settings.TARGET_ROWS_PER_CHUNK))
    assert len(chunks) == num_chunks
    
    # Check header ratio
    header_ratio = 0.05
    header_height = int(1000 * header_ratio)
    
    # First chunk should have at least the header height
    assert chunks[0].height >= header_height

def test_chunk_merger():
    chunk1_data = {
        "sections": [
            {
                "section": "CSE-1",
                "subjects": [
                    {"name": "Math", "time": "10:00"}
                ]
            },
            {
                "section": "CSE-2",
                "subjects": [
                    {"name": "Physics", "time": "11:00"}
                ]
            }
        ]
    }
    
    chunk2_data = {
        "sections": [
            {
                "section": "CSE-1",
                "subjects": [
                    {"name": "Math", "time": "10:00"},  # Duplicate
                    {"name": "Chemistry", "time": "12:00"} # New
                ]
            },
            {
                "section": "CSE-3",
                "subjects": [
                    {"name": "Biology", "time": "09:00"}
                ]
            }
        ]
    }
    
    merged = ChunkMerger.merge([chunk1_data, chunk2_data])
    
    sections = merged.get("sections")
    assert len(sections) == 3
    
    # Check order
    assert sections[0]["section"] == "CSE-1"
    assert sections[1]["section"] == "CSE-2"
    assert sections[2]["section"] == "CSE-3"
    
    # Check subjects of CSE-1 (should be deduplicated and merged)
    cse1_subjects = sections[0]["subjects"]
    assert len(cse1_subjects) == 2
    assert {"name": "Math", "time": "10:00"} in cse1_subjects
    assert {"name": "Chemistry", "time": "12:00"} in cse1_subjects
