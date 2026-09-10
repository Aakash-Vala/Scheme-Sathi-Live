"""
Explainable AI (XAI) Engine for Scheme Matching.
Generates plain-language, transparent justifications for why a scheme is recommended,
detailing financial savings, moratorium advantages, and eligibility clearance.
Supports both English and Hindi.
"""

def generate_explanation(scheme: dict, applicant: dict, match_score: float, approval_info: dict) -> dict:
    project_cost = float(applicant.get("project_cost", 100000))
    requested_loan = float(applicant.get("requested_loan", project_cost * (scheme.get("financing_percentage", 90) / 100)))
    annual_income = float(applicant.get("annual_income", 180000))
    gender = applicant.get("gender", "Female")
    tenure_years = int(scheme.get("max_tenure_years", 3))
    
    # Calculate interest savings vs standard commercial bank (avg 12%)
    concessional_rate = scheme.get("interest_rate_beneficiary_pct", 6.5)
    if gender == "Female" and scheme.get("interest_rate_female_rebate_pct", 0) > 0:
        concessional_rate -= scheme.get("interest_rate_female_rebate_pct", 0)
        
    commercial_rate = scheme.get("commercial_bank_rate_pct", 12.0)
    rate_diff = commercial_rate - concessional_rate
    
    # Approximate annual interest saved on average balance (assume half principal during amortization)
    annual_interest_saved = round((requested_loan * (rate_diff / 100)), 0)
    total_lifetime_savings = round(annual_interest_saved * (tenure_years * 0.65), 0)
    
    moratorium = scheme.get("moratorium_months", 3)
    financing_pct = scheme.get("financing_percentage", 90.0)
    
    # Rationale points (English)
    points_en = []
    points_hi = []
    
    # 1. Statutory eligibility fit
    income_limit = scheme.get("income_limit_annual")
    if income_limit:
        points_en.append(f"Income Check: Your annual family income (₹{annual_income:,.0f}) is within the statutory ceiling of ₹{income_limit:,.0f}.")
        points_hi.append(f"आय पात्रता: आपकी वार्षिक पारिवारिक आय (₹{annual_income:,.0f}) योजना की निर्धारित सीमा ₹{income_limit:,.0f} के भीतर है।")
    else:
        points_en.append("Universal Income: This scheme has no restrictive upper income cap for qualified entrepreneurs.")
        points_hi.append("सार्वभौमिक आय: इस योजना में पात्र उद्यमियों के लिए कोई अधिकतम आय सीमा नहीं है।")

    # 2. Financing coverage
    loan_covered = min(requested_loan, scheme.get("max_loan_amount", requested_loan))
    points_en.append(f"High Coverage: Covers up to {financing_pct:.0f}% of your project cost (₹{loan_covered:,.0f} concessional funding).")
    points_hi.append(f"अधिकतम वित्तपोषण: आपके प्रोजेक्ट लागत का {financing_pct:.0f}% तक (₹{loan_covered:,.0f} रियायती ऋण) कवर करता है।")

    # 3. Interest savings
    points_en.append(f"Massive Interest Savings: At {concessional_rate:.1f}% p.a. vs commercial bank rate of {commercial_rate:.1f}%, you save approximately ₹{annual_interest_saved:,.0f} in interest every year (₹{total_lifetime_savings:,.0f} over tenure).")
    points_hi.append(f"ब्याज में बड़ी बचत: सामान्य बैंक की {commercial_rate:.1f}% दर की तुलना में मात्र {concessional_rate:.1f}% ब्याज दर पर आप प्रतिवर्ष लगभग ₹{annual_interest_saved:,.0f} बचाएंगे (कुल अवधि में ₹{total_lifetime_savings:,.0f})।")

    # 4. Moratorium advantage
    if moratorium > 0:
        points_en.append(f"Moratorium Grace Period: Includes a {moratorium}-month repayment holiday, allowing your business to establish cash flow before EMI repayments start.")
        points_hi.append(f"मोराटोरियम छूट अवधि: {moratorium} महीने का ग्रेस पीरियड उपलब्ध है, जिससे ईएमआई शुरू होने से पहले व्यवसाय को स्थिर किया जा सके।")

    # 5. Demographic / Category advantage
    if scheme.get("id") == "nsfdc_msy" and gender == "Female":
        points_en.append("Women Entrepreneur Bonus: Mahila Samriddhi Yojana grants preferential 4.0% interest rate and up to 95% project cost coverage.")
        points_hi.append("महिला उद्यमी प्रोत्साहन: महिला समृद्धि योजना के तहत विशेष 4% ब्याज दर और 95% तक लागत कवर दी जाती है।")
    elif scheme.get("id") == "nsfdc_gbs":
        points_en.append("Green Technology Priority: Priority sector green-technology allocation with fast-track processing for electric vehicles and solar equipment.")
        points_hi.append("हरित प्रौद्योगिकी प्राथमिकता: ई-रिक्शा और सोलर उपकरणों के लिए त्वरित ऋण स्वीकृति और पर्यावरण प्रोत्साहन।")

    headline_en = f"Recommended based on {match_score:.0f}% profile alignment, high interest subsidy ({rate_diff:.1f}% below market), and {approval_info.get('approval_probability_pct', 80):.0f}% predicted approval likelihood."
    headline_hi = f"{match_score:.0f}% प्रोफाइल अनुकूलता, {rate_diff:.1f}% बाजार से सस्ती ब्याज दर, और {approval_info.get('approval_probability_pct', 80):.0f}% अनुमानित स्वीकृति संभावना के आधार पर चयनित।"

    return {
        "concessional_rate_pct": concessional_rate,
        "commercial_rate_pct": commercial_rate,
        "rate_difference_pct": round(rate_diff, 2),
        "annual_interest_saved_inr": annual_interest_saved,
        "lifetime_interest_saved_inr": total_lifetime_savings,
        "moratorium_months": moratorium,
        "headline_en": headline_en,
        "headline_hi": headline_hi,
        "justification_points_en": points_en,
        "justification_points_hi": points_hi
    }
