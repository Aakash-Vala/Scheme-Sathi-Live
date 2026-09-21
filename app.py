"""
Main FastAPI Web Application Server for Scheme Sathi (SIH PS 26092).
Provides high-performance REST APIs for AI Scheme Recommendation,
ML Loan Approval Prediction, Financial EMI Calculations, and Geo-Spatial Partner Locator.
"""

import os
import io
from typing import Optional, List
from fastapi import FastAPI, Query, HTTPException, UploadFile, File, Header
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ml_engine.recommender import get_recommender
from services.calculator_service import FinancialCalculatorService
from services.locator_service import get_locator
from services.chatbot_service import get_chatbot_service
from services.registration_service import get_registration_service
from services.auth_service import get_auth_service
from services.db import db_service

app = FastAPI(
    title="Scheme Sathi - AI Scheme Matching Platform",
    description="Smart India Hackathon (PS 26092) - MoSJE & NSFDC Concessional Credit AI Platform",
    version="1.0.0"
)

@app.on_event("startup")
async def on_startup():
    db_service.init_and_seed()


# CORS Middleware
cors_origins_env = os.environ.get("CORS_ORIGINS", "*")
allowed_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()] if cors_origins_env != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Request / Response Schemas
class ApplicantProfile(BaseModel):
    caste_category: str = Field(default="SC", description="SC, Safai Karamchari / Dependent, ST, OBC, General")
    annual_income: float = Field(default=180000.0, ge=0, description="Annual family income in INR")
    gender: str = Field(default="Female", description="Female, Male, Other")
    age: int = Field(default=32, ge=18, le=70, description="Applicant age in years")
    education_level: str = Field(default="Secondary (10th)", description="Education qualification level")
    project_category: str = Field(default="micro_finance", description="micro_finance, term_loan, education, green_energy, sanitation")
    project_cost: float = Field(default=120000.0, gt=0, description="Estimated total project or education cost in INR")
    requested_loan: Optional[float] = Field(default=None, description="Requested loan amount in INR (defaults to 90% of cost)")
    project_description: str = Field(default="", description="Natural language description of the business venture or course")
    promoter_contribution_amount: Optional[float] = Field(default=None, description="Margin money beneficiary can contribute")
    has_vocational_training: int = Field(default=1, description="1 if holds PMKVY / NSFDC skill certificate, 0 otherwise")
    experience_years: int = Field(default=2, ge=0, description="Years of business experience")
    has_clean_credit: int = Field(default=1, description="1 if clean credit history, 0 if defaults")
    has_valid_caste_cert: int = Field(default=1, description="1 if caste certificate verified, 0 otherwise")
    has_valid_income_cert: int = Field(default=1, description="1 if income certificate verified, 0 otherwise")
    user_latitude: Optional[float] = Field(default=28.6139, description="Applicant GPS latitude")
    user_longitude: Optional[float] = Field(default=77.2090, description="Applicant GPS longitude")

class CalculatorRequest(BaseModel):
    loan_amount: float = Field(default=100000.0, gt=0)
    interest_rate_pct: float = Field(default=6.5, ge=1.0, le=25.0)
    tenure_years: float = Field(default=3.0, ge=0.5, le=15.0)
    moratorium_months: int = Field(default=3, ge=0, le=24)
    commercial_rate_pct: float = Field(default=12.0, ge=5.0, le=30.0)
    capitalize_moratorium_interest: bool = Field(default=False)

class ApplicationExportRequest(BaseModel):
    applicant_name: str = Field(default="Aakash Kumar")
    phone_number: str = Field(default="9876543210")
    state: str = Field(default="Delhi")
    district: str = Field(default="New Delhi")
    scheme_id: str = Field(default="nsfdc_mcf")
    profile: ApplicantProfile

class ChatMessageRequest(BaseModel):
    message: str = Field(..., description="User question regarding schemes, eligibility, documents, or partners")
    language: str = Field(default="en", description="User preferred language code: en, hi, mr, ta, te, bn")

class SchemeRegistrationRequest(BaseModel):
    applicant_name: str = Field(..., description="Full legal name of the applicant")
    phone_number: str = Field(..., description="10-digit mobile number")
    email: Optional[str] = Field(default="")
    aadhaar_last_four: str = Field(default="XXXX", description="Last 4 digits of Aadhaar card")
    state: str = Field(default="Delhi")
    district: str = Field(default="New Delhi")
    gender: str = Field(default="Female")
    caste_category: str = Field(default="SC")
    caste_cert_number: Optional[str] = Field(default="")
    annual_income: float = Field(..., ge=0)
    income_cert_authority: Optional[str] = Field(default="Revenue Dept / SDM / Tehsildar")
    scheme_id: str = Field(..., description="ID of the selected scheme")
    project_cost: float = Field(..., gt=0)
    promoter_contribution: Optional[float] = Field(default=0.0)
    requested_loan: Optional[float] = Field(default=None)
    assigned_partner_id: Optional[str] = Field(default=None)
    confirmed_by_user: bool = Field(..., description="Must be true to confirm pre-submission details")

class UserSignUpRequest(BaseModel):
    full_name: str = Field(..., min_length=2, description="Beneficiary Full Legal Name")
    phone_number: str = Field(..., description="10-digit Indian Mobile Number")
    password: str = Field(..., min_length=6, description="Account password (min 6 characters)")
    email: Optional[str] = Field(default="")
    caste_category: str = Field(default="SC")
    caste_cert_number: Optional[str] = Field(default="")
    annual_income: float = Field(default=180000.0, ge=0)
    income_cert_authority: Optional[str] = Field(default="Revenue Dept / SDM")
    gender: str = Field(default="Female")
    state: str = Field(default="Delhi")
    district: str = Field(default="New Delhi")
    aadhaar_number: Optional[str] = Field(default=None, description="Full 12-digit Aadhaar Card number")
    aadhaar_last_four: str = Field(default="0000")

class UserLoginRequest(BaseModel):
    identifier: str = Field(..., description="Mobile Number or Email")
    password: str = Field(..., description="Account password")

class AadhaarSendOtpRequest(BaseModel):
    aadhaar_number: str = Field(..., description="12-digit numerical Aadhaar Card Number")

class AadhaarVerifyOtpRequest(BaseModel):
    aadhaar_number: str = Field(..., description="12-digit numerical Aadhaar Card Number")
    otp: str = Field(..., min_length=4, max_length=8, description="6-digit verification OTP code")

class UserProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    annual_income: Optional[float] = None
    caste_category: Optional[str] = None
    caste_cert_number: Optional[str] = None
    income_cert_authority: Optional[str] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    aadhaar_number: Optional[str] = None
    aadhaar_last_four: Optional[str] = None

def get_current_user_optional(authorization: Optional[str] = None) -> Optional[dict]:
    if not authorization:
        return None
    parts = authorization.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        token = parts[1]
        return get_auth_service().verify_token(token)
    return None

def get_current_user_required(authorization: Optional[str] = None) -> dict:
    user = get_current_user_optional(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required. Please log in.")
    return user

# Endpoints
@app.get("/")
async def serve_home():
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))

@app.get("/recommender")
@app.get("/recommender.html")
async def serve_recommender():
    return FileResponse(os.path.join(STATIC_DIR, "recommender.html"))

@app.get("/calculator")
@app.get("/calculator.html")
async def serve_calculator():
    return FileResponse(os.path.join(STATIC_DIR, "calculator.html"))

@app.get("/locator")
@app.get("/locator.html")
async def serve_locator():
    return FileResponse(os.path.join(STATIC_DIR, "locator.html"))

@app.get("/login")
@app.get("/signup")
@app.get("/auth")
@app.get("/auth.html")
@app.get("/my-applications")
async def serve_auth_page():
    return FileResponse(os.path.join(STATIC_DIR, "auth.html"))

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Scheme Sathi AI Engine",
        "version": "1.0.0",
        "ml_model_status": "loaded",
        "mongodb": db_service.get_stats()
    }

@app.get("/api/schemes")
async def list_all_schemes():
    recommender = get_recommender()
    return {
        "status": "success",
        "count": len(recommender.schemes),
        "schemes": recommender.schemes
    }

@app.get("/api/schemes/{scheme_id}")
async def get_scheme_by_id(scheme_id: str):
    recommender = get_recommender()
    for s in recommender.schemes:
        if s["id"] == scheme_id:
            return {"status": "success", "scheme": s}
    raise HTTPException(status_code=404, detail="Scheme not found")

@app.post("/api/recommend")
async def recommend_schemes(profile: ApplicantProfile, authorization: Optional[str] = Header(None)):
    """
    Main AI Recommendation Endpoint.
    Evaluates applicant profile, applies deterministic filters, computes NLP semantic similarity,
    predicts ML loan approval odds, and attaches XAI plain-language justifications.
    """
    current_user = get_current_user_optional(authorization)
    recommender = get_recommender()
    applicant_dict = profile.model_dump()
    result = recommender.recommend(applicant_dict)
    if current_user:
        result["authenticated_beneficiary"] = {
            "user_id": current_user.get("user_id"),
            "full_name": current_user.get("full_name")
        }
    
    # Also attach nearest 3 active channel partners for the top recommended scheme
    if result["recommended_schemes"] and profile.user_latitude and profile.user_longitude:
        top_cat = result["recommended_schemes"][0]["category"]
        locator = get_locator()
        partners_result = locator.find_nearest_partners(
            user_lat=profile.user_latitude,
            user_lon=profile.user_longitude,
            scheme_category=top_cat,
            filter_high_npa=True,
            filter_exhausted_funds=True,
            max_results=3
        )
        result["nearest_channel_partners"] = partners_result["partners"]
    else:
        result["nearest_channel_partners"] = []
        
    return result

@app.post("/api/calculate-emi")
async def calculate_emi(calc: CalculatorRequest):
    """
    Calculates monthly/quarterly EMIs, moratorium interest, and comparison with commercial bank.
    """
    return FinancialCalculatorService.calculate_emi(
        loan_amount=calc.loan_amount,
        interest_rate_pct=calc.interest_rate_pct,
        tenure_years=calc.tenure_years,
        moratorium_months=calc.moratorium_months,
        commercial_rate_pct=calc.commercial_rate_pct,
        capitalize_moratorium_interest=calc.capitalize_moratorium_interest
    )

@app.get("/api/partners")
async def get_channel_partners(
    lat: float = Query(28.6139, description="Latitude"),
    lon: float = Query(77.2090, description="Longitude"),
    category: Optional[str] = Query(None, description="Scheme category filter"),
    state: Optional[str] = Query(None, description="State filter"),
    filter_npa: bool = Query(True, description="Filter high NPA partners"),
    filter_funds: bool = Query(True, description="Filter exhausted funds")
):
    locator = get_locator()
    return locator.find_nearest_partners(
        user_lat=lat,
        user_lon=lon,
        scheme_category=category,
        filter_high_npa=filter_npa,
        filter_exhausted_funds=filter_funds,
        max_results=15,
        state_filter=state
    )

@app.post("/api/generate-application")
async def generate_application_checklist(payload: ApplicationExportRequest):
    """
    Generates structured pre-filled Government Loan Application Summary
    and Document Checklist for offline or online submission.
    """
    recommender = get_recommender()
    scheme = next((s for s in recommender.schemes if s["id"] == payload.scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
        
    cost = payload.profile.project_cost
    fin_pct = scheme.get("financing_percentage", 90.0) / 100.0
    loan_amt = min(cost * fin_pct, scheme.get("max_loan_amount", cost))
    margin_amt = cost - loan_amt
    
    # Document checklist
    docs = scheme.get("required_documents", [])
    checklist = []
    for doc in docs:
        checklist.append({
            "document_name": doc,
            "status": "Required",
            "is_mandatory": True,
            "issuing_authority": "Revenue Dept / Tehsildar" if "Certificate" in doc else ("UIDAI / Bank" if "Aadhaar" in doc or "Passbook" in doc else "Self / CA")
        })
        
    application_data = {
        "reference_id": f"SCHEME-SATHI-{abs(hash(payload.applicant_name + payload.scheme_id)) % 1000000:06d}",
        "scheme_name": scheme["name"],
        "scheme_name_hi": scheme["name_hi"],
        "implementing_ministry": scheme["ministry"],
        "channelizing_agency": scheme["implementing_agency"],
        "applicant": {
            "name": payload.applicant_name,
            "phone": payload.phone_number,
            "gender": payload.profile.gender,
            "caste_category": payload.profile.caste_category,
            "annual_income": payload.profile.annual_income,
            "state": payload.state,
            "district": payload.district
        },
        "financial_summary": {
            "project_cost": cost,
            "concessional_loan_share": loan_amt,
            "promoter_margin_money": margin_amt,
            "interest_rate_pct": scheme["interest_rate_beneficiary_pct"],
            "tenure_years": scheme["max_tenure_years"],
            "moratorium_months": scheme["moratorium_months"],
            "repayment_frequency": scheme["repayment_frequency"]
        },
        "document_checklist": checklist,
        "submission_instructions_en": "Take this application summary and the listed documents to your nearest authorized State Channelizing Agency (SCA) or Partner Bank Branch.",
        "submission_instructions_hi": "इस आवेदन सारांश और संलग्न दस्तावेजों को लेकर अपने निकटतम अधिकृत राज्य चैनेलाइजिंग एजेंसी (SCA) या बैंक शाखा में संपर्क करें।"
    }
    
    return {"status": "success", "application": application_data}
        
@app.post("/api/chat")
async def chat_with_advisor(req: ChatMessageRequest):
    """
    AI Advisory Desk Chatbot for MoSJE/NSFDC Schemes.
    Answers natural language queries on eligibility, interest rates,
    document requirements, and channel partners in 6 languages.
    """
    service = get_chatbot_service()
    result = service.answer_query(user_query=req.message, preferred_lang=req.language)
    return {"status": "success", **result}

@app.get("/api/chat/suggestions")
async def get_chat_suggestions(lang: str = Query("en", description="Preferred language code")):
    """
    Returns quick inquiry starter prompts tailored to the active language.
    """
    service = get_chatbot_service()
    return {"status": "success", "suggestions": service.get_suggestions(lang=lang)}

@app.post("/api/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: str = Query("en")
):
    """
    Server-side Speech-to-Text processor.
    Transcribes audio recorded from client microphone using speech_recognition,
    bypassing browser-side cloud speech service blocks or Windows restrictions.
    """
    try:
        import speech_recognition as sr
        contents = await file.read()
        buf = io.BytesIO(contents)
        r = sr.Recognizer()
        with sr.AudioFile(buf) as source:
            audio = r.record(source)
            
        lang_map = {
            "en": "en-IN",
            "hi": "hi-IN",
            "mr": "mr-IN",
            "ta": "ta-IN",
            "te": "te-IN",
            "bn": "bn-IN"
        }
        target_lang = lang_map.get(language, "en-IN")
        text = r.recognize_google(audio, language=target_lang)
        return {"status": "success", "transcript": text}
    except sr.UnknownValueError:
        return {"status": "error", "message": "No audible speech recognized. Please speak into your microphone and try again."}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# --- Authentication Endpoints ---
@app.post("/api/auth/signup")
async def auth_signup(req: UserSignUpRequest):
    """
    Registers a new marginalized entrepreneur / student account.
    Persists credentials securely and returns JWT bearer session.
    """
    try:
        svc = get_auth_service()
        return svc.sign_up(req.model_dump())
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/login")
async def auth_login(req: UserLoginRequest):
    """
    Authenticates beneficiary using mobile number or email and password.
    """
    try:
        svc = get_auth_service()
        return svc.login(req.identifier, req.password)
    except ValueError as ve:
        raise HTTPException(status_code=401, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/aadhaar/send-otp")
async def auth_aadhaar_send_otp(req: AadhaarSendOtpRequest):
    """
    Validates 12-digit Aadhaar Card, looks up linked registered mobile from UIDAI mock registry,
    and dispatches a 6-digit OTP.
    """
    try:
        svc = get_auth_service()
        return svc.send_aadhaar_otp(req.aadhaar_number)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/aadhaar/verify-otp")
async def auth_aadhaar_verify_otp(req: AadhaarVerifyOtpRequest):
    """
    Verifies 6-digit OTP, persists full Aadhaar card demographic details into users.json database,
    and returns authenticated JWT bearer session.
    """
    try:
        svc = get_auth_service()
        return svc.verify_aadhaar_otp(req.aadhaar_number, req.otp)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/auth/aadhaar/linked-mobile")
async def auth_aadhaar_get_linked_mobile(aadhaar_number: str):
    """
    Retrieves the actual registered mobile number and identity linked to an Aadhaar card.
    """
    try:
        svc = get_auth_service()
        return svc.get_linked_mobile(aadhaar_number)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/aadhaar/lookup")
async def auth_aadhaar_lookup(req: AadhaarSendOtpRequest):
    """
    Lookup endpoint to fetch the actual registered mobile number linked to an Aadhaar card.
    """
    try:
        svc = get_auth_service()
        return svc.get_linked_mobile(req.aadhaar_number)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/auth/me")
async def auth_get_current_user(authorization: Optional[str] = Header(None)):
    """
    Returns current authenticated beneficiary profile.
    """
    user = get_current_user_required(authorization)
    return {"status": "success", "user": user}

@app.put("/api/auth/profile")
async def auth_update_profile(req: UserProfileUpdateRequest, authorization: Optional[str] = Header(None)):
    """
    Updates beneficiary demographic and financial profile information.
    """
    user = get_current_user_required(authorization)
    try:
        svc = get_auth_service()
        updated = svc.update_profile(user["user_id"], req.model_dump(exclude_unset=True))
        return {"status": "success", "user": updated}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/auth/my-applications")
async def auth_get_my_applications(authorization: Optional[str] = Header(None)):
    """
    Fetches all statutory applications filed by the authenticated user.
    """
    user = get_current_user_required(authorization)
    svc = get_auth_service()
    apps = svc.get_user_applications(user)
    return {"status": "success", "count": len(apps), "applications": apps}

@app.post("/api/register-scheme")
async def register_scheme_application(req: SchemeRegistrationRequest, authorization: Optional[str] = Header(None)):
    """
    Submits and registers an official statutory loan application.
    Enforces user pre-submission confirmation verification and allocates Channel Partner.
    Links application to authenticated beneficiary profile if logged in.
    """
    try:
        current_user = get_current_user_optional(authorization)
        data = req.model_dump()
        if current_user:
            data["applicant_user_id"] = current_user.get("user_id")

        service = get_registration_service()
        result = service.register_applicant(data)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal registration error: {str(e)}")

@app.get("/api/registrations/{ref_id}")
async def get_registration_details(ref_id: str):
    """
    Tracks application status and retrieves registration acknowledgement slip by reference ID.
    """
    service = get_registration_service()
    reg = service.get_registration_by_id(ref_id)
    if not reg:
        raise HTTPException(status_code=404, detail="Registration Reference ID not found.")
    return {"status": "success", "registration": reg}

@app.get("/api/registrations")
async def list_all_registrations():
    """
    Returns list of all submitted scheme registrations (Admin / Hackathon Evaluator view).
    """
    service = get_registration_service()
    registrations = service.list_all_registrations()
    return {"status": "success", "count": len(registrations), "registrations": registrations}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
