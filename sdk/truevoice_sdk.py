"""
TrueVoice Enterprise & Core Banking Client SDK (Python)
Zero External Dependencies (Pure Python standard library: urllib, json, time, io, wave).

Provides turnkey integration for:
- Core Banking Systems (CBS / Finacle / BaNCS) wire transfer verification.
- Asterisk PBX / FreeSWITCH / Kamailio SIP telephony gateways.
- WhatsApp Business / Telegram Audio Bots for consumer fraud protection.
- Enterprise SOC incident monitoring & SIEM log ingestion.
"""

import json
import urllib.request
import urllib.error
import io
import time
from typing import Dict, Any, List, Optional


class TrueVoiceClient:
    """
    Official Python Client for TrueVoice Sovereign Real-Time Voice Defense Gateway.
    Compatible with Python 3.8+.
    """
    def __init__(self, base_url: str = "http://localhost:8000", timeout: float = 5.0):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def _get(self, endpoint: str) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        req = urllib.request.Request(url, headers={"User-Agent": "TrueVoice-Python-SDK/2.0"})
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            raise RuntimeError(f"TrueVoice API HTTP Error {e.code}: {e.read().decode('utf-8')}")
        except Exception as e:
            raise RuntimeError(f"TrueVoice Connection Failed: {str(e)}")

    def _post(self, endpoint: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "TrueVoice-Python-SDK/2.0"
            }
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            raise RuntimeError(f"TrueVoice API HTTP Error {e.code}: {e.read().decode('utf-8')}")
        except Exception as e:
            raise RuntimeError(f"TrueVoice Connection Failed: {str(e)}")

    def get_health(self) -> Dict[str, Any]:
        """Checks gateway operational status, active models, and hardware acceleration mode."""
        return self._get("/api/voice/health")

    def verify_audio_chunk(
        self,
        audio_samples: List[float],
        caller_id: str = "+91 99887 76655",
        call_context: str = "CORE_BANKING_WIRE_TRANSFER",
        transaction_amount: float = 0.0,
        policy_scenario: str = "CRITICAL_BANKING"
    ) -> Dict[str, Any]:
        """
        Sub-30ms Real-Time Voice Chunk Verification.
        Accepts normalized float audio samples (-1.0 to 1.0) at 16kHz.
        """
        payload = {
            "audio_chunk": audio_samples,
            "caller_phone": caller_id,
            "call_context": call_context,
            "transaction_amount": transaction_amount,
            "policy_scenario": policy_scenario
        }
        return self._post("/api/voice/analyze-chunk", payload)

    def simulate_call(
        self,
        scenario_type: str,
        caller_claimed_identity: str,
        caller_phone: str = "+91 98112 34567",
        target_action: str = "Authorize Wire Transfer"
    ) -> Dict[str, Any]:
        """
        Executes end-to-end benchmark attack simulation against the defense pipeline.
        Scenarios: 'CEO_WIRE_FRAUD', 'DIGITAL_ARREST_SCAM', 'BENIGN_FAMILY_CALL'.
        """
        payload = {
            "scenario_type": scenario_type,
            "caller_claimed_identity": caller_claimed_identity,
            "caller_phone": caller_phone,
            "target_action": target_action
        }
        return self._post("/api/voice/simulate-call", payload)

    def get_ledger(self) -> List[Dict[str, Any]]:
        """Retrieves the full chain of cryptographic incident blocks."""
        return self._get("/api/voice/ledger")

    def verify_ledger_integrity(self) -> Dict[str, Any]:
        """Performs full cryptographic traversal and Merkle root verification of all blocks."""
        return self._get("/api/voice/ledger/verify")

    def get_section_65b_certificate(self, incident_id: str = "") -> Dict[str, Any]:
        """
        Downloads a statutory electronic evidence certificate admissible under:
        - Section 65B, Indian Evidence Act, 1872
        - Section 63, Bharatiya Sakshya Adhiniyam (BSA), 2023
        """
        endpoint = f"/api/voice/ledger/certificate?incident_id={incident_id}" if incident_id else "/api/voice/ledger/certificate"
        return self._get(endpoint)

    def get_privacy_compliance_status(self) -> Dict[str, Any]:
        """Returns the DPDP Act 2023 & GDPR zero-retention audit report."""
        return self._get("/api/voice/privacy-status")

    def update_policy_threshold(self, scenario_name: str, new_threshold: float) -> Dict[str, Any]:
        """Dynamically configures risk policy alert thresholds."""
        return self._post("/api/voice/policy/update", {
            "scenario_name": scenario_name,
            "new_threshold": float(new_threshold)
        })
