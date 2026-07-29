from backend.logs.attack_logger import log_attack
from collections import defaultdict
import time

packet_history = defaultdict(list)
DDOS_THRESHOLD = 10  # Threshold for DDoS detection
TIME_WINDOW = 1  # Time window in seconds for DDoS detection

def detect_ddos(source_ip):
    current_time = time.time()
    packet_history[source_ip].append(current_time)

    packet_history[source_ip] = [t for t in packet_history[source_ip] if current_time - t <= TIME_WINDOW]

    if len(packet_history[source_ip]) > DDOS_THRESHOLD:
        log_attack(
            attack_type="DDoS",
            source_ip=source_ip,
            severity="High",
            details=f"Detected {len(packet_history[source_ip])} packets in {TIME_WINDOW} second(s)"
        )
        return {
            "attack": True,
            "source_ip": source_ip,
            "packet_count": len(packet_history[source_ip]),
            "type": "DDoS"
        }

    return {
        "attack": False,
        "type": "Normal"
    }