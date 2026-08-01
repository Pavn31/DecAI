import csv
import os
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

ATTACK_LOG = BASE_DIR / "backend" / "logs" / "attack_log.csv"
PACKETS_CSV = BASE_DIR / "data" / "packets.csv"


def log_attack(attack_type, source_ip, severity, details):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # -------- Attack Log --------
    ATTACK_LOG.parent.mkdir(parents=True, exist_ok=True)
    attack_exists = ATTACK_LOG.exists()

    with open(ATTACK_LOG, "a", newline="") as f:
        writer = csv.writer(f)
        if not attack_exists:
            writer.writerow([
                "Timestamp",
                "Attack Type",
                "Source IP",
                "Severity",
                "Details"
            ])

        writer.writerow([
            timestamp,
            attack_type,
            source_ip,
            severity,
            details
        ])

    # -------- Live Packet Monitor --------
    PACKETS_CSV.parent.mkdir(parents=True, exist_ok=True)
    packet_exists = PACKETS_CSV.exists()

    with open(PACKETS_CSV, "a", newline="") as f:
        writer = csv.writer(f)

        if not packet_exists:
            writer.writerow([
                "Status",
                "Timestamp",
                "Source IP",
                "Destination IP",
                "Protocol",
                "Source Port",
                "Destination Port",
                "Length"
            ])

        writer.writerow([
            "Incoming",
            timestamp,
            source_ip,
            "192.168.1.1",
            "HTTP",
            54321,
            80,
            len(str(details))
        ])