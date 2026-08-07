# 🛡️ DecAI

## AI-Powered Intrusion Detection System

DecAI is a modern AI-powered Intrusion Detection System (IDS) built to detect, monitor, and visualize cyber attacks in real time.

The project combines a FastAPI backend with a React dashboard to provide live attack monitoring, threat analytics, packet monitoring, interactive charts, and attack simulations.

---

## ✨ Features

- 🚨 Real-time Cyber Attack Detection
- 📊 Live Dashboard with Statistics
- 📈 Attack Distribution Charts (Bar & Pie)
- 📡 Live Packet Monitor
- 🔍 Search & Severity Filter
- 📥 Download Attack Logs (CSV)
- 🔔 Real-time Toast Notifications
- 📝 Attack Details Modal
- 🔄 Auto Refresh Dashboard
- 🟢 Backend Status Indicator
- ⏱️ Refresh Countdown Timer

### Supported Attack Detection

- SQL Injection
- Cross-Site Scripting (XSS)
- Brute Force Attack
- DDoS Attack
- Port Scanning
- Malware Activity
- Anomaly Detection

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Axios
- Chart.js
- React Chart.js 2
- React Toastify

### Backend

- FastAPI
- Python
- Pandas
- Uvicorn

### Database

- CSV-based Attack Logs

### Development Tools

- Visual Studio Code
- Git & GitHub
- Postman
- Linux

---

## 📁 Project Structure

```text
DecAI/
│
├── backend/
│   ├── api/
│   ├── detection/
│   ├── simulator/
│   ├── logs/
│   ├── packet_monitor/
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── README.md
└── requirements.txt
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/DecAI.git
cd DecAI
```

### 2. Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt

uvicorn api.main:app --reload
```

### 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

### 4. Open in Browser

```text
http://localhost:5173
```

---

## 🌐 API Endpoints

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| GET    | `/stats`         | Get dashboard statistics    |
| GET    | `/attacks`       | Fetch recent attack logs    |
| GET    | `/packets`       | Fetch live packet data      |
| GET    | `/download_logs` | Download attack logs as CSV |

---

## 📸 Screenshots

### Dashboard


### Live Packet Monitor



### Attack Detection



### Charts



---

## 🚀 Future Scope

- AI Threat Intelligence Panel
- AI Threat Recommendations
- Machine Learning-based Detection
- Email & Telegram Alerts
- PDF Report Generation
- Cloud Deployment
- Multi-user Authentication
- Database Integration (MySQL/PostgreSQL)

---

## 👨‍💻 Author

**Pavan**

AI & Data Science Student

GitHub: https://github.com/Pavn31

---

## 📄 License

This project is developed for educational and academic purposes.

---
