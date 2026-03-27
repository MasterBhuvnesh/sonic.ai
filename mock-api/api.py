# ============================================
# MOCK FASTAPI SERVER 
# ============================================

from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel

# ============================================
# CONFIGURATION
# ============================================

# API key for authentication (change this if needed)
API_KEY = "123456"

# This is the mock audio URL that will always be returned
MOCK_AUDIO_URL = "https://studzee-assets.s3.ap-south-1.amazonaws.com/fahhh.wav"

# Available voices (same as real API)
TARGET_VOICES = ["Vinay", "Gavin"]


# ============================================
# INITIALIZE FASTAPI APP
# ============================================

app = FastAPI(title="Mock StyleTTS2 API")


# ============================================
# AUTHENTICATION FUNCTION
# ============================================

def verify_api_key(authorization: str = Header(None)):
    """
    This function validates the API key.

    Expected header:
    Authorization: Bearer <API_KEY>
    """

    # Check if header is missing
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="API key is missing"
        )

    # Extract token (remove 'Bearer ' if present)
    if authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    else:
        token = authorization

    # Validate token
    if token != API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid API key"
        )

    return token


# ============================================
# REQUEST MODEL (BODY STRUCTURE)
# ============================================

class TextOnlyRequest(BaseModel):
    """
    Request body for /generate endpoint
    """
    text: str
    target_voice: str


# ============================================
# ROUTES
# ============================================

@app.post("/generate", dependencies=[Depends(verify_api_key)])
async def generate_speech(request: TextOnlyRequest):
    """
    MOCK GENERATE ENDPOINT

    What it does:
    - Validates input
    - DOES NOT generate audio
    - Returns a fixed S3 URL

    This mimics your real API response structure
    """

    # Validate text length
    if len(request.text) > 5000:
        raise HTTPException(
            status_code=400,
            detail="Text length exceeds the limit of 5000 characters"
        )

    # Validate voice
    if request.target_voice not in TARGET_VOICES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid voice. Choose from: {', '.join(TARGET_VOICES)}"
        )

    # Return mock response (same format as real API)
    return {
        "audio_url": MOCK_AUDIO_URL,
        "s3_key": "mock/fahhh.wav"
    }


@app.get("/voices", dependencies=[Depends(verify_api_key)])
async def list_voices():
    """
    Returns list of available voices
    """
    return {
        "voices": TARGET_VOICES
    }


@app.get("/health", dependencies=[Depends(verify_api_key)])
async def health_check():
    """
    Health check endpoint
    Useful for load balancers / monitoring
    """
    return {
        "status": "healthy",
        "mock": True
    }


# ============================================
# OPTIONAL ROOT ROUTE (FOR QUICK TEST)
# ============================================

@app.get("/")
def root():
    """
    Simple root endpoint to verify server is running
    """
    return {
        "message": "Mock StyleTTS2 API is running"
    }