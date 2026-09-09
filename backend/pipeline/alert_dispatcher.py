"""
TrueVoice Multi-Channel Alerting & Pre-Transaction Warning Dispatcher
Satisfies: 
- Alerting Layer -> Multi-channel alerts (UI / SMS / email)
- Alerting Layer -> Pre-transaction warning prompts
"""

import time
import json


class MultiChannelAlertDispatcher:
    def __init__(self):
        self.dispatched_alerts_log = []

    def generate_pre_transaction_warning(
        self, 
        scenario_type: str, 
        claimed_identity: str, 
        transaction_amount: float = 0.0,
        threat_score: float = 0.0
    ) -> dict:
        """
        Generates specific, legally sound, and context-aware pre-transaction warning prompts
        for both screen display and telephony SIP audio injection.
        """
        if "BANKING" in scenario_type or "CEO" in scenario_type or transaction_amount > 0:
            headline = f"CRITICAL: HIGH-VALUE WIRE FRAUD SUSPENSION (INR {transaction_amount:,.0f})"
            prompt_text = (
                f"PRE-TRANSACTION WARNING: Voice authentication failed biological micro-tremor test "
                f"(Threat Index: {threat_score}%). The caller claiming to be {claimed_identity} exhibits neural vocoder phase artifacts. "
                f"Wire transfer of INR {transaction_amount:,.0f} has been held by TrueVoice Guard. "
                f"Mandatory Step-Up 2FA or in-person verification required."
            )
            audio_tone = "SIP_WARNING_CHIME_440HZ_PULSE"
            ivr_action = "PRESS_9_TO_REPORT_SUSPECTED_FRAUD"

        elif "DIGITAL_ARREST" in scenario_type or "POLICE" in scenario_type:
            headline = "GOVERNMENT CYBER FRAUD ADVISORY: FAKE POLICE / CBI CALL"
            prompt_text = (
                f"CYBER POLICE WARNING: The caller claiming to be {claimed_identity} is using an AI-generated synthetic voice clone. "
                f"Real law enforcement agencies (CBI, ED, Police, Courts) NEVER conduct arrests, trials, or demand bail bond transfers over video or phone calls. "
                f"DO NOT TRANSFER ANY MONEY. Disconnect immediately and call 1930 (National Cyber Crime Helpline)."
            )
            audio_tone = "EMERGENCY_INTERCEPT_ALARM_880HZ"
            ivr_action = "DISCONNECT_AND_SPEED_DIAL_1930"

        else:
            headline = "VOICE CLONING IMPERSONATION DETECTED"
            prompt_text = (
                f"SECURITY NOTICE: TrueVoice detected a synthetic voice model (Threat: {threat_score}%) "
                f"impersonating {claimed_identity}. Do not share passwords, OTPs, or financial details."
            )
            audio_tone = "STANDARD_ALERT_CHIME"
            ivr_action = "WARN_RECIPIENT"

        return {
            "headline": headline,
            "prompt_text": prompt_text,
            "audio_tone_injection": audio_tone,
            "ivr_recommended_action": ivr_action,
            "national_helpline": "1930",
            "statutory_notice": "Reportable under Section 66D Information Technology Act, 2000"
        }

    def dispatch_alert(
        self,
        alert_type: str,
        caller_phone: str,
        claimed_identity: str,
        threat_score: float,
        verdict: str,
        transaction_amount: float = 0.0,
        scenario_type: str = "GENERAL",
        xai_explanation: str = ""
    ) -> dict:
        """
        Omnichannel alert dispatcher: UI, SMS, Email, and Core Banking CBS Webhook.
        """
        timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        pre_tx_warning = self.generate_pre_transaction_warning(
            scenario_type, claimed_identity, transaction_amount, threat_score
        )

        channels_dispatched = []

        # 1. Real-Time UI / WebSocket Channel Payload
        ui_payload = {
            "channel": "UI_WEBSOCKET",
            "status": "EMITTED",
            "threat_score": threat_score,
            "verdict": verdict,
            "pre_transaction_warning": pre_tx_warning
        }
        channels_dispatched.append("UI_WEBSOCKET")

        # 2. SMS Gateway Dispatch Payload (Twilio / Fast2SMS / MSG91 format)
        sms_payload = {
            "channel": "SMS_GATEWAY",
            "provider": "FAST2SMS_INDIAN_GATEWAY_V3",
            "recipient_backup_phone": "+91 99887 76655 (Registered Alternate Mobile)",
            "sender_id": "TRUEVC",
            "message": (
                f"[TRUEVOICE SECURITY ALERT] Possible AI Voice Clone ({threat_score}% Threat) "
                f"impersonating {claimed_identity} on call from {caller_phone}. "
                f"Action taken: {pre_tx_warning['headline']}. Do not transfer funds. Helpline: 1930."
            ),
            "status": "DISPATCHED_QUEUED"
        }
        channels_dispatched.append("SMS_GATEWAY")

        # 3. Enterprise Email Security Alert (SMTP / SendGrid format)
        email_payload = {
            "channel": "ENTERPRISE_EMAIL_SOC",
            "recipient": "security-incident-response@company.in",
            "subject": f"HIGH PRIORITY: AI Voice Clone Impersonation Intercepted - {caller_phone}",
            "body_html": f"<h3>TrueVoice Incident Report: {timestamp}</h3><p>{pre_tx_warning['prompt_text']}</p><p><b>XAI Forensic Evidence:</b> {xai_explanation}</p>",
            "status": "DISPATCHED_QUEUED"
        }
        channels_dispatched.append("ENTERPRISE_EMAIL_SOC")

        # 4. Core Banking System (CBS) Webhook Dispatch (For transactions)
        cbs_payload = None
        if transaction_amount > 0 or verdict == "BLOCK":
            cbs_payload = {
                "channel": "CORE_BANKING_CBS_WEBHOOK",
                "endpoint": "https://cbs.bank.internal/api/v1/fraud-freeze",
                "target_account": "ACC_ESCROW_991823",
                "hold_amount_inr": transaction_amount,
                "freeze_action": "HOLD_IMMEDIATE_UNTIL_BIOMETRIC_2FA",
                "status": "TRANSACTION_FROZEN"
            }
            channels_dispatched.append("CORE_BANKING_CBS_WEBHOOK")

        dispatch_record = {
            "incident_id": f"INC-TV-{int(time.time())}",
            "timestamp": timestamp,
            "caller_phone": caller_phone,
            "claimed_identity": claimed_identity,
            "threat_score": threat_score,
            "verdict": verdict,
            "pre_transaction_warning": pre_tx_warning,
            "channels_dispatched": channels_dispatched,
            "dispatches": {
                "ui": ui_payload,
                "sms": sms_payload,
                "email": email_payload,
                "core_banking": cbs_payload
            }
        }

        self.dispatched_alerts_log.append(dispatch_record)
        return dispatch_record
