"""
TrueVoice Dynamic Risk Policy & Configurable Alert Threshold Engine
Satisfies: Risk Scoring Engine -> Configurable threshold-based alerting

Allows per-scenario policy tuning, sensitivity adjustments, and cost matrix configuration.
"""

class RiskPolicyManager:
    DEFAULT_POLICIES = {
        "CRITICAL_BANKING": {
            "name": "Core Banking High-Value Wire Transfer",
            "threshold": 50.0,
            "cost_fa": 10.0,
            "cost_miss": 25.0,
            "required_action": "AUTOMATED_TRANSACTION_FREEZE",
            "human_in_the_loop": True
        },
        "DIGITAL_ARREST": {
            "name": "Law Enforcement & Digital Arrest Impersonation",
            "threshold": 45.0,
            "cost_fa": 5.0,
            "cost_miss": 30.0,
            "required_action": "CALL_TERMINATE_AND_ALERT_1930",
            "human_in_the_loop": False
        },
        "EXECUTIVE_VIP": {
            "name": "C-Suite & Managing Director Verification",
            "threshold": 55.0,
            "cost_fa": 8.0,
            "cost_miss": 15.0,
            "required_action": "STEP_UP_BIOMETRIC_AUTH",
            "human_in_the_loop": True
        },
        "CASUAL_FAMILY": {
            "name": "Standard Personal / Family Call Protection",
            "threshold": 70.0,
            "cost_fa": 2.0,
            "cost_miss": 10.0,
            "required_action": "WARN_CALLER_OVERLAY",
            "human_in_the_loop": False
        }
    }

    def __init__(self):
        self.policies = dict(self.DEFAULT_POLICIES)
        self.active_policy_key = "CRITICAL_BANKING"

    def get_policy(self, scenario_key: str = None) -> dict:
        """Retrieves active policy parameters."""
        key = scenario_key or self.active_policy_key
        return self.policies.get(key, self.policies["CRITICAL_BANKING"])

    def update_policy_threshold(self, scenario_key: str, new_threshold: float, cost_fa: float = None, cost_miss: float = None) -> dict:
        """Configures scenario-specific threshold and cost weights dynamically."""
        if scenario_key not in self.policies:
            self.policies[scenario_key] = {
                "name": scenario_key,
                "threshold": float(new_threshold),
                "cost_fa": cost_fa or 10.0,
                "cost_miss": cost_miss or 10.0,
                "required_action": "FLAG_SUSPICIOUS",
                "human_in_the_loop": True
            }
        else:
            self.policies[scenario_key]["threshold"] = float(new_threshold)
            if cost_fa is not None:
                self.policies[scenario_key]["cost_fa"] = float(cost_fa)
            if cost_miss is not None:
                self.policies[scenario_key]["cost_miss"] = float(cost_miss)

        return {"status": "UPDATED", "policy": self.policies[scenario_key]}

    def list_all_policies(self) -> dict:
        return self.policies
