from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, List, Literal
from datetime import datetime
import uuid

# ==================== USER MODELS ====================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    age: int
    weight: float
    height: int
    objectives: str
    dietary_restrictions: Optional[str] = None
    training_type: Literal["academia", "casa", "ar_livre"]
    current_activities: Optional[str] = None

    @field_validator('age')
    def validate_age(cls, v):
        if not 12 <= v <= 100:
            raise ValueError('Idade deve estar entre 12 e 100 anos')
        return v

    @field_validator('weight')
    def validate_weight(cls, v):
        if not 30 <= v <= 300:
            raise ValueError('Peso deve estar entre 30 e 300 kg')
        return v

    @field_validator('height')
    def validate_height(cls, v):
        if not 120 <= v <= 250:
            raise ValueError('Altura deve estar entre 120 e 250 cm')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ==================== PROFILE MODELS ====================

class Profile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    full_name: str
    age: int
    weight: float
    height: int
    objectives: str
    dietary_restrictions: Optional[str] = None
    training_type: Literal["academia", "casa", "ar_livre"]
    current_activities: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[int] = None
    objectives: Optional[str] = None
    dietary_restrictions: Optional[str] = None
    training_type: Optional[Literal["academia", "casa", "ar_livre"]] = None
    current_activities: Optional[str] = None

    @field_validator('age')
    def validate_age(cls, v):
        if v is not None and not 12 <= v <= 100:
            raise ValueError('Idade deve estar entre 12 e 100 anos')
        return v

    @field_validator('weight')
    def validate_weight(cls, v):
        if v is not None and not 30 <= v <= 300:
            raise ValueError('Peso deve estar entre 30 e 300 kg')
        return v

    @field_validator('height')
    def validate_height(cls, v):
        if v is not None and not 120 <= v <= 250:
            raise ValueError('Altura deve estar entre 120 e 250 cm')
        return v

class ProfileResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    age: int
    weight: float
    height: int
    objectives: str
    dietary_restrictions: Optional[str] = None
    training_type: str
    current_activities: Optional[str] = None
    bmi: float
    bmi_category: str
    created_at: datetime
    updated_at: datetime

# ==================== SUGGESTION MODELS ====================

class SuggestionCreate(BaseModel):
    type: Literal["workout", "nutrition"]

class Suggestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: Literal["workout", "nutrition"]
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SuggestionResponse(BaseModel):
    id: str
    type: str
    content: str
    created_at: datetime

# ==================== TOKEN MODELS ====================

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None
