from detection.xss_detection import detect_xss
from logs.attack_logger import log_attack
payloads = [
    "<script>alert('XSS')</script>",
    "<img src=x onerror=alert('Hacked')>",
    "<iframe src='evil.com'></iframe>",
    "<h1>Hello World</h1>",
    "Welcome User"
]

print("=== XSS SIMULATOR ===\n")

for payload in payloads:
    if detect_xss(payload):
        print(f"[ALERT] XSS Detected: {payload}")
        log_attack("XSS", "192.168.1.102", "High", payload)
    else:
        print(f"[SAFE] {payload}")