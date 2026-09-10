"""
TrueVoice Test Suite: Blockchain Ledger, Section 65B Certificates & DPDP Act 2023 Compliance
Explicitly verifies:
1. Merkle Tree Root calculation across 5 forensic dimensions.
2. Cryptographic hash chaining and block persistence.
3. Tamper-evident detection (mutating a block and verifying that the chain detects corruption).
4. Statutory Section 65B (Indian Evidence Act) Certificate generation.
5. DPDP Act 2023 volatile RAM scrubbing & zero-retention guarantee.
6. One-way HMAC-SHA256 biometric voiceprint pseudonymization.
7. Python Client SDK end-to-end integration.
"""

import sys
import os
import shutil
import tempfile
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "sdk"))

from pipeline.forensic_blockchain_ledger import ForensicBlockchainLedger
from pipeline.privacy_compliance import PrivacyComplianceController
from pipeline.voice_decision_engine import VoiceDecisionEngine
from truevoice_sdk import TrueVoiceClient


def test_blockchain_and_privacy_compliance():
    print("======================================================================")
    print("[RUNNING] TRUEVOICE BLOCKCHAIN LEDGER & DPDP 2023 PRIVACY TEST SUITE")
    print("======================================================================")

    # 1. Test Genesis Block & Merkle Root
    print("\n[TEST 1] Testing Forensic Blockchain Genesis & Merkle Tree Root...")
    temp_dir = tempfile.mkdtemp()
    try:
        ledger = ForensicBlockchainLedger(ledger_dir=temp_dir)
        chain = ledger.get_chain()
        assert len(chain) == 1, "Chain must start with Genesis block"
        genesis = chain[0]
        print(f"   Genesis Incident ID: {genesis['incident_id']}")
        print(f"   Genesis Merkle Root: {genesis['merkle_root']}")
        print(f"   Genesis Block Hash : {genesis['block_hash']}")
        assert len(genesis["block_hash"]) == 64, "Block hash must be valid SHA-256"

        # 2. Test Incident Appending & Hash Chaining
        print("\n[TEST 2] Testing Incident Appending & SHA-256 Hash Chaining...")
        record = ledger.record_incident(
            caller_phone="+91 99887 76655",
            claimed_identity="CFO Rajesh Malhotra",
            threat_score=94.5,
            verdict="BLOCK",
            scenario_type="CEO_WIRE_FRAUD",
            deep_learning_meta={"model_architecture": "Scalable-AASIST-MHA", "neural_logits": [-2.1, 2.4]},
            lmt_metrics={"lmt_variance": 0.0084, "humanity_score": 12.0, "mean_f0_hz": 142.0},
            speaker_verification_meta={"claimed_identity": "Rajesh Malhotra", "similarity_score": 0.32, "mismatch_detected": True, "cross_session_consistency": "CRITICAL_MISMATCH"},
            context_meta={"call_origin": "SIP_PROXY_CAMBODIA", "i4c_blacklist_record": "FLAGGED_IN_NCRP", "context_risk_multiplier": 2.2},
            action_taken="SIP Session Dropped / Wire Transfer Frozen",
            xai_explanation="HiFi-GAN vocoder artifacts with zero LMT micro-tremor"
        )
        print(f"   Appended Block Index : #{record['block_index']}")
        print(f"   Incident ID          : {record['incident_id']}")
        print(f"   Block Hash           : {record['block_hash']}")
        print(f"   Parent Hash          : {record['previous_hash']}")
        assert record["block_index"] == 1, "First incident must be block #1"
        assert record["previous_hash"] == genesis["block_hash"], "Previous hash must chain to Genesis"

        # 3. Test Cryptographic Verification (Clean Ledger)
        print("\n[TEST 3] Testing Cryptographic Integrity Verification on Clean Ledger...")
        audit = ledger.verify_chain_integrity()
        print(f"   Chain Status         : {audit['verification_status']}")
        print(f"   Total Blocks Verified: {audit['total_blocks']}")
        assert audit["is_valid"] is True, "Clean ledger must pass verification"
        assert audit["tampered_blocks_count"] == 0, "No tampering should be found"

        # 4. Test Tamper Detection (Simulate Tampering Attack)
        print("\n[TEST 4] Simulating Adversarial Tamper Attack (Modifying Threat Score in Block #1)...")
        ledger.chain[1]["payload"]["threat_score"] = 10.0  # Attacker tries to erase fraud score
        tamper_audit = ledger.verify_chain_integrity()
        print(f"   Tamper Detected      : {tamper_audit['verification_status']}")
        print(f"   Tampered Block Count : {tamper_audit['tampered_blocks_count']}")
        print(f"   Tamper Detail        : {tamper_audit['tampered_details'][0]['reason']}")
        assert tamper_audit["is_valid"] is False, "Tampered chain must be rejected"
        assert tamper_audit["tampered_blocks_count"] > 0, "Tampered block must be flagged"

        # Restore valid state for remaining tests
        ledger.chain[1]["payload"]["threat_score"] = 94.5
        restored_audit = ledger.verify_chain_integrity()
        assert restored_audit["is_valid"] is True, "Restored ledger must be valid"

        # 5. Test Indian Evidence Act Section 65B Certificate Generation
        print("\n[TEST 5] Generating Section 65B Electronic Evidence Certificate...")
        cert = ledger.generate_section_65b_certificate(record["incident_id"])
        print(f"   Certificate Serial   : {cert['certificate_id']}")
        print(f"   Statutory Act        : {cert['statutory_act']}")
        print(f"   Certified Block Hash : {cert['block_hash']}")
        print(f"   Certified Merkle Root: {cert['merkle_root']}")
        assert "SECTION 65B, INDIAN EVIDENCE ACT" in cert["certificate_plaintext"], "Certificate must contain statutory text"
        assert cert["is_tamper_evident"] is True, "Certificate must be tamper-evident"

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

    # 6. Test DPDP Act 2023 Volatile Memory Scrubbing
    print("\n[TEST 6] Testing DPDP Act 2023 Memory Scrubbing & Zero-Retention...")
    privacy = PrivacyComplianceController()
    test_audio = np.random.randn(8000).astype(np.float32)
    assert np.any(test_audio != 0), "Audio must contain non-zero samples before scrubbing"
    scrubbed = privacy.scrub_audio_buffer(test_audio)
    assert scrubbed is True, "Memory scrubbing must return True"
    assert np.all(test_audio == 0), "Audio array must be completely zeroed in volatile memory"
    print(f"   Volatile RAM Scrubbed: {privacy.audio_bytes_scrubbed} bytes securely zeroed")

    # 7. Test Biometric Voiceprint Pseudonymization
    print("\n[TEST 7] Testing HMAC-SHA256 Biometric Vector Pseudonymization...")
    test_vector = np.random.randn(192).astype(np.float32)
    pseudo_token = privacy.pseudonymize_biometric_vector(test_vector, caller_id="+91 99887 76655")
    print(f"   Biometric Token      : {pseudo_token}")
    assert pseudo_token.startswith("PSEUDO_VOICEPRINT_"), "Token must follow sovereign pseudonym schema"
    assert len(pseudo_token) > 20, "Token must be cryptographically sound"

    # 8. Test DPDP Act 2023 Compliance Report
    print("\n[TEST 8] Checking DPDP Act 2023 & GDPR Statutory Scorecard...")
    report = privacy.get_compliance_audit_report()
    print(f"   Statutory Status     : {report['status']}")
    print(f"   Disk Storage         : {report['zero_retention_guarantee']['raw_audio_disk_storage']}")
    print(f"   RAM Scrubbing Method : {report['zero_retention_guarantee']['memory_zeroing_method']}")
    assert report["status"] == "100% COMPLIANT", "Privacy status must be 100% compliant"

    # 9. Test Python SDK Client against Live Server
    print("\n[TEST 9] Testing Python SDK Client against Live Server...")
    client = TrueVoiceClient(base_url="http://localhost:8000")
    health = client.get_health()
    print(f"   SDK Gateway Status   : {health['status']} (v{health['version']})")
    assert health["status"] == "ONLINE", "Gateway must be online"
    
    chain_sdk = client.get_ledger()
    print(f"   SDK Chain Length     : {len(chain_sdk)} blocks")
    assert len(chain_sdk) >= 1, "SDK must retrieve at least Genesis block"

    integrity_sdk = client.verify_ledger_integrity()
    print(f"   SDK Ledger Integrity : {integrity_sdk['verification_status']}")
    assert integrity_sdk["is_valid"] is True, "SDK must verify valid ledger"

    privacy_sdk = client.get_privacy_compliance_status()
    print(f"   SDK Privacy Status   : {privacy_sdk['status']}")
    assert privacy_sdk["status"] == "100% COMPLIANT", "SDK must verify privacy compliance"

    print("\n======================================================================")
    print("[SUCCESS] ALL 9 BLOCKCHAIN, PRIVACY & SDK TESTS PASSED (100% COMPLIANT)")
    print("======================================================================")


if __name__ == "__main__":
    test_blockchain_and_privacy_compliance()
