from logs.attack_logger import log_attack
PORT_SCAN_THRESHOLD = 10

ip_port_history = {}
alert_ips = set()


def detect_port_scan(source_ip, destination_port):
    if source_ip not in ip_port_history:
        ip_port_history[source_ip] = set()

    if destination_port != "-":
        ip_port_history[source_ip].add(destination_port)

    if (
        len(ip_port_history[source_ip]) >= PORT_SCAN_THRESHOLD
        and source_ip not in alert_ips
    ):
        alert_ips.add(source_ip)
        log_attack(
            attack_type="Port Scan",
            source_ip=source_ip,
            severity="Medium",
            details=f"{len(ip_port_history[source_ip])} unique ports scanned"
        )
        return {
            "attack": True,
            "source_ip": source_ip,
            "ports": len(ip_port_history[source_ip]),
            "type": "Port Scan"
        }

    return {
        "attack": False,
        "type": "Normal"
    }