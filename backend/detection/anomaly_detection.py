THRESHOLD = 1000

def detect_anomaly(packet_count):
    if packet_count > THRESHOLD:
        return {
            "attack": True,
            "type": "Anomaly",
            "details": f"Abnormal traffic detected ({packet_count} packets/second)"
        }

    return {
        "attack": False,
        "details": "Traffic is normal",
        "type": "Normal"
    }