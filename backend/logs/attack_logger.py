import csv
import os
from datetime import datetime
def log_attack(attack_type, source_ip, severity, details):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    csv_file = "backend/logs/attack_log.csv"

    file_exists = os.path.isfile(csv_file)

    with open(csv_file, mode='a', newline='') as file:
        
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(["Timestamp", "Attack Type", "Source IP", "Severity", "Details"])
        writer.writerow([timestamp, attack_type, source_ip, severity, details])