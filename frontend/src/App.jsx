import AttackChart from "./components/AttackChart";
import PieAttackChart from "./components/PieAttackChart";
import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [attacks, setAttacks] = useState([]);
  const [stats, setStats] = useState({
    total_attacks: 0,
    ddos: 0,
    brute_force: 0,
    high_severity: 0,
  });
  const [backendStatus, setBackendStatus] = useState("Offline");

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
      </section>

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
            {attacks.map((attack, index) => (
              <tr key={index}>
                <td>{attack.Timestamp}</td>
                <td>{attack["Attack Type"]}</td>
                <td>
                  <span
                    className={
                      'severity ${(attack.severity || "low").toLowerCase()}'
                    }
                  >
                    {attack.severity || "High"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="chart-section">
          <h2>Attack Distribution</h2>
          <AttackChart stats={stats}></AttackChart>
        </div>

        <div className="chart-section">
          <h2>Attack Breakdown</h2>
          <PieAttackChart stats={stats} />
        </div>
      </section>
    </div>
  );
}

export default App;
