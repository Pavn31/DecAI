import csv
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from detection.sql_injection import detect_sql_injection
app = FastAPI(
    title="DecAI API",
    version="1.0.0",
    description="Backend API for DecAI Instrusion Detection System"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
BASE_DIR = Path(__file__).resolve().parents[2]
ATTACK_LOG = BASE_DIR / "backend" / "logs" / "attack_log.csv"
PACKETS_LOGS = BASE_DIR / "data" / "packets.csv"

@app.get("/")
def root():
    return{
        "message": "Welcome to DecAI API",
        "status": "Running"
    }

@app.get("/attacks")
def get_attacks():
    if not ATTACK_LOG.exists():
        return{
            "error": "Attack Log File not Found"
        }
    attacks = []
    with ATTACK_LOG.open("r", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            attacks.append(row)

    return attacks

@app.get("/stats")
def get_stats():
    stats = {}

    stats["total_attacks"] = 0
    stats["ddos"] = 0
    stats["brute_force"] = 0
    stats["sql_injection"] = 0
    stats["port_scan"] = 0
    stats["xss"] = 0
    stats["malware"] = 0
    stats["anomaly"] = 0
    stats["high_severity"] = 0

    if not ATTACK_LOG.exists():
        return stats
    with ATTACK_LOG.open("r", newline="") as file:
        reader = csv.DictReader(file)

        for row in reader:
            stats["total_attacks"] += 1
            if row["Attack Type"] == "DDoS":
                stats["ddos"] += 1

            if row["Attack Type"] == "Brute Force":
                stats["brute_force"] += 1

            if row["Attack Type"] == "SQL Injection":
                stats["sql_injection"] += 1

            if row["Attack Type"] == "Port Scan":
                stats["port_scan"] += 1

            if row["Attack Type"] == "XSS":
                stats["xss"] += 1

            if row["Attack Type"] == "Malware":
                stats["malware"] += 1

            if row["Severity"] == "High":
                stats["high_severity"] += 1

            if row["Attack Type"] == "Anomaly":
                stats["anomaly"] += 1

    return stats 

@app.get("/packets")
def get_packets():
    packets = []
    
    if not PACKETS_LOGS.exists():
        return packets
    with PACKETS_LOGS.open("r", newline="") as file:
        reader = csv.DictReader(file)

        for row in reader:
            packets.append({
                "time": row.get("Timestamp", ""),
                "source_ip": row.get("Source IP", ""),
                "destination_ip": row.get("Destination IP", ""),
                "protocol": row.get("Protocol", ""),
                "status": row.get("Direction", "Captured")
            })

    return packets

from fastapi.responses import FileResponse

@app.get("/download_logs")
def download_logs():
    return FileResponse(
        ATTACK_LOG,
        media_type="text/csv",
        filename="attack_log.csv"
    )
@app.get("/test-sqli")
def test_sqli():
    payload = "' OR 1=1 --"

    if detect_sql_injection(payload):
        return {
            "attack": "SQL Injection",
            "status": "detected"
        }

    return {
        "attack": "SQL Injection",
        "status": "Safe"
    }