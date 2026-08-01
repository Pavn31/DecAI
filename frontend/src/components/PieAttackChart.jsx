import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#686c7f",
]; // Green, Blue, Red, Orange, Purple, Pink

function PieAttackChart({ stats }) {
  const data = [
    { name: "DDoS", value: stats.ddos },
    { name: "Brute Force", value: stats.brute_force },
    { name: "Port Scan", value: stats.port_scan },
    { name: "SQL Injection", value: stats.sql_injection },
    { name: "XSS", value: stats.xss },
    { name: "Malware", value: stats.malware },
    { name: "Anomaly", value: stats.anomaly },
  ];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieAttackChart;
