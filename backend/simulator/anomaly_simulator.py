from detection.anomaly_detection import detect_anomaly
from logs.attack_logger import log_attack

traffic = [250, 450, 800, 1200, 1800, 700, 2500]

print("=== ANOMALY SIMULATOR ===\n")
for packet_count in traffic:
    result = detect_anomaly(packet_count)

    if result["attack"]:
        print(f"[ALERT] {result['details']}")
        log_attack("Anomaly", "192.168.1.105", "High", result["details"])

    else:
        print(f"[SAFE] {result['details']}")