// Scheme Sathi - Professional Institutional Client Logic
// Multi-page navigation, Progressive Disclosure, AI Matching, XAI Modal, Theme & 6-Language i18n

let currentLang = 'en';
let allSchemesCache = [];
let cachedRecommendations = null;

const i18n = {
  "en": {
    "nav_overview": "Overview",
    "nav_recommender": "AI Recommender",
    "nav_calculator": "EMI Calculator",
    "nav_locator": "Channel Partners",
    "nav_login": "Login",
    "nav_signup": "Sign Up",
    "nav_auth": "Login / Sign Up",
    "nav_my_apps": "My Applications",
    "nav_logout": "Sign Out",
    "gov_ribbon_text": "Ministry of Social Justice and Empowerment (MoSJE) • National Scheduled Castes Finance & Development Corp",
    "sih_tag": "Smart India Hackathon • Problem Statement: ",
    "portal_subtitle": "AI Channel Finance Recommender & Concessional Lending Portal",
    "theme_dark": "🌙 Dark",
    "theme_light": "☀️ Light",
    "hero_badge": "Smart Automation Platform • Department of Social Justice",
    "hero_h2_1": "AI-Driven Concessional Scheme Matching for ",
    "hero_h2_highlight": "Marginalized Entrepreneurs",
    "hero_desc": "Empowering Scheduled Caste (SC) entrepreneurs and students with AI-matched concessional lending schemes (up to ₹50 Lakhs at 4.0% - 8.0% p.a.), reducing-balance EMI calculations with grace periods, and verified Channel Partner routing.",
    "btn_launch_ai": "Launch AI Recommender →",
    "btn_open_calc": "Open Financial Calculator",
    "btn_locate_partners": "Locate Channel Partners",
    "stat_rates_lbl": "Concessional Interest Rates",
    "stat_funding_lbl": "Project Cost Financing",
    "stat_accuracy_lbl": "ML Predictor Accuracy",
    "stat_partners_lbl": "SCAs, PSBs & RRB Partners",
    "how_title": "How It Works",
    "how_desc": "A 3-step structured pathway from business idea to loan disbursement.",
    "step1_num": "Step 01",
    "step1_title": "Enter Profile & Project Idea",
    "step1_desc": "Provide family income, caste status, and your business concept in simple plain language.",
    "step2_num": "Step 02",
    "step2_title": "AI Matches & Scores Schemes",
    "step2_desc": "Our hybrid engine checks statutory guidelines, NLP semantic fit, and predicts loan approval likelihood.",
    "step3_num": "Step 03",
    "step3_title": "Route to Eligible Channel Partner",
    "step3_desc": "Identify the nearest verified Bank or SCA branch with healthy NPAs (<5%) and available fund quotas.",
    "modules_title": "Platform Modules",
    "modules_desc": "Access each specialized tool on its dedicated interface:",
    "m1_tag": "Core Engine",
    "m1_title": "Smart Scheme Recommender",
    "m1_desc": "Rule filter + NLP semantic intent matching + Random Forest ML classifier for approval probability and Explainable AI (XAI) rationale.",
    "m1_btn": "Open AI Recommender →",
    "m2_tag": "Financial Tool",
    "m2_title": "Financial & Moratorium Calculator",
    "m2_desc": "Dynamic loan simulation accounting for official NSFDC concessional rates (4.0%-8.0%), 3-18 months grace periods, and interest savings vs 12% commercial rates.",
    "m2_btn": "Open EMI Calculator →",
    "m3_tag": "Geo-Spatial",
    "m3_title": "Geo-Spatial Partner Router",
    "m3_desc": "Interactive mapping service routing applications to nearest authorized SCAs, PSBs, and RRBs with NPA < 5% and active fund quotas.",
    "m3_btn": "Explore Partner Map →",
    "schemes_dir_title": "Official MoSJE & NSFDC Concessional Credit Schemes",
    "schemes_dir_desc": "Filter by sector to view statutory limits and concessional interest rates",
    "btn_match_profile": "Match My Profile →",
    "tab_all": "All Categories",
    "tab_micro": "Micro Finance (≤ ₹1.4L)",
    "tab_term": "Term Loans & Small Business",
    "tab_green": "Green EV & Clean Energy",
    "tab_edu": "Higher Education",
    "tab_sanitation": "Sanitation Equipment",
    "rec_badge": "Hybrid AI Engine • Deterministic Rules + NLP Semantics + Supervised ML",
    "rec_title": "Smart Scheme Recommender & Loan Evaluator",
    "rec_desc": "Evaluates statutory MoSJE/NSFDC income and category eligibility, extracts project intent from natural language descriptions via TF-IDF vectorization, and predicts loan approval odds using a trained Random Forest model.",
    "presets_label": "Pre-Configured Evaluation Profiles:",
    "preset_women": "SC Woman Boutique (₹1.2L • MSY)",
    "preset_erickshaw": "Electric E-Rickshaw (₹2.8L • GBS)",
    "preset_btech": "B.Tech Engineering (₹14L • ELS)",
    "preset_sanitation": "Sanitation Mechanized Unit (₹16L • SUY)",
    "sec1_heading": "1. Beneficiary Demographics",
    "lbl_caste": "Target Community Category",
    "opt_sc": "Scheduled Caste (SC)",
    "opt_safai": "Safai Karamchari / Manual Scavenger Dependent",
    "opt_st": "Scheduled Tribe (ST)",
    "opt_obc": "Other Backward Classes (OBC)",
    "opt_gen": "General Category",
    "caste_help": "NSFDC concessional lending prioritizes SC & sanitation worker families.",
    "lbl_income": "Annual Family Income (₹)",
    "income_help": "Statutory ceiling: ₹3,00,000/yr (up to ₹5,00,000 for select term loans).",
    "lbl_gender": "Gender",
    "opt_female": "Female (Concession Priority)",
    "opt_male": "Male",
    "opt_other": "Other",
    "lbl_age": "Applicant Age",
    "lbl_edu": "Education Qualification",
    "opt_no_edu": "No Formal Education",
    "opt_primary": "Primary School",
    "opt_secondary": "Secondary (10th Pass)",
    "opt_higher_sec": "Higher Secondary (12th Pass)",
    "opt_graduate": "Graduate / Diploma",
    "opt_post_graduate": "Post Graduate / Professional",
    "sec2_heading": "2. Project & Financial Scope",
    "lbl_sector": "Primary Sector Category",
    "opt_sector_micro": "Micro Finance / Petty Trade (Up to ₹1.40 Lakh)",
    "opt_sector_term": "Small Enterprise / Term Loan (Up to ₹50 Lakh)",
    "opt_sector_edu": "Higher Technical / Professional Education",
    "opt_sector_green": "Green Energy & EV Mobility (E-Rickshaw / Solar)",
    "opt_sector_sanitation": "Mechanized Sanitation & Cleaning Equipment",
    "lbl_cost": "Estimated Project / Course Cost (₹)",
    "cost_help": "NSFDC covers up to 90% - 95% of unit cost at concessional interest.",
    "lbl_margin": "Promoter Margin Money Available (₹)",
    "margin_help": "Self-contribution (typically 0% to 10% based on project size).",
    "chk_training": "Holds Skill / Vocational Certificate (PMKVY / ITI)",
    "chk_credit": "Clean Credit History / No Prior Loan Defaults",
    "sec3_heading": "3. Project Intent (NLP Vector Matching)",
    "lbl_desc": "Describe Your Venture In Natural Language",
    "ph_desc": "Describe in English, Hindi, or regional languages...",
    "desc_help": "Our NLP vectorizer matches semantic intent with official scheme activity mandates.",
    "quick_kw_label": "Quick Keyword Injection:",
    "btn_run_ai": "Run AI Scheme Matching Engine",
    "btn_running_ai": "Evaluating Statutory Rules & NLP Semantics...",
    "rec_results_title": "Recommended Schemes & Loan Options",
    "rec_results_desc": "Ranked by statutory eligibility, NLP semantic intent fit, and trained ML approval probability.",
    "badge_awaiting": "Awaiting Evaluation",
    "rec_empty_prompt": "Fill the questionnaire above or select a preset profile, then click \"Run AI Scheme Matching Engine\".",
    "card_match": "Match:",
    "card_approval": "Approval Odds:",
    "card_rate": "Concessional Rate",
    "card_funding": "Eligible Funding",
    "card_moratorium": "Moratorium",
    "card_tenure": "Tenure",
    "card_max_loan": "Max Loan Ceiling",
    "card_view_checklist": "View Checklist & Criteria",
    "card_req_docs": "Required Documents:",
    "card_impl_agency": "Implementing Body:",
    "btn_why_this": "Why This Scheme?",
    "btn_calc_emi": "Calculate EMI →",
    "btn_partner_map": "Partner Map →",
    "btn_apply_checklist": "Apply Checklist",
    "btn_register_online": "Register for Scheme Online →",
    "top_match_tag": "Top Match",
    "calc_badge": "Loan Amortization & Subsidy Analysis",
    "calc_title": "Concessional Financial & Moratorium Calculator",
    "calc_desc": "Simulate reducing-balance monthly and quarterly EMIs according to official NSFDC lending guidelines. Accounts for 3 to 18 months repayment holidays and models exact interest savings against commercial bank benchmarks (12% p.a.).",
    "benchmarks_label": "Scheme Benchmarks:",
    "calc_params_heading": "Loan & Moratorium Parameters",
    "lbl_calc_loan": "Loan Amount Required",
    "lbl_calc_rate": "Concessional Interest Rate (% p.a.)",
    "lbl_calc_tenure": "Total Repayment Tenure",
    "lbl_calc_moratorium": "Moratorium Grace Period",
    "moratorium_note": "Moratorium Mechanism: No principal repayment is collected during the grace window. Installments begin only after business setup is completed.",
    "proj_monthly_emi": "Projected Monthly EMI",
    "quarterly_eq": "Quarterly Equivalent:",
    "concessional_saved": "Concessional Interest Saved",
    "vs_bank_rate": "vs Standard Commercial Bank Rate (12.0% p.a.)",
    "stat_lbl_principal": "Principal Amount:",
    "stat_lbl_interest": "Total Concessional Interest:",
    "stat_lbl_payable": "Total Amount Repayable:",
    "stat_lbl_moratorium": "Moratorium Window:",
    "stat_lbl_comm_emi": "Commercial Bank Equivalent EMI:",
    "btn_match_loan": "Match Scheme for This Loan →",
    "btn_find_branch": "Find Bank Branch",
    "amort_title": "Annual Amortization & Repayment Schedule",
    "th_year": "Year",
    "th_principal": "Principal Repaid (₹)",
    "th_interest": "Interest Paid (₹)",
    "th_total": "Total Annual Installment (₹)",
    "th_closing": "Closing Balance (₹)",
    "settled_label": "Settled",
    "loc_badge": "Geo-Spatial Partner Router • Smart NPA & Quota Verification",
    "loc_title": "Channel Partner Locator & Direct Router",
    "loc_desc": "Concessional loans are routed through over 100 Channel Partners. This service identifies authorized State Channelizing Agencies (SCAs), Public Sector Banks (PSBs), and RRBs while automatically excluding branches with high NPAs (>5.0%) or exhausted fund quotas.",
    "lbl_filter_category": "Scheme Category",
    "lbl_filter_state": "State Filter",
    "chk_filter_npa": "Filter Out High NPA Partners (> 5.0%)",
    "chk_filter_funds": "Filter Out Exhausted Fund Quotas",
    "btn_use_gps": "Use Current GPS Coordinates",
    "loc_auth_partners": "Authorized Partners",
    "loc_verified_tag": "Low NPA Verified",
    "loc_loading": "Loading channel partners...",
    "loc_no_partners": "No active partners found for the selected filter criteria.",
    "loc_km_away": "km away",
    "btn_nav_gmaps": "Navigate via Google Maps →",
    "loc_npa_ratio": "NPA Ratio:",
    "loc_fund_util": "Fund Utilization:",
    "xai_modal_title": "Scheme Explainable AI Assessment",
    "xai_annual_saved": "Annual Interest Saved",
    "xai_lifetime_saved": "Lifetime Tenure Savings",
    "xai_vs_bank": "vs 12.0% Commercial Bank Rate",
    "xai_tenure_over": "Over Tenure Window",
    "xai_rationale_heading": "Qualification Rationale:",
    "xai_drivers_heading": "ML Approval Score Drivers:",
    "xai_positive_factors": "Positive Factors:",
    "xai_recommendations": "Recommended Enhancements:",
    "app_gov_title": "GOVERNMENT OF INDIA • MoSJE & NSFDC",
    "app_doc_summary": "Concessional Channel Finance Application Summary",
    "app_th_doc": "Required Document",
    "app_th_authority": "Issuing Authority",
    "app_th_status": "Status",
    "app_status_required": "Required",
    "app_submission_lbl": "Submission Instructions:",
    "btn_print_checklist": "Print / Save PDF Checklist",
    "footer_title": "Scheme Sathi • SIH 26092",
    "footer_desc": "AI-Driven Concessional Scheme Matching Platform for Marginalized Entrepreneurs",
    "footer_guidelines": "Statutory guidelines under NSFDC, NSKFDC, and Ministry of Social Justice & Empowerment (MoSJE).",
    "chat_launcher_label": "Scheme Advisory Desk",
    "chat_title": "Scheme Advisory Desk",
    "chat_subtitle": "Official MoSJE & NSFDC Advisory",
    "chat_placeholder": "Ask about schemes, eligibility, documents...",
    "chat_welcome": "Welcome to the official Scheme Advisory Desk. Ask any questions about MoSJE & NSFDC concessional loans, income criteria, required documents, or authorized channel partners.",
    "auth_btn_login_signup": "Sign In / Register",
    "auth_modal_title": "Beneficiary Portal Authentication",
    "auth_tab_login": "Beneficiary Login",
    "auth_tab_signup": "New Registration (Sign Up)",
    "auth_lbl_mobile": "10-Digit Mobile Number",
    "auth_lbl_password": "Password (Min 6 Characters)",
    "auth_lbl_fullname": "Full Legal Name",
    "auth_lbl_caste": "Target Community Category",
    "auth_lbl_income": "Annual Family Income (₹)",
    "auth_lbl_state": "State & District",
    "auth_lbl_aadhaar": "Aadhaar (Last 4 Digits)",
    "auth_lbl_gender": "Gender",
    "auth_btn_login": "Sign In to Account →",
    "auth_btn_signup": "Create Beneficiary Account & Sign In →",
    "auth_btn_logout": "Sign Out",
    "auth_btn_my_apps": "My Applications",
    "auth_prompt_to_register": "Please sign in or create an account to proceed with statutory scheme registration.",
    "auth_prompt_to_recommend": "Please sign in or create an account to run the AI Scheme Matching Engine.",
    "auth_tab_aadhaar": "Login via Aadhaar (OTP)",
    "auth_tab_password": "Password Login",
    "auth_lbl_aadhaar_12": "12-Digit Aadhaar Card Number",
    "auth_btn_send_otp": "Get OTP on Registered Mobile →",
    "auth_btn_verify_otp": "Verify OTP & Sign In →",
    "auth_lbl_enter_otp": "Enter 6-Digit SMS OTP",
    "auth_aadhaar_help": "Enter full 12-digit Aadhaar to receive OTP on the linked mobile number.",
    "auth_demo_otp_note": "UIDAI Simulation: Demo OTP is",
    "auth_resend_otp": "Resend OTP",
    "auth_change_aadhaar": "Change Aadhaar Number"
  },
  "hi": {
    "nav_overview": "अवलोकन",
    "nav_recommender": "एआई योजना अनुशंसा",
    "nav_calculator": "ईएमआई कैलकुलेटर",
    "nav_locator": "चैनल पार्टनर",
    "nav_login": "लॉगिन",
    "nav_signup": "साइन अप",
    "nav_auth": "लॉगिन / साइन अप",
    "nav_my_apps": "मेरे आवेदन",
    "nav_logout": "लॉग आउट",
    "gov_ribbon_text": "सामाजिक न्याय एवं अधिकारिता मंत्रालय (MoSJE) • राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम",
    "sih_tag": "स्मार्ट इंडिया हैकाथॉन • समस्या विवरण: ",
    "portal_subtitle": "एआई चैनल फाइनेंस अनुशंसा एवं रियायती ऋण सहायता पोर्टल",
    "theme_dark": "🌙 डार्क",
    "theme_light": "☀️ लाइट",
    "hero_badge": "स्मार्ट ऑटोमेशन प्लेटफॉर्म • सामाजिक न्याय विभाग",
    "hero_h2_1": "वंचित एवं अनुसूचित जाति उद्यमियों हेतु ",
    "hero_h2_highlight": "एआई-संचालित रियायती योजना मिलान",
    "hero_desc": "अनुसूचित जाति (SC) उद्यमियों और छात्रों को 4.0% से 8.0% वार्षिक रियायती ब्याज दर पर ₹50 लाख तक के ऋण, वित्तीय कैलकुलेटर, मोराटोरियम छूट व निकटतम बैंक शाखा खोजने की डिजिटल सुविधा।",
    "btn_launch_ai": "एआई योजना विज़ार्ड खोलें →",
    "btn_open_calc": "वित्तीय कैलकुलेटर खोलें",
    "btn_locate_partners": "चैनल पार्टनर बैंक खोजें",
    "stat_rates_lbl": "रियायती ब्याज दरें",
    "stat_funding_lbl": "परियोजना लागत वित्तपोषण",
    "stat_accuracy_lbl": "एमएल मॉडल सटीकता",
    "stat_partners_lbl": "सत्यापित बैंक व एससीएस शाखाएं",
    "how_title": "यह कैसे कार्य करता है",
    "how_desc": "व्यावसायिक विचार से लेकर ऋण वितरण तक 3-चरणीय सरल प्रक्रिया।",
    "step1_num": "चरण 01",
    "step1_title": "प्रोफ़ाइल व प्रोजेक्ट विवरण दर्ज करें",
    "step1_desc": "अपनी पारिवारिक आय, जाति वर्ग और व्यावसायिक विचार को अपनी भाषा में लिखें।",
    "step2_num": "चरण 02",
    "step2_title": "एआई योजना मिलान व स्कोरिंग",
    "step2_desc": "हमारा हाइब्रिड इंजन सरकारी नियमों, एनएलपी सिमेंटिक्स और ऋण स्वीकृति संभावना का विश्लेषण करता है।",
    "step3_num": "चरण 03",
    "step3_title": "निकटतम अधिकृत चैनल पार्टनर से जुड़ें",
    "step3_desc": "कम एनपीए (<5%) और उपलब्ध फंड कोटे वाली निकटतम बैंक या निगम शाखा का चयन करें।",
    "modules_title": "प्लेटफ़ॉर्म मॉड्यूल",
    "modules_desc": "प्रत्येक विशेष सुविधा का लाभ उसके समर्पित पृष्ठ पर उठाएं:",
    "m1_tag": "मुख्य इंजन",
    "m1_title": "स्मार्ट योजना अनुशंसा विज़ार्ड",
    "m1_desc": "नियम फिल्टर + एनएलपी सिमेंटिक मिलान + रैंडम फॉरेस्ट एमएल क्लासिफायर ऋण स्वीकृति संभावना व स्पष्टीकरण के साथ।",
    "m1_btn": "एआई अनुशंसा विज़ार्ड खोलें →",
    "m2_tag": "वित्तीय उपकरण",
    "m2_title": "वित्तीय एवं मोराटोरियम कैलकुलेटर",
    "m2_desc": "NSFDC की रियायती दरों (4%-8%), 3-18 माह मोराटोरियम छूट और 12% वाणिज्यिक ब्याज की तुलना में होने वाली बचत देखें।",
    "m2_btn": "ईएमआई कैलकुलेटर खोलें →",
    "m3_tag": "भू-स्थानिक सेवा",
    "m3_title": "जियो-स्पेशियल पार्टनर राउटर",
    "m3_desc": "कम एनपीए (<5%) और सक्रिय फंड कोटे वाली निकटतम एससीए, सार्वजनिक बैंकों व ग्रामीण बैंकों का इंटरेक्टिव मानचित्र।",
    "m3_btn": "पार्टनर मानचित्र देखें →",
    "schemes_dir_title": "आधिकारिक MoSJE एवं NSFDC रियायती ऋण योजनाएं",
    "schemes_dir_desc": "विभिन्न क्षेत्रों के अनुसार रियायती ब्याज दरें और अधिकतम ऋण सीमा देखें",
    "btn_match_profile": "मेरी प्रोफ़ाइल मिलाएं →",
    "tab_all": "सभी श्रेणियां",
    "tab_micro": "सूक्ष्म वित्त (≤ ₹1.4 लाख)",
    "tab_term": "सावधि ऋण व लघु व्यवसाय",
    "tab_green": "हरित ऊर्जा व ई-वाहन",
    "tab_edu": "उच्च शिक्षा ऋण",
    "tab_sanitation": "स्वच्छता उपकरण",
    "rec_badge": "हाइब्रिड एआई इंजन • वैधानिक नियम + एनएलपी शब्दार्थ + पर्यवेक्षित एमएल",
    "rec_title": "स्मार्ट योजना अनुशंसा एवं ऋण मूल्यांकनकर्ता",
    "rec_desc": "MoSJE/NSFDC की वैधानिक आय व पात्रता की जांच, एनएलपी द्वारा परियोजना आवश्यकता का मिलान और रैंडम फॉरेस्ट मॉडल द्वारा ऋण स्वीकृति की भविष्यवाणी।",
    "presets_label": "पूर्व-कॉन्फ़िगर मूल्यांकन प्रोफ़ाइल:",
    "preset_women": "महिला बुटीक (₹1.2 लाख • MSY)",
    "preset_erickshaw": "इलेक्ट्रिक ई-रिक्शा (₹2.8 लाख • GBS)",
    "preset_btech": "बी.टेक इंजीनियरिंग (₹14 लाख • ELS)",
    "preset_sanitation": "मैकेनाइज्ड स्वच्छता इकाई (₹16 लाख • SUY)",
    "sec1_heading": "1. लाभार्थी जनसांख्यिकी",
    "lbl_caste": "लक्षित समुदाय श्रेणी",
    "opt_sc": "अनुसूचित जाति (SC)",
    "opt_safai": "सफाई कर्मचारी / स्वच्छकार आश्रित",
    "opt_st": "अनुसूचित जनजाति (ST)",
    "opt_obc": "अन्य पिछड़ा वर्ग (OBC)",
    "opt_gen": "सामान्य वर्ग",
    "caste_help": "NSFDC रियायती ऋण में अनुसूचित जाति व स्वच्छता कर्मियों को प्राथमिकता दी जाती है।",
    "lbl_income": "वार्षिक पारिवारिक आय (₹)",
    "income_help": "वैधानिक सीमा: ₹3,00,000/वर्ष (विशेष सावधि ऋणों हेतु ₹5,00,000 तक)।",
    "lbl_gender": "लिंग",
    "opt_female": "महिला (अतिरिक्त ब्याज छूट)",
    "opt_male": "पुरुष",
    "opt_other": "अन्य",
    "lbl_age": "आवेदक की आयु",
    "lbl_edu": "शैक्षणिक योग्यता",
    "opt_no_edu": "कोई औपचारिक शिक्षा नहीं",
    "opt_primary": "प्राथमिक विद्यालय (1-8वीं)",
    "opt_secondary": "माध्यमिक (10वीं उत्तीर्ण)",
    "opt_higher_sec": "उच्चतर माध्यमिक (12वीं उत्तीर्ण)",
    "opt_graduate": "स्नातक / डिप्लोमा",
    "opt_post_graduate": "स्नातकोत्तर / व्यावसायिक",
    "sec2_heading": "2. परियोजना एवं वित्तीय विवरण",
    "lbl_sector": "प्राथमिक व्यवसाय क्षेत्र",
    "opt_sector_micro": "सूक्ष्म वित्त / छोटा व्यापार (₹1.40 लाख तक)",
    "opt_sector_term": "लघु उद्यम / सावधि ऋण (₹50 लाख तक)",
    "opt_sector_edu": "उच्च तकनीकी / व्यावसायिक शिक्षा",
    "opt_sector_green": "हरित ऊर्जा व ई-वाहन (ई-रिक्शा / सौर ऊर्जा)",
    "opt_sector_sanitation": "मैकेनाइज्ड स्वच्छता एवं सीवर सफाई उपकरण",
    "lbl_cost": "अनुमानित परियोजना / अध्ययन लागत (₹)",
    "cost_help": "NSFDC रियायती ब्याज पर 90% से 95% तक परियोजना लागत का वित्तपोषण करता है।",
    "lbl_margin": "स्वयं का योगदान / मार्जिन मनी (₹)",
    "margin_help": "स्वयं की पूंजी (परियोजना आकार के आधार पर 0% से 10%)।",
    "chk_training": "कौशल / व्यावसायिक प्रमाण पत्र (PMKVY / ITI) उपलब्ध है",
    "chk_credit": "स्वच्छ क्रेडिट इतिहास / कोई पूर्व ऋण चूक नहीं",
    "sec3_heading": "3. व्यावसायिक विचार (एनएलपी मिलान)",
    "lbl_desc": "अपने व्यावसायिक विचार का स्वाभाविक भाषा में विवरण दें",
    "ph_desc": "हिंदी या अंग्रेजी में स्वाभाविक रूप से लिखें...",
    "desc_help": "हमारा एनएलपी मॉडल आपके विवरण का सरकारी योजनाओं के पात्र कार्यों से सटीक मिलान करता है।",
    "quick_kw_label": "त्वरित कीवर्ड चुनें:",
    "btn_run_ai": "एआई योजना मिलान इंजन चलाएं",
    "btn_running_ai": "वैधानिक नियमों व एनएलपी का विश्लेषण जारी...",
    "rec_results_title": "अनुशंसित योजनाएं एवं ऋण विकल्प",
    "rec_results_desc": "वैधानिक पात्रता, एनएलपी मिलान और एमएल स्वीकृति संभावना के आधार पर क्रमबद्ध।",
    "badge_awaiting": "मूल्यांकन की प्रतीक्षा है",
    "rec_empty_prompt": "उपरोक्त फ़ॉर्म भरें या कोई पूर्व-निर्मित प्रोफ़ाइल चुनें, फिर \"एआई योजना मिलान इंजन चलाएं\" पर क्लिक करें।",
    "card_match": "मिलान:",
    "card_approval": "स्वीकृति संभावना:",
    "card_rate": "रियायती ब्याज दर",
    "card_funding": "पात्र ऋण सहायता",
    "card_moratorium": "मोराटोरियम",
    "card_tenure": "ऋण अवधि",
    "card_max_loan": "अधिकतम ऋण सीमा",
    "card_view_checklist": "पात्रता व आवश्यक दस्तावेज देखें",
    "card_req_docs": "आवश्यक दस्तावेज:",
    "card_impl_agency": "कार्यान्वयन एजेंसी:",
    "btn_why_this": "यह योजना क्यों?",
    "btn_calc_emi": "ईएमआई गणना करें →",
    "btn_partner_map": "पार्टनर मानचित्र →",
    "btn_apply_checklist": "आवेदन चेकलिस्ट",
    "btn_register_online": "योजना हेतु ऑनलाइन पंजीकरण करें →",
    "top_match_tag": "सर्वश्रेष्ठ मिलान",
    "calc_badge": "ऋण परिशोधन एवं सब्सिडी विश्लेषण",
    "calc_title": "रियायती वित्तीय एवं मोराटोरियम कैलकुलेटर",
    "calc_desc": "आधिकारिक NSFDC नियमों के अनुसार मासिक व त्रैमासिक ईएमआई की गणना करें। 3 से 18 माह की मोराटोरियम छूट व वाणिज्यिक बैंकों (12% वार्षिक) की तुलना में होने वाली बचत देखें।",
    "benchmarks_label": "योजना मानक दरें:",
    "calc_params_heading": "ऋण एवं मोराटोरियम पैरामीटर",
    "lbl_calc_loan": "आवश्यक ऋण राशि",
    "lbl_calc_rate": "रियायती ब्याज दर (% वार्षिक)",
    "lbl_calc_tenure": "कुल पुनर्भुगतान अवधि",
    "lbl_calc_moratorium": "मोराटोरियम (छूट अवधि)",
    "moratorium_note": "मोराटोरियम तंत्र: छूट अवधि के दौरान कोई मूलधन नहीं वसूला जाता। किश्तें व्यवसाय स्थापित होने के बाद ही प्रारंभ होती हैं।",
    "proj_monthly_emi": "अनुमानित मासिक ईएमआई",
    "quarterly_eq": "त्रैमासिक समतुल्य:",
    "concessional_saved": "कुल रियायती ब्याज की बचत",
    "vs_bank_rate": "वाणिज्यिक बैंक दर (12.0% वार्षिक) की तुलना में",
    "stat_lbl_principal": "मूल ऋण राशि:",
    "stat_lbl_interest": "कुल रियायती ब्याज:",
    "stat_lbl_payable": "कुल देय राशि:",
    "stat_lbl_moratorium": "मोराटोरियम छूट:",
    "stat_lbl_comm_emi": "सामान्य बैंक ईएमआई:",
    "btn_match_loan": "इस ऋण हेतु योजना खोजें →",
    "btn_find_branch": "बैंक शाखा खोजें",
    "amort_title": "वार्षिक ऋण परिशोधन अनुसूची",
    "th_year": "वर्ष",
    "th_principal": "मूलधन भुगतान (₹)",
    "th_interest": "ब्याज भुगतान (₹)",
    "th_total": "वार्षिक कुल किश्त (₹)",
    "th_closing": "शेष राशि (₹)",
    "settled_label": "पूर्ण चुकता",
    "loc_badge": "भू-स्थानिक पार्टनर राउटर • स्मार्ट एनपीए व कोटा सत्यापन",
    "loc_title": "चैनल पार्टनर लोकेटर एवं बैंक राउटर",
    "loc_desc": "रियायती ऋण 100 से अधिक चैनल भागीदारों के माध्यम से वितरित किए जाते हैं। यह सेवा उच्च एनपीए (>5.0%) या समाप्त कोटे वाली शाखाओं को हटाकर अधिकृत निगमों, राष्ट्रीयकृत बैंकों व ग्रामीण बैंकों को खोजती है।",
    "lbl_filter_category": "योजना श्रेणी",
    "lbl_filter_state": "राज्य चुनें",
    "chk_filter_npa": "उच्च एनपीए (> 5.0%) वाले भागीदारों को हटाएं",
    "chk_filter_funds": "समाप्त फंड कोटा वाले भागीदारों को हटाएं",
    "btn_use_gps": "वर्तमान जीपीएस स्थान का उपयोग करें",
    "loc_auth_partners": "अधिकृत चैनल पार्टनर",
    "loc_verified_tag": "कम एनपीए सत्यापित",
    "loc_loading": "चैनल पार्टनर लोड हो रहे हैं...",
    "loc_no_partners": "चयनित मानदंडों के लिए कोई सक्रिय भागीदार नहीं मिला।",
    "loc_km_away": "किमी दूर",
    "btn_nav_gmaps": "गूगल मैप्स नेविगेशन खोलें →",
    "loc_npa_ratio": "एनपीए अनुपात:",
    "loc_fund_util": "फंड उपयोग:",
    "xai_modal_title": "योजना का एआई स्पष्टीकरण विश्लेषण",
    "xai_annual_saved": "वार्षिक ब्याज बचत",
    "xai_lifetime_saved": "कुल अवधि ब्याज बचत",
    "xai_vs_bank": "12.0% वाणिज्यिक बैंक दर की तुलना में",
    "xai_tenure_over": "कुल ऋण अवधि के दौरान",
    "xai_rationale_heading": "पात्रता एवं चयन के कारण:",
    "xai_drivers_heading": "एमएल स्वीकृति स्कोर के मुख्य कारक:",
    "xai_positive_factors": "सकारात्मक पहलू:",
    "xai_recommendations": "सुधार हेतु सुझाव:",
    "app_gov_title": "भारत सरकार • सामाजिक न्याय मंत्रालय एवं NSFDC",
    "app_doc_summary": "रियायती चैनल वित्तपोषण आवेदन सारांश",
    "app_th_doc": "आवश्यक दस्तावेज",
    "app_th_authority": "जारीकर्ता प्राधिकरण",
    "app_th_status": "स्थिति",
    "app_status_required": "अनिवार्य",
    "app_submission_lbl": "जमा करने के निर्देश:",
    "btn_print_checklist": "प्रिंट करें / पीडीएफ चेकलिस्ट सहेजें",
    "footer_title": "स्कीम साथी • SIH 26092",
    "footer_desc": "वंचित उद्यमियों हेतु एआई-संचालित रियायती ऋण योजना मिलान प्लेटफ़ॉर्म",
    "footer_guidelines": "NSFDC, NSKFDC एवं सामाजिक न्याय और अधिकारिता मंत्रालय (MoSJE) के आधिकारिक नियम।",
    "chat_launcher_label": "योजना सहायक डेस्क",
    "chat_title": "योजना सहायक डेस्क",
    "chat_subtitle": "MoSJE एवं NSFDC आधिकारिक परामर्श",
    "chat_placeholder": "योजनाओं, पात्रता, दस्तावेजों के बारे में पूछें...",
    "chat_welcome": "योजना सहायक डेस्क में आपका स्वागत है। सामाजिक न्याय मंत्रालय और NSFDC की रियायती योजनाओं, पात्रता, आवश्यक दस्तावेजों या चैनल पार्टनरों के बारे में कोई भी प्रश्न पूछें।",
    "auth_btn_login_signup": "लॉग इन / नया पंजीकरण",
    "auth_modal_title": "लाभार्थी पोर्टल प्रमाणीकरण",
    "auth_tab_login": "लाभार्थी लॉगिन",
    "auth_tab_signup": "नया पंजीकरण (साइन अप)",
    "auth_lbl_mobile": "10-अंकीय मोबाइल नंबर",
    "auth_lbl_password": "पासवर्ड (न्यूनतम 6 अक्षर)",
    "auth_lbl_fullname": "आवेदक का पूरा नाम",
    "auth_lbl_caste": "आरक्षित समुदाय वर्ग",
    "auth_lbl_income": "वार्षिक पारिवारिक आय (₹)",
    "auth_lbl_state": "राज्य व जिला",
    "auth_lbl_aadhaar": "आधार (अंतिम 4 अंक)",
    "auth_lbl_gender": "लिंग",
    "auth_btn_login": "खाते में प्रवेश करें →",
    "auth_btn_signup": "खाता बनाएं और लॉगिन करें →",
    "auth_btn_logout": "लॉग आउट",
    "auth_btn_my_apps": "मेरे आवेदन",
    "auth_prompt_to_register": "कृपया वैधानिक योजना पंजीकरण हेतु पहले लॉगिन या नया खाता बनाएं।",
    "auth_prompt_to_recommend": "एआई योजना मिलान इंजन चलाने के लिए कृपया पहले लॉगिन करें या नया खाता बनाएं।",
    "auth_tab_aadhaar": "आधार कार्ड (OTP) द्वारा लॉगिन",
    "auth_tab_password": "पासवर्ड लॉगिन",
    "auth_lbl_aadhaar_12": "12-अंकीय आधार कार्ड नंबर",
    "auth_btn_send_otp": "पंजीकृत मोबाइल पर ओटीपी प्राप्त करें →",
    "auth_btn_verify_otp": "ओटीपी सत्यापित कर लॉगिन करें →",
    "auth_lbl_enter_otp": "6-अंकीय एसएमएस ओटीपी दर्ज करें",
    "auth_aadhaar_help": "पंजीकृत मोबाइल पर ओटीपी प्राप्त करने के लिए 12-अंकीय आधार दर्ज करें।",
    "auth_demo_otp_note": "यूआईडीएआई सिमुलेशन: डेमो ओटीपी है",
    "auth_resend_otp": "पुनः ओटीपी भेजें",
    "auth_change_aadhaar": "आधार नंबर बदलें"
  },
  "mr": {
    "nav_overview": "अवलोकन",
    "nav_recommender": "एआय योजना शिफारस",
    "nav_calculator": "ईएमआय कॅल्क्युलेटर",
    "nav_locator": "चॅनेल भागीदार",
    "nav_login": "लॉगिन",
    "nav_signup": "नोंदणी",
    "nav_auth": "लॉगिन / नोंदणी",
    "nav_my_apps": "माझे अर्ज",
    "nav_logout": "लॉग आउट",
    "gov_ribbon_text": "सामाजिक न्याय आणि सक्षमीकरण मंत्रालय (MoSJE) • राष्ट्रीय अनुसूचित जाती वित्त व विकास महामंडळ",
    "sih_tag": "स्मार्ट इंडिया हॅकाथॉन • समस्या क्रमांक: ",
    "portal_subtitle": "एआय चॅनेल फायनान्स शिफारस व सवलतीचे कर्ज सहाय्य पोर्टल",
    "theme_dark": "🌙 डार्क",
    "theme_light": "☀️ लाइट",
    "hero_badge": "स्मार्ट ऑटोमेशन प्लॅटफॉर्म • सामाजिक न्याय विभाग",
    "hero_h2_1": "वंचित व अनुसूचित जाती उद्योजकांसाठी ",
    "hero_h2_highlight": "एआय-चालित सवलतीची योजना जुळवणी",
    "hero_desc": "अनुसूचित जाती (SC) उद्योजक आणि विद्यार्थ्यांना 4.0% ते 8.0% वार्षिक सवलतीच्या दरात ₹50 लाखांपर्यंत कर्ज, आर्थिक कॅल्क्युलेटर, मोराटोरियम सवलत व जवळच्या अधिकृत बँक शाखा शोधण्याची आधुनिक सुविधा.",
    "btn_launch_ai": "एआय योजना विझार्ड सुरू करा →",
    "btn_open_calc": "आर्थिक कॅल्क्युलेटर उघडा",
    "btn_locate_partners": "चॅनेल भागीदार बँक शोधा",
    "stat_rates_lbl": "सवलतीचे व्याजदर",
    "stat_funding_lbl": "प्रकल्प खर्च अर्थसहाय्य",
    "stat_accuracy_lbl": "एमएल मॉडेल अचूकता",
    "stat_partners_lbl": "सत्यापित बँक व महामंडळ शाखा",
    "how_title": "हे कसे कार्य करते",
    "how_desc": "व्यवसाय कल्पनेपासून ते कर्ज वितरणापर्यंत 3-टप्प्यांची सोपी प्रक्रिया.",
    "step1_num": "टप्पा 01",
    "step1_title": "माहिती व प्रकल्प कल्पना नोंदवा",
    "step1_desc": "कौटुंबिक उत्पन्न, जात प्रवर्ग आणि व्यावसायिक कल्पना साध्या भाषेत सांगा.",
    "step2_num": "टप्पा 02",
    "step2_title": "एआय योजना जुळवणी व गुणदान",
    "step2_desc": "आमचे इंजिन सरकारी नियम, एनएलपी आणि कर्ज मंजुरीच्या शक्यतेचे विश्लेषण करते.",
    "step3_num": "टप्पा 03",
    "step3_title": "जवळच्या अधिकृत भागीदार बँकेशी जोडा",
    "step3_desc": "कमी एनपीए (<5%) आणि उपलब्ध फंड कोटा असलेल्या जवळच्या बँकेची निवड करा.",
    "modules_title": "प्लॅटफॉर्म मॉड्युल्स",
    "modules_desc": "प्रत्येक सेवेचा लाभ त्याच्या स्वतंत्र पृष्ठावर घ्या:",
    "m1_tag": "मुख्य इंजिन",
    "m1_title": "स्मार्ट योजना शिफारस विझार्ड",
    "m1_desc": "नियम फिल्टर + एनएलपी शब्दार्थ जुळवणी + रँडम फॉरेस्ट मॉडेल मंजुरी शक्यतेसह.",
    "m1_btn": "एआय शिफारस विझार्ड उघडा →",
    "m2_tag": "आर्थिक साधन",
    "m2_title": "आर्थिक व मोराटोरियम कॅल्क्युलेटर",
    "m2_desc": "NSFDC च्या सवलतीच्या दरांवर (4%-8%), हप्ता सवलत आणि 12% व्यावसायिक व्याजाच्या तुलनेत होणारी बचत पहा.",
    "m2_btn": "ईएमआय कॅल्क्युलेटर उघडा →",
    "m3_tag": "भू-स्थानिक सेवा",
    "m3_title": "भागीदार बँक व महामंडळ शोधक",
    "m3_desc": "कमी एनपीए (<5%) व सक्रिय फंड कोटा असलेल्या जवळच्या बँक व महामंडळ शाखांचा नकाशा.",
    "m3_btn": "भागीदार नकाशा पहा →",
    "schemes_dir_title": "अधिकृत MoSJE व NSFDC सवलतीची कर्ज योजना",
    "schemes_dir_desc": "क्षेत्रानुसार सवलतीचे व्याजदर आणि कमाल कर्ज मर्यादा तपासा",
    "btn_match_profile": "माझी पात्रता तपासा →",
    "tab_all": "सर्व प्रवर्ग",
    "tab_micro": "सूक्ष्म वित्त (≤ ₹1.4 लाख)",
    "tab_term": "मुदत कर्ज व लघु व्यवसाय",
    "tab_green": "हरित ऊर्जा व ई-रिक्षा",
    "tab_edu": "उच्च शिक्षण कर्ज",
    "tab_sanitation": "स्वच्छता यंत्रसामग्री",
    "rec_badge": "हायब्रिड एआय इंजिन • वैधानिक नियम + एनएलपी शब्दार्थ + पर्यवेक्षित एमएल",
    "rec_title": "स्मार्ट योजना शिफारस व कर्ज मूल्यांकन",
    "rec_desc": "उत्पन्न व जात पात्रतेची तपासणी, एनएलपी द्वारे व्यवसाय कल्पनेचे विश्लेषण आणि कर्ज मंजुरी शक्यतेचा अंदाज.",
    "presets_label": "तयार मूल्यांकन प्रोफाईल:",
    "preset_women": "महिला बुटीक (₹1.2 लाख • MSY)",
    "preset_erickshaw": "इलेक्ट्रिक ई-रिक्षा (₹2.8 लाख • GBS)",
    "preset_btech": "बी.टेक अभियांत्रिकी (₹14 लाख • ELS)",
    "preset_sanitation": "स्वच्छता यंत्रसामग्री (₹16 लाख • SUY)",
    "sec1_heading": "1. लाभार्थी माहिती",
    "lbl_caste": "लक्षित समुदाय प्रवर्ग",
    "opt_sc": "अनुसूचित जाती (SC)",
    "opt_safai": "सफाई कर्मचारी / स्वच्छकार आश्रित",
    "opt_st": "अनुसूचित जमाती (ST)",
    "opt_obc": "इतर मागासवर्गीय (OBC)",
    "opt_gen": "खुला प्रवर्ग",
    "caste_help": "NSFDC सवलतीच्या कर्जामध्ये अनुसूचित जाती व सफाई कामगार कुटुंबांना प्राधान्य दिले जाते.",
    "lbl_income": "वार्षिक कौटुंबिक उत्पन्न (₹)",
    "income_help": "वैधानिक मर्यादा: ₹3,00,000/वर्ष (काही मुदत कर्जासाठी ₹5,00,000 पर्यंत).",
    "lbl_gender": "लिंग",
    "opt_female": "महिला (अतिरिक्त सवलत)",
    "opt_male": "पुरुष",
    "opt_other": "इतर",
    "lbl_age": "अर्जदाराचे वय",
    "lbl_edu": "शैक्षणिक पात्रता",
    "opt_no_edu": "औपचारिक शिक्षण नाही",
    "opt_primary": "प्राथमिक शाळा (1-8वी)",
    "opt_secondary": "माध्यमिक (10वी उत्तीर्ण)",
    "opt_higher_sec": "उच्च माध्यमिक (12वी उत्तीर्ण)",
    "opt_graduate": "पदवीधर / डिप्लोमा",
    "opt_post_graduate": "पदव्युत्तर / व्यावसायिक",
    "sec2_heading": "2. प्रकल्प आणि आर्थिक माहिती",
    "lbl_sector": "व्यवसाय क्षेत्र",
    "opt_sector_micro": "सूक्ष्म वित्त / छोटा व्यवसाय (₹1.40 लाखांपर्यंत)",
    "opt_sector_term": "लघु उद्योग / मुदत कर्ज (₹50 लाखांपर्यंत)",
    "opt_sector_edu": "उच्च तांत्रिक / व्यावसायिक शिक्षण",
    "opt_sector_green": "हरित ऊर्जा व ई-वाहन (ई-रिक्षा / सौर ऊर्जा)",
    "opt_sector_sanitation": "स्वच्छता व ड्रेनेज सफाई यंत्रे",
    "lbl_cost": "अंदाजे प्रकल्प खर्च (₹)",
    "cost_help": "NSFDC सवलतीच्या दरात प्रकल्पाच्या 90% ते 95% पर्यंत अर्थसहाय्य देते.",
    "lbl_margin": "स्वतःचे योगदान / मार्जिन मनी (₹)",
    "margin_help": "स्वतःची गुंतवणूक (प्रकल्पानुसार 0% ते 10%).",
    "chk_training": "कौशल्य / व्यावसायिक प्रमाणपत्र (PMKVY / ITI) आहे",
    "chk_credit": "चांगला क्रेडिट इतिहास / कोणतीही कर्ज थकबाकी नाही",
    "sec3_heading": "3. व्यवसाय कल्पना (एनएलपी विश्लेषण)",
    "lbl_desc": "आपल्या व्यावसायिक कल्पनेचे साध्या भाषेत वर्णन करा",
    "ph_desc": "मराठी, हिंदी किंवा इंग्रजीत लिहा...",
    "desc_help": "आमचे एनएलपी मॉडेल तुमच्या कल्पनेचे सरकारी योजनांच्या निकषांशी अचूक जुळवणी करते.",
    "quick_kw_label": "कीवर्ड निवडा:",
    "btn_run_ai": "एआय योजना जुळवणी सुरू करा",
    "btn_running_ai": "नियम व एनएलपीचे विश्लेषण सुरू आहे...",
    "rec_results_title": "शिफारस केलेल्या योजना व कर्ज पर्याय",
    "rec_results_desc": "पात्रता, एनएलपी जुळवणी आणि मंजुरी शक्यतेनुसार क्रमवारी.",
    "badge_awaiting": "मूल्यांकनाची वाट पाहत आहे",
    "rec_empty_prompt": "वरील फॉर्म भरा किंवा तयार प्रोफाईल निवडून \"एआय योजना जुळवणी सुरू करा\" वर क्लिक करा.",
    "card_match": "जुळणी:",
    "card_approval": "मंजुरी शक्यता:",
    "card_rate": "सवलतीचा व्याजदर",
    "card_funding": "पात्र कर्ज सहाय्य",
    "card_moratorium": "हप्ता सवलत",
    "card_tenure": "कर्ज कालावधी",
    "card_max_loan": "कमाल कर्ज मर्यादा",
    "card_view_checklist": "निकष व आवश्यक कागदपत्रे पहा",
    "card_req_docs": "आवश्यक कागदपत्रे:",
    "card_impl_agency": "अंमलबजावणी संस्था:",
    "btn_why_this": "ही योजना का?",
    "btn_calc_emi": "ईएमआय मोजा →",
    "btn_partner_map": "भागीदार नकाशा →",
    "btn_apply_checklist": "अर्ज चेकलिस्ट",
    "btn_register_online": "योजनेसाठी थेट ऑनलाइन नोंदणी करा →",
    "top_match_tag": "सर्वोत्तम जुळणी",
    "calc_badge": "कर्ज परतफेड व अनुदान विश्लेषण",
    "calc_title": "सवलतीचे वित्तीय व मोराटोरियम कॅल्क्युलेटर",
    "calc_desc": "NSFDC नियमांनुसार मासिक व त्रैमासिक ईएमआय मोजा. 3 ते 18 महिन्यांची सवलत आणि सामान्य बँकांच्या (12%) तुलनेत होणारी बचत पहा.",
    "benchmarks_label": "योजना व्याजदर:",
    "calc_params_heading": "कर्ज आणि परतफेड माहिती",
    "lbl_calc_loan": "आवश्यक कर्ज रक्कम",
    "lbl_calc_rate": "सवलतीचा व्याजदर (% वार्षिक)",
    "lbl_calc_tenure": "एकूण परतफेड कालावधी",
    "lbl_calc_moratorium": "मोराटोरियम (हप्ता सवलत)",
    "moratorium_note": "मोराटोरियम पद्धत: व्यवसाय स्थिर होईपर्यंत हप्ता सुरू होत नाही.",
    "proj_monthly_emi": "अंदाजे मासिक ईएमआय",
    "quarterly_eq": "त्रैमासिक समान हप्ता:",
    "concessional_saved": "एकूण सवलतीची व्याज बचत",
    "vs_bank_rate": "व्यावसायिक बँक दर (12.0%) च्या तुलनेत",
    "stat_lbl_principal": "मुद्दल रक्कम:",
    "stat_lbl_interest": "एकूण सवलतीचे व्याज:",
    "stat_lbl_payable": "एकूण परतफेड रक्कम:",
    "stat_lbl_moratorium": "हप्ता सवलत:",
    "stat_lbl_comm_emi": "सामान्य बँक ईएमआय:",
    "btn_match_loan": "या कर्जासाठी योजना शोधा →",
    "btn_find_branch": "बँक शाखा शोधा",
    "amort_title": "वार्षिक कर्ज परतफेड तक्ता",
    "th_year": "वर्ष",
    "th_principal": "मुद्दल परतफेड (₹)",
    "th_interest": "व्याज परतफेड (₹)",
    "th_total": "वार्षिक एकूण हप्ता (₹)",
    "th_closing": "शिल्लक रक्कम (₹)",
    "settled_label": "पूर्ण फेडले",
    "loc_badge": "भू-स्थानिक भागीदार शोधक • एनपीए पडताळणी",
    "loc_title": "चॅनेल भागीदार व अधिकृत बँक शोधक",
    "loc_desc": "सवलतीची कर्जे 100+ चॅनेल भागीदारांमार्फत दिली जातात. ही सेवा कमी एनपीए (<5%) असलेल्या अधिकृत बँक शाखा शोधून देते.",
    "lbl_filter_category": "योजना प्रवर्ग",
    "lbl_filter_state": "राज्य निवडा",
    "chk_filter_npa": "उच्च एनपीए (> 5.0%) असलेल्या शाखा वगळा",
    "chk_filter_funds": "फंड संपलेल्या शाखा वगळा",
    "btn_use_gps": "सध्याचे स्थान वापरा",
    "loc_auth_partners": "अधिकृत चॅनेल भागीदार",
    "loc_verified_tag": "कमी एनपीए प्रमाणित",
    "loc_loading": "भागीदार शोधत आहे...",
    "loc_no_partners": "निवडलेल्या निकषांसाठी भागीदार आढळला नाही.",
    "loc_km_away": "किमी अंतरावर",
    "btn_nav_gmaps": "गूगल मॅप्स नेव्हिगेशन →",
    "loc_npa_ratio": "एनपीए गुणोत्तर:",
    "loc_fund_util": "फंड वापर:",
    "xai_modal_title": "योजनेचे एआय विश्लेषण",
    "xai_annual_saved": "वार्षिक व्याज बचत",
    "xai_lifetime_saved": "एकूण कालावधीतील बचत",
    "xai_vs_bank": "12.0% बँक दराच्या तुलनेत",
    "xai_tenure_over": "संपूर्ण कर्ज कालावधीत",
    "xai_rationale_heading": "पात्रतेची कारणे:",
    "xai_drivers_heading": "मंजुरीचे मुख्य घटक:",
    "xai_positive_factors": "सकारात्मक बाबी:",
    "xai_recommendations": "सुधारणेसाठी मार्गदर्शन:",
    "app_gov_title": "भारत सरकार • सामाजिक न्याय मंत्रालय व NSFDC",
    "app_doc_summary": "सवलतीच्या कर्ज अर्जाचा सारांश",
    "app_th_doc": "आवश्यक कागदपत्र",
    "app_th_authority": "देणारी संस्था",
    "app_th_status": "स्थिती",
    "app_status_required": "अनिवार्य",
    "app_submission_lbl": "अर्ज सादर करण्याच्या सूचना:",
    "btn_print_checklist": "प्रिंट करा / पीडीएफ सेव्ह करा",
    "footer_title": "स्कीम साथी • SIH 26092",
    "footer_desc": "वंचित घटकांसाठी एआय-चालित सवलतीची कर्ज योजना जुळवणी",
    "footer_guidelines": "NSFDC आणि सामाजिक न्याय मंत्रालयाचे अधिकृत नियम.",
    "chat_launcher_label": "योजना सहाय्यक डेस्क",
    "chat_title": "योजना सहाय्यक डेस्क",
    "chat_subtitle": "MoSJE आणि NSFDC अधिकृत मार्गदर्शन",
    "chat_placeholder": "योजना, पात्रता, कागदपत्रांबद्दल विचारा...",
    "chat_welcome": "योजना सहाय्यक डेस्कवर आपले स्वागत आहे. सवलतीची कर्जे, उत्पन्न मर्यादा, आवश्यक कागदपत्रे किंवा बँक भागीदारांबद्दल विचारा.",
    "auth_btn_login_signup": "लॉगिन / नवीन नोंदणी",
    "auth_modal_title": "लाभार्थी पोर्टल प्रमाणीकरण",
    "auth_tab_login": "लाभार्थी लॉगिन",
    "auth_tab_signup": "नवीन नोंदणी (साइन अप)",
    "auth_lbl_mobile": "१०-अंकी मोबाईल नंबर",
    "auth_lbl_password": "पासवर्ड (किमान ६ अक्षरे)",
    "auth_lbl_fullname": "पूर्ण नाव",
    "auth_lbl_caste": "आरक्षित प्रवर्ग",
    "auth_lbl_income": "वार्षिक कौटुंबिक उत्पन्न (₹)",
    "auth_lbl_state": "राज्य व जिल्हा",
    "auth_lbl_aadhaar": "आधार (शेवटचे ४ अंक)",
    "auth_lbl_gender": "लिंग",
    "auth_btn_login": "खात्यात प्रवेश करा →",
    "auth_btn_signup": "खाते तयार करा व लॉगिन करा →",
    "auth_btn_logout": "लॉग आउट",
    "auth_btn_my_apps": "माझे अर्ज",
    "auth_prompt_to_register": "कृपया योजनेसाठी अर्ज करण्यापूर्वी लॉगिन किंवा नोंदणी करा.",
    "auth_prompt_to_recommend": "एआय योजना जुळवणी इंजिन चालवण्यासाठी कृपया आधी लॉगिन करा किंवा नोंदणी करा.",
    "auth_tab_aadhaar": "आधार कार्ड (OTP) द्वारे लॉगिन",
    "auth_tab_password": "पासवर्ड लॉगिन",
    "auth_lbl_aadhaar_12": "१२-अंकी आधार कार्ड क्रमांक",
    "auth_btn_send_otp": "नोंदणीकृत मोबाईलवर ओटीपी मिळवा →",
    "auth_btn_verify_otp": "ओटीपी पडताळून लॉगिन करा →",
    "auth_lbl_enter_otp": "६-अंकी एसएमएस ओटीपी प्रविष्ट करा",
    "auth_aadhaar_help": "नोंदणीकृत मोबाईलवर ओटीपी मिळवण्यासाठी १२-अंकी आधार प्रविष्ट करा.",
    "auth_demo_otp_note": "UIDAI सिम्युलेशन: डेमो ओटीपी आहे",
    "auth_resend_otp": "पुन्हा ओटीपी पाठवा",
    "auth_change_aadhaar": "आधार क्रमांक बदला"
  },
  "ta": {
    "nav_overview": "கண்ணோட்டம்",
    "nav_recommender": "ஏஐ திட்டப் பரிந்துரை",
    "nav_calculator": "இஎம்ஐ கணிப்பான்",
    "nav_locator": "சேனல் கூட்டாளர்கள்",
    "nav_login": "உள்நுழைவு",
    "nav_signup": "பதிவு செய்",
    "nav_auth": "உள்நுழைவு / பதிவு",
    "nav_my_apps": "எனது விண்ணப்பங்கள்",
    "nav_logout": "வெளியேறு",
    "gov_ribbon_text": "சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம் (MoSJE) • தேசிய அட்டவணை சாதிகள் நிதி மற்றும் மேம்பாட்டுக் கழகம்",
    "sih_tag": "ஸ்மார்ட் இந்தியா ஹேக்கத்தான் • பிரச்சனை அறிக்கை: ",
    "portal_subtitle": "ஏஐ சேனல் நிதி பரிந்துரை மற்றும் சலுகைக் கடன் தளம்",
    "theme_dark": "🌙 இருண்ட",
    "theme_light": "☀️ ஒளி",
    "hero_badge": "ஸ்மார்ட் ஆட்டோமேஷன் தளம் • சமூக நீதித் துறை",
    "hero_h2_1": "விளிம்புநிலை மற்றும் எஸ்சி தொழில்முனைவோருக்கான ",
    "hero_h2_highlight": "ஏஐ-இயங்கும் சலுகைக் கடன் திட்டப் பொருத்தம்",
    "hero_desc": "அட்டவணை சாதி (SC) தொழில்முனைவோர் மற்றும் மாணவர்களுக்கு 4.0% முதல் 8.0% வரையிலான சலுகை வட்டி விகிதத்தில் ₹50 லட்சம் வரை கடன், இஎம்ஐ கணிப்பான் மற்றும் அருகிலுள்ள வங்கி கிளைகளைக் கண்டறியும் சேவை.",
    "btn_launch_ai": "திட்டப் பரிந்துரையைத் தொடங்கவும் →",
    "btn_open_calc": "நிதி கணிப்பானைத் திறக்கவும்",
    "btn_locate_partners": "வங்கி கூட்டாளர்களைக் கண்டறியவும்",
    "stat_rates_lbl": "சலுகை வட்டி விகிதங்கள்",
    "stat_funding_lbl": "திட்டச் செலவு நிதியுதவி",
    "stat_accuracy_lbl": "எம்எல் துல்லியம்",
    "stat_partners_lbl": "அங்கீகரிக்கப்பட்ட வங்கி கிளைகள்",
    "how_title": "இது எவ்வாறு செயல்படுகிறது",
    "how_desc": "தொழில் யோசனை முதல் கடன் பெறுதல் வரையிலான 3-படி செயல்முறை.",
    "step1_num": "படி 01",
    "step1_title": "விவரங்களை உள்ளிடவும்",
    "step1_desc": "வருமானம், சாதி மற்றும் தொழில் யோசனையை எளிய மொழியில் உள்ளிடவும்.",
    "step2_num": "படி 02",
    "step2_title": "ஏஐ பொருத்தம் மற்றும் மதிப்பீடு",
    "step2_desc": "எங்கள் இயந்திரம் அரசு விதிகள் மற்றும் ஒப்புதல் வாய்ப்புகளை பகுப்பாய்வு செய்கிறது.",
    "step3_num": "படி 03",
    "step3_title": "அருகிலுள்ள வங்கியை அணுகவும்",
    "step3_desc": "குறைந்த என்.பி.ஏ (<5%) உள்ள அருகிலுள்ள வங்கி கிளையைத் தேர்வு செய்யவும்.",
    "modules_title": "தளத்தின் சேவைகள்",
    "modules_desc": "ஒவ்வொரு சிறப்பு கருவியையும் அதன் பிரத்யேக பக்கத்தில் பயன்படுத்தவும்:",
    "m1_tag": "முதன்மை இயந்திரம்",
    "m1_title": "ஸ்மார்ட் திட்டப் பரிந்துரை",
    "m1_desc": "விதி வடிகட்டி + என்எல்பி பொருத்தம் + ரேண்டம் ஃபாரஸ்ட் ஒப்புதல் வாய்ப்பு பகுப்பாய்வு.",
    "m1_btn": "பரிந்துரையைத் திறக்கவும் →",
    "m2_tag": "நிதிக் கருவி",
    "m2_title": "இஎம்ஐ மற்றும் சலுகைக் கால கணிப்பான்",
    "m2_desc": "NSFDC சலுகை விகிதங்கள் (4%-8%) மற்றும் வணிக வங்கிகளுடன் ஒப்பீடு.",
    "m2_btn": "இஎம்ஐ கணிப்பானைத் திறக்கவும் →",
    "m3_tag": "புவிசார் சேவை",
    "m3_title": "வங்கி மற்றும் கூட்டாளர் வரைபடம்",
    "m3_desc": "அங்கீகரிக்கப்பட்ட அரசு மற்றும் ஊரக வங்கிகளின் வரைபடம்.",
    "m3_btn": "வரைபடத்தைக் காண்க →",
    "schemes_dir_title": "அதிகாரப்பூர்வ MoSJE & NSFDC சலுகைக் கடன் திட்டங்கள்",
    "schemes_dir_desc": "துறை வாரியாக வட்டி விகிதங்கள் மற்றும் கடன் வரம்புகளைக் காண்க",
    "btn_match_profile": "தகுதியைச் சரிபார்க்கவும் →",
    "tab_all": "அனைத்து பிரிவுகளும்",
    "tab_micro": "நுண் நிதி (≤ ₹1.4 லட்சம்)",
    "tab_term": "வணிகக் கடன்",
    "tab_green": "பசுமை ஆற்றல் & இ-வாகனம்",
    "tab_edu": "உயர் கல்வி கடன்",
    "tab_sanitation": "துப்புரவு உபகரணங்கள்",
    "rec_badge": "ஹைப்ரிட் ஏஐ • அரசு விதிகள் + என்எல்பி + மேற்பார்வையிடப்பட்ட எம்எல்",
    "rec_title": "ஸ்மார்ட் திட்டப் பரிந்துரை மற்றும் மதிப்பீட்டாளர்",
    "rec_desc": "தகுதி சரிபார்ப்பு, என்எல்பி மூலம் தேவையை அறிதல் மற்றும் ஒப்புதல் சாத்தியக்கூறுகள் கணக்கீடு.",
    "presets_label": "முன் அமைக்கப்பட்ட சுயவிவரங்கள்:",
    "preset_women": "மகளிர் பூட்டிக் (₹1.2L • MSY)",
    "preset_erickshaw": "பேட்டரி இ-ரிக்சா (₹2.8L • GBS)",
    "preset_btech": "பி.டெக் பொறியியல் (₹14L • ELS)",
    "preset_sanitation": "துப்புரவு வாகனம் (₹16L • SUY)",
    "sec1_heading": "1. விண்ணப்பதாரர் விவரங்கள்",
    "lbl_caste": "சமூகப் பிரிவு",
    "opt_sc": "பட்டியல் சாதி (SC)",
    "opt_safai": "துப்புரவுப் பணியாளர் குடும்பம்",
    "opt_st": "பட்டியல் பழங்குடி (ST)",
    "opt_obc": "இதர பிற்படுத்தப்பட்ட வகுப்பு (OBC)",
    "opt_gen": "பொதுப் பிரிவு",
    "caste_help": "NSFDC சலுகைக் கடனில் எஸ்சி மக்களுக்கு முன்னுரிமை அளிக்கப்படுகிறது.",
    "lbl_income": "ஆண்டு குடும்ப வருமானம் (₹)",
    "income_help": "அரசு உச்சவரம்பு: ₹3,00,000/ஆண்டு (சில கடன்களுக்கு ₹5,00,000 வரை).",
    "lbl_gender": "பாலினம்",
    "opt_female": "பெண் (கூடுதல் வட்டிச் சலுகை)",
    "opt_male": "ஆண்",
    "opt_other": "மற்றவை",
    "lbl_age": "விண்ணப்பதாரர் வயது",
    "lbl_edu": "கல்வித் தகுதி",
    "opt_no_edu": "முறையான கல்வி இல்லை",
    "opt_primary": "தொடக்கப் பள்ளி",
    "opt_secondary": "பத்தாம் வகுப்பு தேர்ச்சி",
    "opt_higher_sec": "பன்னிரண்டாம் வகுப்பு தேர்ச்சி",
    "opt_graduate": "பட்டதாரி / டிப்ளமோ",
    "opt_post_graduate": "முதுகலை / தொழிற்கல்வி",
    "sec2_heading": "2. திட்ட நிதி விவரங்கள்",
    "lbl_sector": "வணிகத் துறை",
    "opt_sector_micro": "நுண் கடன் / சிறு வணிகம் (₹1.40 லட்சம் வரை)",
    "opt_sector_term": "சிறு தொழில் / காலக் கடன் (₹50 லட்சம் வரை)",
    "opt_sector_edu": "தொழில்நுட்பம் / தொழில்முறைக் கல்வி",
    "opt_sector_green": "பசுமை ஆற்றல் & இ-ரிக்சா",
    "opt_sector_sanitation": "துப்புரவு மற்றும் கழிவுநீர் உபகரணங்கள்",
    "lbl_cost": "மதிப்பிடப்பட்ட திட்டச் செலவு (₹)",
    "cost_help": "NSFDC 90% முதல் 95% வரை சலுகை வட்டியில் நிதி வழங்குகிறது.",
    "lbl_margin": "சொந்த முதலீடு / பங்குத் தொகை (₹)",
    "margin_help": "சொந்தப் பங்கு (0% முதல் 10% வரை).",
    "chk_training": "திறன் பயிற்சி சான்றிதழ் (PMKVY / ITI) உள்ளது",
    "chk_credit": "கடன் நிலுவைகள் ஏதுமில்லை",
    "sec3_heading": "3. தொழில் நோக்கம் (என்எல்பி பொருத்தம்)",
    "lbl_desc": "உங்கள் தொழில் யோசனையை உங்கள் சொந்த மொழியில் விவரிக்கவும்",
    "ph_desc": "தமிழ் அல்லது ஆங்கிலத்தில் எழுதவும்...",
    "desc_help": "எங்கள் என்எல்பி மாதிரி உங்கள் விளக்கத்தை அரசு திட்டங்களுடன் ஒப்பிடுகிறது.",
    "quick_kw_label": "முக்கிய வார்த்தைகள்:",
    "btn_run_ai": "ஏஐ திட்டப் பொருத்தத்தை இயக்கவும்",
    "btn_running_ai": "பொருத்தத்தை பகுப்பாய்வு செய்கிறது...",
    "rec_results_title": "பரிந்துரைக்கப்பட்ட திட்டங்கள்",
    "rec_results_desc": "தகுதி மற்றும் ஒப்புதல் சாத்தியக்கூறுகளின் அடிப்படையில் வரிசைப்படுத்தப்பட்டது.",
    "badge_awaiting": "மதிப்பீட்டிற்காக காத்திருக்கிறது",
    "rec_empty_prompt": "படிவத்தை நிரப்பிவிட்டு \"ஏஐ திட்டப் பொருத்தத்தை இயக்கவும்\" பொத்தானை அழுத்தவும்.",
    "card_match": "பொருத்தம்:",
    "card_approval": "ஒப்புதல் வாய்ப்பு:",
    "card_rate": "சலுகை வட்டி விகிதம்",
    "card_funding": "தகுதியான கடன் உதவி",
    "card_moratorium": "சலுகைக் காலம்",
    "card_tenure": "கால அளவு",
    "card_max_loan": "அதிகபட்ச கடன் வரம்பு",
    "card_view_checklist": "ஆவணங்கள் மற்றும் விதிகள்",
    "card_req_docs": "தேவையான ஆவணங்கள்:",
    "card_impl_agency": "செயல்படுத்தும் அமைப்பு:",
    "btn_why_this": "இந்த திட்டம் ஏன்?",
    "btn_calc_emi": "இஎம்ஐ கணக்கிடுங்கள் →",
    "btn_partner_map": "வங்கி வரைபடம் →",
    "btn_apply_checklist": "விண்ணப்ப பட்டியல்",
    "btn_register_online": "திட்டத்திற்கு நேரடியாக ஆன்லைனில் பதிவு செய்க →",
    "top_match_tag": "சிறந்த பொருத்தம்",
    "calc_badge": "கடன் தவணை பகுப்பாய்வு",
    "calc_title": "சலுகை நிதி மற்றும் இஎம்ஐ கணிப்பான்",
    "calc_desc": "NSFDC வழிகாட்டுதல்களின்படி மாதந்தோறும் செலுத்த வேண்டிய தவணை மற்றும் வட்டி சேமிப்பைக் கணக்கிடுங்கள்.",
    "benchmarks_label": "திட்ட வட்டி வரம்புகள்:",
    "calc_params_heading": "கடன் அளவுருக்கள்",
    "lbl_calc_loan": "தேவையான கடன் தொகை",
    "lbl_calc_rate": "சலுகை வட்டி விகிதம் (% ஆண்டு)",
    "lbl_calc_tenure": "திருப்பிச் செலுத்தும் காலம்",
    "lbl_calc_moratorium": "சலுகைக் காலம் (மொரட்டோரியம்)",
    "moratorium_note": "தொழில் தொடங்கும் வரை தவணை செலுத்தத் தேவையில்லை.",
    "proj_monthly_emi": "மாதாந்திர இஎம்ஐ",
    "quarterly_eq": "காலாண்டு தவணை:",
    "concessional_saved": "மொத்த வட்டி சேமிப்பு",
    "vs_bank_rate": "வணிக வங்கிகளுடன் ஒப்பிடுகையில் (12%)",
    "stat_lbl_principal": "அசல் தொகை:",
    "stat_lbl_interest": "மொத்த சலுகை வட்டி:",
    "stat_lbl_payable": "மொத்தம் செலுத்த வேண்டியது:",
    "stat_lbl_moratorium": "சலுகைக் காலம்:",
    "stat_lbl_comm_emi": "சாதாரண வங்கி இஎம்ஐ:",
    "btn_match_loan": "இத்தொகைக்கான திட்டத்தைக் கண்டறியவும் →",
    "btn_find_branch": "வங்கி கிளையைக் கண்டறியவும்",
    "amort_title": "ஆண்டு வாரியான தவணை அட்டவணை",
    "th_year": "ஆண்டு",
    "th_principal": "செலுத்தப்பட்ட அசல் (₹)",
    "th_interest": "செலுத்தப்பட்ட வட்டி (₹)",
    "th_total": "மொத்த தவணை (₹)",
    "th_closing": "மீதமுள்ள இருப்பு (₹)",
    "settled_label": "முடிந்தது",
    "loc_badge": "வங்கி கிளை வரைபடம்",
    "loc_title": "சேனல் கூட்டாளர் மற்றும் வங்கி லொக்கேட்டர்",
    "loc_desc": "குறைந்த என்.பி.ஏ (<5%) உள்ள அரசு அங்கீகாரம் பெற்ற வங்கி கிளைகளைக் கண்டறியவும்.",
    "lbl_filter_category": "திட்டப் பிரிவு",
    "lbl_filter_state": "மாநிலத்தைத் தேர்வு செய்யவும்",
    "chk_filter_npa": "அதிக என்.பி.ஏ உள்ள வங்கிகளை நீக்கவும்",
    "chk_filter_funds": "நிதி தீர்ந்த கிளைகளை நீக்கவும்",
    "btn_use_gps": "தற்போதைய இருப்பிடத்தைப் பயன்படுத்தவும்",
    "loc_auth_partners": "அங்கீகரிக்கப்பட்ட கூட்டாளர்கள்",
    "loc_verified_tag": "சரிபார்க்கப்பட்டது",
    "loc_loading": "வங்கிகள் ஏற்றப்படுகின்றன...",
    "loc_no_partners": "கிளைகள் எதுவும் கிடைக்கவில்லை.",
    "loc_km_away": "கி.மீ தூரத்தில்",
    "btn_nav_gmaps": "கூகுள் மேப்ஸ் வழிசெலுத்தல் →",
    "loc_npa_ratio": "என்.பி.ஏ விகிதம்:",
    "loc_fund_util": "நிதிப் பயன்பாடு:",
    "xai_modal_title": "திட்டத்தின் ஏஐ விளக்கம்",
    "xai_annual_saved": "ஆண்டு வட்டி சேமிப்பு",
    "xai_lifetime_saved": "முழு கடன் வட்டி சேமிப்பு",
    "xai_vs_bank": "12.0% வங்கி வட்டியுடன் ஒப்பிடுகையில்",
    "xai_tenure_over": "முழு காலத்திலும்",
    "xai_rationale_heading": "தேர்வின் காரணங்கள்:",
    "xai_drivers_heading": "ஒப்புதலின் முக்கிய காரணிகள்:",
    "xai_positive_factors": "சாதகமான காரணிகள்:",
    "xai_recommendations": "பரிந்துரைகள்:",
    "app_gov_title": "இந்திய அரசு • சமூக நீதி அமைச்சகம் & NSFDC",
    "app_doc_summary": "கடன் விண்ணப்பச் சுருக்கம்",
    "app_th_doc": "தேவையான ஆவணம்",
    "app_th_authority": "வழங்கும் அதிகாரி",
    "app_th_status": "நிலை",
    "app_status_required": "கட்டாயம்",
    "app_submission_lbl": "சமர்ப்பிக்கும் வழிமுறைகள்:",
    "btn_print_checklist": "அச்சிடுக / பிடிஎஃப் சேமிக்கவும்",
    "footer_title": "ஸ்கீம் சாதி • SIH 26092",
    "footer_desc": "விளிம்புநிலை தொழில்முனைவோருக்கான ஏஐ கடன் திட்டப் பொருத்தம்",
    "footer_guidelines": "NSFDC மற்றும் சமூக நீதி அமைச்சகத்தின் வழிகாட்டுதல்கள்.",
    "chat_launcher_label": "திட்ட ஆலோசனை மையம்",
    "chat_title": "திட்ட ஆலோசனை மையம்",
    "chat_subtitle": "அதிகாரப்பூர்வ MoSJE & NSFDC ஆலோசனை",
    "chat_placeholder": "திட்டங்கள், தகுதி, ஆவணங்கள் பற்றி கேளுங்கள்...",
    "chat_welcome": "திட்ட ஆலோசனை மையத்திற்கு வரவேற்கிறோம். தகுதி, ஆவணங்கள் அல்லது கடன் திட்டங்கள் பற்றி கேளுங்கள்.",
    "auth_btn_login_signup": "உள்நுழை / பதிவு செய்",
    "auth_modal_title": "பயனாளர் போர்டல் அங்கீகாரம்",
    "auth_tab_login": "பயனாளர் உள்நுழைவு",
    "auth_tab_signup": "புதிய பதிவு (சைன் அப்)",
    "auth_lbl_mobile": "10-இலக்க மொபைல் எண்",
    "auth_lbl_password": "கடவுச்சொல் (குறைந்தது 6 எழுத்துக்கள்)",
    "auth_lbl_fullname": "முழு பெயர்",
    "auth_lbl_caste": "சமூகப் பிரிவு",
    "auth_lbl_income": "ஆண்டு குடும்ப வருமானம் (₹)",
    "auth_lbl_state": "மாநிலம் மற்றும் மாவட்டம்",
    "auth_lbl_aadhaar": "ஆதார் (கடைசி 4 இலக்கங்கள்)",
    "auth_lbl_gender": "பாலினம்",
    "auth_btn_login": "கணக்கில் உள்நுழையவும் →",
    "auth_btn_signup": "கணக்கை உருவாக்கி உள்நுழைக →",
    "auth_btn_logout": "வெளியேறு",
    "auth_btn_my_apps": "எனது விண்ணப்பங்கள்",
    "auth_prompt_to_register": "திட்டத்திற்கு விண்ணப்பிக்க தயவுசெய்து உள்நுழையவும் அல்லது பதிவு செய்யவும்.",
    "auth_prompt_to_recommend": "ஏஐ திட்டப் பொருத்த இயந்திரத்தை இயக்க தயவுசெய்து முதலில் உள்நுழையவும் அல்லது கணக்கை உருவாக்கவும்.",
    "auth_tab_aadhaar": "ஆதார் அட்டை (OTP) உள்நுழைவு",
    "auth_tab_password": "கடவுச்சொல் உள்நுழைவு",
    "auth_lbl_aadhaar_12": "12-இலக்க ஆதார் அட்டை எண்",
    "auth_btn_send_otp": "பதிவுசெய்த மொபைலில் OTP பெறவும் →",
    "auth_btn_verify_otp": "OTP சரிபார்த்து உள்நுழையவும் →",
    "auth_lbl_enter_otp": "6-இலக்க எஸ்எம்எஸ் OTP ஐ உள்ளிடவும்",
    "auth_aadhaar_help": "பதிவுசெய்த மொபைலில் OTP பெற 12 இலக்க ஆதாரை உள்ளிடவும்.",
    "auth_demo_otp_note": "UIDAI உருவகப்படுத்துதல்: டெமோ OTP",
    "auth_resend_otp": "மீண்டும் OTP அனுப்பவும்",
    "auth_change_aadhaar": "ஆதார் எண்ணை மாற்றவும்"
  },
  "te": {
    "nav_overview": "అవలోకనం",
    "nav_recommender": "AI పథక సిఫార్సు",
    "nav_calculator": "EMI కాలిక్యులేటర్",
    "nav_locator": "ఛానెల్ భాగస్వాములు",
    "nav_login": "లాగిన్",
    "nav_signup": "సైన్ అప్",
    "nav_auth": "లాగిన్ / సైన్ అప్",
    "nav_my_apps": "నా దరఖాస్తులు",
    "nav_logout": "లాగ్ అవుట్",
    "gov_ribbon_text": "సామాజిక న్యాయం & సాధికారత మంత్రిత్వ శాఖ (MoSJE) • జాతీయ షెడ్యూల్డ్ కులాల ఫైనాన్స్ & డెవలప్‌మెంట్ కార్పొరేషన్",
    "sih_tag": "స్మార్ట్ ఇండియా హ్యాకథాన్ • సమస్య ప్రకటన: ",
    "portal_subtitle": "AI ఛానెల్ ఫైనాన్స్ సిఫార్సు & రాయితీ రుణ పోర్టల్",
    "theme_dark": "🌙 డార్క్",
    "theme_light": "☀️ లైట్",
    "hero_badge": "స్మార్ట్ ఆటోమేషన్ ప్లాట్‌ఫామ్ • సామాజిక న్యాయ శాఖ",
    "hero_h2_1": "బలహీన వర్గాలు మరియు ఎస్సీ వ్యవస్థాపకులకు ",
    "hero_h2_highlight": "AI ఆధారిత రాయితీ రుణ పథకాల సరిపోలిక",
    "hero_desc": "షెడ్యూల్డ్ కులాల (SC) వ్యవస్థాపకులు మరియు విద్యార్థులకు 4.0% నుండి 8.0% వరకు రాయితీ వడ్డీతో ₹50 లక్షల వరకు రుణాలు, EMI కాలిక్యులేటర్ మరియు సమీప బ్యాంక్ శాఖలను కనుగొనే సదుపాయం.",
    "btn_launch_ai": "AI పథక శోధన ప్రారంభించండి →",
    "btn_open_calc": "ఆర్థిక కాలిక్యులేటర్ తెరవండి",
    "btn_locate_partners": "బ్యాంక్ శాఖలను కనుగొనండి",
    "stat_rates_lbl": "రాయితీ వడ్డీ రేట్లు",
    "stat_funding_lbl": "ప్రాజెక్ట్ వ్యయ నిధులు",
    "stat_accuracy_lbl": "ML మోడల్ ఖచ్చితత్వం",
    "stat_partners_lbl": "ధృవీకరించబడిన బ్యాంక్ శాఖలు",
    "how_title": "ఇది ఎలా పనిచేస్తుంది",
    "how_desc": "వ్యాపార ఆలోచన నుండి రుణ పంపిణీ వరకు 3-దశల సులభమైన ప్రక్రియ.",
    "step1_num": "దశ 01",
    "step1_title": "వివరాలను నమోదు చేయండి",
    "step1_desc": "మీ ఆదాయం, కుల వర్గం మరియు వ్యాపార ఆలోచనను సరళమైన భాషలో తెలపండి.",
    "step2_num": "దశ 02",
    "step2_title": "AI సరిపోలిక మరియు స్కోరింగ్",
    "step2_desc": "మా ఇంజిన్ ప్రభుత్వ మార్గదర్శకాలు మరియు రుణ ఆమోద సంభావ్యతను లెక్కిస్తుంది.",
    "step3_num": "దశ 03",
    "step3_title": "అర్హత గల బ్యాంక్‌ను ఎంచుకోండి",
    "step3_desc": "తక్కువ NPA (<5%) ఉన్న సమీప అధికారిక బ్యాంక్ శాఖను ఎంచుకోండి.",
    "modules_title": "ప్లాట్‌ఫామ్ సేవా విభాగాలు",
    "modules_desc": "ప్రతి ప్రత్యేక సాధనాన్ని దాని ప్రత్యేక పేజీలో ఉపయోగించండి:",
    "m1_tag": "ప్రధాన ఇంజిన్",
    "m1_title": "స్మార్ట్ పథక సిఫార్సు విజార్డ్",
    "m1_desc": "రూల్ ఫిల్టర్ + NLP అర్థ విశ్లేషణ + రాండమ్ ఫారెస్ట్ రుణ ఆమోద సంభావ్యత.",
    "m1_btn": "పథక విజార్డ్ తెరవండి →",
    "m2_tag": "ఆర్థిక సాధనం",
    "m2_title": "EMI మరియు మారటోరియం కాలిక్యులేటర్",
    "m2_desc": "NSFDC రాయితీ రేట్లు (4%-8%) మరియు వాణిజ్య బ్యాంకులపై ఆదా అయ్యే వడ్డీని లెక్కించండి.",
    "m2_btn": "EMI కాలిక్యులేటర్ తెరవండి →",
    "m3_tag": "భౌగోళిక సేవ",
    "m3_title": "ఛానెల్ భాగస్వామ్య బ్యాంకుల మ్యాప్",
    "m3_desc": "తక్కువ NPA ఉన్న సమీప కార్పొరేషన్ మరియు బ్యాంక్ శాఖల మ్యాప్.",
    "m3_btn": "మ్యాప్ చూడండి →",
    "schemes_dir_title": "అధికారిక MoSJE & NSFDC రాయితీ రుణ పథకాలు",
    "schemes_dir_desc": "రంగాల వారీగా రాయితీ వడ్డీ రేట్లు మరియు గరిష్ట రుణ పరిమితులను చూడండి",
    "btn_match_profile": "నా అర్హతను సరిపోల్చండి →",
    "tab_all": "అన్ని రంగాలు",
    "tab_micro": "మైక్రో ఫైనాన్స్ (≤ ₹1.4 లక్షలు)",
    "tab_term": "టర్మ్ రుణాలు & చిన్న వ్యాపారాలు",
    "tab_green": "గ్రీన్ ఎనర్జీ & ఈ-రిక్షా",
    "tab_edu": "ఉన్నత విద్య రుణాలు",
    "tab_sanitation": "పారిశుద్ధ్య పరికరాలు",
    "rec_badge": "హైబ్రిడ్ AI ఇంజిన్ • నిబంధనలు + NLP అర్థశాస్త్రం + పర్యవేక్షిత ML",
    "rec_title": "స్మార్ట్ పథక సిఫార్సు & రుణ మూల్యాంకనం",
    "rec_desc": "ఆదాయ మరియు వర్గ అర్హత పరిశీలన, NLP ప్రాజెక్ట్ గుర్తింపు మరియు రుణ ఆమోద అంచనా.",
    "presets_label": "ముందుగా రూపొందించిన ప్రొఫైల్స్:",
    "preset_women": "మహిళా బొటిక్ (₹1.2L • MSY)",
    "preset_erickshaw": "ఎలక్ట్రిక్ ఈ-రిక్షా (₹2.8L • GBS)",
    "preset_btech": "బి.టెక్ ఇంజనీరింగ్ (₹14L • ELS)",
    "preset_sanitation": "పారిశుద్ధ్య పరికరాలు (₹16L • SUY)",
    "sec1_heading": "1. దరఖాస్తుదారు వివరాలు",
    "lbl_caste": "లక్షిత కమ్యూనిటీ వర్గం",
    "opt_sc": "షెడ్యూల్డ్ కులం (SC)",
    "opt_safai": "సఫాయి కర్మచారి కుటుంబం",
    "opt_st": "షెడ్యూల్డ్ తెగ (ST)",
    "opt_obc": "ఇతర వెనుకబడిన తరగతులు (OBC)",
    "opt_gen": "జనరల్ కేటగిరీ",
    "caste_help": "NSFDC రుణాల్లో ఎస్సీ మరియు పారిశుద్ధ్య కుటుంబాలకు ప్రాధాన్యత ఉంటుంది.",
    "lbl_income": "వార్షిక కుటుంబ ఆదాయం (₹)",
    "income_help": "ప్రభుత్వ పరిమితి: ₹3,00,000/సంవత్సరం (కొన్ని రుణాలకు ₹5,00,000 వరకు).",
    "lbl_gender": "లింగం",
    "opt_female": "మహిళ (అదనపు వడ్డీ రాయితీ)",
    "opt_male": "పురుషుడు",
    "opt_other": "ఇతర",
    "lbl_age": "దరఖాస్తుదారు వయస్సు",
    "lbl_edu": "విద్యార్హత",
    "opt_no_edu": "విద్యార్హత లేదు",
    "opt_primary": "ప్రాథమిక పాఠశాల",
    "opt_secondary": "10వ తరగతి ఉత్తీర్ణత",
    "opt_higher_sec": "12వ తరగతి ఉత్తీర్ణత",
    "opt_graduate": "డిగ్రీ / డిప్లొమా",
    "opt_post_graduate": "పోస్ట్ గ్రాడ్యుయేట్ / ప్రొఫెషనల్",
    "sec2_heading": "2. ప్రాజెక్ట్ మరియు ఆర్థిక వివరాలు",
    "lbl_sector": "వ్యాపార రంగం",
    "opt_sector_micro": "మైక్రో ఫైనాన్స్ / చిరు వ్యాపారం (₹1.40 లక్షల వరకు)",
    "opt_sector_term": "చిన్న పరిశ్రమ / టర్మ్ లోన్ (₹50 లక్షల వరకు)",
    "opt_sector_edu": "ఉన్నత సాంకేతిక / వృత్తి విద్యా కోర్సులు",
    "opt_sector_green": "గ్రీన్ ఎనర్జీ & ఈ-రిక్షా (సోలార్ పవర్)",
    "opt_sector_sanitation": "మెకనైజ్డ్ పారిశుద్ధ్య పరికరాలు",
    "lbl_cost": "అంచనా ప్రాజెక్ట్ ఖర్చు (₹)",
    "cost_help": "NSFDC 90% నుండి 95% వరకు ప్రాజెక్ట్ వ్యయానికి రాయితీ రుణాన్ని అందిస్తుంది.",
    "lbl_margin": "స్వంత పెట్టుబడి / మార్జిన్ మనీ (₹)",
    "margin_help": "స్వంత వాటా (0% నుండి 10% వరకు).",
    "chk_training": "నైపుణ్య ధృవీకరణ పత్రం (PMKVY / ITI) కలిగి ఉన్నారు",
    "chk_credit": "ఎలాంటి రుణ ఎగవేత చరిత్ర లేదు",
    "sec3_heading": "3. వ్యాపార ఆలోచన (NLP విశ్లేషణ)",
    "lbl_desc": "మీ వ్యాపార ఆలోచనను సరళమైన భాషలో వివరించండి",
    "ph_desc": "తెలుగు లేదా ఇంగ్లీషులో వ్రాయండి...",
    "desc_help": "మా NLP మోడల్ మీ వివరణను అధికారిక పథకాలతో ఖచ్చితంగా పోలుస్తుంది.",
    "quick_kw_label": "కీవర్డ్ ఎంచుకోండి:",
    "btn_run_ai": "AI పథక సరిపోలికను ప్రారంభించండి",
    "btn_running_ai": "విశ్లేషిస్తోంది...",
    "rec_results_title": "సిఫార్సు చేయబడిన పథకాలు",
    "rec_results_desc": "అర్హత మరియు ఆమోద సంభావ్యత ఆధారంగా క్రమబద్ధీకరించబడింది.",
    "badge_awaiting": "మూల్యాంకనం కోసం వేచి ఉంది",
    "rec_empty_prompt": "వివరాలను పూరించి \"AI పథక సరిపోలికను ప్రారంభించండి\" క్లిక్ చేయండి.",
    "card_match": "సరిపోలిక:",
    "card_approval": "ఆమోద సంభావ్యత:",
    "card_rate": "రాయితీ వడ్డీ రేటు",
    "card_funding": "అర్హత గల రుణ సహాయం",
    "card_moratorium": "మారటోరియం",
    "card_tenure": "రుణ కాలపరిమితి",
    "card_max_loan": "గరిష్ట రుణ పరిమితి",
    "card_view_checklist": "అర్హత & అవసరమైన పత్రాలు",
    "card_req_docs": "కావలసిన పత్రాలు:",
    "card_impl_agency": "అమలు సంస్థ:",
    "btn_why_this": "ఈ పథకం ఎందుకు?",
    "btn_calc_emi": "EMI లెక్కించండి →",
    "btn_partner_map": "బ్యాంక్ మ్యాప్ →",
    "btn_apply_checklist": "దరఖాస్తు చెక్‌లిస్ట్",
    "btn_register_online": "పథకం కోసం నేరుగా ఆన్‌లైన్‌లో నమోదు చేసుకోండి →",
    "top_match_tag": "ఉత్తమ సరిపోలిక",
    "calc_badge": "రుణ పరిశోధన & రాయితీ విశ్లేషణ",
    "calc_title": "రాయితీ ఆర్థిక & EMI కాలిక్యులేటర్",
    "calc_desc": "NSFDC మార్గదర్శకాల ప్రకారం నెలవారీ EMI మరియు వడ్డీ ఆదాను లెక్కించండి.",
    "benchmarks_label": "పథక వడ్డీ రేట్లు:",
    "calc_params_heading": "రుణ వివరాలు",
    "lbl_calc_loan": "కావలసిన రుణ మొత్తం",
    "lbl_calc_rate": "రాయితీ వడ్డీ రేటు (% వార్షికం)",
    "lbl_calc_tenure": "తిరిగి చెల్లించే కాలం",
    "lbl_calc_moratorium": "మారటోరియం (గ్రేస్ పీరియడ్)",
    "moratorium_note": "వ్యాపారం స్థిరపడే వరకు వాయిదాలు ప్రారంభం కావు.",
    "proj_monthly_emi": "నెలవారీ EMI",
    "quarterly_eq": "త్రైమాసిక వాయిదా:",
    "concessional_saved": "ఆదా అయ్యే మొత్తం వడ్డీ",
    "vs_bank_rate": "సాధారణ బ్యాంక్ రేటు (12.0%) తో పోలిస్తే",
    "stat_lbl_principal": "అసలు మొత్తం:",
    "stat_lbl_interest": "మొత్తం రాయితీ వడ్డీ:",
    "stat_lbl_payable": "మొత్తం చెల్లించాల్సినది:",
    "stat_lbl_moratorium": "మారటోరియం కాలం:",
    "stat_lbl_comm_emi": "సాధారణ బ్యాంక్ EMI:",
    "btn_match_loan": "ఈ రుణానికి పథకాన్ని చూడండి →",
    "btn_find_branch": "బ్యాంక్ శాఖను కనుగొనండి",
    "amort_title": "వార్షిక రుణ విమోచన షెడ్యూల్",
    "th_year": "సంవత్సరం",
    "th_principal": "చెల్లించిన అసలు (₹)",
    "th_interest": "చెల్లించిన వడ్డీ (₹)",
    "th_total": "వార్షిక మొత్తం చెల్లింపు (₹)",
    "th_closing": "మిగిలిన బ్యాలెన్స్ (₹)",
    "settled_label": "పూర్తయింది",
    "loc_badge": "బ్యాంక్ శాఖ లొకేటర్",
    "loc_title": "ఛానెల్ భాగస్వామ్య బ్యాంక్ లొకేటర్",
    "loc_desc": "తక్కువ NPA (<5%) ఉన్న అధికారిక బ్యాంక్ శాఖలను గుర్తించండి.",
    "lbl_filter_category": "పథక విభాగం",
    "lbl_filter_state": "రాష్ట్రం ఎంచుకోండి",
    "chk_filter_npa": "అధిక NPA ఉన్న బ్యాంకులను తొలగించండి",
    "chk_filter_funds": "నిధులు ముగిసిన శాఖలను తొలగించండి",
    "btn_use_gps": "ప్రస్తుత లొకేషన్ ఉపయోగించండి",
    "loc_auth_partners": "అధికారిక భాగస్వాములు",
    "loc_verified_tag": "తక్కువ NPA ధృవీకరించబడింది",
    "loc_loading": "బ్యాంకులు లోడ్ అవుతున్నాయి...",
    "loc_no_partners": "ఎలాంటి శాఖలు లభించలేదు.",
    "loc_km_away": "కి.మీ దూరంలో",
    "btn_nav_gmaps": "గూగుల్ మ్యాప్స్ మార్గం →",
    "loc_npa_ratio": "NPA నిష్పత్తి:",
    "loc_fund_util": "నిధుల వినియోగం:",
    "xai_modal_title": "పథకం AI విశ్లేషణ",
    "xai_annual_saved": "వార్షిక వడ్డీ ఆదా",
    "xai_lifetime_saved": "మొత్తం కాలవ్యవధి ఆదా",
    "xai_vs_bank": "12.0% సాధారణ బ్యాంక్ రేటుతో పోలిస్తే",
    "xai_tenure_over": "మొత్తం కాలపరిమితిలో",
    "xai_rationale_heading": "ఎంపిక కారణాలు:",
    "xai_drivers_heading": "ఆమోదానికి ప్రధాన అంశాలు:",
    "xai_positive_factors": "సానుకూల అంశాలు:",
    "xai_recommendations": "సూచనలు:",
    "app_gov_title": "భారత ప్రభుత్వం • సామాజిక న్యాయ మంత్రిత్వ శాఖ & NSFDC",
    "app_doc_summary": "రాయితీ రుణ దరఖాస్తు సారాంశం",
    "app_th_doc": "కావలసిన పత్రం",
    "app_th_authority": "జారీ చేయు అధికారి",
    "app_th_status": "స్థితి",
    "app_status_required": "తప్పనిసరి",
    "app_submission_lbl": "సమర్పణ సూచనలు:",
    "btn_print_checklist": "ప్రింట్ / పిడిఎఫ్ సేవ్ చేయండి",
    "footer_title": "స్కీమ్ సాథి • SIH 26092",
    "footer_desc": "బలహీన వర్గాల వ్యవస్థాపకుల కోసం AI ఆధారిత రుణ పథక వేదిక",
    "footer_guidelines": "NSFDC మరియు సామాజిక న్యాయ మంత్రిత్వ శాఖ మార్గదర్శకాలు.",
    "chat_launcher_label": "పథక సలహా కేంద్రం",
    "chat_title": "పథక సలహా కేంద్రం",
    "chat_subtitle": "అధికారిక MoSJE & NSFDC సలహా",
    "chat_placeholder": "పథకాలు, అర్హత, పత్రాల గురించి అడగండి...",
    "chat_welcome": "పథక సలహా కేంద్రానికి స్వాగతం. రుణాలు, అర్హతలు లేదా అవసరమైన పత్రాల గురించి అడగండి.",
    "auth_btn_login_signup": "లాగిన్ / రిజిస్ట్రేషన్",
    "auth_modal_title": "లబ్ధిదారుల పోర్టల్ లాగిన్",
    "auth_tab_login": "లబ్ధిదారుల లాగిన్",
    "auth_tab_signup": "కొత్త రిజిస్ట్రేషన్ (సైన్ అప్)",
    "auth_lbl_mobile": "10-అంకెల మొబైల్ నంబర్",
    "auth_lbl_password": "పాస్‌వర్డ్ (కనీసం 6 అక్షరాలు)",
    "auth_lbl_fullname": "పూర్తి పేరు",
    "auth_lbl_caste": "సామాజిక వర్గం",
    "auth_lbl_income": "వార్షిక కుటుంబ ఆదాయం (₹)",
    "auth_lbl_state": "రాష్ట్రం & జిల్లా",
    "auth_lbl_aadhaar": "ఆధార్ (చివరి 4 అంకెలు)",
    "auth_lbl_gender": "లింగం",
    "auth_btn_login": "ఖాతాలోకి ప్రవేశించండి →",
    "auth_btn_signup": "ఖాతాను సృష్టించి లాగిన్ అవ్వండి →",
    "auth_btn_logout": "లాగ్ అవుట్",
    "auth_btn_my_apps": "నా దరఖాస్తులు",
    "auth_prompt_to_register": "పథకానికి దరఖాస్తు చేయడానికి దయచేసి లాగిన్ అవ్వండి లేదా ఖాతాను తెరవండి.",
    "auth_prompt_to_recommend": "AI పథక సరిపోలిక ఇంజిన్‌ను అమలు చేయడానికి దయచేసి ముందుగా లాగిన్ అవ్వండి లేదా ఖాతాను సృష్టించండి.",
    "auth_tab_aadhaar": "ఆధార్ కార్డు (OTP) ద్వారా లాగిన్",
    "auth_tab_password": "పాస్‌వర్డ్ లాగిన్",
    "auth_lbl_aadhaar_12": "12-అంకెల ఆధార్ కార్డు సంఖ్య",
    "auth_btn_send_otp": "నమోదిత మొబైల్‌కు OTP పొందండి →",
    "auth_btn_verify_otp": "OTP ని ధృవీకరించి లాగిన్ అవ్వండి →",
    "auth_lbl_enter_otp": "6-అంకెల SMS OTP ని నమోదు చేయండి",
    "auth_aadhaar_help": "నమోదిత మొబైల్‌లో OTP ని పొందడానికి 12 అంకెల ఆధార్‌ను నమోదు చేయండి.",
    "auth_demo_otp_note": "UIDAI సిమ్యులేషన్: డెమో OTP",
    "auth_resend_otp": "మళ్లీ OTP పంపండి",
    "auth_change_aadhaar": "ఆధార్ సంఖ్యను మార్చండి"
  },
  "bn": {
    "nav_overview": "সামগ্রিক দৃশ্য",
    "nav_recommender": "এআই প্রকল্প সুপারিশ",
    "nav_calculator": "ইএমআই ক্যালকুলেটর",
    "nav_locator": "চ্যানেল পার্টনার",
    "nav_login": "লগইন",
    "nav_signup": "নিবন্ধন",
    "nav_auth": "লগইন / নিবন্ধন",
    "nav_my_apps": "আমার আবেদনপত্র",
    "nav_logout": "লগ আউট",
    "gov_ribbon_text": "সামাজিক ন্যায়বিচার ও ক্ষমতায়ন মন্ত্রক (MoSJE) • জাতীয় তফসিলি জাতি অর্থ ও উন্নয়ন নিগম",
    "sih_tag": "স্মার্ট ইন্ডিয়া হ্যাকাথন • সমস্যা বিবরণ: ",
    "portal_subtitle": "এআই চ্যানেল ফিনান্স সুপারিশ ও রেয়াতি ঋণ সহায়তা পোর্টাল",
    "theme_dark": "🌙 ডার্ক",
    "theme_light": "☀️ লাইট",
    "hero_badge": "স্মার্ট অটোমেশন প্ল্যাটফর্ম • সামাজিক ন্যায়বিচার বিভাগ",
    "hero_h2_1": "অনগ্রসর ও তফসিলি জাতি উদ্যোক্তাদের জন্য ",
    "hero_h2_highlight": "এআই-চালিত রেয়াতি প্রকল্প মিলকরণ",
    "hero_desc": "তফসিলি জাতি (SC) উদ্যোক্তা ও শিক্ষার্থীদের জন্য ৪.০% থেকে ৮.০% রেয়াতি সুদে ₹৫০ লক্ষ পর্যন্ত ঋণ, ইএমআই ক্যালকুলেটর ও নিকটবর্তী অনুমোদিত ব্যাংক শাখা খোঁজার ডিজিটাল সুবিধা।",
    "btn_launch_ai": "এআই সুপারিশ উইজার্ড খুলুন →",
    "btn_open_calc": "আর্থিক ক্যালকুলেটর খুলুন",
    "btn_locate_partners": "চ্যানেল পার্টনার ব্যাংক খুঁজুন",
    "stat_rates_lbl": "রেয়াতি সুদের হার",
    "stat_funding_lbl": "প্রকল্প ব্যয় অর্থায়ন",
    "stat_accuracy_lbl": "এমএল মডেলের নির্ভুলতা",
    "stat_partners_lbl": "অনুমোদিত ব্যাংক ও নিগম শাখা",
    "how_title": "এটি কীভাবে কাজ করে",
    "how_desc": "ব্যবসায়িক পরিকল্পনা থেকে ঋণ বিতরণ পর্যন্ত ৩-ধাপের সহজ প্রক্রিয়া।",
    "step1_num": "ধাপ ০১",
    "step1_title": "বিবরণ ও ব্যবসায়িক ধারণা দিন",
    "step1_desc": "পারিবারিক আয়, জাতিগত শ্রেণী এবং ব্যবসায়িক ভাবনা সহজ ভাষায় লিখুন।",
    "step2_num": "ধাপ ০২",
    "step2_title": "এআই প্রকল্প মিলকরণ ও স্কোরিং",
    "step2_desc": "আমাদের ইঞ্জিন সরকারি নির্দেশিকা ও ঋণ অনুমোদনের সম্ভাবনা বিশ্লেষণ করে।",
    "step3_num": "ধাপ ০৩",
    "step3_title": "নিকটস্থ অনুমোদিত ব্যাংকে যোগাযোগ করুন",
    "step3_desc": "স্বল্প এনপিএ (<৫%) ও পর্যাপ্ত তহবিলযুক্ত নিকটবর্তী ব্যাংক বেছে নিন।",
    "modules_title": "প্ল্যাটফর্মের সেবাসমূহ",
    "modules_desc": "প্রতিটি বিশেষ সুবিধার জন্য নির্দিষ্ট পেজ ব্যবহার করুন:",
    "m1_tag": "মূল ইঞ্জিন",
    "m1_title": "স্মার্ট প্রকল্প সুপারিশ উইজার্ড",
    "m1_desc": "নিয়ম ফিল্টার + এনএলপি মিলকরণ + র‍্যান্ডম ফরেস্ট ঋণ অনুমোদন বিশ্লেষণ।",
    "m1_btn": "সুপারিশ উইজার্ড খুলুন →",
    "m2_tag": "আর্থিক সরঞ্জাম",
    "m2_title": "ইএমআই ও মোরেটোরিয়াম ক্যালকুলেটর",
    "m2_desc": "NSFDC রেয়াতি হার (৪%-৮%) ও বাণিজ্যিক ব্যাংকের তুলনায় সঞ্চয় হিসাব করুন।",
    "m2_btn": "ইএমআই ক্যালকুলেটর খুলুন →",
    "m3_tag": "ভূ-স্থানিক সেবা",
    "m3_title": "চ্যানেল পার্টনার ব্যাংক ম্যাপ",
    "m3_desc": "স্বল্প এনপিএ (<৫%) যুক্ত অনুমোদিত ব্যাংক ও নিগমের ইন্টারেক্টিভ মানচিত্র।",
    "m3_btn": "পার্টনার ম্যাপ দেখুন →",
    "schemes_dir_title": "সরকারি MoSJE ও NSFDC রেয়াতি ঋণ প্রকল্প",
    "schemes_dir_desc": "বিভিন্ন খাতের রেয়াতি সুদের হার ও সর্বোচ্চ ঋণসীমা দেখুন",
    "btn_match_profile": "আমার যোগ্যতা যাচাই করুন →",
    "tab_all": "সকল বিভাগ",
    "tab_micro": "ক্ষুদ্র ঋণ (≤ ₹১.৪ লক্ষ)",
    "tab_term": "মেয়াদী ঋণ ও ক্ষুদ্র উদ্যোগ",
    "tab_green": "সবুজ শক্তি ও ই-রিকশা",
    "tab_edu": "উচ্চশিক্ষা ঋণ",
    "tab_sanitation": "পরিচ্ছন্নতা যন্ত্রপাতি",
    "rec_badge": "হাইব্রিড এআই ইঞ্জিন • সরকারি নিয়ম + এনএলপি + এমএল বিশ্লেষণ",
    "rec_title": "স্মার্ট প্রকল্প সুপারিশ ও ঋণ মূল্যায়ন",
    "rec_desc": "সরকারি যোগ্যতা পরীক্ষা, এনএলপি দ্বারা প্রয়োজন শনাক্তকরণ এবং ঋণ অনুমোদনের সম্ভাবনা গণনা।",
    "presets_label": "প্রস্তুত প্রোফাইলসমূহ:",
    "preset_women": "মহিলা বুটিক (₹১.২L • MSY)",
    "preset_erickshaw": "ব্যাটারি ই-রিকশা (₹২.৮L • GBS)",
    "preset_btech": "বি.টেক ইঞ্জিনিয়ারিং (₹১৪L • ELS)",
    "preset_sanitation": "পরিচ্ছন্নতা সরঞ্জাম (₹১৬L • SUY)",
    "sec1_heading": "১. আবেদনকারীর জনমিতিক তথ্য",
    "lbl_caste": "সম্প্রদায় শ্রেণী",
    "opt_sc": "তফসিলি জাতি (SC)",
    "opt_safai": "পরিচ্ছন্নতা কর্মী পরিবার",
    "opt_st": "তফসিলি উপজাতি (ST)",
    "opt_obc": "অন্যান্য অনগ্রসর শ্রেণী (OBC)",
    "opt_gen": "সাধারণ শ্রেণী",
    "caste_help": "NSFDC ঋণে এসসি ও পরিচ্ছন্নতা কর্মীদের অগ্রাধিকার দেওয়া হয়।",
    "lbl_income": "বার্ষিক পারিবারিক আয় (₹)",
    "income_help": "সরকারি সীমা: ₹৩,০০,০০০/বছর (কিছু ঋণে ₹৫,০০,০০০ পর্যন্ত)।",
    "lbl_gender": "লিঙ্গ",
    "opt_female": "মহিলা (অতিরিক্ত সুদ ছাড়)",
    "opt_male": "পুরুষ",
    "opt_other": "অন্যান্য",
    "lbl_age": "আবেদনকারীর বয়স",
    "lbl_edu": "শিক্ষাগত যোগ্যতা",
    "opt_no_edu": "প্রাতিষ্ঠানিক শিক্ষা নেই",
    "opt_primary": "প্রাথমিক বিদ্যালয়",
    "opt_secondary": "দশম শ্রেণী উত্তীর্ণ",
    "opt_higher_sec": "দ্বাদশ শ্রেণী উত্তীর্ণ",
    "opt_graduate": "স্নাতক / ডিপ্লোমা",
    "opt_post_graduate": "স্নাতকোত্তর / পেশাদার",
    "sec2_heading": "২. প্রকল্প ও আর্থিক তথ্য",
    "lbl_sector": "ব্যবসায়িক ক্ষেত্র",
    "opt_sector_micro": "ক্ষুদ্র ব্যবসা (₹১.৪০ লক্ষ পর্যন্ত)",
    "opt_sector_term": "ছোট কারখানা / মেয়াদী ঋণ (₹৫০ লক্ষ পর্যন্ত)",
    "opt_sector_edu": "উচ্চ কারিগরি / পেশাগত শিক্ষা",
    "opt_sector_green": "সবুজ শক্তি ও ই-রিকশা (সৌরবিদ্যুৎ)",
    "opt_sector_sanitation": "পরিচ্ছন্নতা ও ড্রেন পরিষ্কার যন্ত্রপাতি",
    "lbl_cost": "আনুমানিক প্রকল্প ব্যয় (₹)",
    "cost_help": "NSFDC ৯০% থেকে ৯৫% পর্যন্ত রেয়াতি সুদে ঋণ প্রদান করে।",
    "lbl_margin": "নিজের বিনিয়োগ / মার্জিন মানি (₹)",
    "margin_help": "নিজের অংশ (প্রকল্পভেদে ০% থেকে ১০%)।",
    "chk_training": "দক্ষতা শংসাপত্র (PMKVY / ITI) আছে",
    "chk_credit": "কোনো বকেয়া ঋণের সমস্যা নেই",
    "sec3_heading": "৩. ব্যবসায়িক পরিকল্পনা (এনএলপি বিশ্লেষণ)",
    "lbl_desc": "আপনার ব্যবসায়িক ধারণা সহজ ভাষায় বর্ণনা করুন",
    "ph_desc": "বাংলা বা ইংরেজিতে লিখুন...",
    "desc_help": "আমাদের এনএলপি মডেল আপনার পরিকল্পনাটি সরকারি প্রকল্পের সাথে নির্ভুলভাবে মেলায়।",
    "quick_kw_label": "দ্রুত কীওয়ার্ড বাছুন:",
    "btn_run_ai": "এআই প্রকল্প ম্যাচিং শুরু করুন",
    "btn_running_ai": "বিশ্লেষণ করা হচ্ছে...",
    "rec_results_title": "সুপারিশকৃত প্রকল্প ও ঋণের বিকল্প",
    "rec_results_desc": "যোগ্যতা এবং অনুমোদনের সম্ভাবনার ভিত্তিতে সাজানো।",
    "badge_awaiting": "মূল্যায়নের অপেক্ষায়",
    "rec_empty_prompt": "উপরের ফর্মটি পূরণ করে \"এআই প্রকল্প ম্যাচিং শুরু করুন\" বোতামে চাপ দিন।",
    "card_match": "ম্যাচ:",
    "card_approval": "অনুমোদনের সম্ভাবনা:",
    "card_rate": "রেয়াতি সুদের হার",
    "card_funding": "যোগ্য ঋণ সহায়তা",
    "card_moratorium": "মোরেটোরিয়াম",
    "card_tenure": "ঋণের মেয়াদ",
    "card_max_loan": "সর্বোচ্চ ঋণের সীমা",
    "card_view_checklist": "নথিপত্র ও নিয়মাবলী দেখুন",
    "card_req_docs": "প্রয়োজনীয় নথিপত্র:",
    "card_impl_agency": "বাস্তবায়নকারী সংস্থা:",
    "btn_why_this": "এই প্রকল্পটি কেন?",
    "btn_calc_emi": "ইএমআই হিসাব করুন →",
    "btn_partner_map": "পার্টনার ম্যাপ →",
    "btn_apply_checklist": "আবেদন চেকলিস্ট",
    "btn_register_online": "প্রকল্পের জন্য সরাসরি অনলাইন নিবন্ধন করুন →",
    "top_match_tag": "শীর্ষ ম্যাচ",
    "calc_badge": "ঋণ কিস্তি ও ভর্তুকি বিশ্লেষণ",
    "calc_title": "রেয়াতি আর্থিক ও মোরেটোরিয়াম ক্যালকুলেটর",
    "calc_desc": "NSFDC নির্দেশিকা অনুযায়ী মাসিক কিস্তি এবং বাণিজ্যিক ব্যাংকের তুলনায় সঞ্চয় হিসাব করুন।",
    "benchmarks_label": "প্রকল্পের সুদের হার:",
    "calc_params_heading": "ঋণ ও কিস্তির বিবরণ",
    "lbl_calc_loan": "প্রয়োজনীয় ঋণের পরিমাণ",
    "lbl_calc_rate": "রেয়াতি সুদের হার (% বার্ষিক)",
    "lbl_calc_tenure": "পরিশোধের মেয়াদ",
    "lbl_calc_moratorium": "মোরেটোরিয়াম (ছাড়ের মেয়াদ)",
    "moratorium_note": "ব্যবসা চালু না হওয়া পর্যন্ত কিস্তি দেওয়া স্থগিত থাকে।",
    "proj_monthly_emi": "মাসিক ইএমআই",
    "quarterly_eq": "ত্রৈমাসিক কিস্তি:",
    "concessional_saved": "মোট রেয়াতি সুদ সঞ্চয়",
    "vs_bank_rate": "বাণিজ্যিক ব্যাংক হারের (১২%) তুলনায়",
    "stat_lbl_principal": "আসল পরিমাণ:",
    "stat_lbl_interest": "মোট রেয়াতি সুদ:",
    "stat_lbl_payable": "মোট পরিশোধযোগ্য:",
    "stat_lbl_moratorium": "ছাড়ের মেয়াদ:",
    "stat_lbl_comm_emi": "সাধারণ ব্যাংক ইএমআই:",
    "btn_match_loan": "এই ঋণের জন্য প্রকল্প খুঁজুন →",
    "btn_find_branch": "ব্যাংক শাখা খুঁজুন",
    "amort_title": "বার্ষিক ঋণ পরিশোধের সময়সূচী",
    "th_year": "বছর",
    "th_principal": "আসল পরিশোধ (₹)",
    "th_interest": "সুদ পরিশোধ (₹)",
    "th_total": "বার্ষিক মোট কিস্তি (₹)",
    "th_closing": "অবশিষ্ট স্থিতি (₹)",
    "settled_label": "পরিশোধিত",
    "loc_badge": "ব্যাংক শাখা লকেটর",
    "loc_title": "চ্যানেল পার্টনার ও ব্যাংক লকেটর",
    "loc_desc": "স্বল্প এনপিএ (<৫%) যুক্ত অনুমোদিত সরকারি ও গ্রামীণ ব্যাংক শাখা খুঁজুন।",
    "lbl_filter_category": "প্রকল্প বিভাগ",
    "lbl_filter_state": "রাজ্য নির্বাচন করুন",
    "chk_filter_npa": "উচ্চ এনপিএ যুক্ত ব্যাংক বাদ দিন",
    "chk_filter_funds": "তহবিল শেষ হওয়া শাখা বাদ দিন",
    "btn_use_gps": "বর্তমান অবস্থান ব্যবহার করুন",
    "loc_auth_partners": "অনুমোদিত পার্টনার",
    "loc_verified_tag": "স্বল্প এনপিএ যাচাইকৃত",
    "loc_loading": "লোড হচ্ছে...",
    "loc_no_partners": "কোনো শাখা পাওয়া যায়নি।",
    "loc_km_away": "কিমি দূরে",
    "btn_nav_gmaps": "গুগল ম্যাপস নেভিগেশন →",
    "loc_npa_ratio": "এনপিএ অনুপাত:",
    "loc_fund_util": "তহবিল ব্যবহার:",
    "xai_modal_title": "প্রকল্পের এআই বিশ্লেষণ",
    "xai_annual_saved": "বার্ষিক সুদ সঞ্চয়",
    "xai_lifetime_saved": "মেয়াদে মোট সুদ সঞ্চয়",
    "xai_vs_bank": "১২.০% সাধারণ ব্যাংক হারের তুলনায়",
    "xai_tenure_over": "সমগ্র ঋণের মেয়াদে",
    "xai_rationale_heading": "যোগ্যতা নির্বাচনের কারণ:",
    "xai_drivers_heading": "অনুমোদনের মূল কারণ:",
    "xai_positive_factors": "ইতিবাচক দিকসমূহ:",
    "xai_recommendations": "পরামর্শ:",
    "app_gov_title": "ভারত সরকার • সামাজিক ন্যায়বিচার মন্ত্রক ও NSFDC",
    "app_doc_summary": "ঋণ আবেদনের সংক্ষিপ্ত বিবরণ",
    "app_th_doc": "প্রয়োজনীয় নথি",
    "app_th_authority": "প্রদানকারী কর্তৃপক্ষ",
    "app_th_status": "অবস্থা",
    "app_status_required": "বাধ্যতামূলক",
    "app_submission_lbl": "জমা দেওয়ার নির্দেশিকা:",
    "btn_print_checklist": "প্রিন্ট করুন / পিডিএফ সংরক্ষণ করুন",
    "footer_title": "স্কিম সাথি • SIH 26092",
    "footer_desc": "অনগ্রসর উদ্যোক্তাদের জন্য এআই-চালিত ঋণ সহায়তা প্ল্যাটফর্ম",
    "footer_guidelines": "NSFDC এবং সামাজিক ন্যায়বিচার মন্ত্রকের নির্দেশিকা।",
    "chat_launcher_label": "যোজনা সহায়ক ডেস্ক",
    "chat_title": "যোজনা সহায়ক ডেস্ক",
    "chat_subtitle": "অফিসিয়াল MoSJE ও NSFDC পরামর্শ",
    "chat_placeholder": "যোজনা, योग्यता, নথি সম্পর্কে জিজ্ঞাসা করুন...",
    "chat_welcome": "যোজনা সহায়ক ডেস্কে স্বাগতম। ঋণ প্রকল্প, যোগ্যতা এবং প্রয়োজনীয় নথি সম্পর্কে প্রশ্ন জিজ্ঞাসা করুন।",
    "auth_btn_login_signup": "লগইন / নিবন্ধন",
    "auth_modal_title": "সুবিধাভোগী পোর্টাল প্রমাণীকরণ",
    "auth_tab_login": "সুবিধাভোগী লগইন",
    "auth_tab_signup": "নতুন নিবন্ধন (সাইন আপ)",
    "auth_lbl_mobile": "১০-সংখ্যার মোবাইল নম্বর",
    "auth_lbl_password": "পাসওয়ার্ড (নূন্যতম ৬ অক্ষর)",
    "auth_lbl_fullname": "পুরো নাম",
    "auth_lbl_caste": "সংরক্ষিত শ্রেণি",
    "auth_lbl_income": "বার্ষিক পারিবারিক আয় (₹)",
    "auth_lbl_state": "রাজ্য ও জেলা",
    "auth_lbl_aadhaar": "আধার (শেষ ৪ সংখ্যা)",
    "auth_lbl_gender": "লিঙ্গ",
    "auth_btn_login": "অ্যাকাউন্টে প্রবেশ করুন →",
    "auth_btn_signup": "অ্যাকাউন্ট তৈরি করে লগইন করুন →",
    "auth_btn_logout": "লগ আউট",
    "auth_btn_my_apps": "আমার আবেদনপত্র",
    "auth_prompt_to_register": "প্রকল্পে আবেদন করার জন্য অনুগ্রহ করে লগইন করুন বা নিবন্ধন করুন।",
    "auth_prompt_to_recommend": "এআই প্রকল্প মিলকরণ ইঞ্জিন চালাতে অনুগ্রহ করে প্রথমে লগইন করুন অথবা একটি অ্যাকাউন্ট তৈরি করুন।",
    "auth_tab_aadhaar": "আধার কার্ড (OTP) দ্বারা লগইন",
    "auth_tab_password": "পাসওয়ার্ড লগইন",
    "auth_lbl_aadhaar_12": "১২-সংখ্যার আধার কার্ড নম্বর",
    "auth_btn_send_otp": "নিবন্ধিত মোবাইলে ওটিপি পান →",
    "auth_btn_verify_otp": "ওটিপি যাচাই করে লগইন করুন →",
    "auth_lbl_enter_otp": "৬-সংখ্যার এসএমএস ওটিপি লিখুন",
    "auth_aadhaar_help": "নিবন্ধিত মোবাইলে ওটিপি পেতে ১২ সংখ্যার আধার নম্বর লিখুন।",
    "auth_demo_otp_note": "UIDAI সিমুলেশন: ডেমো ওটিপি হলো",
    "auth_resend_otp": "পুনরায় ওটিপি পাঠান",
    "auth_change_aadhaar": "আধার নম্বর পরিবর্তন করুন"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  loadAllSchemes();
  initChatbotWidget();
  initAuth();
  initRegistrationModal();
  
  const form = document.getElementById('wizard-form');
  if (form) {
    form.addEventListener('submit', handleRecommendationSubmit);
  }
});

// ----------------------------------------------------
// Theme Management (Light Institutional / Dark Slate)
// ----------------------------------------------------
function initTheme() {
  const saved = localStorage.getItem('scheme-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeButton(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('scheme-theme', next);
  updateThemeButton(next);
  if (window.onThemeChange) {
    window.onThemeChange(next);
  }
}

function updateThemeButton(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    const t = i18n[currentLang] || i18n['en'];
    btn.innerHTML = theme === 'dark' ? (t.theme_light || '☀️ Light') : (t.theme_dark || '🌙 Dark');
  }
}

// ----------------------------------------------------
// Multilingual Management (6 Indian Languages)
// ----------------------------------------------------
function initLanguage() {
  const savedLang = localStorage.getItem('scheme-lang') || 'en';
  setLanguage(savedLang);
}

function setLanguage(lang) {
  if (!i18n[lang]) lang = 'en';
  currentLang = lang;
  localStorage.setItem('scheme-lang', lang);
  
  // Sync dropdown selector if present
  const sel = document.getElementById('lang-select');
  if (sel) sel.value = lang;

  // Translate all declared DOM elements
  applyTranslations(lang);
  renderAuthNav();

  // Sync chatbot labels if present
  if (typeof updateChatbotLanguage === 'function') {
    updateChatbotLanguage(lang);
  }

  // Re-sync theme button text
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateThemeButton(currentTheme);

  // Notify active page listeners (e.g. recalculate or re-render lists)
  if (window.onLanguageChange) {
    window.onLanguageChange(lang);
  }

  // If recommendations are displayed, re-render them with localized strings
  if (cachedRecommendations) {
    renderRecommendationResults(cachedRecommendations);
  }
}

function t(key) {
  const dict = i18n[currentLang] || i18n['en'];
  return dict[key] || (i18n['en'][key] || key);
}

function applyTranslations(lang) {
  const dict = i18n[lang] || i18n['en'];

  // Text content replacements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (dict[k]) el.innerHTML = dict[k];
  });

  // Placeholder replacements
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const k = el.getAttribute('data-i18n-ph');
    if (dict[k]) el.placeholder = dict[k];
  });

  // Value replacements for submit buttons if any
  document.querySelectorAll('[data-i18n-val]').forEach(el => {
    const k = el.getAttribute('data-i18n-val');
    if (dict[k]) el.value = dict[k];
  });
}

// ----------------------------------------------------
// Recommender Wizard Presets
// ----------------------------------------------------
function loadScenario(type) {
  const form = document.getElementById('wizard-form');
  if (!form) return;
  
  if (type === 'women_boutique') {
    form.gender.value = 'Female';
    form.caste_category.value = 'SC';
    form.annual_income.value = 180000;
    form.project_cost.value = 120000;
    form.project_category.value = 'micro_finance';
    form.project_description.value = currentLang === 'hi'
      ? 'महिलाओं के लिए आधुनिक सिलाई और कढ़ाई बुटीक की दुकान शुरू करनी है।'
      : 'Starting a women designer boutique, tailoring and embroidery shop with modern industrial stitching machines.';
  } else if (type === 'erickshaw') {
    form.gender.value = 'Male';
    form.caste_category.value = 'SC';
    form.annual_income.value = 220000;
    form.project_cost.value = 280000;
    form.project_category.value = 'green_energy';
    form.project_description.value = currentLang === 'hi'
      ? 'यात्रियों के दैनिक आवागमन के लिए बैटरी चालित ई-रिक्शा और चार्जर खरीदना है।'
      : 'Purchasing an eco-friendly electric battery rickshaw (e-rickshaw) and fast charger for local urban passenger transport.';
  } else if (type === 'btech') {
    form.gender.value = 'Female';
    form.caste_category.value = 'SC';
    form.annual_income.value = 250000;
    form.project_cost.value = 1400000;
    form.project_category.value = 'education';
    form.project_description.value = currentLang === 'hi'
      ? 'मान्यता प्राप्त संस्थान से कंप्यूटर साइंस आर्टिफिशियल इंटेलिजेंस में बी.टेक उच्च तकनीकी शिक्षा हेतु फीस।'
      : 'Higher technical education for B.Tech in Artificial Intelligence & Computer Science at an accredited institute including tuition fees and laptop.';
  } else if (type === 'sanitation') {
    form.gender.value = 'Male';
    form.caste_category.value = 'Safai Karamchari / Dependent';
    form.annual_income.value = 200000;
    form.project_cost.value = 1600000;
    form.project_category.value = 'sanitation';
    form.project_description.value = currentLang === 'hi'
      ? 'शहरी सीवर सफाई और नालों के रखरखाव हेतु आधुनिक वैक्यूম सक्शन टैंकर और जेटिंग वाहन।'
      : 'Mechanized sanitation vacuum suction tanker and sewer jetting equipment for urban civic drain maintenance.';
  }
  
  const submitBtn = document.getElementById('btn-run-ai');
  if (submitBtn) submitBtn.scrollIntoView({ behavior: 'smooth' });
}

// ----------------------------------------------------
// Recommendation Submit & Processing
// ----------------------------------------------------
async function handleRecommendationSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const form = (e && e.target && e.target.tagName === 'FORM') ? e.target : document.getElementById('wizard-form');
  if (!form) return;

  // Beneficiary Authentication Enforcement:
  // Trigger popup modal if user is not authenticated
  if (!currentUserProfile || !currentUserToken) {
    authPendingAction = 'run_matching';
    openAuthModal('login');
    showAuthNotification(t('auth_prompt_to_recommend'));
    return;
  }

  const submitBtn = document.getElementById('btn-run-ai');
  const originalText = submitBtn ? submitBtn.innerHTML : 'Run AI Scheme Matching Engine';
  
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="loading-spinner" style="margin-right: 8px;"></span>
      ${t('btn_running_ai')}
    `;
  }
  
  const payload = {
    caste_category: form.caste_category.value,
    annual_income: parseFloat(form.annual_income.value) || 150000,
    gender: form.gender.value,
    age: parseInt(form.age.value) || 30,
    education_level: form.education_level.value,
    project_category: form.project_category.value,
    project_cost: parseFloat(form.project_cost.value) || 100000,
    project_description: form.project_description.value,
    promoter_contribution_amount: form.promoter_margin && form.promoter_margin.value ? parseFloat(form.promoter_margin.value) : null,
    has_vocational_training: form.has_training && form.has_training.checked ? 1 : 0,
    has_clean_credit: form.clean_credit && form.clean_credit.checked ? 1 : 0,
    has_valid_caste_cert: 1,
    has_valid_income_cert: 1,
    user_latitude: 28.6139,
    user_longitude: 77.2090
  };

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (currentUserToken) headers['Authorization'] = `Bearer ${currentUserToken}`;

    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) throw new Error("Recommendation service error");
    const data = await res.json();
    
    cachedRecommendations = data;
    renderRecommendationResults(data);
    
    const resultsSec = document.getElementById('results-section');
    if (resultsSec) resultsSec.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    alert("Error fetching recommendations: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

// ----------------------------------------------------
// Progressive Disclosure Card Rendering with Localization
// ----------------------------------------------------
function renderRecommendationResults(data) {
  const container = document.getElementById('results-container');
  const countBadge = document.getElementById('results-count-badge');
  if (!container) return;
  container.innerHTML = '';
  
  const schemes = data.recommended_schemes || [];
  if (countBadge) countBadge.innerText = `${schemes.length} ${currentLang === 'hi' ? 'पात्र सरकारी योजनाएं उपलब्ध' : 'Eligible Government Schemes Found'}`;
  
  if (schemes.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--bg-card); border-radius: 8px; border: 1px dashed var(--border-subtle);">
        <h4 style="color: var(--text-muted); font-size: 1rem;">${currentLang === 'hi' ? 'कोई प्रत्यक्ष योजना आपके मानदंडों से मेल नहीं खाती।' : 'No direct scheme matched your strict statutory criteria.'}</h4>
        <p style="color: var(--text-dim); margin-top: 6px; font-size: 0.85rem;">${currentLang === 'hi' ? 'कृपया पारिवारिक वार्षिक आय सीमा या अन्य विवरण जांचें।' : 'Check alternative suggestions or verify family annual income ceiling.'}</p>
      </div>
    `;
    return;
  }
  
  schemes.forEach((s, idx) => {
    const isTopPick = idx === 0;
    const card = document.createElement('div');
    card.className = `scheme-card ${isTopPick ? 'top-pick' : ''}`;
    
    const docs = s.required_documents || [];
    const displayName = (currentLang !== 'en' && s.name_hi) ? s.name_hi : s.name;
    const displaySubName = (currentLang !== 'en' && s.name_hi) ? s.name : s.name_hi;
    const displayDesc = (currentLang !== 'en' && s.description_hi) ? s.description_hi : s.description_en;
    
    const cardHtml = `
      ${isTopPick ? `<div class="top-badge-ribbon">${t('top_match_tag')}</div>` : ''}
      <div>
        <span class="scheme-cat-pill">${s.category.replace('_', ' ')}</span>
        <h3 class="scheme-title">${displayName}</h3>
        <p class="scheme-title-hi">${displaySubName}</p>

        <div class="metrics-pill-row">
          <div class="pill-match">
            <span>${t('card_match')}</span>
            <strong>${s.match_score_pct}%</strong>
          </div>
          <div class="pill-approval ${s.risk_badge}">
            <span>${t('card_approval')}</span>
            <strong>${s.approval_probability_pct}%</strong>
          </div>
        </div>

        <div class="spec-grid">
          <div class="spec-cell">
            <span>${t('card_rate')}</span>
            <span class="concessional-rate">${s.interest_rate_beneficiary_pct}% p.a.</span>
          </div>
          <div class="spec-cell">
            <span>${t('card_funding')}</span>
            <span>₹${(s.calculated_eligible_loan || s.max_loan_amount).toLocaleString('en-IN')}</span>
          </div>
          <div class="spec-cell">
            <span>${t('card_moratorium')}</span>
            <span>${s.moratorium_months} ${currentLang === 'hi' ? 'माह' : 'Months'}</span>
          </div>
          <div class="spec-cell">
            <span>${t('card_tenure')}</span>
            <span>${s.max_tenure_years} ${currentLang === 'hi' ? 'वर्ष तक' : 'Years'}</span>
          </div>
        </div>

        <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px;">
          ${displayDesc}
        </p>

        <!-- Progressive Disclosure: Expandable Checklist -->
        <div class="accordion-box" style="margin-bottom: 16px;">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            <span>${t('card_view_checklist')} (${docs.length})</span>
            <span class="accordion-icon">+</span>
          </div>
          <div class="accordion-content" style="display: none;">
            <p style="font-size: 0.74rem; color: var(--text-dim); margin-bottom: 6px; text-transform: uppercase;">${t('card_req_docs')}</p>
            <ul style="padding-left: 16px; margin-bottom: 10px; font-size: 0.8rem; color: var(--text-main); line-height: 1.55;">
              ${docs.map(d => `<li>${d}</li>`).join('')}
            </ul>
            <p style="font-size: 0.74rem; color: var(--text-dim); margin-bottom: 2px; text-transform: uppercase;">${t('card_impl_agency')}</p>
            <p style="font-size: 0.8rem; color: var(--green-primary); font-weight: 600;">${s.implementing_agency}</p>
          </div>
        </div>
      </div>

      <div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
          <button class="btn-secondary" style="flex: 1; font-size: 0.78rem; padding: 7px;" onclick="openExplainerModal('${s.id}')">
            ${t('btn_why_this')}
          </button>
          <a href="/calculator?loan=${s.calculated_eligible_loan || 100000}&rate=${s.interest_rate_beneficiary_pct}&tenure=${s.max_tenure_years}&moratorium=${s.moratorium_months}" class="btn-secondary" style="flex: 1; font-size: 0.78rem; padding: 7px;">
            ${t('btn_calc_emi')}
          </a>
        </div>
        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
          <a href="/locator?category=${s.category}" class="btn-secondary" style="flex: 1; font-size: 0.78rem; padding: 7px;">
            ${t('btn_partner_map')}
          </a>
          <button class="btn-secondary" style="flex: 1; font-size: 0.78rem; padding: 7px;" onclick="openApplicationModal('${s.id}')">
            ${t('btn_apply_checklist')}
          </button>
        </div>
        <button class="btn-primary" style="width: 100%; font-size: 0.80rem; padding: 8px 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px;" onclick="openRegistrationModal('${s.id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          ${t('btn_register_online')}
        </button>
      </div>
    `;
    
    card.innerHTML = cardHtml;
    container.appendChild(card);
  });
  
  allSchemesCache = [...schemes, ...(data.alternative_or_near_matches || [])];
}

// Accordion Toggle
function toggleAccordion(header) {
  const content = header.nextElementSibling;
  const icon = header.querySelector('.accordion-icon');
  const isHidden = content.style.display === 'none';
  content.style.display = isHidden ? 'block' : 'none';
  if (icon) icon.innerText = isHidden ? '−' : '+';
}

// ----------------------------------------------------
// Explainable AI (XAI) Modal
// ----------------------------------------------------
function openExplainerModal(schemeId) {
  const scheme = allSchemesCache.find(s => s.id === schemeId);
  if (!scheme || !scheme.explanation) return;
  
  const exp = scheme.explanation;
  const modal = document.getElementById('xai-modal');
  const title = document.getElementById('modal-scheme-title');
  const body = document.getElementById('modal-xai-body');
  
  const schemeName = (currentLang !== 'en' && scheme.name_hi) ? scheme.name_hi : scheme.name;
  title.innerText = `${schemeName} • ${t('xai_modal_title')}`;
  
  body.innerHTML = `
    <div style="background: var(--green-subtle); border-left: 3px solid var(--green-primary); padding: 12px 14px; border-radius: 4px; margin-bottom: 18px;">
      <p style="font-weight: 600; color: var(--text-pure); font-size: 0.9rem;">${exp.headline_en}</p>
      <p style="font-size: 0.8rem; color: var(--green-primary); font-weight: 600; margin-top: 4px;">${exp.headline_hi}</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 18px;">
      <div style="background: var(--bg-card-subtle); border: 1px solid var(--border-dark); border-radius: 6px; padding: 12px; text-align: center;">
        <span style="font-size: 0.68rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600; letter-spacing: 0.04em;">${t('xai_annual_saved')}</span>
        <h3 style="color: var(--green-primary); font-size: 1.45rem; font-weight: 800; margin: 2px 0;">₹${exp.annual_interest_saved_inr.toLocaleString('en-IN')}</h3>
        <p style="font-size: 0.7rem; color: var(--text-muted);">${t('xai_vs_bank')}</p>
      </div>
      <div style="background: var(--bg-card-subtle); border: 1px solid var(--border-dark); border-radius: 6px; padding: 12px; text-align: center;">
        <span style="font-size: 0.68rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600; letter-spacing: 0.04em;">${t('xai_lifetime_saved')}</span>
        <h3 style="color: var(--green-primary); font-size: 1.45rem; font-weight: 800; margin: 2px 0;">₹${exp.lifetime_interest_saved_inr.toLocaleString('en-IN')}</h3>
        <p style="font-size: 0.7rem; color: var(--text-muted);">${t('xai_tenure_over')} (${scheme.max_tenure_years} ${currentLang === 'hi' ? 'वर्ष' : 'Yrs'})</p>
      </div>
    </div>

    <h4 style="font-size: 0.88rem; font-weight: 700; margin-bottom: 8px; color: var(--text-pure); text-transform: uppercase; letter-spacing: 0.03em;">${t('xai_rationale_heading')}</h4>
    <ul style="padding-left: 18px; font-size: 0.85rem; color: var(--text-main); line-height: 1.55; margin-bottom: 16px;">
      ${exp.justification_points_en.map(p => `<li>${p}</li>`).join('')}
    </ul>

    <h4 style="font-size: 0.88rem; font-weight: 700; margin-bottom: 8px; color: var(--text-pure); text-transform: uppercase; letter-spacing: 0.03em;">${t('xai_drivers_heading')}</h4>
    <div style="font-size: 0.82rem; background: var(--bg-card-subtle); border-radius: 6px; padding: 12px; border: 1px solid var(--border-dark);">
      <p style="color: var(--green-primary); font-weight: 600; margin-bottom: 4px;">${t('xai_positive_factors')}</p>
      <ul style="padding-left: 18px; margin-bottom: 10px; color: var(--text-main);">
        ${(scheme.positive_factors || []).map(f => `<li>${f}</li>`).join('')}
      </ul>
      <p style="color: var(--accent-amber); font-weight: 600; margin-bottom: 4px;">${t('xai_recommendations')}</p>
      <ul style="padding-left: 18px; color: var(--text-main);">
        ${(scheme.improvements || ['Ensure all statutory documents are up to date.']).map(i => `<li>${i}</li>`).join('')}
      </ul>
    </div>
  `;
  
  modal.style.display = 'flex';
}

function closeModal() {
  const xai = document.getElementById('xai-modal');
  if (xai) xai.style.display = 'none';
  const app = document.getElementById('app-modal');
  if (app) app.style.display = 'none';
}

// ----------------------------------------------------
// Application Checklist & PDF Summary Modal
// ----------------------------------------------------
async function openApplicationModal(schemeId) {
  const scheme = allSchemesCache.find(s => s.id === schemeId);
  const form = document.getElementById('wizard-form');
  
  const payload = {
    applicant_name: "Beneficiary Applicant",
    phone_number: "9876543210",
    state: "Delhi",
    district: "Central Delhi",
    scheme_id: schemeId,
    profile: {
      caste_category: form ? form.caste_category.value : "SC",
      annual_income: form ? parseFloat(form.annual_income.value) || 180000 : 180000,
      gender: form ? form.gender.value : "Female",
      age: form ? parseInt(form.age.value) || 30 : 30,
      education_level: form ? form.education_level.value : "Secondary (10th)",
      project_category: scheme ? scheme.category : "micro_finance",
      project_cost: form ? parseFloat(form.project_cost.value) || 100000 : 100000,
      project_description: form ? form.project_description.value || "New business venture" : "Business venture"
    }
  };

  try {
    const res = await fetch('/api/generate-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    const app = result.application;
    
    const modal = document.getElementById('app-modal');
    const body = document.getElementById('modal-app-body');
    
    const displayName = (currentLang !== 'en' && scheme && scheme.name_hi) ? scheme.name_hi : app.scheme_name;
    
    body.innerHTML = `
      <div id="printable-app-area" style="border: 1px solid var(--border-dark); border-radius: 6px; padding: 24px; background: var(--bg-card); color: var(--text-pure);">
        <div style="text-align: center; border-bottom: 1px solid var(--border-dark); padding-bottom: 14px; margin-bottom: 16px;">
          <h3 style="color: var(--green-primary); font-size: 1.15rem; font-weight: 800; letter-spacing: -0.2px;">${t('app_gov_title')}</h3>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin: 3px 0 6px;">${t('app_doc_summary')}</p>
          <span style="font-size: 0.72rem; background: var(--green-subtle); color: var(--green-primary); border: 1px solid var(--green-border); padding: 2px 8px; border-radius: 3px; font-weight: 700;">
            Ref: ${app.reference_id}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.82rem; margin-bottom: 16px; background: var(--bg-card-subtle); padding: 14px; border-radius: 4px; border: 1px solid var(--border-dark);">
          <div>
            <strong>${currentLang === 'hi' ? 'चयनित योजना' : 'Selected Scheme'}:</strong> ${displayName}<br/>
            <strong>${currentLang === 'hi' ? 'लक्षित वर्ग' : 'Target Group'}:</strong> ${app.applicant.caste_category} (${app.applicant.gender})<br/>
            <strong>${currentLang === 'hi' ? 'वार्षिक आय' : 'Annual Income'}:</strong> ₹${app.applicant.annual_income.toLocaleString('en-IN')}
          </div>
          <div>
            <strong>${currentLang === 'hi' ? 'कुल लागत' : 'Project Cost'}:</strong> ₹${app.financial_summary.project_cost.toLocaleString('en-IN')}<br/>
            <strong>${currentLang === 'hi' ? 'ऋण सहायता' : 'Loan Share'}:</strong> ₹${app.financial_summary.concessional_loan_share.toLocaleString('en-IN')}<br/>
            <strong>${currentLang === 'hi' ? 'ब्याज दर' : 'Interest Rate'}:</strong> ${app.financial_summary.interest_rate_pct}% p.a. (${app.financial_summary.moratorium_months} Mos Grace)
          </div>
        </div>

        <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-pure); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.03em;">
          ${t('card_req_docs')}
        </h4>
        <div style="font-size: 0.8rem; margin-bottom: 16px;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: var(--bg-card-subtle); color: var(--text-pure); text-align: left;">
                <th style="padding: 8px 10px; border: 1px solid var(--border-dark);">${t('app_th_doc')}</th>
                <th style="padding: 8px 10px; border: 1px solid var(--border-dark);">${t('app_th_authority')}</th>
                <th style="padding: 8px 10px; border: 1px solid var(--border-dark);">${t('app_th_status')}</th>
              </tr>
            </thead>
            <tbody>
              ${app.document_checklist.map(d => `
                <tr style="border-bottom: 1px solid var(--border-dark);">
                  <td style="padding: 8px 10px; border: 1px solid var(--border-dark); font-weight: 500;">${d.document_name}</td>
                  <td style="padding: 8px 10px; border: 1px solid var(--border-dark); color: var(--text-muted);">${d.issuing_authority}</td>
                  <td style="padding: 8px 10px; border: 1px solid var(--border-dark); color: var(--green-primary); font-weight: 600;">${t('app_status_required')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="background: var(--bg-card-subtle); border: 1px solid var(--border-dark); padding: 12px; border-radius: 4px; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 18px;">
          <strong style="color: var(--text-pure);">${t('app_submission_lbl')}</strong> ${app.submission_instructions_en}
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn-primary" onclick="window.print()">${t('btn_print_checklist')}</button>
        </div>
      </div>
    `;
    
    modal.style.display = 'flex';
  } catch (err) {
    alert("Error creating application summary: " + err.message);
  }
}

async function loadAllSchemes() {
  try {
    const res = await fetch('/api/schemes');
    const data = await res.json();
    allSchemesCache = data.schemes || [];
  } catch (err) {
    console.error("Failed to cache schemes", err);
  }
}

// ----------------------------------------------------
// Institutional Chatbot Advisory Desk Implementation
// ----------------------------------------------------
let chatSpeechRecognition = null;
let isChatRecording = false;

function initChatbotWidget() {
  if (document.getElementById('chat-launcher-btn')) return;

  const launcher = document.createElement('button');
  launcher.id = 'chat-launcher-btn';
  launcher.className = 'chat-launcher-btn';
  launcher.setAttribute('onclick', 'toggleChatWidget()');
  launcher.title = t('chat_launcher_label');
  launcher.innerHTML = `
    <span class="chat-launcher-dot"></span>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <span id="chat-launcher-text">${t('chat_launcher_label')}</span>
  `;
  document.body.appendChild(launcher);

  const panel = document.createElement('div');
  panel.id = 'chat-widget-panel';
  panel.className = 'chat-widget-panel';
  panel.style.display = 'none';
  panel.innerHTML = `
    <div class="chat-widget-header">
      <div class="chat-header-info">
        <div class="chat-header-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span id="chat-header-title-text">${t('chat_title')}</span>
        </div>
        <span id="chat-header-sub-text" class="chat-header-sub">${t('chat_subtitle')}</span>
      </div>
      <div class="chat-header-tools">
        <button class="chat-tool-btn" onclick="clearChatMessages()" title="Clear Chat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
        <button class="chat-tool-btn" onclick="toggleChatWidget()" title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <div id="chat-messages" class="chat-messages"></div>

    <div id="chat-quick-suggestions" class="chat-quick-suggestions"></div>

    <div class="chat-input-bar">
      <button id="chat-voice-btn" class="chat-voice-btn" onclick="toggleChatVoice()" title="Voice Input (Speak)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      </button>
      <input type="text" id="chat-input-field" class="chat-input-field" placeholder="${t('chat_placeholder')}" onkeydown="if(event.key==='Enter') sendChatMessage()">
      <button class="chat-send-btn" onclick="sendChatMessage()" title="Send">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  `;
  document.body.appendChild(panel);

  renderChatWelcomeMessage();
  loadChatSuggestions();
}

function toggleChatWidget() {
  const panel = document.getElementById('chat-widget-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    panel.style.display = 'flex';
    const input = document.getElementById('chat-input-field');
    if (input) input.focus();
  } else {
    panel.style.display = 'none';
  }
}

function renderChatWelcomeMessage() {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  container.innerHTML = `
    <div class="chat-bubble-bot">
      <span class="chat-badge-verified">${t('chat_title')}</span>
      <p style="margin-bottom: 6px; line-height: 1.45;">${t('chat_welcome')}</p>
      <div style="font-size: 0.74rem; color: var(--text-muted); border-top: 1px solid var(--border-dark); padding-top: 6px; margin-top: 6px;">
        ${currentLang === 'hi' ? 'सुझाव: नीचे दिए गए प्रश्नों पर क्लिक करें या अपना प्रश्न टाइप/बोलें।' : 'Tip: Click any starter question below or type/speak your query.'}
      </div>
    </div>
  `;
}

async function loadChatSuggestions() {
  const container = document.getElementById('chat-quick-suggestions');
  if (!container) return;
  try {
    const res = await fetch('/api/chat/suggestions?lang=' + currentLang);
    const data = await res.json();
    if (data.suggestions && data.suggestions.length > 0) {
      container.innerHTML = data.suggestions.map(s => `
        <button class="chat-chip" onclick="askSuggestion('${s.replace(/'/g, "\\'")}')">${s}</button>
      `).join('');
    }
  } catch (e) {
    console.error("Failed to load chat suggestions", e);
  }
}

function askSuggestion(text) {
  const input = document.getElementById('chat-input-field');
  if (input) {
    input.value = text;
    sendChatMessage();
  }
}

function clearChatMessages() {
  renderChatWelcomeMessage();
}

function updateChatbotLanguage(lang) {
  const launcherText = document.getElementById('chat-launcher-text');
  if (launcherText) launcherText.textContent = t('chat_launcher_label');

  const titleText = document.getElementById('chat-header-title-text');
  if (titleText) titleText.textContent = t('chat_title');

  const subText = document.getElementById('chat-header-sub-text');
  if (subText) subText.textContent = t('chat_subtitle');

  const input = document.getElementById('chat-input-field');
  if (input) input.placeholder = t('chat_placeholder');

  loadChatSuggestions();
  
  const container = document.getElementById('chat-messages');
  if (container && container.children.length <= 1) {
    renderChatWelcomeMessage();
  }
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input-field');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  
  input.value = '';
  
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble-user';
  userBubble.textContent = text;
  container.appendChild(userBubble);
  container.scrollTop = container.scrollHeight;

  const loadingBubble = document.createElement('div');
  loadingBubble.className = 'chat-bubble-bot';
  loadingBubble.id = 'chat-loading-indicator';
  loadingBubble.innerHTML = `<span style="color: var(--text-muted); font-style: italic;">${currentLang === 'hi' ? 'उत्तर खोजा जा रहा है...' : 'Consulting advisory rules...'}</span>`;
  container.appendChild(loadingBubble);
  container.scrollTop = container.scrollHeight;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, language: currentLang })
    });
    const data = await res.json();
    
    const loader = document.getElementById('chat-loading-indicator');
    if (loader) loader.remove();

    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble-bot';
    
    let formattedReply = (data.reply || '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

    let actionsHtml = '';
    if (data.suggested_actions && data.suggested_actions.length > 0) {
      actionsHtml = `
        <div class="chat-action-btn-row">
          ${data.suggested_actions.map(a => `
            <a href="${a.url}" class="chat-action-btn">
              ${a.label} →
            </a>
          `).join('')}
        </div>
      `;
    }

    botBubble.innerHTML = `
      <span class="chat-badge-verified">${t('chat_title')}</span>
      <div style="margin-top: 4px; line-height: 1.5;">${formattedReply}</div>
      ${actionsHtml}
    `;

    container.appendChild(botBubble);
    container.scrollTop = container.scrollHeight;
  } catch (err) {
    const loader = document.getElementById('chat-loading-indicator');
    if (loader) loader.remove();

    const errBubble = document.createElement('div');
    errBubble.className = 'chat-bubble-bot';
    errBubble.innerHTML = `<span style="color: var(--accent-red);">${currentLang === 'hi' ? 'त्रुटि: प्रतिक्रिया प्राप्त नहीं हो सकी।' : 'Error: Failed to fetch advisory reply.'}</span>`;
    container.appendChild(errBubble);
  }
}

function showChatNotification(msg, isError = false) {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  const note = document.createElement('div');
  note.className = 'chat-bubble-bot';
  note.style.border = isError ? '1px solid var(--accent-red-border)' : '1px solid var(--green-border)';
  note.style.background = isError ? 'var(--accent-red-subtle)' : 'var(--green-subtle)';
  note.innerHTML = `<span style="font-size: 0.76rem; color: ${isError ? 'var(--accent-red)' : 'var(--green-primary)'}; font-weight: 600;">${msg}</span>`;
  container.appendChild(note);
  container.scrollTop = container.scrollHeight;
}

let serverAudioRecorder = null;
let useServerAudioDirectly = false;

async function toggleChatVoice() {
  const voiceBtn = document.getElementById('chat-voice-btn');
  const input = document.getElementById('chat-input-field');

  if (isChatRecording) {
    if (serverAudioRecorder) {
      serverAudioRecorder.stop();
      return;
    }
    if (chatSpeechRecognition) {
      try { chatSpeechRecognition.stop(); } catch (e) {}
    }
    isChatRecording = false;
    if (voiceBtn) voiceBtn.classList.remove('recording');
    if (input) input.placeholder = t('chat_placeholder');
    return;
  }

  // If server-side recording is already preferred due to prior network block
  if (useServerAudioDirectly) {
    startServerAudioRecording();
    return;
  }

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    startServerAudioRecording();
    return;
  }

  // Explicitly prompt/verify microphone media permission first
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (permErr) {
      console.warn("Microphone access permission error:", permErr);
      showChatNotification(
        currentLang === 'hi'
          ? 'माइक्रोफ़ोन अनुमति अवरोधित है। कृपया ब्राउज़र के एड्रेस बार (URL बार) में माइक अनुमति को "Allow" करें।'
          : 'Microphone access is blocked. Please click the site settings / lock icon in your browser address bar and set Microphone to "Allow".',
        true
      );
      if (voiceBtn) voiceBtn.classList.remove('recording');
      if (input) input.placeholder = t('chat_placeholder');
      return;
    }
  }

  try {
    chatSpeechRecognition = new SpeechRec();
    
    // Map 6 Indian language locales
    const localeMap = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'bn': 'bn-IN'
    };
    chatSpeechRecognition.lang = localeMap[currentLang] || 'en-IN';
    chatSpeechRecognition.continuous = false;
    chatSpeechRecognition.interimResults = true;
    chatSpeechRecognition.maxAlternatives = 1;

    chatSpeechRecognition.onstart = function() {
      isChatRecording = true;
      if (voiceBtn) voiceBtn.classList.add('recording');
      if (input) {
        input.placeholder = currentLang === 'hi' ? 'बोलिए... सुन रहा हूँ' : 'Listening... Speak into your microphone now';
      }
    };

    chatSpeechRecognition.onresult = function(event) {
      let interim = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      
      const transcript = finalTranscript || interim;
      if (input && transcript) {
        input.value = transcript;
      }
      
      if (finalTranscript && finalTranscript.trim().length > 0) {
        isChatRecording = false;
        if (voiceBtn) voiceBtn.classList.remove('recording');
        if (input) input.placeholder = t('chat_placeholder');
        setTimeout(() => {
          sendChatMessage();
        }, 400);
      }
    };

    chatSpeechRecognition.onerror = function(e) {
      console.warn("Browser speech service error:", e.error);
      isChatRecording = false;
      if (voiceBtn) voiceBtn.classList.remove('recording');

      if (e.error === 'network' || e.error === 'service-not-allowed') {
        // Automatically switch to server-side audio recorder fallback!
        useServerAudioDirectly = true;
        showChatNotification(
          currentLang === 'hi'
            ? 'डायरेक्ट माइक्रोफ़ोन रिकॉर्डर सक्रिय किया गया। कृपया बोलें और भेजने के लिए माइक पर पुनः क्लिक करें।'
            : 'Direct microphone recording activated. Please speak and click the mic icon when done to send.',
          false
        );
        startServerAudioRecording();
        return;
      } else if (e.error === 'not-allowed') {
        showChatNotification(
          currentLang === 'hi'
            ? 'माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया ब्राउज़र में अनुमति दें।'
            : 'Microphone permission denied. Please allow microphone access in your browser address bar.',
          true
        );
      } else if (e.error === 'no-speech') {
        showChatNotification(
          currentLang === 'hi'
            ? 'कोई आवाज़ सुनाई नहीं दी। कृपया पुनः प्रयास करें।'
            : 'No speech was detected. Please try speaking into the microphone again.',
          false
        );
      } else {
        startServerAudioRecording();
      }
    };

    chatSpeechRecognition.onend = function() {
      if (!serverAudioRecorder) {
        isChatRecording = false;
        if (voiceBtn) voiceBtn.classList.remove('recording');
        if (input) input.placeholder = t('chat_placeholder');
      }
    };

    chatSpeechRecognition.start();
  } catch (e) {
    console.warn("Starting browser speech failed, falling back to server recording:", e);
    startServerAudioRecording();
  }
}

async function startServerAudioRecording() {
  const voiceBtn = document.getElementById('chat-voice-btn');
  const input = document.getElementById('chat-input-field');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
    const source = audioCtx.createMediaStreamSource(stream);
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);
    const pcmChunks = [];

    processor.onaudioprocess = (e) => {
      if (!isChatRecording) return;
      const channelData = e.inputBuffer.getChannelData(0);
      pcmChunks.push(new Float32Array(channelData));
    };

    source.connect(processor);
    processor.connect(audioCtx.destination);

    isChatRecording = true;
    if (voiceBtn) voiceBtn.classList.add('recording');
    if (input) {
      input.placeholder = currentLang === 'hi'
        ? 'रिकॉर्डिंग चालू है... बोलें, फिर माइक पर पुनः क्लिक करें'
        : 'Recording audio... Speak now, click mic again to send';
    }

    serverAudioRecorder = {
      stop: async () => {
        isChatRecording = false;
        if (voiceBtn) voiceBtn.classList.remove('recording');
        if (input) input.placeholder = currentLang === 'hi' ? 'ध्वनि का रूपांतरण हो रहा है...' : 'Transcribing voice...';

        source.disconnect();
        processor.disconnect();
        stream.getTracks().forEach(t => t.stop());
        try { await audioCtx.close(); } catch (e) {}

        const wavBlob = encodePcmToWav(pcmChunks, 16000);
        serverAudioRecorder = null;
        await uploadAndTranscribeAudio(wavBlob);
      }
    };

    // Auto stop after 7 seconds
    setTimeout(() => {
      if (isChatRecording && serverAudioRecorder) {
        serverAudioRecorder.stop();
      }
    }, 7000);

  } catch (err) {
    console.warn("Direct microphone capture failed:", err);
    showChatNotification(
      currentLang === 'hi'
        ? 'माइक्रोफ़ोन एक्सेस नहीं मिल सका। कृपया ब्राउज़र में अनुमति जांचें।'
        : 'Could not access microphone. Please check browser permissions.',
      true
    );
  }
}

function encodePcmToWav(chunks, sampleRate) {
  let totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
  let merged = new Float32Array(totalLength);
  let offset = 0;
  for (let c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }

  const buffer = new ArrayBuffer(44 + merged.length * 2);
  const view = new DataView(buffer);

  function writeString(v, pos, str) {
    for (let i = 0; i < str.length; i++) {
      v.setUint8(pos + i, str.charCodeAt(i));
    }
  }

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + merged.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, merged.length * 2, true);

  let index = 44;
  for (let i = 0; i < merged.length; i++, index += 2) {
    let s = Math.max(-1, Math.min(1, merged[i]));
    view.setInt16(index, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

async function uploadAndTranscribeAudio(wavBlob) {
  const input = document.getElementById('chat-input-field');
  try {
    const formData = new FormData();
    formData.append('file', wavBlob, 'recording.wav');

    const res = await fetch('/api/transcribe?language=' + currentLang, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();

    if (input) input.placeholder = t('chat_placeholder');

    if (data.status === 'success' && data.transcript) {
      if (input) {
        input.value = data.transcript;
        sendChatMessage();
      }
    } else {
      showChatNotification(data.message || (currentLang === 'hi' ? 'आवाज़ पहचानी नहीं जा सकी। कृपया पुनः प्रयास करें।' : 'Could not recognize voice. Please try speaking again.'), true);
    }
  } catch (err) {
    console.error("Transcription error:", err);
    if (input) input.placeholder = t('chat_placeholder');
    showChatNotification(currentLang === 'hi' ? 'सर्वर पर ट्रांसक्रिप्शन विफल रहा। कृपया टाइप करें।' : 'Transcription failed on server. Please type your query.', true);
  }
}

// ----------------------------------------------------
// Beneficiary Authentication, Storage & Session Management
// ----------------------------------------------------
let currentUserToken = localStorage.getItem('scheme_sathi_token') || null;
let currentUserProfile = null;
try {
  const savedUser = localStorage.getItem('scheme_sathi_user');
  if (savedUser) currentUserProfile = JSON.parse(savedUser);
} catch (e) {
  currentUserProfile = null;
}
let authPendingSchemeId = null;
let authPendingAction = null;

function syncWizardWithUserProfile() {
  if (!currentUserProfile) return;
  const form = document.getElementById('wizard-form');
  if (!form) return;

  if (currentUserProfile.caste_category && form.caste_category) {
    const isSafai = currentUserProfile.caste_category.includes('Safai');
    form.caste_category.value = isSafai ? 'Safai Karamchari / Dependent' : currentUserProfile.caste_category;
  }
  if (currentUserProfile.annual_income && form.annual_income) {
    form.annual_income.value = currentUserProfile.annual_income;
  }
  if (currentUserProfile.gender && form.gender) {
    form.gender.value = currentUserProfile.gender;
  }
}

async function initAuth() {
  initAuthModal();
  renderAuthNav();
  if (currentUserToken) {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${currentUserToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        currentUserProfile = data.user;
        localStorage.setItem('scheme_sathi_user', JSON.stringify(currentUserProfile));
        renderAuthNav();
        syncWizardWithUserProfile();
      } else {
        handleAuthLogout(false);
      }
    } catch (e) {
      console.warn("Auth check error:", e);
    }
  }
}

function toggleUserProfileDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('user-profile-dropdown-menu');
  const btn = document.getElementById('user-profile-toggle-btn');
  if (!menu) return;
  const isShow = menu.classList.contains('show');
  if (isShow) {
    menu.classList.remove('show');
    if (btn) btn.classList.remove('active');
  } else {
    menu.classList.add('show');
    if (btn) btn.classList.add('active');
  }
}

function closeUserProfileDropdown() {
  const menu = document.getElementById('user-profile-dropdown-menu');
  const btn = document.getElementById('user-profile-toggle-btn');
  if (menu) menu.classList.remove('show');
  if (btn) btn.classList.remove('active');
}

function toggleMobileNav(e) {
  if (e) e.stopPropagation();
  const navLinks = document.querySelector('.nav-links');
  const btn = document.querySelector('.nav-mobile-toggle');
  if (navLinks) {
    navLinks.classList.toggle('open');
    if (btn) btn.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  }
}

function changeFontSize(step) {
  if (step === 0) {
    document.documentElement.style.fontSize = '';
  } else if (step === -1) {
    document.documentElement.style.fontSize = '92%';
  } else if (step === 1) {
    document.documentElement.style.fontSize = '108%';
  }
}

// Global click listener for dropdowns and drawers
document.addEventListener('click', function(e) {
  const userWrapper = document.querySelector('.user-profile-wrapper');
  if (userWrapper && !userWrapper.contains(e.target)) {
    closeUserProfileDropdown();
  }
  const navLinks = document.querySelector('.nav-links');
  const navToggle = document.querySelector('.nav-mobile-toggle');
  if (navLinks && navLinks.classList.contains('open')) {
    if (!navLinks.contains(e.target) && (!navToggle || !navToggle.contains(e.target))) {
      navLinks.classList.remove('open');
    }
  }
});

function renderAuthNav() {
  const container = document.getElementById('auth-nav-container');
  const authTab = document.getElementById('nav-auth-tab');
  const currentPath = window.location.pathname.toLowerCase();

  if (authTab) {
    if (currentUserProfile) {
      authTab.textContent = t('nav_my_apps');
      authTab.href = '/my-applications';
      authTab.setAttribute('data-i18n', 'nav_my_apps');
      if (currentPath.includes('my-applications')) {
        authTab.classList.add('active');
      }
    } else {
      authTab.textContent = t('nav_auth');
      authTab.href = '/login';
      authTab.setAttribute('data-i18n', 'nav_auth');
      if (currentPath.includes('login') || currentPath.includes('signup') || currentPath.includes('auth')) {
        authTab.classList.add('active');
      }
    }
  }

  if (!container) return;

  if (currentUserProfile) {
    const rawName = currentUserProfile.full_name || 'Beneficiary';
    const nameParts = rawName.trim().split(/\s+/);
    const initials = nameParts.length >= 2 
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
      : rawName.substring(0, 2).toUpperCase();
    const caste = currentUserProfile.caste_category || 'SC';
    const phone = currentUserProfile.phone_number ? '+91 ' + currentUserProfile.phone_number : 'Registered';
    const aadhaarStatus = currentUserProfile.aadhaar_verified 
      ? 'Aadhaar Verified' 
      : (currentUserProfile.aadhaar_last_four ? `Aadhaar: ••••${currentUserProfile.aadhaar_last_four}` : 'Citizen Account');

    container.innerHTML = `
      <div class="user-profile-wrapper">
        <button type="button" class="user-profile-chip-btn" id="user-profile-toggle-btn" onclick="toggleUserProfileDropdown(event)" aria-label="Beneficiary Account Menu" title="Verified Beneficiary: ${rawName}">
          <div class="user-avatar-circle">
            ${initials}
            <span class="user-verified-badge-dot" title="Verified Citizen Record"></span>
          </div>
          <span class="user-name-label">${rawName}</span>
          <span class="user-caste-pill">${caste}</span>
          <svg class="user-chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>

        <div class="user-profile-dropdown-menu" id="user-profile-dropdown-menu">
          <div class="user-card-summary">
            <div class="user-card-name">${rawName}</div>
            <div class="user-card-meta">
              <span><strong>Category:</strong> ${caste}</span>
              <span><strong>Mobile:</strong> ${phone}</span>
              <span style="color: var(--green-primary); font-weight: 700;">● ${aadhaarStatus}</span>
            </div>
          </div>
          <a href="/my-applications" class="user-dropdown-item" onclick="closeUserProfileDropdown()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            <span>${t('nav_my_apps')}</span>
          </a>
          <a href="/recommender" class="user-dropdown-item" onclick="closeUserProfileDropdown()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            <span>${t('nav_recommender')}</span>
          </a>
          <button type="button" class="user-dropdown-item danger" onclick="closeUserProfileDropdown(); handleAuthLogout()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span>${t('auth_btn_logout')}</span>
          </button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <a href="/login" class="btn-auth-nav" onclick="if(window.location.pathname !== '/login'){ event.preventDefault(); openAuthModal('aadhaar'); }">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>${t('auth_btn_login_signup')}</span>
      </a>
    `;
  }
}

function initAuthModal() {
  if (document.getElementById('auth-modal')) return;

  const modalHtml = `
    <div id="auth-modal" class="auth-modal-backdrop">
      <div class="auth-modal-content">
        <div class="auth-modal-header">
          <div>
            <span style="font-size: 0.68rem; background: var(--green-subtle); color: var(--green-primary); border: 1px solid var(--green-border); padding: 2px 7px; border-radius: 3px; font-weight: 700; display: inline-block; margin-bottom: 4px;">
              MoSJE & NSFDC Official Portal
            </span>
            <h3 id="auth-modal-title">${t('auth_modal_title')}</h3>
          </div>
          <button class="modal-close-icon" onclick="closeAuthModal()" title="Close">✕</button>
        </div>

        <div class="auth-tabs-bar">
          <button id="auth-tab-btn-aadhaar" class="auth-tab-btn active" onclick="switchAuthTab('aadhaar')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right:4px;"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>
            ${t('auth_tab_aadhaar')}
          </button>
          <button id="auth-tab-btn-login" class="auth-tab-btn" onclick="switchAuthTab('login')">${t('auth_tab_password')}</button>
          <button id="auth-tab-btn-signup" class="auth-tab-btn" onclick="switchAuthTab('signup')">${t('auth_tab_signup')}</button>
        </div>

        <div class="auth-modal-body">
          <div id="auth-notification-banner" style="display:none; background: var(--green-subtle); border: 1px solid var(--green-border); color: var(--green-primary); padding: 10px 14px; border-radius: 4px; font-size: 0.82rem; font-weight: 700; margin-bottom: 8px;"></div>
          <div id="auth-error-banner" class="auth-error-banner"></div>

          <div style="display: flex; justify-content: flex-end; margin-bottom: 2px;">
            <button type="button" class="btn-demo-fill" onclick="prefillModalDemoBeneficiary()">
              One-Click Demo Fill
            </button>
          </div>

          <!-- ================= 1. Aadhaar OTP Login Form ================= -->
          <div id="auth-aadhaar-form" style="display: flex; flex-direction: column; gap: 14px;">
            <!-- Step 1: Aadhaar Input -->
            <div id="modal-aadhaar-step1">
              <label class="form-label">${t('auth_lbl_aadhaar_12')} <span style="color:#dc2626;">*</span></label>
              <div style="position: relative;">
                <input type="text" id="modal-aadhaar-number" class="form-input aadhaar-input" placeholder="1234 5678 9012" maxlength="14" oninput="formatAadhaarInput(this)">
              </div>
              <small style="color: var(--text-dim); font-size: 0.72rem; margin-top: 4px; display: block;">
                ${t('auth_aadhaar_help')}
              </small>

              <!-- Live preview of actual registered mobile number -->
              <div id="modal-aadhaar-linked-preview" style="display: none; margin-top: 10px; font-size: 0.80rem; background: var(--green-subtle); color: var(--green-primary); padding: 9px 12px; border-radius: 4px; border: 1px solid var(--green-border);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 700;">Verified UIDAI Citizen Record:</span>
                  <span id="modal-preview-name" style="font-size: 0.76rem; background: var(--bg-card); padding: 1px 6px; border-radius: 3px; border: 1px solid var(--green-border);">Aakash Kumar</span>
                </div>
                <div style="margin-top: 4px; color: var(--text-pure); font-size: 0.84rem;">
                  Actual Linked Mobile: <strong id="modal-preview-phone" style="color: var(--green-primary); font-size: 0.95rem;">+91 9876543210</strong>
                </div>
              </div>

              <button type="button" id="btn-modal-send-aadhaar-otp" class="btn-primary" style="padding: 11px; width: 100%; margin-top: 12px;" onclick="handleModalAadhaarSendOtp()">
                ${t('auth_btn_send_otp')}
              </button>
            </div>

            <!-- Step 2: OTP Verification -->
            <div id="modal-aadhaar-step2" style="display: none; flex-direction: column; gap: 12px;">
              <div id="modal-aadhaar-otp-notice" class="auth-otp-notice">
                <div style="display:flex; align-items:flex-start; gap:8px;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-primary)" stroke-width="2" style="flex-shrink:0; margin-top:2px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <div>
                    <div>OTP dispatched to registered mobile linked with Aadhaar <strong id="modal-otp-masked-aadhaar">XXXX-XXXX-9012</strong>:</div>
                    <div style="margin-top: 3px; font-size: 0.95rem; color: var(--text-pure);">
                      Actual Mobile: <strong id="modal-otp-phone" style="color: var(--green-primary); font-size: 1.0rem;">+91 9876543210</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div id="modal-demo-otp-banner" class="auth-demo-otp-banner" style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.74rem;">${t('auth_demo_otp_note')} <strong id="modal-demo-otp-code">123456</strong></span>
                <button type="button" class="btn-demo-copy" onclick="fillModalDemoOtp()">Auto-Fill OTP</button>
              </div>

              <div>
                <label class="form-label">${t('auth_lbl_enter_otp')} <span style="color:#dc2626;">*</span></label>
                <input type="text" id="modal-aadhaar-otp" class="form-input otp-input" placeholder="••••••" maxlength="6" pattern="[0-9]{6}">
              </div>

              <button type="button" id="btn-modal-verify-aadhaar-otp" class="btn-primary" style="padding: 11px; width: 100%;" onclick="handleModalAadhaarVerifyOtp()">
                ${t('auth_btn_verify_otp')}
              </button>

              <div style="display: flex; justify-content: space-between; font-size: 0.76rem; margin-top: 4px;">
                <a href="javascript:void(0)" onclick="resetModalAadhaarStep()" style="color: var(--text-muted);">${t('auth_change_aadhaar')}</a>
                <a href="javascript:void(0)" onclick="handleModalAadhaarSendOtp()" style="color: var(--green-primary); font-weight: 700;">${t('auth_resend_otp')}</a>
              </div>
            </div>

            <div style="text-align: center; border-top: 1px dashed var(--border-dark); padding-top: 10px; margin-top: 4px;">
              <p style="font-size: 0.78rem; color: var(--text-muted);">
                Prefer standard password login?
                <a href="javascript:void(0)" onclick="switchAuthTab('login')" style="color: var(--green-primary); font-weight: 700; margin-left: 4px;">
                  Sign In with Password →
                </a>
              </p>
            </div>
          </div>

          <!-- ================= 2. Password Login Form ================= -->
          <form id="auth-login-form" onsubmit="handleAuthLoginSubmit(event)" style="display: none; flex-direction: column; gap: 14px;">
            <div>
              <label class="form-label">${t('auth_lbl_mobile')} / Email</label>
              <input type="text" name="identifier" class="form-input" placeholder="e.g. 9876543210 or beneficiary@gov.in" required>
            </div>
            <div>
              <label class="form-label">${t('auth_lbl_password')}</label>
              <input type="password" name="password" class="form-input" placeholder="••••••••" required>
            </div>
            <button type="submit" id="btn-auth-login-submit" class="btn-primary" style="padding: 10px; width: 100%;">
              ${t('auth_btn_login')}
            </button>
            <p style="font-size: 0.78rem; text-align: center; color: var(--text-muted); margin-top: 4px;">
              Don't have an account? <a href="javascript:void(0)" onclick="switchAuthTab('signup')" style="color: var(--green-primary); font-weight: 700;">Create Account (Sign Up)</a>
            </p>
          </form>

          <!-- ================= 3. Sign Up Form ================= -->
          <form id="auth-signup-form" onsubmit="handleAuthSignUpSubmit(event)" style="display: none; flex-direction: column; gap: 14px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label class="form-label">${t('auth_lbl_fullname')} *</label>
                <input type="text" name="full_name" class="form-input" placeholder="e.g. Aakash Kumar" required>
              </div>
              <div>
                <label class="form-label">${t('auth_lbl_mobile')} *</label>
                <input type="tel" name="phone_number" class="form-input" placeholder="e.g. 9876543210" pattern="[6-9][0-9]{9}" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label class="form-label">${t('auth_lbl_password')} *</label>
                <input type="password" name="password" class="form-input" placeholder="Min 6 characters" minlength="6" required>
              </div>
              <div>
                <label class="form-label">Email ID (Optional)</label>
                <input type="email" name="email" class="form-input" placeholder="applicant@example.gov.in">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label class="form-label">${t('auth_lbl_caste')} *</label>
                <select name="caste_category" class="form-select" required>
                  <option value="SC" selected>Scheduled Caste (SC)</option>
                  <option value="Safai Karamchari / Dependent">Safai Karamchari / Dependent</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="OBC">Other Backward Classes (OBC)</option>
                  <option value="General">General Category</option>
                </select>
              </div>
              <div>
                <label class="form-label">Caste Certificate No.</label>
                <input type="text" name="caste_cert_number" class="form-input" placeholder="e.g. DL/REV/SC/77291">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label class="form-label">${t('auth_lbl_income')} *</label>
                <input type="number" name="annual_income" class="form-input" value="180000" min="10000" max="1500000" step="5000" required>
              </div>
              <div>
                <label class="form-label">${t('auth_lbl_gender')} *</label>
                <select name="gender" class="form-select" required>
                  <option value="Female" selected>Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px;">
              <div>
                <label class="form-label">${t('auth_lbl_state')} *</label>
                <input type="text" name="state_district" class="form-input" value="Delhi, Central Delhi" required>
              </div>
              <div>
                <label class="form-label">${t('auth_lbl_aadhaar')} *</label>
                <input type="text" name="aadhaar_last_four" class="form-input" placeholder="e.g. 8842" maxlength="4" pattern="[0-9]{4}" required>
              </div>
            </div>

            <button type="submit" id="btn-auth-signup-submit" class="btn-primary" style="padding: 10px; width: 100%; margin-top: 4px;">
              ${t('auth_btn_signup')}
            </button>
            <p style="font-size: 0.78rem; text-align: center; color: var(--text-muted); margin-top: 4px;">
              Already registered? <a href="javascript:void(0)" onclick="switchAuthTab('aadhaar')" style="color: var(--green-primary); font-weight: 700;">Login with Aadhaar</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = modalHtml;
  document.body.appendChild(container.firstElementChild);
}

function openAuthModal(tab = 'aadhaar', pendingSchemeId = null) {
  initAuthModal();
  if (pendingSchemeId) authPendingSchemeId = pendingSchemeId;
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  hideAuthError();
  switchAuthTab(tab);
  modal.style.display = 'flex';
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.style.display = 'none';
  hideAuthError();
  const banner = document.getElementById('auth-notification-banner');
  if (banner) banner.style.display = 'none';
}

function switchAuthTab(tab) {
  const aadhaarBtn = document.getElementById('auth-tab-btn-aadhaar');
  const loginBtn = document.getElementById('auth-tab-btn-login');
  const signupBtn = document.getElementById('auth-tab-btn-signup');

  const aadhaarForm = document.getElementById('auth-aadhaar-form');
  const loginForm = document.getElementById('auth-login-form');
  const signupForm = document.getElementById('auth-signup-form');

  [aadhaarBtn, loginBtn, signupBtn].forEach(b => b && b.classList.remove('active'));
  [aadhaarForm, loginForm, signupForm].forEach(f => f && (f.style.display = 'none'));

  if (tab === 'aadhaar') {
    if (aadhaarBtn) aadhaarBtn.classList.add('active');
    if (aadhaarForm) aadhaarForm.style.display = 'flex';
  } else if (tab === 'login') {
    if (loginBtn) loginBtn.classList.add('active');
    if (loginForm) loginForm.style.display = 'flex';
  } else {
    if (signupBtn) signupBtn.classList.add('active');
    if (signupForm) signupForm.style.display = 'flex';
  }
}

let aadhaarModalLookupTimeout = null;

function formatAadhaarInput(el) {
  if (!el) return;
  let val = el.value.replace(/\D/g, '');
  if (val.length > 12) val = val.substring(0, 12);
  let parts = [];
  for (let i = 0; i < val.length; i += 4) {
    parts.push(val.substring(i, i + 4));
  }
  el.value = parts.join(' ');

  const previewBox = document.getElementById('modal-aadhaar-linked-preview');
  if (val.length === 12) {
    if (aadhaarModalLookupTimeout) clearTimeout(aadhaarModalLookupTimeout);
    aadhaarModalLookupTimeout = setTimeout(async () => {
      try {
        const res = await fetch('/api/auth/aadhaar/linked-mobile?aadhaar_number=' + val);
        if (res.ok) {
          const data = await res.json();
          const phoneEl = document.getElementById('modal-preview-phone');
          const nameEl = document.getElementById('modal-preview-name');
          if (phoneEl) phoneEl.innerText = '+91 ' + (data.phone_number || data.linked_phone);
          if (nameEl) nameEl.innerText = data.full_name || 'Verified Citizen';
          if (previewBox) previewBox.style.display = 'block';
        }
      } catch (err) {
        console.warn('Aadhaar modal lookup failed:', err);
      }
    }, 120);
  } else {
    if (previewBox) previewBox.style.display = 'none';
  }
}

function fillModalDemoOtp() {
  const code = document.getElementById('modal-demo-otp-code');
  const input = document.getElementById('modal-aadhaar-otp');
  if (code && input) {
    input.value = code.innerText.trim();
  }
}

function resetModalAadhaarStep() {
  const s1 = document.getElementById('modal-aadhaar-step1');
  const s2 = document.getElementById('modal-aadhaar-step2');
  if (s1 && s2) {
    s1.style.display = 'block';
    s2.style.display = 'none';
  }
  const input = document.getElementById('modal-aadhaar-number');
  if (input) {
    input.focus();
    formatAadhaarInput(input);
  }
}

async function handleModalAadhaarSendOtp() {
  hideAuthError();
  const input = document.getElementById('modal-aadhaar-number');
  if (!input) return;
  const raw = input.value.replace(/\D/g, '');
  if (raw.length !== 12) {
    showAuthError("Please enter a valid 12-digit numerical Aadhaar card number.");
    input.focus();
    return;
  }

  const btn = document.getElementById('btn-modal-send-aadhaar-otp');
  const origText = btn.innerHTML;
  btn.disabled = true;
  btn.innerText = currentLang === 'hi' ? 'ओटीपी भेजा जा रहा है...' : 'Sending OTP to Mobile...';

  try {
    const res = await fetch('/api/auth/aadhaar/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaar_number: raw })
    });
    const data = await res.json();

    if (res.ok && data.status === 'success') {
      const pPhone = document.getElementById('modal-otp-masked-phone');
      const pAadhaar = document.getElementById('modal-otp-masked-aadhaar');
      const pDemo = document.getElementById('modal-demo-otp-code');
      const pActualPhone = document.getElementById('modal-otp-phone');
      if (pPhone) pPhone.innerText = data.phone_masked;
      if (pAadhaar) pAadhaar.innerText = data.aadhaar_masked;
      if (pDemo) pDemo.innerText = data.otp_demo;
      if (pActualPhone) pActualPhone.innerText = '+91 ' + (data.phone_number || data.linked_phone || data.phone_masked);

      const s1 = document.getElementById('modal-aadhaar-step1');
      const s2 = document.getElementById('modal-aadhaar-step2');
      if (s1 && s2) {
        s1.style.display = 'none';
        s2.style.display = 'flex';
      }
      const otpInput = document.getElementById('modal-aadhaar-otp');
      if (otpInput) {
        otpInput.value = '';
        otpInput.focus();
      }
      showAuthNotification(data.message);
    } else {
      showAuthError(data.detail || data.message || "Failed to dispatch OTP. Check Aadhaar number.");
    }
  } catch (e) {
    showAuthError("Network error: " + e.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = origText;
  }
}

async function handleModalAadhaarVerifyOtp() {
  hideAuthError();
  const aadhaarInput = document.getElementById('modal-aadhaar-number');
  const otpInput = document.getElementById('modal-aadhaar-otp');
  if (!aadhaarInput || !otpInput) return;

  const rawAadhaar = aadhaarInput.value.replace(/\D/g, '');
  const rawOtp = otpInput.value.trim();

  if (rawAadhaar.length !== 12) {
    showAuthError("Aadhaar Number must be 12 digits.");
    return;
  }
  if (!rawOtp || rawOtp.length < 4) {
    showAuthError("Please enter the 6-digit OTP code sent to your registered mobile.");
    otpInput.focus();
    return;
  }

  const btn = document.getElementById('btn-modal-verify-aadhaar-otp');
  const origText = btn.innerHTML;
  btn.disabled = true;
  btn.innerText = currentLang === 'hi' ? 'सत्यापित किया जा रहा है...' : 'Verifying Aadhaar OTP...';

  try {
    const res = await fetch('/api/auth/aadhaar/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aadhaar_number: rawAadhaar,
        otp: rawOtp
      })
    });
    const data = await res.json();

    if (res.ok && data.status === 'success') {
      currentUserToken = data.token;
      currentUserProfile = data.user;
      localStorage.setItem('scheme_sathi_token', data.token);
      localStorage.setItem('scheme_sathi_user', JSON.stringify(data.user));

      renderAuthNav();
      closeAuthModal();

      if (authPendingSchemeId) {
        const sid = authPendingSchemeId;
        authPendingSchemeId = null;
        openRegistrationModal(sid);
      } else if (authPendingAction === 'run_matching') {
        authPendingAction = null;
        const wizardForm = document.getElementById('wizard-form');
        if (wizardForm) {
          syncWizardWithUserProfile();
          handleRecommendationSubmit({ preventDefault: () => {}, target: wizardForm });
        }
      }
    } else {
      showAuthError(data.detail || data.message || "Invalid OTP entered. Please try again.");
    }
  } catch (e) {
    showAuthError("Network error: " + e.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = origText;
  }
}

function showAuthError(msg) {
  const banner = document.getElementById('auth-error-banner');
  if (banner) {
    banner.innerText = msg;
    banner.style.display = 'block';
  }
}

function hideAuthError() {
  const banner = document.getElementById('auth-error-banner');
  if (banner) banner.style.display = 'none';
}

function showAuthNotification(msg) {
  const banner = document.getElementById('auth-notification-banner');
  if (banner) {
    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span>${msg}</span>
      </div>
    `;
    banner.style.display = 'block';
  }
}

function prefillModalDemoBeneficiary() {
  hideAuthError();
  const isAadhaarActive = document.getElementById('auth-tab-btn-aadhaar') && document.getElementById('auth-tab-btn-aadhaar').classList.contains('active');
  const isLoginActive = document.getElementById('auth-tab-btn-login') && document.getElementById('auth-tab-btn-login').classList.contains('active');

  if (isAadhaarActive) {
    const aadhaarInp = document.getElementById('modal-aadhaar-number');
    if (aadhaarInp) {
      aadhaarInp.value = '1234 5678 9012';
      resetModalAadhaarStep();
      showAuthNotification("Demo Aadhaar filled (1234 5678 9012 • Aakash Kumar, SC, Delhi). Click 'Get OTP'.");
    }
  } else if (isLoginActive) {
    const form = document.getElementById('auth-login-form');
    if (form) {
      form.identifier.value = '9876543210';
      form.password.value = 'Demo@123';
    }
  } else {
    const form = document.getElementById('auth-signup-form');
    if (form) {
      form.full_name.value = 'Sunita Devi';
      form.phone_number.value = '98' + Math.floor(10000000 + Math.random() * 90000000);
      form.password.value = 'Demo@123';
      form.email.value = 'sunita.devi@beneficiary.gov.in';
      form.caste_category.value = 'SC';
      form.caste_cert_number.value = 'DL/REV/SC/55491';
      form.annual_income.value = '175000';
      form.gender.value = 'Female';
      form.state_district.value = 'Delhi, Central Delhi';
      form.aadhaar_last_four.value = '6543';
    }
  }
}

async function handleAuthLoginSubmit(e) {
  e.preventDefault();
  hideAuthError();
  const form = e.target;
  const submitBtn = document.getElementById('btn-auth-login-submit');
  const origText = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerText = currentLang === 'hi' ? 'सत्यापन हो रहा है...' : 'Authenticating...';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: form.identifier.value.trim(),
        password: form.password.value
      })
    });
    const data = await res.json();

    if (res.ok && data.status === 'success') {
      currentUserToken = data.token;
      currentUserProfile = data.user;
      localStorage.setItem('scheme_sathi_token', data.token);
      localStorage.setItem('scheme_sathi_user', JSON.stringify(data.user));

      renderAuthNav();
      closeAuthModal();

      if (authPendingSchemeId) {
        const sid = authPendingSchemeId;
        authPendingSchemeId = null;
        openRegistrationModal(sid);
      } else if (authPendingAction === 'run_matching') {
        authPendingAction = null;
        const wizardForm = document.getElementById('wizard-form');
        if (wizardForm) {
          syncWizardWithUserProfile();
          handleRecommendationSubmit({ preventDefault: () => {}, target: wizardForm });
        }
      }
    } else {
      showAuthError(data.detail || data.message || "Invalid credentials. Please try again.");
    }
  } catch (err) {
    showAuthError("Connection error: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = origText;
  }
}

async function handleAuthSignUpSubmit(e) {
  e.preventDefault();
  hideAuthError();
  const form = e.target;
  const submitBtn = document.getElementById('btn-auth-signup-submit');
  const origText = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerText = currentLang === 'hi' ? 'खाता बनाया जा रहा है...' : 'Creating Account...';

  const stateDist = form.state_district.value.split(',');
  const state = stateDist[0] ? stateDist[0].trim() : 'Delhi';
  const district = stateDist[1] ? stateDist[1].trim() : 'New Delhi';

  const payload = {
    full_name: form.full_name.value.trim(),
    phone_number: form.phone_number.value.trim(),
    password: form.password.value,
    email: form.email.value.trim(),
    caste_category: form.caste_category.value,
    caste_cert_number: form.caste_cert_number.value.trim(),
    annual_income: parseFloat(form.annual_income.value) || 180000,
    gender: form.gender.value,
    state: state,
    district: district,
    aadhaar_last_four: form.aadhaar_last_four.value.trim()
  };

  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (res.ok && data.status === 'success') {
      currentUserToken = data.token;
      currentUserProfile = data.user;
      localStorage.setItem('scheme_sathi_token', data.token);
      localStorage.setItem('scheme_sathi_user', JSON.stringify(data.user));

      renderAuthNav();
      closeAuthModal();

      if (authPendingSchemeId) {
        const sid = authPendingSchemeId;
        authPendingSchemeId = null;
        openRegistrationModal(sid);
      } else if (authPendingAction === 'run_matching') {
        authPendingAction = null;
        const wizardForm = document.getElementById('wizard-form');
        if (wizardForm) {
          syncWizardWithUserProfile();
          handleRecommendationSubmit({ preventDefault: () => {}, target: wizardForm });
        }
      }
    } else {
      showAuthError(data.detail || data.message || "Registration failed. Check inputs.");
    }
  } catch (err) {
    showAuthError("Connection error: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = origText;
  }
}

function handleAuthLogout(showMsg = true) {
  currentUserToken = null;
  currentUserProfile = null;
  localStorage.removeItem('scheme_sathi_token');
  localStorage.removeItem('scheme_sathi_user');
  renderAuthNav();
  if (window.location.pathname.includes('my-applications') || window.location.pathname.includes('login') || window.location.pathname.includes('auth')) {
    window.location.href = '/login';
  }
}

async function openMyApplicationsModal() {
  if (!currentUserProfile || !currentUserToken) {
    openAuthModal('login');
    return;
  }

  let modal = document.getElementById('my-apps-modal');
  if (!modal) {
    const modalHtml = `
      <div id="my-apps-modal" class="auth-modal-backdrop">
        <div class="auth-modal-content" style="max-width: 680px;">
          <div class="auth-modal-header">
            <div>
              <span style="font-size: 0.68rem; background: var(--green-subtle); color: var(--green-primary); border: 1px solid var(--green-border); padding: 2px 7px; border-radius: 3px; font-weight: 700; display: inline-block; margin-bottom: 4px;">
                Beneficiary Application Dashboard
              </span>
              <h3>${t('auth_btn_my_apps')}</h3>
            </div>
            <button class="modal-close-icon" onclick="document.getElementById('my-apps-modal').style.display='none'">✕</button>
          </div>
          <div id="my-apps-modal-body" class="auth-modal-body">
            <p style="color: var(--text-muted); font-size: 0.84rem;">Loading applications...</p>
          </div>
        </div>
      </div>
    `;
    const c = document.createElement('div');
    c.innerHTML = modalHtml;
    document.body.appendChild(c.firstElementChild);
    modal = document.getElementById('my-apps-modal');
  }

  modal.style.display = 'flex';
  const body = document.getElementById('my-apps-modal-body');

  try {
    const res = await fetch('/api/auth/my-applications', {
      headers: { 'Authorization': `Bearer ${currentUserToken}` }
    });
    const data = await res.json();
    const apps = data.applications || [];

    if (apps.length === 0) {
      body.innerHTML = `
        <div style="text-align: center; padding: 28px; background: var(--bg-card-subtle); border-radius: 6px; border: 1px dashed var(--border-dark);">
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 12px;">No scheme applications submitted yet.</p>
          <a href="/recommender" class="btn-primary" style="display: inline-block; font-size: 0.80rem; padding: 8px 16px;" onclick="document.getElementById('my-apps-modal').style.display='none'">Explore Eligible Schemes →</a>
        </div>
      `;
      return;
    }

    body.innerHTML = apps.map(a => `
      <div class="my-apps-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; flex-wrap: wrap;">
          <div>
            <span style="font-size: 0.72rem; background: var(--green-subtle); color: var(--green-primary); font-weight: 700; padding: 2px 6px; border-radius: 3px; border: 1px solid var(--green-border);">
              ${a.registration_id}
            </span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-pure); margin-top: 4px;">${a.scheme.name}</h4>
          </div>
          <span style="font-size: 0.74rem; background: var(--green-subtle); color: var(--green-primary); padding: 3px 8px; border-radius: 4px; font-weight: 700;">
            ${a.status_label_en}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.80rem; color: var(--text-muted); margin-top: 4px; border-top: 1px dashed var(--border-dark); padding-top: 6px;">
          <span>Loan: <strong style="color: var(--text-pure);">₹${a.financial_summary.concessional_loan_amount.toLocaleString('en-IN')}</strong> @ ${a.financial_summary.interest_rate_beneficiary_pct}% p.a.</span>
          <span>Date: <strong>${a.submission_timestamp}</strong></span>
        </div>
        <div style="font-size: 0.78rem; color: var(--text-muted);">
          Allocated Center: <strong style="color: var(--green-primary);">${a.allocated_channel_partner.name}</strong> (${a.allocated_channel_partner.branch_name})
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
          <button class="btn-secondary" style="font-size: 0.74rem; padding: 4px 10px;" onclick="viewPastAcknowledgement('${a.registration_id}')">View & Print Receipt Slip →</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    body.innerHTML = `<p style="color: #dc2626; font-size: 0.84rem;">Failed to load applications: ${err.message}</p>`;
  }
}

async function viewPastAcknowledgement(refId) {
  const myApps = document.getElementById('my-apps-modal');
  if (myApps) myApps.style.display = 'none';

  initRegistrationModal();
  const regModal = document.getElementById('registration-modal');
  if (!regModal) return;

  try {
    const res = await fetch(`/api/registrations/${refId}`);
    const data = await res.json();
    if (res.ok && data.status === 'success') {
      renderRegistrationAcknowledgementSlip(data.registration);
      regModal.style.display = 'flex';
    } else {
      alert("Application not found.");
    }
  } catch (e) {
    alert("Error fetching application details: " + e.message);
  }
}

// ----------------------------------------------------
// Institutional Scheme Registration & Pre-Submission Confirmation
// ----------------------------------------------------
let pendingRegistrationData = null;

function initRegistrationModal() {
  if (document.getElementById('registration-modal')) return;

  const modalHtml = `
    <div id="registration-modal" class="reg-modal-backdrop">
      <div class="reg-modal-content">
        <div class="reg-modal-header">
          <div>
            <div style="font-size: 0.68rem; background: var(--green-subtle); color: var(--green-primary); border: 1px solid var(--green-border); padding: 2px 7px; border-radius: 3px; font-weight: 700; display: inline-block; margin-bottom: 4px;">
              MoSJE & NSFDC Official Portal
            </div>
            <h3 id="reg-title">Statutory Scheme Registration</h3>
            <p id="reg-subtitle">Direct Beneficiary Concessional Loan Application</p>
          </div>
          <button class="modal-close-icon" onclick="closeRegistrationModal()" title="Close">✕</button>
        </div>

        <div id="reg-body" class="reg-modal-body">
          <!-- Dynamically swapped between Step 1 (Form), Step 2 (Confirmation Review), and Step 3 (Acknowledgement Slip) -->
        </div>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = modalHtml;
  document.body.appendChild(container.firstElementChild);
}

function openRegistrationModal(schemeId) {
  initRegistrationModal();
  const modal = document.getElementById('registration-modal');
  if (!modal) return;

  if (!currentUserProfile) {
    authPendingSchemeId = schemeId;
    openAuthModal('login', schemeId);
    showAuthNotification(t('auth_prompt_to_register'));
    return;
  }

  const scheme = allSchemesCache.find(s => s.id === schemeId) || (allSchemesCache[0] || {});
  
  // Pre-fill directly from authenticated and verified beneficiary profile
  const prefillName = currentUserProfile.full_name;
  const prefillPhone = currentUserProfile.phone_number;
  const prefillEmail = currentUserProfile.email || 'applicant@example.gov.in';
  const prefillAadhaar = currentUserProfile.aadhaar_last_four || '8842';
  const prefillState = currentUserProfile.state || 'Delhi';
  const prefillDistrict = currentUserProfile.district || 'New Delhi';
  const prefillIncome = currentUserProfile.annual_income || 180000;
  const prefillGender = currentUserProfile.gender || 'Female';
  const prefillCaste = currentUserProfile.caste_category || 'SC';
  const prefillCasteCert = currentUserProfile.caste_cert_number || 'DL/REV/SC/77291';
  const prefillIncomeAuth = currentUserProfile.income_cert_authority || 'Revenue Dept / SDM';
  const prefillCost = scheme.max_project_cost || 120000;

  renderRegistrationStep1({
    scheme_id: scheme.id,
    scheme_name: (currentLang !== 'en' && scheme.name_hi) ? scheme.name_hi : scheme.name,
    applicant_name: prefillName,
    phone_number: prefillPhone,
    email: prefillEmail,
    aadhaar_last_four: prefillAadhaar,
    state: prefillState,
    district: prefillDistrict,
    gender: prefillGender,
    caste_category: prefillCaste,
    caste_cert_number: prefillCasteCert,
    annual_income: prefillIncome,
    income_cert_authority: prefillIncomeAuth,
    project_cost: prefillCost,
    interest_rate: scheme.interest_rate_beneficiary_pct,
    moratorium: scheme.moratorium_months,
    tenure: scheme.max_tenure_years
  });

  modal.style.display = 'flex';
}

function renderRegistrationStep1(data) {
  const body = document.getElementById('reg-body');
  if (!body) return;

  const isHi = currentLang === 'hi';
  body.innerHTML = `
    <div style="font-size: 0.82rem; color: var(--text-muted); border-bottom: 1px solid var(--border-dark); padding-bottom: 10px;">
      ${isHi ? 'चरण 1: कृपया अपने क्रेडेंशियल और योजना विवरण भरें। इसके बाद सिस्टम आपके विवरणों की पुष्टि करेगा।' : 'Step 1: Enter applicant demographic and financial credentials. The system will verify and confirm details before submission.'}
    </div>

    <div style="background: var(--bg-card-subtle); border: 1px solid var(--border-dark); border-radius: 4px; padding: 10px 14px; font-size: 0.82rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="color: var(--green-primary);">${isHi ? 'चयनित योजना' : 'Selected Scheme'}:</strong>
        <span style="font-weight: 700; color: var(--text-pure); margin-left: 6px;">${data.scheme_name}</span>
      </div>
      <span style="background: var(--green-subtle); color: var(--green-primary); border: 1px solid var(--green-border); padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.74rem;">
        ${data.interest_rate}% p.a. • ${data.moratorium} Mos Grace
      </span>
    </div>

    <form id="reg-step1-form" onsubmit="event.preventDefault(); proceedToConfirmationStep();" class="reg-form-grid">
      <input type="hidden" name="scheme_id" value="${data.scheme_id}">

      <div class="reg-input-group">
        <label>${isHi ? 'आवेदक का पूरा नाम' : 'Full Applicant Name'}</label>
        <input type="text" name="applicant_name" value="${data.applicant_name}" required>
      </div>

      <div class="reg-input-group">
        <label>${isHi ? 'मोबाइल नंबर' : '10-Digit Mobile Number'}</label>
        <input type="tel" name="phone_number" value="${data.phone_number}" pattern="[0-9]{10}" required>
      </div>

      <div class="reg-input-group">
        <label>${isHi ? 'आधार अंतिम 4 अंक' : 'Aadhaar Card (Last 4 Digits)'}</label>
        <input type="text" name="aadhaar_last_four" value="${data.aadhaar_last_four}" maxlength="4" pattern="[0-9]{4}" placeholder="e.g. 8842" required>
      </div>

      <div class="reg-input-group">
        <label>${isHi ? 'ईमेल (वैकल्पिक)' : 'Email ID (Optional)'}</label>
        <input type="email" name="email" value="${data.email}">
      </div>

      <div class="reg-input-group">
        <label>${isHi ? 'जाति वर्ग' : 'Caste Category'}</label>
        <select name="caste_category" required>
          <option value="SC" ${data.caste_category === 'SC' ? 'selected' : ''}>Scheduled Caste (SC)</option>
          <option value="Safai Karamchari / Dependent" ${data.caste_category && data.caste_category.includes('Safai') ? 'selected' : ''}>Safai Karamchari / Dependent</option>
        </select>
      </div>

      <div class="reg-input-group">
        <label>${isHi ? 'जाति प्रमाण पत्र संख्या' : 'Caste Certificate Number'}</label>
        <input type="text" name="caste_cert_number" value="${data.caste_cert_number}" required>
      </div>

      <div class="reg-input-group">
        <label>${isHi ? 'वार्षिक पारिवारिक आय (₹)' : 'Annual Family Income (₹)'}</label>
        <input type="number" name="annual_income" value="${data.annual_income}" max="300000" required>
      </div>

      <div class="reg-input-group">
        <label>${isHi ? 'आय प्रमाण पत्र जारीकर्ता' : 'Income Cert Issuing Authority'}</label>
        <input type="text" name="income_cert_authority" value="${data.income_cert_authority}" required>
      </div>

      <div class="reg-input-group">
        <label>${isHi ? 'लिंग' : 'Gender'}</label>
        <select name="gender" required>
          <option value="Female" ${data.gender === 'Female' ? 'selected' : ''}>${isHi ? 'महिला' : 'Female'}</option>
          <option value="Male" ${data.gender === 'Male' ? 'selected' : ''}>${isHi ? 'पुरुष' : 'Male'}</option>
          <option value="Other">${isHi ? 'अन्य' : 'Other'}</option>
        </select>
      </div>

      <div class="reg-input-group">
        <label>${isHi ? 'राज्य व जिला' : 'State & District'}</label>
        <input type="text" name="state_district" value="${data.state}, ${data.district}" required>
      </div>

      <div class="reg-input-group" style="grid-column: 1 / -1;">
        <label>${isHi ? 'अनुमानित परियोजना लागत (₹)' : 'Estimated Project Cost (₹)'}</label>
        <input type="number" name="project_cost" value="${data.project_cost}" required>
      </div>

      <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
        <button type="button" class="btn-secondary" onclick="closeRegistrationModal()">${isHi ? 'रद्द करें' : 'Cancel'}</button>
        <button type="submit" class="btn-primary">${isHi ? 'विवरण सत्यापित करें एवं आगे बढ़ें →' : 'Verify & Review Details →'}</button>
      </div>
    </form>
  `;
}

function proceedToConfirmationStep() {
  const form = document.getElementById('reg-step1-form');
  if (!form) return;

  const schemeId = form.scheme_id.value;
  const scheme = allSchemesCache.find(s => s.id === schemeId) || {};
  const cost = parseFloat(form.project_cost.value) || (scheme.max_project_cost || 120000);
  const finPct = (scheme.financing_percentage || 90.0) / 100.0;
  const maxLoan = scheme.max_loan_amount || cost;
  const loanShare = Math.min(cost * finPct, maxLoan);
  const marginMoney = Math.max(0, cost - loanShare);

  const stateDist = form.state_district.value.split(',');
  const state = stateDist[0] ? stateDist[0].trim() : 'Delhi';
  const district = stateDist[1] ? stateDist[1].trim() : 'New Delhi';

  pendingRegistrationData = {
    scheme_id: schemeId,
    scheme_name: (currentLang !== 'en' && scheme.name_hi) ? scheme.name_hi : scheme.name,
    applicant_name: form.applicant_name.value.trim(),
    phone_number: form.phone_number.value.trim(),
    email: form.email.value.trim(),
    aadhaar_last_four: form.aadhaar_last_four.value.trim(),
    caste_category: form.caste_category.value,
    caste_cert_number: form.caste_cert_number.value.trim(),
    annual_income: parseFloat(form.annual_income.value),
    income_cert_authority: form.income_cert_authority.value.trim(),
    gender: form.gender.value,
    state: state,
    district: district,
    project_cost: cost,
    requested_loan: loanShare,
    promoter_contribution: marginMoney,
    interest_rate: scheme.interest_rate_beneficiary_pct,
    moratorium: scheme.moratorium_months,
    tenure: scheme.max_tenure_years,
    confirmed_by_user: false
  };

  renderRegistrationConfirmationStep(pendingRegistrationData);
}

function renderRegistrationConfirmationStep(data) {
  const body = document.getElementById('reg-body');
  if (!body) return;

  const isHi = currentLang === 'hi';
  body.innerHTML = `
    <div style="background: var(--green-subtle); border: 1px solid var(--green-border); border-radius: 4px; padding: 12px 16px; display: flex; align-items: center; gap: 10px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <div>
        <strong style="color: var(--green-primary); font-size: 0.88rem;">${isHi ? 'चरण 2: कृपया अपने विवरण की अंतिम पुष्टि करें' : 'Step 2: Pre-Submission Verification & Confirmation'}</strong>
        <p style="font-size: 0.76rem; color: var(--text-main); margin-top: 1px;">
          ${isHi ? 'कृपया आवेदन जमा करने से पहले नीचे दिए गए सभी विवरणों की जांच करें।' : 'Please review your declared credentials before final commitment to the Channel Finance System.'}
        </p>
      </div>
    </div>

    <div class="confirm-review-card">
      <div class="confirm-review-row">
        <span class="confirm-review-label">${isHi ? 'आवेदक का नाम' : 'Applicant Full Name'}:</span>
        <span class="confirm-review-val">${data.applicant_name} (${data.gender})</span>
      </div>
      <div class="confirm-review-row">
        <span class="confirm-review-label">${isHi ? 'पहचान / आधार' : 'Identity (Masked Aadhaar)'}:</span>
        <span class="confirm-review-val">XXXX-XXXX-${data.aadhaar_last_four}</span>
      </div>
      <div class="confirm-review-row">
        <span class="confirm-review-label">${isHi ? 'मोबाइल नंबर' : 'Contact Mobile'}:</span>
        <span class="confirm-review-val">+91 ${data.phone_number}</span>
      </div>
      <div class="confirm-review-row">
        <span class="confirm-review-label">${isHi ? 'आरक्षित वर्ग व प्रमाण पत्र' : 'Community & Certificate'}:</span>
        <span class="confirm-review-val">${data.caste_category} (${data.caste_cert_number})</span>
      </div>
      <div class="confirm-review-row">
        <span class="confirm-review-label">${isHi ? 'वार्षिक पारिवारिक आय' : 'Annual Family Income'}:</span>
        <span class="confirm-review-val" style="color: var(--green-primary);">
          ₹${data.annual_income.toLocaleString('en-IN')}/yr (${isHi ? 'मान्य वैधानिक सीमा' : 'Statutory Eligible < ₹3.00L'})
        </span>
      </div>
      <div class="confirm-review-row">
        <span class="confirm-review-label">${isHi ? 'चयनित योजना' : 'Registered Scheme'}:</span>
        <span class="confirm-review-val">${data.scheme_name}</span>
      </div>
      <div class="confirm-review-row">
        <span class="confirm-review-label">${isHi ? 'परियोजना लागत / ऋण सहायता' : 'Project Cost / Concessional Loan'}:</span>
        <span class="confirm-review-val">₹${data.project_cost.toLocaleString('en-IN')} (Loan: ₹${data.requested_loan.toLocaleString('en-IN')})</span>
      </div>
      <div class="confirm-review-row">
        <span class="confirm-review-label">${isHi ? 'रियायती ब्याज दर व अनुग्रह अवधि' : 'Concessional Interest & Grace'}:</span>
        <span class="confirm-review-val" style="color: var(--green-primary);">${data.interest_rate}% p.a. (${data.moratorium} Months Moratorium)</span>
      </div>
      <div class="confirm-review-row">
        <span class="confirm-review-label">${isHi ? 'स्वयं का योगदान (मार्जिन)' : 'Promoter Margin Money'}:</span>
        <span class="confirm-review-val">₹${data.promoter_contribution.toLocaleString('en-IN')}</span>
      </div>
      <div class="confirm-review-row">
        <span class="confirm-review-label">${isHi ? 'आबंटित चैनल पार्टनर' : 'Allocated Channel Partner'}:</span>
        <span class="confirm-review-val" style="color: var(--green-primary);">Authorized State Channelizing Agency (SCA / PSB)</span>
      </div>
    </div>

    <div class="statutory-undertaking-card">
      <input type="checkbox" id="reg-confirm-checkbox" onchange="toggleConfirmButton(this.checked)">
      <label for="reg-confirm-checkbox">
        ${isHi 
          ? 'मैं एतद्द्वारा घोषित और पुष्टि करता/करती हूँ कि ऊपर दी गई सभी जानकारी सत्य और प्रमाणिक है। मुझे ज्ञात है कि यह आवेदन अधिकृत चैनल पार्टनर (SCA/बैंक) को प्रेषित किया जाएगा और मैं मूल प्रमाण पत्र प्रस्तुत करने हेतु सहमत हूँ।' 
          : 'I hereby declare and confirm that all the information provided above is true, accurate, and authentic. I understand that direct applications are routed through authorized Channel Partners (SCAs/Banks) and agree to present original certificates for physical verification.'}
      </label>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
      <button type="button" class="btn-secondary" onclick="renderRegistrationStep1(pendingRegistrationData)">
        ${isHi ? '← विवरण संपादित करें' : '← Edit Details'}
      </button>
      <button type="button" id="reg-submit-btn" class="btn-primary" disabled onclick="submitConfirmedRegistration()">
        ${isHi ? 'पुष्टि करें एवं आधिकारिक पंजीकरण जमा करें →' : 'Confirm & Submit Official Registration →'}
      </button>
    </div>
  `;
}

function toggleConfirmButton(checked) {
  const btn = document.getElementById('reg-submit-btn');
  if (btn) btn.disabled = !checked;
}

async function submitConfirmedRegistration() {
  if (!pendingRegistrationData) return;
  pendingRegistrationData.confirmed_by_user = true;

  const btn = document.getElementById('reg-submit-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = currentLang === 'hi' ? 'पंजीकरण जमा किया जा रहा है...' : 'Committing Statutory Registration...';
  }

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (currentUserToken) headers['Authorization'] = `Bearer ${currentUserToken}`;

    const res = await fetch('/api/register-scheme', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(pendingRegistrationData)
    });
    const result = await res.json();

    if (res.ok && result.status === 'success') {
      renderRegistrationAcknowledgementSlip(result.registration);
    } else {
      alert("Registration Error: " + (result.detail || result.message || "Failed to commit registration."));
      if (btn) {
        btn.disabled = false;
        btn.textContent = currentLang === 'hi' ? 'पुनः प्रयास करें' : 'Try Again';
      }
    }
  } catch (err) {
    alert("Network error submitting registration: " + err.message);
    if (btn) {
      btn.disabled = false;
      btn.textContent = currentLang === 'hi' ? 'पुनः प्रयास करें' : 'Try Again';
    }
  }
}

function renderRegistrationAcknowledgementSlip(reg) {
  const body = document.getElementById('reg-body');
  if (!body) return;

  const isHi = currentLang === 'hi';
  body.innerHTML = `
    <div id="printable-registration-receipt" class="reg-receipt-slip">
      <div style="text-align: center; border-bottom: 2px solid var(--green-primary); padding-bottom: 12px; margin-bottom: 14px;">
        <span class="flag-strip" style="display:inline-block; margin-bottom: 4px;"><span></span><span></span><span></span></span>
        <h3 style="font-size: 1.1rem; color: var(--green-primary); font-weight: 800; letter-spacing: -0.2px;">
          ${isHi ? 'भारत सरकार • सामाजिक न्याय एवं अधिकारिता मंत्रालय' : 'GOVERNMENT OF INDIA • MoSJE & NSFDC'}
        </h3>
        <p style="font-size: 0.78rem; color: var(--text-muted); margin: 2px 0 6px;">
          ${isHi ? 'आधिकारिक वैधानिक योजना पंजीकरण पावती पर्ची' : 'Official Statutory Scheme Registration Acknowledgement Slip'}
        </p>
        <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
          <span style="font-size: 0.76rem; background: var(--green-subtle); color: var(--green-primary); border: 1px solid var(--green-border); padding: 3px 10px; border-radius: 3px; font-weight: 800;">
            REF ID: ${reg.registration_id}
          </span>
          <span style="font-size: 0.72rem; background: var(--bg-card-subtle); border: 1px solid var(--border-dark); padding: 3px 8px; border-radius: 3px; color: var(--text-muted);">
            ${reg.submission_timestamp}
          </span>
        </div>
      </div>

      <div style="background: var(--green-subtle); border: 1px solid var(--green-border); padding: 8px 12px; border-radius: 4px; font-size: 0.78rem; color: var(--green-primary); font-weight: 700; text-align: center; margin-bottom: 14px;">
        ${isHi ? reg.status_label_hi : reg.status_label_en}
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.82rem; margin-bottom: 14px; background: var(--bg-card-subtle); padding: 12px; border-radius: 4px; border: 1px solid var(--border-dark);">
        <div>
          <strong>${isHi ? 'आवेदक का नाम' : 'Applicant'}:</strong> ${reg.applicant.name}<br/>
          <strong>${isHi ? 'पहचान / आधार' : 'Aadhaar'}:</strong> XXXX-XXXX-${reg.applicant.aadhaar_last_four}<br/>
          <strong>${isHi ? 'वर्ग व आय' : 'Caste & Income'}:</strong> ${reg.applicant.caste_category} (₹${reg.applicant.annual_income.toLocaleString('en-IN')})
        </div>
        <div>
          <strong>${isHi ? 'पंजीकृत योजना' : 'Scheme'}:</strong> ${isHi ? reg.scheme.name_hi : reg.scheme.name}<br/>
          <strong>${isHi ? 'स्वीकृत ऋण शेयर' : 'Concessional Loan'}:</strong> ₹${reg.financial_summary.concessional_loan_amount.toLocaleString('en-IN')} @ ${reg.financial_summary.interest_rate_beneficiary_pct}% p.a.<br/>
          <strong>${isHi ? 'अनुग्रह अवधि' : 'Moratorium'}:</strong> ${reg.financial_summary.moratorium_months} ${isHi ? 'माह' : 'Months'}
        </div>
      </div>

      <div style="border: 1px solid var(--border-dark); border-radius: 4px; padding: 12px; margin-bottom: 14px;">
        <h4 style="font-size: 0.82rem; font-weight: 700; color: var(--text-pure); margin-bottom: 6px; text-transform: uppercase;">
          ${isHi ? 'आबंटित चैनल पार्टनर कार्यालय (सत्यापन केंद्र)' : 'Allocated Channel Partner Branch (Verification Center)'}
        </h4>
        <p style="font-size: 0.80rem; font-weight: 600; color: var(--green-primary); margin-bottom: 2px;">
          ${reg.allocated_channel_partner.name}
        </p>
        <p style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 4px;">
          ${reg.allocated_channel_partner.address} • Phone: ${reg.allocated_channel_partner.phone}
        </p>
        <p style="font-size: 0.74rem; color: var(--text-pure); background: var(--bg-card-subtle); padding: 6px 8px; border-radius: 3px; border-left: 3px solid var(--green-primary);">
          <strong>${isHi ? 'निर्देश:' : 'Action Required:'}</strong> ${isHi ? reg.next_steps_hi : reg.next_steps_en}
        </p>
      </div>

      <div style="font-size: 0.76rem;">
        <strong style="color: var(--text-pure); text-transform: uppercase;">${isHi ? 'भौतिक सत्यापन हेतु आवश्यक दस्तावेज:' : 'Documents for Physical Verification:'}</strong>
        <ul style="margin: 6px 0 0 16px; color: var(--text-muted);">
          ${reg.document_checklist.map(d => `<li><strong>${d.document_name}</strong> (${d.issuing_authority})</li>`).join('')}
        </ul>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px;">
      <button class="btn-secondary" onclick="closeRegistrationModal()">${isHi ? 'पूर्ण / बंद करें' : 'Close'}</button>
      <button class="btn-primary" onclick="window.print()">${isHi ? 'पावती पर्ची प्रिंट करें' : 'Print Acknowledgement Slip'}</button>
    </div>
  `;
}

function closeRegistrationModal() {
  const modal = document.getElementById('registration-modal');
  if (modal) modal.style.display = 'none';
}