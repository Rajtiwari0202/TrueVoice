"""
TrueVoice Contextual Risk Enrichment Engine
Satisfies: Risk Scoring Engine -> Contextual enrichment (call origin, transaction, fraud history)

Enriches acoustic threat scores using:
1. Transaction Value Escalation (e.g. wire amount scaling from INR 50,000 to INR 50,00,000)
2. Geolocation / Virtual PBX Origin Mismatch (e.g. +91 caller ID routed via offshore SIP proxy)
3. National Cybercrime Reporting Portal (I4C / NCRP) Fraud History Blacklist
"""

class ContextualRiskEnricher:
    # Known high-risk foreign virtual PBX prefixes / offshore cybercrime hubs
    HIGH_RISK_ORIGINS = ["+855", "+95", "+856", "+234", "SIP_PROXY_CAMBODIA", "SIP_PROXY_MYANMAR"]

    # I4C flagged numbers with active FIR / NCRP complaints
    MOCK_I4C_BLACKLIST = {
        "+91 98112 34567": {"flag": "ACTIVE_DIGITAL_ARREST_FIR", "reports_count": 14, "risk_category": "CRITICAL"},
        "+91 98765 00112": {"flag": "KNOWN_CEO_IMPERSONATION", "reports_count": 8, "risk_category": "HIGH"},
        "+91 91234 56789": {"flag": "SUSPICIOUS_KYC_EXTORTION", "reports_count": 3, "risk_category": "MEDIUM"}
    }

    def evaluate_context(
        self, 
        caller_phone: str = "", 
        claimed_identity: str = "", 
        transaction_amount: float = 0.0,
        call_origin: str = "DOMESTIC_PSTN",
        scenario_type: str = "CASUAL_CALL"
    ) -> dict:
        """
        Computes the Contextual Risk Factor (1.0x to 2.5x) and shifts the Bayesian threat probability.
        """
        risk_multiplier = 1.0
        risk_factors = []

        # 1. Transaction Value Escalation
        if transaction_amount > 5000000.0:  # > 50 Lakhs
            risk_multiplier *= 1.60
            risk_factors.append(f"HIGH_VALUE_WIRE_ESCALATION (INR {transaction_amount:,.0f} > 50 Lakhs)")
        elif transaction_amount > 1000000.0: # > 10 Lakhs
            risk_multiplier *= 1.35
            risk_factors.append(f"ELEVATED_WIRE_AMOUNT (INR {transaction_amount:,.0f})")
        elif transaction_amount > 100000.0: # > 1 Lakh
            risk_multiplier *= 1.15
            risk_factors.append(f"TRANSACTION_ESCALATION (INR {transaction_amount:,.0f})")

        # 2. Call Origin / Geolocation Proxy Detection
        for prefix in self.HIGH_RISK_ORIGINS:
            if caller_phone.startswith(prefix) or prefix in call_origin:
                risk_multiplier *= 1.45
                risk_factors.append(f"OFFSHORE_VIRTUAL_PBX_PROXY_DETECTED ({prefix})")
                break

        # 3. I4C / National Cybercrime Portal Blacklist Check
        matched_blacklist = self.MOCK_I4C_BLACKLIST.get(caller_phone.strip())
        if matched_blacklist:
            risk_multiplier *= 1.50
            risk_factors.append(f"I4C_FRAUD_HISTORY_MATCH ({matched_blacklist['flag']}, {matched_blacklist['reports_count']} Complaints)")

        # 4. Law Enforcement / Government Impersonation Keywords in Identity
        high_risk_roles = ["cbi", "police", "customs", "ed officer", "narcotics", "court", "judge", "director general"]
        if any(role in claimed_identity.lower() for role in high_risk_roles):
            risk_multiplier *= 1.30
            risk_factors.append(f"REGULATORY_AUTHORITY_COERCION_CLAIM ({claimed_identity})")

        risk_multiplier = round(min(2.5, risk_multiplier), 2)
        has_context_risk = len(risk_factors) > 0

        return {
            "has_context_risk": has_context_risk,
            "context_risk_multiplier": risk_multiplier,
            "risk_factors": risk_factors,
            "i4c_blacklist_record": matched_blacklist or "CLEAN_NCRP_RECORD",
            "transaction_amount_inr": transaction_amount,
            "call_origin": call_origin
        }

    def enrich_threat_score(self, base_acoustic_threat: float, context_evaluation: dict) -> float:
        """
        Fuses acoustic threat score with contextual multiplier:
        Threat_final = clip(BaseAcoustic * Multiplier, 1.0, 99.9)
        """
        mult = context_evaluation.get("context_risk_multiplier", 1.0)
        enriched_score = base_acoustic_threat * mult
        return round(float(min(99.9, max(1.0, enriched_score))), 1)
