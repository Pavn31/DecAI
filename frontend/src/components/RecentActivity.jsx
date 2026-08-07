function RecentActivity({ attacks = [] }) {
  const recent = [...attacks].slice(-5).reverse();

  return (
    <section className="card">
      <h2>🕒 Recent Activity</h2>

      {recent.length === 0 ? (
        <p>No recent activity.</p>
      ) : (
        <div className="activity-list">
          {recent.map((attack, index) => (
            <div className="activity-item" key={index}>
              <div>
                <strong>{attack["Attack Type"]}</strong>
                <br />
                <small>{attack["Source IP"]}</small>
              </div>

              <span
                className={`severity ${(attack["Severity"] || "Low").toLowerCase()}`}
              >
                {attack["Severity"] || "Low"}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentActivity;
