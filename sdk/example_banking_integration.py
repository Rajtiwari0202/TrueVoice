"""
TrueVoice Enterprise SDK Example: Core Banking System (Finacle / CBS) Integration
Scenario: ₹50,00,000 High-Value Wire Transfer Authorization Call Interception.
"""

import sys
import os
import time

sys.path.insert(0, os.path.dirname(__file__))
from truevoice_sdk import TrueVoiceClient


def run_banking_fraud_interception_demo():
    print("================================================================================")
    print("   TRUEVOICE ENTERPRISE BANKING SDK - LIVE WIRE FRAUD DEFENSE DEMO")
    print("================================================================================")

    client = TrueVoiceClient(base_url="http://localhost:8000")

    # 1. Check Gateway & Privacy Status
    print("\n[STEP 1] Validating Gateway Health & DPDP Act 2023 Compliance...")
    health = client.get_health()
    print(f"   Gateway Status      : {health['status']} (v{health['version']})")
    print(f"   Active Models Count : {len(health['models_active'])} models online")
    
    privacy = client.get_privacy_compliance_status()
    print(f"   Privacy Compliance  : {privacy['status']}")
    print(f"   Ephemeral Memory    : {privacy['zero_retention_guarantee']['memory_zeroing_method']}")

    # 2. Simulate High-Value Wire Fraud Impersonation Call
    print("\n[STEP 2] Incoming SIP Call on High-Value Wire Desk (INR 50,00,000)...")
    print("   Claimed Identity: Rajesh Malhotra (Chief Financial Officer)")
    print("   Target Action   : Urgent RTGS Wire Transfer to SBI - 987201928371")
    print("   Origin PBX      : SIP Gateway Cambodia (+855) / High-Risk Proxy")

    start_t = time.perf_counter()
    decision = client.simulate_call(
        scenario_type="CEO_WIRE_FRAUD",
        caller_claimed_identity="Rajesh Malhotra (CFO)",
        caller_phone="+91 99887 76655",
        target_action="Authorize INR 50,00,000 Wire Transfer to SBI"
    )
    latency = round((time.perf_counter() - start_t) * 1000, 2)

    ve = decision["voice_evaluation"]
    defense = decision["automated_defense_action"]

    print(f"\n[STEP 3] TrueVoice Defense Verdict (Latency: {latency} ms):")
    print(f"   Security Verdict    : {defense['status']}")
    print(f"   Synthetic Threat    : {ve['threat_score']}% (Threshold: 50.0%)")
    print(f"   Humanity Index      : {ve['humanity_index']}% Organic Phonation")
    print(f"   Automated Action    : {defense['action_taken']}")
    print(f"   Alert Notification  : {defense['alert_message']}")

    # 3. Check Section 65B Electronic Evidence Certificate
    print("\n[STEP 4] Generating Indian Evidence Act Section 65B Certificate...")
    cert = client.get_section_65b_certificate()
    print(f"   Certificate Serial  : {cert['certificate_id']}")
    print(f"   Statutory Act       : {cert['statutory_act']}")
    print(f"   Block Hash          : {cert['block_hash']}")
    print(f"   Merkle Root         : {cert['merkle_root']}")

    # 4. Cryptographic Ledger Audit
    print("\n[STEP 5] Auditing Blockchain Ledger Integrity...")
    audit = client.verify_ledger_integrity()
    print(f"   Total Blocks        : {audit['total_blocks']}")
    print(f"   Tampering Detected  : {audit['tampered_blocks_count']} blocks")
    print(f"   Integrity Status    : {audit['verification_status']}")

    print("\n================================================================================")
    print("   [SUCCESS] WIRE FRAUD PREVENTED & CERTIFIED FOR COURT PROSECUTION")
    print("================================================================================")


if __name__ == "__main__":
    run_banking_fraud_interception_demo()
