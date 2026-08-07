import "./Notification.css";

function Notification({ notification }) {
  if (!notification) return null;

  return (
    <div className={`notification ${notification.severity.toLowerCase()}`}>
      <h3>{notification.title}</h3>
      <p>{notification.message}</p>
    </div>
  );
}

export default Notification;
