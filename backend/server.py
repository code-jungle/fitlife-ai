from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from datetime import datetime, timedelta

# Import models and utilities
from models import (
    UserCreate, UserLogin, User, Token,
    Profile, ProfileUpdate, ProfileResponse,
    SuggestionCreate, Suggestion, SuggestionResponse
)
from auth import (
    get_password_hash, verify_password, create_access_token, get_current_user_email
)
from database import get_database
from gemini_service import gemini_service

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create FastAPI app
app = FastAPI(title="FitLife AI API", version="1.0.0")

# Create API router with /api prefix
api_router = APIRouter(prefix="/api")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== HELPER FUNCTIONS ====================

def calculate_bmi(weight: float, height: int) -> tuple[float, str]:
    """Calculate BMI and return category"""
    height_m = height / 100
    bmi = round(weight / (height_m ** 2), 1)
    
    if bmi < 18.5:
        category = "Abaixo do peso"
    elif bmi < 25:
        category = "Peso normal"
    elif bmi < 30:
        category = "Sobrepeso"
    elif bmi < 35:
        category = "Obesidade grau I"
    elif bmi < 40:
        category = "Obesidade grau II"
    else:
        category = "Obesidade grau III"
    
    return bmi, category

# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user with complete profile"""
    db = get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado"
        )
    
    # Create user
    user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password)
    )
    
    await db.users.insert_one(user.model_dump())
    
    # Create profile
    profile = Profile(
        user_id=user.id,
        full_name=user_data.full_name,
        age=user_data.age,
        weight=user_data.weight,
        height=user_data.height,
        objectives=user_data.objectives,
        dietary_restrictions=user_data.dietary_restrictions,
        training_type=user_data.training_type,
        current_activities=user_data.current_activities
    )
    
    await db.profiles.insert_one(profile.model_dump())
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    logger.info(f"Novo usuário registrado: {user.email}")
    
    return Token(access_token=access_token)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login user and return JWT token"""
    db = get_database()
    
    # Find user
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    user = User(**user_doc)
    
    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    logger.info(f"Login bem-sucedido: {user.email}")
    
    return Token(access_token=access_token)

# ==================== PROFILE ENDPOINTS ====================

@api_router.get("/profile", response_model=ProfileResponse)
async def get_profile(current_user_email: str = Depends(get_current_user_email)):
    """Get current user's profile"""
    db = get_database()
    
    # Get user
    user_doc = await db.users.find_one({"email": current_user_email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Get profile
    profile_doc = await db.profiles.find_one({"user_id": user_doc["id"]})
    if not profile_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil não encontrado"
        )
    
    profile = Profile(**profile_doc)
    
    # Calculate BMI
    bmi, bmi_category = calculate_bmi(profile.weight, profile.height)
    
    return ProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        full_name=profile.full_name,
        age=profile.age,
        weight=profile.weight,
        height=profile.height,
        objectives=profile.objectives,
        dietary_restrictions=profile.dietary_restrictions,
        training_type=profile.training_type,
        current_activities=profile.current_activities,
        bmi=bmi,
        bmi_category=bmi_category,
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

@api_router.put("/profile", response_model=ProfileResponse)
async def update_profile(
    profile_update: ProfileUpdate,
    current_user_email: str = Depends(get_current_user_email)
):
    """Update current user's profile"""
    db = get_database()
    
    # Get user
    user_doc = await db.users.find_one({"email": current_user_email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Get current profile
    profile_doc = await db.profiles.find_one({"user_id": user_doc["id"]})
    if not profile_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil não encontrado"
        )
    
    # Update only provided fields
    update_data = profile_update.model_dump(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await db.profiles.update_one(
            {"user_id": user_doc["id"]},
            {"$set": update_data}
        )
    
    # Get updated profile
    updated_profile_doc = await db.profiles.find_one({"user_id": user_doc["id"]})
    profile = Profile(**updated_profile_doc)
    
    # Calculate BMI
    bmi, bmi_category = calculate_bmi(profile.weight, profile.height)
    
    logger.info(f"Perfil atualizado: {current_user_email}")
    
    return ProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        full_name=profile.full_name,
        age=profile.age,
        weight=profile.weight,
        height=profile.height,
        objectives=profile.objectives,
        dietary_restrictions=profile.dietary_restrictions,
        training_type=profile.training_type,
        current_activities=profile.current_activities,
        bmi=bmi,
        bmi_category=bmi_category,
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

@api_router.delete("/user", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(current_user_email: str = Depends(get_current_user_email)):
    """Delete user account and all associated data"""
    db = get_database()
    
    # Get user
    user_doc = await db.users.find_one({"email": current_user_email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    user_id = user_doc["id"]
    
    # Delete all user data
    await db.profiles.delete_one({"user_id": user_id})
    await db.suggestions.delete_many({"user_id": user_id})
    await db.users.delete_one({"id": user_id})
    
    logger.info(f"Conta deletada: {current_user_email}")

# ==================== SUGGESTIONS ENDPOINTS ====================

@api_router.post("/suggestions/workout", response_model=SuggestionResponse, status_code=status.HTTP_201_CREATED)
async def generate_workout(current_user_email: str = Depends(get_current_user_email)):
    """Generate personalized workout suggestion"""
    db = get_database()
    
    # Get user and profile
    user_doc = await db.users.find_one({"email": current_user_email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    profile_doc = await db.profiles.find_one({"user_id": user_doc["id"]})
    if not profile_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil não encontrado. Complete seu perfil primeiro."
        )
    
    profile = Profile(**profile_doc)
    
    # Generate workout using Gemini
    logger.info(f"Gerando treino para: {current_user_email}")
    content = await gemini_service.generate_workout(profile)
    
    # Save suggestion
    suggestion = Suggestion(
        user_id=user_doc["id"],
        type="workout",
        content=content
    )
    
    await db.suggestions.insert_one(suggestion.model_dump())
    
    return SuggestionResponse(
        id=suggestion.id,
        type=suggestion.type,
        content=suggestion.content,
        created_at=suggestion.created_at
    )

@api_router.post("/suggestions/nutrition", response_model=SuggestionResponse, status_code=status.HTTP_201_CREATED)
async def generate_nutrition(current_user_email: str = Depends(get_current_user_email)):
    """Generate personalized nutrition suggestion"""
    db = get_database()
    
    # Get user and profile
    user_doc = await db.users.find_one({"email": current_user_email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    profile_doc = await db.profiles.find_one({"user_id": user_doc["id"]})
    if not profile_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil não encontrado. Complete seu perfil primeiro."
        )
    
    profile = Profile(**profile_doc)
    
    # Generate nutrition plan using Gemini
    logger.info(f"Gerando plano nutricional para: {current_user_email}")
    content = await gemini_service.generate_nutrition(profile)
    
    # Save suggestion
    suggestion = Suggestion(
        user_id=user_doc["id"],
        type="nutrition",
        content=content
    )
    
    await db.suggestions.insert_one(suggestion.model_dump())
    
    return SuggestionResponse(
        id=suggestion.id,
        type=suggestion.type,
        content=suggestion.content,
        created_at=suggestion.created_at
    )

@api_router.get("/suggestions/history")
async def get_suggestions_history(current_user_email: str = Depends(get_current_user_email)):
    """Get all suggestions history for current user"""
    db = get_database()
    
    # Get user
    user_doc = await db.users.find_one({"email": current_user_email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Get all suggestions, sorted by most recent
    suggestions_cursor = db.suggestions.find({"user_id": user_doc["id"]}).sort("created_at", -1)
    suggestions_docs = await suggestions_cursor.to_list(length=None)
    
    return {
        "workouts": [
            SuggestionResponse(**doc) 
            for doc in suggestions_docs 
            if doc["type"] == "workout"
        ],
        "nutrition": [
            SuggestionResponse(**doc) 
            for doc in suggestions_docs 
            if doc["type"] == "nutrition"
        ]
    }

@api_router.delete("/suggestions/{suggestion_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_suggestion(
    suggestion_id: str,
    current_user_email: str = Depends(get_current_user_email)
):
    """Delete a specific suggestion"""
    db = get_database()
    
    # Get user
    user_doc = await db.users.find_one({"email": current_user_email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Delete suggestion (only if it belongs to the user)
    result = await db.suggestions.delete_one({
        "id": suggestion_id,
        "user_id": user_doc["id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sugestão não encontrada"
        )
    
    logger.info(f"Sugestão deletada: {suggestion_id} por {current_user_email}")

# ==================== HEALTH CHECK ====================

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

# Include router
app.include_router(api_router)

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 FitLife AI API iniciada")
    logger.info("📊 MongoDB conectado")
    logger.info("🤖 Gemini AI configurado com Emergent LLM Key")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    from database import Database
    await Database.close()
    logger.info("👋 FitLife AI API encerrada")
