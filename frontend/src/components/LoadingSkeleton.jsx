import "./LoadingSkeleton.css";

function LoadingSkeleton() {
  return (
    <div className="skeleton-container">
      <div className="skeleton-card"></div>
      <div className="skeleton-card"></div>
      <div className="skeleton-card"></div>
      <div className="skeleton-card large"></div>
    </div>
  );
}

export default LoadingSkeleton;
