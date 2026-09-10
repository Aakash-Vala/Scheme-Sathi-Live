"""
Chatbot Advisory Service for Scheme Sathi (SIH Problem Statement 26092).
Provides domain-specific, NLP-powered conversational intelligence on MoSJE & NSFDC
concessional lending schemes, statutory eligibility, document checklists,
channel partner routing, and interest rate savings.
"""

import json
import os
import re
from typing import Dict, Any, List, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class ChatbotAdvisoryService:
    def __init__(self, schemes_file: Optional[str] = None):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        if schemes_file is None:
            schemes_file = os.path.join(base_dir, "data", "government_schemes.json")
            
        with open(schemes_file, "r", encoding="utf-8") as f:
            self.schemes = json.load(f)
            
        self.scheme_by_id = {s["id"]: s for s in self.schemes}
        
        # Build NLP retrieval index
        self._build_knowledge_base()

    def _build_knowledge_base(self):
        """Constructs statutory knowledge base and TF-IDF corpus for semantic intent retrieval."""
        self.knowledge_entries = []
        
        # 1. Scheme-specific knowledge
        for s in self.schemes:
            # English entry
            en_text = f"{s['name']} {s['category']} {s['description_en']} " + " ".join(s.get("eligible_activities", [])) + " " + " ".join(s.get("required_documents", []))
            self.knowledge_entries.append({
                "type": "scheme_overview",
                "scheme_id": s["id"],
                "lang": "en",
                "text": en_text,
                "data": s
            })
            # Hindi entry
            hi_text = f"{s.get('name_hi', s['name'])} {s.get('description_hi', '')} " + " ".join(s.get("eligible_activities", []))
            self.knowledge_entries.append({
                "type": "scheme_overview",
                "scheme_id": s["id"],
                "lang": "hi",
                "text": hi_text,
                "data": s
            })

        # 2. General Statutory FAQs
        self.faqs = [
            {
                "id": "faq_income_criteria",
                "topics": ["income", "annual income", "limit", "salary", "eligibility", "आय", "वार्षिक आय", "आय सीमा", "पात्रता"],
                "answer_en": "Under NSFDC guidelines, the statutory annual family income ceiling is up to ₹3,00,000 per annum for both rural and urban areas for Micro Credit (MSY, MCF) and Term Loans. Select higher-value credit schemes such as Stand-Up India and VCF-SC accommodate higher business project requirements without traditional BPL/EWS income caps.",
                "answer_hi": "NSFDC दिशानिर्देशों के तहत, सूक्ष्म ऋण (MSY, MCF) और सावधि ऋणों के लिए ग्रामीण और शहरी दोनों क्षेत्रों में वार्षिक पारिवारिक आय की वैधानिक सीमा ₹3,00,000 प्रति वर्ष तक है। स्टैंड-अप इंडिया और VCF-SC जैसी उच्च-मूल्य योजनाओं के लिए पारंपरिक आय सीमा लागू नहीं होती।",
                "actions": [
                    {"label": "Check Eligibility in Recommender", "url": "/recommender"},
                    {"label": "Explore Schemes", "url": "/"}
                ]
            },
            {
                "id": "faq_channel_finance",
                "topics": ["channel partner", "sca", "psb", "rrb", "apply direct", "channel finance", "बैंक", "चैनल पार्टनर", "आवेदन कैसे करें", "एजेंसी"],
                "answer_en": "Important: Direct loan applications are NOT entertained directly at NSFDC headquarters. Under the official 'Channel Finance System', concessional funds are disbursed through over 100 accredited Channel Partners comprising State Channelizing Agencies (SCAs), Public Sector Banks (PSBs like SBI, PNB, Canara Bank), and Regional Rural Banks (RRBs). You must submit your application to your local SCA or partner bank.",
                "answer_hi": "महत्वपूर्ण: NSFDC मुख्यालय में सीधे ऋण आवेदन स्वीकार नहीं किए जाते हैं। आधिकारिक 'चैनल फाइनेंस सिस्टम' के तहत, रियायती धनराशि 100 से अधिक मान्यता प्राप्त चैनल पार्टनरों जैसे राज्य चैनेलाइजिंग एजेंसियों (SCA), सार्वजनिक क्षेत्र के बैंकों (PSBs) और क्षेत्रीय ग्रामीण बैंकों (RRBs) के माध्यम से वितरित की जाती है।",
                "actions": [
                    {"label": "Locate Channel Partners Near You", "url": "/locator"},
                    {"label": "Generate Application Checklist", "url": "/recommender"}
                ]
            },
            {
                "id": "faq_documents",
                "topics": ["document", "documents", "paperwork", "caste certificate", "income certificate", "proof", "दस्तावेज", "कागजात", "प्रमाण पत्र", "आधार"],
                "answer_en": "Standard mandatory documents required for MoSJE / NSFDC concessional loans include:\n1. SC Community / Caste Certificate issued by competent Revenue Authority (Tehsildar/SDM)\n2. Valid Family Income Certificate (under ₹3.00 Lakhs/yr)\n3. Aadhaar Card & PAN Card\n4. Bank Account Passbook (linked with Aadhaar)\n5. Detailed Project Cost Quotation or Estimate\n6. Two Passport-size Photographs\nFor education loans, admission offer letter and fee schedule are also required.",
                "answer_hi": "MoSJE / NSFDC रियायती ऋणों के लिए आवश्यक अनिवार्य दस्तावेज:\n1. सक्षम राजस्व प्राधिकारी (तहसीलदार/SDM) द्वारा जारी अनुसूचित जाति (SC) प्रमाण पत्र\n2. वैध पारिवारिक आय प्रमाण पत्र (₹3.00 लाख/वर्ष से कम)\n3. आधार कार्ड और पैन कार्ड\n4. आधार से लिंक बैंक खाता पासबुक\n5. प्रोजेक्ट लागत का कोटेशन/अनुमान\n6. दो पासपोर्ट साइज फोटो\nशिक्षा ऋण के लिए प्रवेश पत्र और शुल्क विवरण भी आवश्यक है।",
                "actions": [
                    {"label": "Generate Pre-filled Application & Checklist", "url": "/recommender"}
                ]
            },
            {
                "id": "faq_interest_moratorium",
                "topics": ["interest rate", "interest", "moratorium", "grace period", "savings", "ब्याज", "ब्याज दर", "मोराटोरियम", "छूट"],
                "answer_en": "NSFDC concessional interest rates range from just 4.0% p.a. (Mahila Samriddhi Yojana for women) to 8.0% p.a. (Term Loans), saving up to 60%-70% in total interest compared to 12.0%-16.0% commercial bank rates. Furthermore, all schemes include a statutory Moratorium (Grace Period) of 3 to 18 months during which only nominal interest is payable before principal EMI begins.",
                "answer_hi": "NSFDC की रियायती ब्याज दरें महिलाओं के लिए मात्र 4.0% प्रति वर्ष (महिला समृद्धि योजना) से 8.0% प्रति वर्ष (सावधि ऋण) तक हैं, जो सामान्य बैंकों की 12.0%-16.0% दरों की तुलना में 60%-70% ब्याज बचाती हैं। इसके अलावा, 3 से 18 महीने का मोराटोरियम (अनुग्रह अवधि) मिलता है।",
                "actions": [
                    {"label": "Calculate Concessional EMI", "url": "/calculator"},
                    {"label": "View Comparison", "url": "/calculator?loan=140000&rate=4.0&tenure=3&moratorium=3"}
                ]
            },
            {
                "id": "faq_education_loan",
                "topics": ["study", "education", "college", "btech", "mbba", "abroad", "higher education", "els", "शिक्षा", "पढ़ाई", "कॉलेज", "विदेश"],
                "answer_en": "Under the NSFDC Education Loan Scheme (ELS), Scheduled Caste students can avail concessional loans up to ₹20.00 Lakhs for professional courses in India and up to ₹30.00 Lakhs for overseas studies. Interest rate is 4.0% p.a. for female students and 4.5% p.a. for male students. Repayment includes course duration + 6 months to 1 year moratorium.",
                "answer_hi": "NSFDC शिक्षा ऋण योजना (ELS) के तहत, अनुसूचित जाति के छात्र भारत में व्यावसायिक पाठ्यक्रमों के लिए ₹20.00 लाख तक और विदेश में अध्ययन के लिए ₹30.00 लाख तक का रियायती ऋण प्राप्त कर सकते हैं। छात्राओं के लिए ब्याज दर मात्र 4.0% और छात्रों के लिए 4.5% है। कोर्स अवधि + 6 माह से 1 वर्ष का मोराटोरियम उपलब्ध है।",
                "actions": [
                    {"label": "Calculate Education Loan EMI", "url": "/calculator?loan=1500000&rate=4.0&tenure=10&moratorium=12"},
                    {"label": "Check ELS Eligibility", "url": "/recommender"}
                ]
            },
            {
                "id": "faq_margin_money",
                "topics": ["margin money", "promoter contribution", "self funding", "percentage", "मार्जिन", "स्वयं का योगदान"],
                "answer_en": "NSFDC finances between 90% and 95% of the total project or course cost. For Micro Credit Finance (MSY, MCF), zero promoter contribution is required (100% financed by NSFDC/SCA). For small business term loans (LVY, GBS), the promoter's contribution is only 2% to 10% of the project cost.",
                "answer_hi": "NSFDC कुल परियोजना या पाठ्यक्रम लागत का 90% से 95% तक वित्तपोषण प्रदान करता है। माइक्रो क्रेडिट (MSY, MCF) के लिए शून्य मार्जिन मनी की आवश्यकता है (100% वित्तपोषण)। छोटे व्यवसाय ऋणों (LVY, GBS) के लिए प्रमोटर का अंशदान केवल 2% से 10% है।",
                "actions": [
                    {"label": "Simulate Loan & Margin", "url": "/calculator"}
                ]
            }
        ]

        for faq in self.faqs:
            topic_str = " ".join(faq["topics"])
            self.knowledge_entries.append({
                "type": "faq",
                "faq_id": faq["id"],
                "lang": "en",
                "text": f"{topic_str} {faq['answer_en']}",
                "data": faq
            })
            self.knowledge_entries.append({
                "type": "faq",
                "faq_id": faq["id"],
                "lang": "hi",
                "text": f"{topic_str} {faq['answer_hi']}",
                "data": faq
            })

        self.corpus_texts = [entry["text"] for entry in self.knowledge_entries]
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
        self.tfidf_matrix = self.vectorizer.fit_transform(self.corpus_texts)

    def answer_query(self, user_query: str, preferred_lang: str = "en", lang: Optional[str] = None) -> Dict[str, Any]:
        """
        Processes citizen query, scores semantic knowledge base via TF-IDF + intent heuristics,
        and generates an accurate institutional response with actionable links.
        """
        active_lang = lang if lang else preferred_lang
        query_cleaned = user_query.strip()
        if not query_cleaned:
            return self._get_fallback_response(active_lang)

        # Detect language preference from query or argument
        lang = active_lang if active_lang in ["en", "hi", "mr", "ta", "te", "bn"] else "en"
        # If query contains Devanagari script, prioritize Hindi/Marathi
        if re.search(r'[\u0900-\u097F]', query_cleaned) and lang == "en":
            lang = "hi"

        query_lower = query_cleaned.lower()

        # 1. Quick greetings handling
        greetings_en = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "namaste", "namaskar"]
        greetings_hi = ["नमस्ते", "नमस्कार", "प्रणाम", "हेलो", "हाय"]
        if query_lower in greetings_en or any(query_cleaned.startswith(g) for g in greetings_hi):
            return self._get_greeting_response(lang)

        # 2. Scheme-specific exact intent match
        matched_scheme = None
        for s in self.schemes:
            code = s["id"].replace("nsfdc_", "").lower()
            name_lower = s["name"].lower()
            name_hi = s.get("name_hi", "").lower()
            
            # Check acronyms or direct titles
            if (code in query_lower or 
                s["name"].lower() in query_lower or 
                (code == "msy" and ("mahila" in query_lower or "samriddhi" in query_lower or "महिला" in query_cleaned)) or
                (code == "mcf" and ("micro credit" in query_lower or "सूक्ष्म ऋण" in query_cleaned)) or
                (code == "lvy" and ("laghu" in query_lower or "vyavasay" in query_lower or "लघु व्यवसाय" in query_cleaned)) or
                (code == "els" and ("education" in query_lower or "study" in query_lower or "शिक्षा" in query_cleaned or "विदेश" in query_cleaned)) or
                (code == "suy" and ("swachhta" in query_lower or "sanitation" in query_lower or "सफाई" in query_cleaned or "स्वच्छता" in query_cleaned)) or
                (code == "standup" and ("stand-up" in query_lower or "stand up" in query_lower or "स्टैंड-अप" in query_cleaned)) or
                (code == "vcf_sc" and ("venture" in query_lower or "vcf" in query_lower or "वेंचर" in query_cleaned))):
                matched_scheme = s
                break

        # If scheme matched specifically and user asked about its interest rate, documents, or cost
        if matched_scheme:
            return self._generate_scheme_response(matched_scheme, query_lower, query_cleaned, lang)

        # 3. Check specific FAQ keywords
        for faq in self.faqs:
            for t in faq["topics"]:
                if t in query_lower or t in query_cleaned:
                    ans = faq["answer_hi"] if lang in ["hi", "mr"] else faq["answer_en"]
                    return {
                        "reply": ans,
                        "suggested_actions": faq.get("actions", []),
                        "related_schemes": [],
                        "language": lang
                    }

        # 4. TF-IDF Semantic Vector Similarity
        query_vec = self.vectorizer.transform([query_cleaned])
        scores = cosine_similarity(query_vec, self.tfidf_matrix)[0]
        best_idx = int(scores.argmax())
        best_score = float(scores[best_idx])

        if best_score > 0.12:
            best_entry = self.knowledge_entries[best_idx]
            if best_entry["type"] == "faq":
                faq = best_entry["data"]
                ans = faq["answer_hi"] if lang in ["hi", "mr"] else faq["answer_en"]
                return {
                    "reply": ans,
                    "suggested_actions": faq.get("actions", []),
                    "related_schemes": [],
                    "language": lang
                }
            elif best_entry["type"] == "scheme_overview":
                scheme = best_entry["data"]
                return self._generate_scheme_response(scheme, query_lower, query_cleaned, lang)

        # 5. Fallback Response with helpful guidance
        return self._get_fallback_response(lang)

    def _generate_scheme_response(self, scheme: Dict[str, Any], query_lower: str, query_raw: str, lang: str) -> Dict[str, Any]:
        """Generates detailed institutional response for a matched scheme."""
        is_hi = lang in ["hi", "mr"]
        scheme_name = scheme["name_hi"] if is_hi and scheme.get("name_hi") else scheme["name"]
        
        # Check specific facet
        if any(w in query_lower or w in query_raw for w in ["document", "documents", "दस्तावेज", "कागजात", "proof"]):
            docs_list = scheme.get("required_documents", [])
            if is_hi:
                reply = f"**{scheme_name} के लिए आवश्यक दस्तावेज:**\n" + "\n".join([f"• {d}" for d in docs_list])
            else:
                reply = f"**Required Documents for {scheme_name}:**\n" + "\n".join([f"• {d}" for d in docs_list])
        elif any(w in query_lower or w in query_raw for w in ["interest", "rate", "ब्याज", "दर"]):
            rate = scheme["interest_rate_beneficiary_pct"]
            rebate = scheme.get("interest_rate_female_rebate_pct", 0)
            comm_rate = scheme.get("commercial_bank_rate_pct", 12.0)
            if is_hi:
                reply = f"**{scheme_name} की ब्याज दर:**\n• रियायती ब्याज दर: **{rate}% प्रति वर्ष**\n• सामान्य बैंक दर: ~{comm_rate}% प्रति वर्ष\n• ब्याज बचत: लगभग {round(comm_rate - rate, 1)}% प्रति वर्ष।\n• मोराटोरियम अवधि: {scheme.get('moratorium_months', 3)} माह।"
            else:
                reply = f"**Interest Rate for {scheme_name}:**\n• Concessional Beneficiary Rate: **{rate}% p.a.**\n• Commercial Bank Benchmark: ~{comm_rate}% p.a.\n• Net Annual Interest Saving: ~{round(comm_rate - rate, 1)}% p.a.\n• Moratorium (Grace Period): {scheme.get('moratorium_months', 3)} Months."
        else:
            # Full summary
            desc = scheme.get("description_hi", scheme["description_en"]) if is_hi else scheme["description_en"]
            max_loan = scheme["max_loan_amount"]
            rate = scheme["interest_rate_beneficiary_pct"]
            tenure = scheme["max_tenure_years"]
            mora = scheme["moratorium_months"]
            
            if is_hi:
                reply = (
                    f"**{scheme_name}** ({scheme['category']})\n\n"
                    f"{desc}\n\n"
                    f"• **अधिकतम ऋण सीमा:** ₹{max_loan:,}\n"
                    f"• **रियायती ब्याज दर:** {rate}% प्रति वर्ष\n"
                    f"• **अधिकतम अवधि:** {tenure} वर्ष\n"
                    f"• **मोराटोरियम (अनुग्रह अवधि):** {mora} माह\n"
                    f"• **लक्ष्य वर्ग:** {scheme['target_beneficiary']}"
                )
            else:
                reply = (
                    f"**{scheme_name}** ({scheme['category']})\n\n"
                    f"{desc}\n\n"
                    f"• **Maximum Loan Limit:** ₹{max_loan:,}\n"
                    f"• **Concessional Interest Rate:** {rate}% p.a.\n"
                    f"• **Repayment Tenure:** Up to {tenure} years\n"
                    f"• **Moratorium (Grace Period):** {mora} months\n"
                    f"• **Target Beneficiary:** {scheme['target_beneficiary']}"
                )

        actions = [
            {
                "label": "Calculate EMI" if not is_hi else "ईएमआई की गणना करें",
                "url": f"/calculator?loan={scheme['max_loan_amount']}&rate={scheme['interest_rate_beneficiary_pct']}&tenure={scheme['max_tenure_years']}&moratorium={scheme.get('moratorium_months', 3)}"
            },
            {
                "label": "Check Eligibility" if not is_hi else "पात्रता जांचें",
                "url": "/recommender"
            },
            {
                "label": "Locate Partner" if not is_hi else "चैनल पार्टनर खोजें",
                "url": f"/locator?category={scheme['category']}"
            }
        ]

        return {
            "reply": reply,
            "suggested_actions": actions,
            "related_schemes": [scheme["id"]],
            "language": lang
        }

    def _get_greeting_response(self, lang: str) -> Dict[str, Any]:
        """Returns institutional greeting message."""
        is_hi = lang in ["hi", "mr"]
        if is_hi:
            reply = (
                "नमस्ते! मैं 'योजना साथी' का आधिकारिक डिजिटल सहायक हूँ।\n\n"
                "आप मुझसे निम्न विषयों पर प्रश्न पूछ सकते हैं:\n"
                "1. सामाजिक न्याय एवं अधिकारिता मंत्रालय (MoSJE) व NSFDC की रियायती योजनाएं\n"
                "2. आय सीमा और जाति पात्रता दिशानिर्देश\n"
                "3. आवेदन हेतु आवश्यक दस्तावेज (जाति, आय, कोटेशन)\n"
                "4. चैनल पार्टनर (SCA, सरकारी बैंक, ग्रामीण बैंक)\n"
                "5. ब्याज दरें और मोराटोरियम (अनुग्रह अवधि)"
            )
        else:
            reply = (
                "Welcome to the official **Scheme Sathi Advisory Desk** (MoSJE & NSFDC).\n\n"
                "I can assist you with:\n"
                "1. Concessional credit schemes (MSY, MCF, LVY, Term Loan, Education Loan)\n"
                "2. Statutory eligibility thresholds (Income under ₹3L/yr, SC category)\n"
                "3. Mandatory document requirements\n"
                "4. Authorized Channel Partners (SCAs, PSBs, RRBs)\n"
                "5. Concessional interest rates (4.0% - 8.0%) and Moratorium periods"
            )

        actions = [
            {"label": "Recommend Best Scheme", "url": "/recommender"},
            {"label": "EMI Calculator", "url": "/calculator"},
            {"label": "Find Channel Partners", "url": "/locator"}
        ]

        return {
            "reply": reply,
            "suggested_actions": actions,
            "related_schemes": [],
            "language": lang
        }

    def _get_fallback_response(self, lang: str) -> Dict[str, Any]:
        """Provides helpful fallback advice when exact match is low confidence."""
        is_hi = lang in ["hi", "mr"]
        if is_hi:
            reply = (
                "मुझे आपका प्रश्न पूरी तरह समझ नहीं आया। कृपया अपना प्रश्न स्पष्ट शब्दों में पूछें, जैसे:\n"
                "• 'महिला समृद्धि योजना की ब्याज दर क्या है?'\n"
                "• 'ऋण आवेदन के लिए कौन-से दस्तावेज चाहिए?'\n"
                "• 'वार्षिक आय की सीमा क्या है?'\n"
                "• 'चैनल पार्टनर बैंक कैसे खोजें?'"
            )
        else:
            reply = (
                "I couldn't find an exact statutory match for your query. You can ask questions such as:\n"
                "• \"What is the interest rate for Mahila Samriddhi Yojana?\"\n"
                "• \"What documents are required to apply for a loan?\"\n"
                "• \"What is the annual income eligibility limit?\"\n"
                "• \"How do I locate my nearest State Channelizing Agency (SCA)?\""
            )

        actions = [
            {"label": "Launch AI Recommender", "url": "/recommender"},
            {"label": "Locate Partner Banks", "url": "/locator"},
            {"label": "Calculate Loan EMI", "url": "/calculator"}
        ]

        return {
            "reply": reply,
            "suggested_actions": actions,
            "related_schemes": [],
            "language": lang
        }

    def get_suggestions(self, lang: str = "en") -> List[str]:
        """Returns standard starter queries for quick inquiry buttons."""
        if lang in ["hi", "mr"]:
            return [
                "महिला समृद्धि योजना (MSY) क्या है?",
                "वार्षिक आय सीमा क्या है?",
                "आवेदन के लिए कौन-से दस्तावेज चाहिए?",
                "चैनल पार्टनर (SCA) क्या होता है?",
                "शिक्षा ऋण (ELS) की ब्याज दर क्या है?"
            ]
        elif lang == "ta":
            return [
                "மகளிர் சம்ரித்தி யோஜனா என்றால் என்ன?",
                "வருமான தகுதி வரம்பு என்ன?",
                "தேவையான ஆவணங்கள் எவை?",
                "சேனல் பார்ட்னர் என்றால் என்ன?"
            ]
        elif lang == "te":
            return [
                "మహిళా సమృద్ధి యోజన అంటే ఏమిటి?",
                "ఆదాయ అర్హత పరిమితి ఎంత?",
                "కావాల్సిన పత్రాలు ఏమిటి?",
                "ఛానల్ భాగస్వామి అంటే ఏమిటి?"
            ]
        elif lang == "bn":
            return [
                "মহিলা সমৃদ্ধি যোজনা কী?",
                "বার্ষিক আয়ের সীমা কত?",
                "প্রয়োজনীয় নথিগুলি কী কী?",
                "চ্যানেল পার্টনার কী?"
            ]
        else:
            return [
                "What is Mahila Samriddhi Yojana (MSY)?",
                "What is the annual income limit?",
                "What documents are required to apply?",
                "What is a State Channelizing Agency (SCA)?",
                "What is the Education Loan interest rate?"
            ]


# Singleton instance
_chatbot_instance = None

def get_chatbot_service() -> ChatbotAdvisoryService:
    global _chatbot_instance
    if _chatbot_instance is None:
        _chatbot_instance = ChatbotAdvisoryService()
    return _chatbot_instance
