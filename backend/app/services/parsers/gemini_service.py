import google.generativeai as genai
import os
from typing import Optional
from app.services.parsers.prompts import GEMINI_TIMETABLE_PROMPT
import PIL.Image

class GeminiService:
    def __init__(self, api_key: Optional[str] = None):
        key = api_key or os.getenv("GEMINI_API_KEY")
        if key:
            genai.configure(api_key=key)
        
        # Using gemini-1.5-flash as it is fast and supports vision, or gemini-1.5-pro
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def extract_timetable_json(self, image_paths: list[str]) -> str:
        """Sends the images and prompt to Gemini and returns the raw response string."""
        try:
            images = [PIL.Image.open(p) for p in image_paths]
            prompt_parts = [GEMINI_TIMETABLE_PROMPT] + images
            response = self.model.generate_content(prompt_parts)
            try:
                text = response.text.strip()
            except ValueError:
                raise ValueError("Could not extract any text from this image. It may be a random image, not a timetable, or blocked by safety filters.")
            
            # Clean up potential markdown formatting if the model disobeys
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
                
            if text.endswith("```"):
                text = text[:-3]
                
            return text.strip()
        except Exception as e:
            raise RuntimeError(f"Gemini API error: {str(e)}")
