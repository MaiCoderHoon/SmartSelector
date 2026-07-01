from app.services.parsers.image_parser import ImageParser

class ParserFactory:
    @staticmethod
    def get_parser(content_type: str):
        """
        Factory method to return the appropriate parser based on the MIME type.
        Currently supports image parsing via Gemini.
        """
        if content_type.startswith("image/"):
            return ImageParser()
        raise ValueError(f"No parser available for content type: {content_type}")
