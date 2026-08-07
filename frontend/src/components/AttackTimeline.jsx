import "./AttackTimeline.css";

function AttackTimeline({ attacks = [] }) {
  return (
    <div className="timeline-card">
      <h2>📈 Attack Timeline</h2>

      <div className="timeline">
        {attacks.slice(0, 8).map((attack, index) => (
          <div className="timeline-item" key={index}>
            <div
              className={`timeline-dot ${(
                attack["Severity"] || "Low"
              ).toLowerCase()}`}
            />

            <div className="timeline-content">
              <h4>{attack["Attack Type"]}</h4>
              <p>{attack["Timestamp"]}</p>
              <span>{attack["Source IP"]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttackTimeline;
