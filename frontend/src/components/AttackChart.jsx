import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AttackChart({ stats }) {
  const data = [
    { name: "DDoS", attacks: stats.ddos },
    { name: "Brute Force", attacks: stats.brute_force },
    { name: "SQL Injection", attacks: stats.sql_injection },
    { name: "Port Scan", attacks: stats.port_scan },
    { name: "XSS", attacks: stats.xss },
    { name: "Malware", attacks: stats.malware },
    { name: "Anomaly", attacks: stats.anomaly },
  ];

  return (
    <BarChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3"></CartesianGrid>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="attacks" fill="#de4ac0" radius={[8, 8, 0, 0]} />
    </BarChart>
  );
}
export default AttackChart;
