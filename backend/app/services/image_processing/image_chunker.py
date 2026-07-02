import math
from PIL import Image
from typing import List
from app.core.config import settings

class ImageChunker:
    @staticmethod
    def chunk(image: Image.Image) -> List[Image.Image]:
        """
        Divides the timetable into multiple horizontal pieces.
        Requirements:
        - Split using rows instead of arbitrary pixels (heuristically based on expected rows)
        - Target approximately 8-12 timetable rows per chunk
        - Add small overlap between chunks so no row is cut
        - Keep headers if possible (appends the top % of image to each chunk)
        - Preserve image quality
        """
        width, height = image.size
        
        # Estimate the number of chunks based on a typical 60-row timetable
        estimated_total_rows = 60
        num_chunks = max(1, math.ceil(estimated_total_rows / settings.TARGET_ROWS_PER_CHUNK))
        
        # Header heuristic: top 5% of the original image often contains the table headers
        header_ratio = 0.05
        header_height = int(height * header_ratio)
        header_image = image.crop((0, 0, width, header_height))
        
        # The body to be chunked is below the header
        body_start_y = header_height
        body_height = height - body_start_y
        
        chunk_height = math.ceil(body_height / num_chunks)
        overlap = settings.CHUNK_OVERLAP
        
        chunks = []
        for i in range(num_chunks):
            start_y = body_start_y + (i * chunk_height)
            # Add overlap to the start_y for chunks after the first one to avoid cutting rows
            if i > 0:
                start_y -= overlap
                
            end_y = min(height, body_start_y + ((i + 1) * chunk_height) + overlap)
            
            # Crop the chunk from the body
            body_chunk = image.crop((0, start_y, width, end_y))
            
            # If it's the first chunk, the header is already naturally before it or part of it? 
            # Wait, if we start body_start_y at header_height, we just prepend the header.
            # Let's create a new image that combines the header and the body_chunk.
            chunk_total_height = header_height + body_chunk.height
            final_chunk = Image.new('RGB', (width, chunk_total_height))
            final_chunk.paste(header_image, (0, 0))
            final_chunk.paste(body_chunk, (0, header_height))
            
            chunks.append(final_chunk)
            
            if end_y >= height:
                break
                
        return chunks
