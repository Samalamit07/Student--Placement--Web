import { useEffect, useState } from "react";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load reports"));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return <Loading />;

  const rows = [
    ["Total Students", stats.total_students],
    ["Total Companies", stats.total_companies],
    ["Total Jobs", stats.total_jobs],
    ["Total Applications", stats.total_applications],
    ["Selected", stats.selected],
    ["Pending", stats.pending],
    ["Rejected", stats.rejected],
  ];

  return (
    <div>
      <h3 className="mb-3">Placement Statistics</h3>
      <table className="table bg-white" style={{ maxWidth: "400px" }}>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td>{label}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
