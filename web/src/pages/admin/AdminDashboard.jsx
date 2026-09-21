import { useEffect, useState } from "react";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const cards = [
    { label: "Total Students", value: stats.total_students },
    { label: "Total Companies", value: stats.total_companies },
    { label: "Total Jobs", value: stats.total_jobs },
    { label: "Total Applications", value: stats.total_applications },
    { label: "Selected", value: stats.selected },
    { label: "Pending", value: stats.pending },
    { label: "Rejected", value: stats.rejected },
  ];

  return (
    <div>
      <h3 className="mb-4">Admin Dashboard</h3>
      <div className="row g-3">
        {cards.map((c) => (
          <div className="col-md-3" key={c.label}>
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted">{c.label}</h6>
                <h2>{c.value}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
