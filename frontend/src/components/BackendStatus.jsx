import { useEffect, useState } from "react";

function BackendStatus() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch("http://127.0.0.1:8000/stats");

        if (res.ok) {
          setOnline(true);
        } else {
          setOnline(false);
        }
      } catch {
        setOnline(false);
      }
    }

    checkBackend();

    const interval = setInterval(checkBackend, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "15px",
      }}
    >
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: online ? "#22c55e" : "#ef4444",
        }}
      ></div>

      <span>Backend {online ? "Online" : "Offline"}</span>
    </div>
  );
}

export default BackendStatus;
