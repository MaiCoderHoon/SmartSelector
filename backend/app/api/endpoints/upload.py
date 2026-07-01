from fastapi import APIRouter, File, UploadFile, HTTPException, status
from app.schemas.upload import UploadResponse
from app.utils.file_validation import validate_file
from app.services.upload_service import save_upload_file

router = APIRouter()

@router.post("/", response_model=UploadResponse)
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
        
    # Get actual size saved if file.size isn't accurate
    import os
    size = os.path.getsize(file_path)
    
    return UploadResponse(
        success=True,
        filename=file.filename,
        size=size,
        content_type=file.content_type or "application/octet-stream",
        message="File uploaded successfully"
    )
