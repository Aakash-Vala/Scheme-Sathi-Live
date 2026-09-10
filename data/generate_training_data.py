"""
Historical Government Loan Application Training Data Generator.
Simulates realistic historical application outcomes for NSFDC / MoSJE channel finance schemes
based on authentic lending guidelines, debt-to-income limits, and policy priorities.
"""

import os
import random
import numpy as np
import pandas as pd

def generate_historical_dataset(num_samples: int = 2500, output_path: str = "data/historical_applications.csv"):
    np.random.seed(42)
    random.seed(42)
    
    categories = ["micro_finance", "term_loan", "education", "green_energy", "sanitation"]
    education_levels = ["No Formal Education", "Primary (1-8)", "Secondary (10th)", "Higher Secondary (12th)", "Graduate", "Post Graduate / Professional"]
    
    records = []
    
    for i in range(num_samples):
        # Category assignment
        cat = random.choice(categories)
        
        # Gender
        gender = random.choices(["Female", "Male", "Other"], weights=[0.48, 0.50, 0.02])[0]
        
        # Age
        age = int(np.random.normal(34, 9))
        age = max(18, min(65, age))
        
        # Caste Category
        caste = random.choices(["SC", "Safai Karamchari / Dependent", "ST", "OBC", "General"], weights=[0.70, 0.15, 0.08, 0.05, 0.02])[0]
        
        # Annual family income (80% within NSFDC ₹3.00 Lakhs cap, some higher)
        if random.random() < 0.85:
            annual_income = round(random.uniform(60000, 300000), -2)
        else:
            annual_income = round(random.uniform(300001, 700000), -2)
            
        # Project Cost & Requested Loan based on category
        if cat == "micro_finance":
            project_cost = round(random.uniform(20000, 140000), -2)
            promoter_contrib_pct = random.choice([0.0, 2.0, 5.0, 10.0])
            max_loan = min(125000.0, project_cost * 0.95 if gender == "Female" else project_cost * 0.90)
            requested_loan = round(min(max_loan, project_cost * (1 - promoter_contrib_pct/100)), -2)
            tenure_months = 36
            moratorium_months = 3
        elif cat == "education":
            project_cost = round(random.uniform(80000, 2500000), -3)
            promoter_contrib_pct = random.choice([0.0, 5.0, 10.0])
            requested_loan = round(min(project_cost * 0.90, 2500000), -3)
            tenure_months = 84
            moratorium_months = 12
        elif cat == "green_energy":
            project_cost = round(random.uniform(150000, 1500000), -3)
            promoter_contrib_pct = random.choice([5.0, 10.0, 15.0])
            requested_loan = round(project_cost * (1 - promoter_contrib_pct/100), -3)
            tenure_months = 84
            moratorium_months = 6
        elif cat == "sanitation":
            project_cost = round(random.uniform(100000, 2000000), -3)
            promoter_contrib_pct = random.choice([2.0, 5.0, 10.0])
            requested_loan = round(project_cost * (1 - promoter_contrib_pct/100), -3)
            tenure_months = 84
            moratorium_months = 6
        else: # term_loan
            project_cost = round(random.uniform(150000, 4000000), -3)
            promoter_contrib_pct = random.choice([5.0, 10.0, 15.0, 20.0])
            requested_loan = round(min(project_cost * 0.90, 4000000), -3)
            tenure_months = 60
            moratorium_months = 6
            
        education = random.choices(education_levels, weights=[0.10, 0.20, 0.30, 0.20, 0.15, 0.05])[0]
        has_vocational_training = 1 if (random.random() < 0.40 or education in ["Graduate", "Post Graduate / Professional"]) else 0
        experience_years = max(0, min(20, int(np.random.exponential(3.5))))
        has_clean_credit = 1 if random.random() < 0.88 else 0
        has_valid_caste_cert = 1 if caste in ["SC", "Safai Karamchari / Dependent"] and random.random() < 0.96 else (1 if random.random() < 0.80 else 0)
        has_valid_income_cert = 1 if random.random() < 0.94 else 0
        
        # Calculate monthly debt service approximation
        # Concessional rate avg 6%
        r = 0.06 / 12
        emi = (requested_loan * r * (1 + r)**tenure_months) / ((1 + r)**tenure_months - 1)
        monthly_income = annual_income / 12
        dti_ratio = round(emi / monthly_income, 3)
        
        # Realistic Approval Logic (ground truth rules with realistic human assessor variance)
        approval_score = 0.0
        
        # 1. Statutory eligibility (Caste + Income)
        is_target_caste = caste in ["SC", "Safai Karamchari / Dependent"]
        income_eligible = (annual_income <= 300000) or (cat in ["term_loan", "green_energy"] and annual_income <= 500000)
        
        if is_target_caste and has_valid_caste_cert:
            approval_score += 35
        else:
            approval_score -= 25
            
        if income_eligible and has_valid_income_cert:
            approval_score += 25
        else:
            approval_score -= 30
            
        # 2. Debt to Income Ratio
        if dti_ratio <= 0.40:
            approval_score += 20
        elif dti_ratio <= 0.60:
            approval_score += 10
        else:
            approval_score -= 20
            
        # 3. Credit history
        if has_clean_credit:
            approval_score += 10
        else:
            approval_score -= 25
            
        # 4. Vocational training & experience
        if has_vocational_training:
            approval_score += 7
        if experience_years >= 2:
            approval_score += 5
            
        # 5. Margin contribution stake
        if promoter_contrib_pct >= 5.0:
            approval_score += 5
            
        # 6. Policy priority (Women & Sanitation workers get priority under MoSJE)
        if gender == "Female":
            approval_score += 8
        if caste == "Safai Karamchari / Dependent":
            approval_score += 8
            
        # Add slight natural randomness (e.g. documentation neatness, local interview)
        approval_score += np.random.normal(0, 5)
        
        # Probability of approval sigmoid-like
        approval_prob = 1 / (1 + np.exp(-(approval_score - 45) / 12))
        approved = 1 if approval_prob >= 0.50 and is_target_caste and income_eligible else 0
        
        records.append({
            "applicant_id": f"APP_{1000 + i}",
            "gender": gender,
            "applicant_age": age,
            "caste_category": caste,
            "annual_income": annual_income,
            "scheme_category": cat,
            "project_cost": project_cost,
            "requested_loan": requested_loan,
            "promoter_contrib_pct": promoter_contrib_pct,
            "education_level": education,
            "has_vocational_training": has_vocational_training,
            "experience_years": experience_years,
            "has_clean_credit": has_clean_credit,
            "has_valid_caste_cert": has_valid_caste_cert,
            "has_valid_income_cert": has_valid_income_cert,
            "debt_to_income_ratio": dti_ratio,
            "approval_score": round(max(5.0, min(99.0, approval_score)), 1),
            "approved": approved
        })
        
    df = pd.DataFrame(records)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} historical application records saved to {output_path}")
    print(f"Approval rate: {df['approved'].mean()*100:.1f}%")
    return df

if __name__ == "__main__":
    generate_historical_dataset()
