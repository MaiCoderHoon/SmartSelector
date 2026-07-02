from PIL import Image, ImageEnhance
import cv2
import numpy as np
from app.core.config import settings

class ImagePreprocessor:
    @staticmethod
    def process(image: Image.Image) -> Image.Image:
        """
        Preprocesses the timetable image to improve OCR readability:
        1. Upscale by UPSCALE_FACTOR using high-quality interpolation
        2. Increase contrast by CONTRAST_FACTOR
        3. Sharpen by SHARPEN_FACTOR
        Preserves original colors and never crops.
        """
        # 1. Upscale
        new_width = int(image.width * settings.UPSCALE_FACTOR)
        new_height = int(image.height * settings.UPSCALE_FACTOR)
        
        # High quality interpolation using Lanczos
        image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # 2. Increase contrast
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(settings.CONTRAST_FACTOR)
        
        # 3. Sharpen
        sharpness = ImageEnhance.Sharpness(image)
        image = sharpness.enhance(settings.SHARPEN_FACTOR)
        
        return image
