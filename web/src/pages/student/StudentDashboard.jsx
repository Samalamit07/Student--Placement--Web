import { useEffect, useState } from "react";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/student/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load dashboard"));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!data) return <Loading />;

  return (
    <div>
      <h3>Welcome, {data.name}</h3>
      <p className="text-muted">Profile completion: {data.profile_completion}%</p>
      <div className="row g-3 mt-2">
        {[
          ["Course", data.course],
          ["Department", data.department],
          ["CGPA", data.cgpa],
          ["Available Jobs", data.available_jobs],
          ["Total Applications", data.total_applications],
          ["Selected", data.selected],
          ["Pending", data.pending],
          ["Rejected", data.rejected],
        ].map(([label, value]) => (
          <div className="col-md-3" key={label}>
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted">{label}</h6>
                <h4>{value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3"><strong>Skills:</strong> {(data.skills || []).join(", ") || "None added yet"}</p>
    </div>
  );
}
