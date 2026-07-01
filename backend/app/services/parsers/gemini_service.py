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
        self.model = genai.GenerativeModel('gemini-1.5-pro')
    
    def extract_timetable_json(self, image_path: str) -> str:
        """Sends the image and prompt to Gemini and returns the raw response string."""
        try:
            img = PIL.Image.open(image_path)
            response = self.model.generate_content([GEMINI_TIMETABLE_PROMPT, img])
            text = response.text.strip()
            
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
