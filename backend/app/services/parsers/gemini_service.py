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
        self.model = genai.GenerativeModel('gemini-3.5-flash')
    
    def extract_timetable_json(self, image_paths: list[str]) -> str:
        """Sends the images and prompt to Gemini and returns the raw response string."""
        import json
        import PIL.Image
        all_sections = []
        
        for p in image_paths:
            try:
                image = PIL.Image.open(p)
                text = self._generate_for_image(image)
                data = json.loads(text.strip())
                if "sections" in data:
                    all_sections.extend(data["sections"])
            except Exception as e:
                raise RuntimeError(f"Gemini API error on image: {str(e)}")
                
        return json.dumps({"sections": all_sections})

    def extract_timetable_json_from_image(self, image: PIL.Image.Image) -> str:
        """Sends a single PIL Image to Gemini and returns the raw JSON string."""
        import json
        try:
            text = self._generate_for_image(image)
            # Just to validate it's JSON
            data = json.loads(text.strip())
            return json.dumps(data)
        except Exception as e:
            raise RuntimeError(f"Gemini API error on image: {str(e)}")

    def _generate_for_image(self, image: PIL.Image.Image) -> str:
        import re
        prompt_parts = [GEMINI_TIMETABLE_PROMPT, image]
        response = self.model.generate_content(prompt_parts)
        text = response.text.strip()
        
        json_match = re.search(r'```json\s*(.*?)\s*```', text, re.DOTALL)
        if json_match:
            text = json_match.group(1).strip()
        else:
            text = text.split('</thinking>')[-1].strip()
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
        return text
