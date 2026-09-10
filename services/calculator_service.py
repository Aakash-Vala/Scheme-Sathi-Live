"""
Financial Calculator Service.
Implements standard banking EMI calculation, moratorium grace period simulation,
detailed payment schedules, and concessional interest subsidy comparisons against commercial banks.
"""

from typing import Dict, Any, List

class FinancialCalculatorService:
    @staticmethod
    def calculate_emi(
        loan_amount: float,
        interest_rate_pct: float,
        tenure_years: float,
        moratorium_months: int = 0,
        commercial_rate_pct: float = 12.0,
        capitalize_moratorium_interest: bool = False
    ) -> Dict[str, Any]:
        """
        Calculates monthly and quarterly EMIs, total interest, moratorium interest,
        and net savings compared to a commercial bank loan.
        """
        loan_amount = float(max(1000.0, loan_amount))
        tenure_months = int(max(6, round(tenure_years * 12)))
        r_concessional = (interest_rate_pct / 100.0) / 12.0
        r_commercial = (commercial_rate_pct / 100.0) / 12.0
        
        # Moratorium interest calculation (Simple interest during grace period)
        moratorium_months = int(max(0, min(moratorium_months, tenure_months - 6)))
        effective_repayment_months = tenure_months - moratorium_months
        
        moratorium_interest = loan_amount * (interest_rate_pct / 100.0) * (moratorium_months / 12.0)
        
        effective_principal = loan_amount
        if capitalize_moratorium_interest:
            effective_principal += moratorium_interest
            
        # Concessional EMI
        if r_concessional > 0 and effective_repayment_months > 0:
            emi_concessional = (
                effective_principal * r_concessional * ((1 + r_concessional) ** effective_repayment_months)
            ) / (((1 + r_concessional) ** effective_repayment_months) - 1)
        else:
            emi_concessional = effective_principal / max(1, effective_repayment_months)
            
        total_repayment_concessional = emi_concessional * effective_repayment_months
        if not capitalize_moratorium_interest:
            total_repayment_concessional += moratorium_interest
            
        total_interest_concessional = total_repayment_concessional - loan_amount
        
        # Quarterly installment (standard for many NSFDC schemes)
        quarterly_emi = round(emi_concessional * 3, 2)
        
        # Commercial Bank comparison (Standard 12% without concessional moratorium benefits)
        if r_commercial > 0 and tenure_months > 0:
            emi_commercial = (
                loan_amount * r_commercial * ((1 + r_commercial) ** tenure_months)
            ) / (((1 + r_commercial) ** tenure_months) - 1)
        else:
            emi_commercial = loan_amount / tenure_months
            
        total_repayment_commercial = emi_commercial * tenure_months
        total_interest_commercial = total_repayment_commercial - loan_amount
        
        total_interest_saved = max(0.0, total_interest_commercial - total_interest_concessional)
        monthly_emi_saved = max(0.0, emi_commercial - emi_concessional)
        
        # Generate yearly amortization overview
        yearly_breakdown = FinancialCalculatorService._generate_yearly_schedule(
            effective_principal, interest_rate_pct, effective_repayment_months, emi_concessional
        )
        
        return {
            "loan_amount": round(loan_amount, 2),
            "interest_rate_pct": round(interest_rate_pct, 2),
            "commercial_rate_pct": round(commercial_rate_pct, 2),
            "total_tenure_months": tenure_months,
            "moratorium_months": moratorium_months,
            "effective_repayment_months": effective_repayment_months,
            "monthly_emi": round(emi_concessional, 2),
            "quarterly_emi": quarterly_emi,
            "moratorium_interest": round(moratorium_interest, 2),
            "total_interest_payable": round(total_interest_concessional, 2),
            "total_amount_payable": round(total_repayment_concessional, 2),
            "commercial_monthly_emi": round(emi_commercial, 2),
            "commercial_total_interest": round(total_interest_commercial, 2),
            "commercial_total_payable": round(total_repayment_commercial, 2),
            "total_interest_saved": round(total_interest_saved, 2),
            "monthly_emi_saved": round(monthly_emi_saved, 2),
            "interest_savings_percentage": round((total_interest_saved / max(1.0, total_interest_commercial)) * 100, 1),
            "yearly_schedule": yearly_breakdown
        }

    @staticmethod
    def _generate_yearly_schedule(principal: float, rate_pct: float, months: int, monthly_emi: float) -> List[Dict[str, Any]]:
        schedule = []
        balance = principal
        r_monthly = (rate_pct / 100.0) / 12.0
        
        current_year = 1
        year_principal = 0.0
        year_interest = 0.0
        
        for m in range(1, months + 1):
            interest_m = balance * r_monthly
            principal_m = min(balance, monthly_emi - interest_m)
            balance = max(0.0, balance - principal_m)
            
            year_principal += principal_m
            year_interest += interest_m
            
            if m % 12 == 0 or m == months:
                schedule.append({
                    "year": current_year,
                    "principal_paid": round(year_principal, 2),
                    "interest_paid": round(year_interest, 2),
                    "total_paid": round(year_principal + year_interest, 2),
                    "closing_balance": round(balance, 2)
                })
                current_year += 1
                year_principal = 0.0
                year_interest = 0.0
                
        return schedule
