function DashboardCard({ title, value, icon }) {
  return (
    <div className="card stat-card">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

export default DashboardCard;
