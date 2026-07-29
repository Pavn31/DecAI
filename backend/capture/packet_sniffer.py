from datetime import datetime
from scapy.all import sniff
from scapy.layers.inet import IP, TCP, UDP
from backend.detection.port_scan import detect_port_scan 
from backend.detection.ddos import detect_ddos
import csv
import os

CSV_FILE = "data/packets.csv"
total_packets = 0
tcp_packets = 0
udp_packets = 0
other_packets = 0
ip_port_history = {}  # Dictionary to store IP and port history
alert_ips = set()  # Set to store IPs that have triggered an alert
PORT_SCAN_THRESHOLD = 10  # Threshold for port scan detection

#Create the CSV if file is empty
if not os.path.exists(CSV_FILE) or os.stat(CSV_FILE).st_size == 0:
    with open(CSV_FILE, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([
            "Direction",
            "Timestamp",
            "Source IP",
            "Destination IP",
            "Protocol",
            "Source Port",
            "Destination Port",
            "Packet Length",
        ])

def packet_callback(packet):
    if IP in packet:
        global total_packets, tcp_packets, udp_packets, other_packets
        total_packets += 1

        protocol = "OTHER"
        source_port = "-"
        destination_port = "-"

        if TCP in packet:
            protocol = "TCP"
            tcp_packets += 1
            source_port = packet[TCP].sport
            destination_port = packet[TCP].dport
        elif UDP in packet:
            protocol = "UDP"
            udp_packets += 1
            source_port = packet[UDP].sport
            destination_port = packet[UDP].dport
        else:
            protocol = "OTHER"
            other_packets += 1

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        source_ip = packet[IP].src
        destination_ip = packet[IP].dst
        if source_ip.startswith("192.168."):
            direction = "Outgoing"
        else:
            direction = "Incoming"
        packet_length = len(packet)

        result = detect_port_scan(source_ip, destination_port)

        if result["attack"]:
            print(result["source_ip"])
            print(result["ports"])

        ddos_result = detect_ddos(source_ip)

        if ddos_result["attack"]:
            print("\n🚨 DDoS Attck Detected!"
                  f"Source: {ddos_result['source_ip']}, "
                  f"Packet Count: {ddos_result['packet_count']}"
                )

        print("=" * 45)
        print(f"[{timestamp}]")
        print()
        print(f"Direction: {direction}")
        print(f"Source IP: {source_ip}")
        print(f"Destination IP: {destination_ip}")
        print(f"Protocol: {protocol}")
        print(f"Source Port: {source_port}")
        print(f"Destination Port: {destination_port}")
        print(f"Packet Length: {packet_length} bytes")

        print("\n------ Live Statistics ------")
        print(f"Total Packets: {total_packets}")
        print(f"TCP Packets: {tcp_packets}")
        print(f"UDP Packets: {udp_packets}")
        print(f"Other Packets: {other_packets}")
        print("=" * 45)
        with open(CSV_FILE, mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                direction,
                timestamp,
                source_ip,
                destination_ip,
                protocol,
                source_port,
                destination_port,
                packet_length,
            ])

print("DecAI Packet Logger Started")
print("Press Ctrl+C to stop the logger and save the captured packets to CSV.\n")

sniff(prn=packet_callback, store=False)