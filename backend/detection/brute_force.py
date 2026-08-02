from logs.attack_logger import log_attack
import time
from collections import defaultdict
attempt_history = defaultdict(list)
TIME_WINDOW = 60  # Time window in seconds for brute force detection
BRUTE_THRESHOLD = 5 # Threshold for brute force detection

def detect_brute_force(source_ip):
    current_time = time.time()
    attempt_history[source_ip].append(current_time)

    attempt_history[source_ip] = [t for t in attempt_history[source_ip] if current_time - t <= TIME_WINDOW]

    attempt_count = len(attempt_history[source_ip])

    if attempt_count >= BRUTE_THRESHOLD:
        log_attack(
            attack_type="Brute Force",
            source_ip=source_ip,
            severity="High",
            details=f"{attempt_count} failed login attempts in {TIME_WINDOW} seconds"
        )
        return {
            "attack": True,
            "source_ip": source_ip,
            "attempt_count": attempt_count,
            "type": "Brute Force"
        }
    return {
        "attack": False,
        "type": "Normal"
    }