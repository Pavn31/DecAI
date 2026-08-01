import AttackChart from "./components/AttackChart";
import PieAttackChart from "./components/PieAttackChart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

import "./App.css";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const fetchData = () => {
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

            toast.error(
              `🚨 ${latest["Attack Type"]} Detected\nSeverity: ${latest.severity || "High"}`,
            );
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
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="app">
      <header className="header">
        <h1 className="title">DecAI</h1>
        <p className="subtitle">AI-Powered Instrusion Detection System</p>
        <p className={backendStatus == "Online" ? "online" : "offline"}>
          <span className="status-dot"></span>
          Backend: {backendStatus}
        </p>
      </header>
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

      <div className="search-controls">
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
            {(Array.isArray(attacks) ? attacks : [])
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
                <tr key={index}>
                  <td>{attack.Timestamp}</td>
                  <td>{attack["Attack Type"]}</td>
                  <td>
                    <span
                      className={
                        'severity ${(attack.Severity || "low").toLowerCase()}'
                      }
                    >
                      {attack["Severity"] || "High"}
                    </span>
                  </td>
                </tr>
              ))}
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
      <ToastContainer position="top-right" autoClose={4000} theme="dark" />
    </div>
  );
}

export default App;
