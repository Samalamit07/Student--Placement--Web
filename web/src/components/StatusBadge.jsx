const colors = {
  Applied: "secondary",
  "Under Review": "info",
  Shortlisted: "warning",
  Selected: "success",
  Rejected: "danger",
};

export default function StatusBadge({ status }) {
  return <span className={`badge bg-${colors[status] || "secondary"}`}>{status}</span>;
}
