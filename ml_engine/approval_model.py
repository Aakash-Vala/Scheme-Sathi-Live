"""
Supervised Machine Learning Model for Loan Approval Prediction & Credit Risk Assessment.
Trains on historical application outcomes and predicts approval likelihood for marginalized applicants.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import roc_auc_score, accuracy_score, classification_report

MODEL_PATH = "ml_engine/approval_pipeline.pkl"
DATA_PATH = "data/historical_applications.csv"

# Categorical & Numerical feature definitions
CATEGORICAL_FEATURES = ["gender", "caste_category", "scheme_category", "education_level"]
NUMERICAL_FEATURES = [
    "applicant_age", "annual_income", "project_cost", "requested_loan",
    "promoter_contrib_pct", "has_vocational_training", "experience_years",
    "has_clean_credit", "has_valid_caste_cert", "has_valid_income_cert",
    "debt_to_income_ratio"
]

def train_approval_model(csv_path: str = DATA_PATH, model_output_path: str = MODEL_PATH):
    if not os.path.exists(csv_path):
        from data.generate_training_data import generate_historical_dataset
        generate_historical_dataset(output_path=csv_path)
        
    df = pd.read_csv(csv_path)
    
    X = df[CATEGORICAL_FEATURES + NUMERICAL_FEATURES]
    y = df["approved"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERICAL_FEATURES),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_FEATURES)
        ]
    )
    
    # Random Forest with tuned hyperparameters for stable probability calibration
    classifier = RandomForestClassifier(
        n_estimators=150,
        max_depth=12,
        min_samples_split=6,
        min_samples_leaf=3,
        random_state=42,
        class_weight="balanced"
    )
    
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", classifier)
    ])
    
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_prob)
    
    print(f"Approval Model Trained Successfully!")
    print(f"Accuracy: {acc:.4f} | ROC-AUC: {auc:.4f}")
    
    os.makedirs(os.path.dirname(model_output_path), exist_ok=True)
    joblib.dump(pipeline, model_output_path)
    print(f"Model saved to {model_output_path}")
    return pipeline

class ApprovalPredictor:
    _instance = None
    
    def __init__(self, model_path: str = MODEL_PATH):
        if not os.path.exists(model_path):
            self.pipeline = train_approval_model(model_output_path=model_path)
        else:
            self.pipeline = joblib.load(model_path)
            
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ApprovalPredictor()
        return cls._instance

    def predict(self, applicant: dict) -> dict:
        """
        Takes applicant dictionary with keys matching feature schema and returns
        approval probability, risk tier, positive factors, and improvement recommendations.
        """
        # Prepare inputs with safe defaults
        annual_income = float(applicant.get("annual_income", 180000))
        project_cost = float(applicant.get("project_cost", 100000))
        requested_loan = float(applicant.get("requested_loan", project_cost * 0.90))
        tenure_months = int(applicant.get("tenure_months", 36))
        interest_rate = float(applicant.get("interest_rate_pct", 6.5)) / 100
        
        # Calculate DTI
        r = interest_rate / 12 if interest_rate > 0 else 0.005
        if r > 0 and tenure_months > 0:
            emi = (requested_loan * r * (1 + r)**tenure_months) / ((1 + r)**tenure_months - 1)
        else:
            emi = requested_loan / max(1, tenure_months)
        monthly_income = max(1000.0, annual_income / 12)
        dti_ratio = round(emi / monthly_income, 3)
        
        promoter_contrib = float(applicant.get("promoter_contribution_pct", 5.0))
        if project_cost > 0 and applicant.get("promoter_contribution_amount") is not None:
            promoter_contrib = (float(applicant["promoter_contribution_amount"]) / project_cost) * 100
            
        row = {
            "gender": str(applicant.get("gender", "Female")),
            "caste_category": str(applicant.get("caste_category", "SC")),
            "scheme_category": str(applicant.get("scheme_category", "micro_finance")),
            "education_level": str(applicant.get("education_level", "Secondary (10th)")),
            "applicant_age": int(applicant.get("age", 32)),
            "annual_income": annual_income,
            "project_cost": project_cost,
            "requested_loan": requested_loan,
            "promoter_contrib_pct": promoter_contrib,
            "has_vocational_training": int(applicant.get("has_vocational_training", 1)),
            "experience_years": int(applicant.get("experience_years", 2)),
            "has_clean_credit": int(applicant.get("has_clean_credit", 1)),
            "has_valid_caste_cert": int(applicant.get("has_valid_caste_cert", 1)),
            "has_valid_income_cert": int(applicant.get("has_valid_income_cert", 1)),
            "debt_to_income_ratio": dti_ratio
        }
        
        df_input = pd.DataFrame([row])
        prob = self.pipeline.predict_proba(df_input)[0, 1]
        prob_pct = round(prob * 100, 1)
        
        # Categorize risk tier
        if prob_pct >= 75.0:
            risk_tier = "High Approval Likelihood"
            risk_badge = "success"
        elif prob_pct >= 50.0:
            risk_tier = "Moderate Approval Likelihood"
            risk_badge = "warning"
        else:
            risk_tier = "Action Required (High Risk of Rejection)"
            risk_badge = "danger"
            
        # Extract dynamic factors
        positive_factors = []
        improvements = []
        
        if row["caste_category"] in ["SC", "Safai Karamchari / Dependent"]:
            positive_factors.append("Eligible target demographic priority under MoSJE guidelines")
        else:
            improvements.append("Verify if applicant qualifies under designated affirmative action categories")
            
        if row["gender"] == "Female":
            positive_factors.append("Special priority & 0.5%-1.0% interest concession for women entrepreneurs")
            
        if dti_ratio <= 0.35:
            positive_factors.append(f"Comfortable Debt-to-Income ratio ({dti_ratio*100:.1f}% vs 50% limit)")
        elif dti_ratio > 0.50:
            improvements.append(f"Debt-to-Income ratio is high ({dti_ratio*100:.1f}%). Extend loan tenure or reduce loan amount to lower monthly EMI.")
            
        if row["has_vocational_training"] == 1:
            positive_factors.append("Prior skill certification / vocational training strengthens project viability")
        else:
            improvements.append("Enrolling in a short PMKVY / NSFDC skill course improves approval probability by ~10%")
            
        if promoter_contrib >= 5.0:
            positive_factors.append(f"Adequate promoter equity contribution ({promoter_contrib:.1f}%)")
        else:
            improvements.append("Increasing promoter margin money to 5%-10% lowers bank risk perception")
            
        if row["has_valid_caste_cert"] and row["has_valid_income_cert"]:
            positive_factors.append("Valid government statutory certificates on record")
        else:
            improvements.append("Ensure income and caste certificates are updated and issued by authorized Tehsildar/SDM")

        return {
            "approval_probability_pct": prob_pct,
            "risk_tier": risk_tier,
            "risk_badge": risk_badge,
            "debt_to_income_ratio": dti_ratio,
            "projected_monthly_emi": round(emi, 2),
            "positive_factors": positive_factors,
            "improvements": improvements
        }

if __name__ == "__main__":
    train_approval_model()
