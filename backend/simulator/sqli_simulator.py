from detection.sql_injection import detect_sql_injection
from logs.attack_logger import log_attack
payloads = [
    "' OR 1=1 --",
    "UNION SELECT username, password FROM users",
    "DROP TABLE users",
    "DELETE FROM users WHERE id=1",
    "HELLO WORLD",
    "LOGIN Successful",
]

print("=== SQL INJECTION SIMULATOR ===")

for payload in payloads:
    if detect_sql_injection(payload):
        print(f"[ALERT] SQL Injection Detected: {payload}")
        log_attack("SQL Injection", "192.168.1.101", "High", payload)
    else:
        print(f"[SAFE] {payload}")