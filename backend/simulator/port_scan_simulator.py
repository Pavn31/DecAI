from detection.port_scan import detect_port_scan
from logs.attack_logger import log_attack
ip = "192.168.1.104"

print("=== PORT SCAN SIMULATOR ===\n")

for i in range(15):
    port = input(f"Enter port number to scan (Attempt {i + 1}/15): ")
    result = detect_port_scan(ip, port)

    if result["attack"]:
        print(f"[ALERT] Port Scan Detected from {result['source_ip']} on {result['ports']} unique ports.")
        log_attack("Port Scan", ip, "Medium", f"{result['ports']} unique ports scanned")
        break
    else:
        print(f"[SAFE] No Port Scan Detected. Attempt {i + 1}/15.")