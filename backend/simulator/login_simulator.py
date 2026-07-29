from backend.detection.brute_force import detect_brute_force
source_ip = "192.168.1.100"
while True:
    username = input("Username: ")
    password = input("Password: ")

    if username == "admin" and password == "admin123":
        print("Login Successful")

    else:
        print("Login Failed")

        result = detect_brute_force(source_ip)
        if result["attack"]:
            print("BRUTE FORCE ATTACK DETECTED")