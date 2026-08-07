import AttackChart from "./components/AttackChart";
import PieAttackChart from "./components/PieAttackChart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import CountUp from "react-countup";
import "./App.css";
import Notification from "./components/Notification";
const alertSound = new Audio("/sounds/alert.mp3");

function App() {
  const [attacks, setAttacks] = useState([]);
  const [stats, setStats] = useState({
    total_attacks: 0,
    ddos: 0,
    brute_force: 0,
    sql_injection: 0,
    high_severity: 0,
  });
  const [packets, setPackets] = useState([]);
  const [backendStatus, setBackendStatus] = useState("Offline");
  const lastAttack = useRef("");
  const downloadLogs = () => {
    window.open("http://127.0.0.1:8000/download_logs", "_blank");
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectAttack, setSelectedAttack] = useState(null);
  const [notification, setNotification] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [highlightAttack, setHighlightAttack] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/stats")
      .then((response) => {
        setStats(response.data);
        setBackendStatus("Online");
      })
      .catch((error) => {
        console.error(error);
        setBackendStatus("Offline");
      });
    axios
      .get("http://127.0.0.1:8000/attacks")
      .then((response) => {
        setAttacks(response.data);
        if (response.data.length > 0) {
          const latest = response.data[response.data.length - 1];
          const attackID = latest.Timestamp + latest["Attack Type"];
          if (lastAttack.current !== attackID) {
            lastAttack.current = attackID;
            setHighlightAttack(attackID);
            setTimeout(() => {
              setHighlightAttack("");
            }, 3000);

            setNotification({
              title: "⚠️ New Attack Detected",
              message: `${latest["Attack Type"]} from ${latest["Source IP"]}`,
              severity: latest["Severity"] || "Low",
            });
            if ((latest["Severity"] || "").toLowerCase() === "high") {
              alertSound.currentTime = 0;
              alertSound.play().catch(() => {});
            }
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get("http://127.0.0.1:8000/packets")
      .then((response) => {
        setPackets(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
    const timer = setInterval(() => {
      setCountdown((prev) => (prev === 1 ? 3 : prev - 1));
    }, 1000);
    const interval = setInterval(fetchData, 3000);
    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <h2>Loading DecAI....</h2>
      </div>
    );
  }
  return (
    <div className="app">
      <Notification notification={notification} />
      <header className="header">
        <h1 className="title">DecAI</h1>
        <p className="subtitle">AI-Powered Instrusion Detection System</p>
      </header>
      <div className="refresh-timer">🔄 Refreshing in {countdown}s</div>
      <section className="stats">
        <div className="card">
          <h2>Total Attacks</h2>
          <p>{stats.total_attacks}</p>
        </div>

        <div className="card">
          <h2>DDoS Attacks</h2>
          <p>{stats.ddos}</p>
        </div>

        <div className="card">
          <h2>Brute Force</h2>
          <p>{stats.brute_force}</p>
        </div>

        <div className="card">
          <h2>High Severity</h2>
          <p>{stats.high_severity}</p>
        </div>

        <div className="card">
          <h2>SQL Injection</h2>
          <p>{stats.sql_injection}</p>
        </div>

        <div className="card">
          <h2>Port Scan</h2>
          <p>{stats.port_scan}</p>
        </div>

        <div className="card">
          <h2>XSS</h2>
          <p>{stats.xss}</p>
        </div>

        <div className="card">
          <h2>Malware</h2>
          <p>{stats.malware}</p>
        </div>

        <div className="card">
          <h2>Anomaly</h2>
          <p>{stats.anomaly}</p>
        </div>
      </section>
      <div className="backend-status">
        <span
          className={
            backendStatus === "Online" ? "status-online" : "status-offline"
          }
        >
          ● {backendStatus}
        </span>
      </div>
      <div className="search-controls">
        <button onClick={downloadLogs} className="download-btn">
          ⬇️ Download Attack Logs
        </button>
        <input
          type="text"
          placeholder="Search by Attack Type or Severity"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="search-input"
        >
          <option value="All">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <section className="table-section">
        <h2>Recent Attacks</h2>

        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Attack</th>
              <th>Severity</th>
            </tr>
          </thead>

          <tbody>
            {(Array.isArray(attacks) ? attacks : []).length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-state">
                  🛡️ No attacks detected yet.
                </td>
              </tr>
            ) : (
              (Array.isArray(attacks) ? attacks : [])
                .filter((attack) => {
                  const matchesSearch =
                    (attack["Attack Type"] || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    (attack["Severity"] || attack.severity || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    (attack["Source IP"] || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());

                  const matchesSeverity =
                    severityFilter === "All" ||
                    (
                      attack["Severity"] ||
                      attack.severity ||
                      ""
                    ).toLowerCase() === severityFilter.toLowerCase();

                  return matchesSearch && matchesSeverity;
                })
                .map((attack, index) => (
                  <tr
                    key={index}
                    className={
                      highlightAttack ===
                      attack.Timestamp + attack["Attack Type"]
                        ? "highlight-row"
                        : ""
                    }
                    onClick={() => setSelectedAttack(attack)}
                  >
                    <td>{attack.Timestamp}</td>
                    <td>{attack["Attack Type"]}</td>
                    <td>
                      <span
                        className={`severity ${(attack["Severity"] || "Low").toLowerCase()}`}
                      >
                        {attack["Severity"] || "Low"}
                      </span>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
        <section className="table-section">
          <h2>Live Packet Monitor</h2>

          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Source IP</th>
                <th>Destination IP</th>
                <th>Protocol</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {packets.map((packet, index) => (
                <tr key={index}>
                  <td>{packet.time}</td>
                  <td>{packet.source_ip}</td>
                  <td>{packet.destination_ip}</td>
                  <td>{packet.protocol}</td>
                  <td>{packet.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className="chart-section">
          <h2>Attack Distribution</h2>
          <AttackChart stats={stats}></AttackChart>
        </div>

        <div className="chart-section">
          <h2>Attack Breakdown</h2>
          <PieAttackChart stats={stats} />
        </div>
      </section>
      {selectAttack && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Attack Details</h2>

            <p>
              <strong>Time:</strong> {selectAttack["Timestamp"]}
            </p>
            <p>
              <strong>Attack:</strong> {selectAttack["Attack Type"]}
            </p>
            <p>
              <strong>Source IP:</strong> {selectAttack["Source IP"]}
            </p>
            <p>
              <strong>Severity:</strong> {selectAttack["Severity"]}
            </p>
            <p>
              <strong>Details:</strong> {selectAttack["Details"]}
            </p>
            <button
              className="download-btn"
              onClick={() => setSelectedAttack(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={4000} theme="dark" />
    </div>
  );
}

export default App;
