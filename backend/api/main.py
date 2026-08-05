import csv
from pathlib import Path
from typing import List, Dict, Any

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from detection.sql_injection import detect_sql_injection

app = FastAPI(
    title="DecAI API",
    version="1.0.0",
    description="Backend API for DecAI Intrusion Detection System",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# More reliable path resolution
BASE_DIR = Path(__file__).resolve().parents[2]
ATTACK_LOG = BASE_DIR / "backend" / "logs" / "attack_log.csv"
PACKETS_LOG = BASE_DIR / "data" / "packets.csv"


@app.get("/")
def root():
    return {
        "message": "Welcome to DecAI API",
        "status": "Running",
        "version": "1.0.0",
    }


@app.get("/attacks")
def get_attacks() -> List[Dict[str, Any]]:
    if not ATTACK_LOG.exists():
        raise HTTPException(status_code=404, detail="Attack log file not found")

    try:
        with ATTACK_LOG.open("r", newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            return list(reader)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read attack log: {str(e)}")


@app.get("/stats")
def get_stats() -> Dict[str, int]:
    stats = {
        "total_attacks": 0,
        "ddos": 0,
        "brute_force": 0,
        "sql_injection": 0,
        "port_scan": 0,
        "xss": 0,
        "malware": 0,
        "anomaly": 0,
        "high_severity": 0,
    }

    if not ATTACK_LOG.exists():
        return stats

    try:
        with ATTACK_LOG.open("r", newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)

            for row in reader:
                stats["total_attacks"] += 1

                attack_type = row.get("Attack Type", "").strip()
                severity = row.get("Severity", "").strip()

                if attack_type == "DDoS":
                    stats["ddos"] += 1
                elif attack_type == "Brute Force":
                    stats["brute_force"] += 1
                elif attack_type == "SQL Injection":
                    stats["sql_injection"] += 1
                elif attack_type == "Port Scan":
                    stats["port_scan"] += 1
                elif attack_type == "XSS":
                    stats["xss"] += 1
                elif attack_type == "Malware":
                    stats["malware"] += 1
                elif attack_type == "Anomaly":
                    stats["anomaly"] += 1

                if severity == "High":
                    stats["high_severity"] += 1

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate stats: {str(e)}")

    return stats


@app.get("/packets")
def get_packets() -> List[Dict[str, str]]:
    if not PACKETS_LOG.exists():
        return []

    packets = []
    try:
        with PACKETS_LOG.open("r", newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            for row in reader:
                packets.append({
                    "time": row.get("Timestamp", ""),
                    "source_ip": row.get("Source IP", ""),
                    "destination_ip": row.get("Destination IP", ""),
                    "protocol": row.get("Protocol", ""),
                    "status": row.get("Direction", "Captured"),
                })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read packets log: {str(e)}")

    return packets


@app.get("/download_logs")
def download_logs():
    if not ATTACK_LOG.exists():
        raise HTTPException(status_code=404, detail="Attack log file not found")

    return FileResponse(
        path=ATTACK_LOG,
        media_type="text/csv",
        filename="attack_log.csv",
    )


@app.get("/test-sqli")
def test_sqli(payload: str = Query("' OR 1=1 --", description="SQL injection payload to test")):
    is_detected = detect_sql_injection(payload)

    return {
        "payload": payload,
        "attack": "SQL Injection",
        "status": "detected" if is_detected else "Safe",
    }