import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import Loading from "../../components/Loading";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/applications")
      .then((res) => setApplications(res.data.items || res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load applications"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h3 className="mb-3">My Applications</h3>
      {applications.length === 0 && <div className="text-muted">You haven't applied to any jobs yet.</div>}
      <table className="table table-hover bg-white">
        <thead>
          <tr>
            <th>Job</th>
            <th>Company</th>
            <th>Status</th>
            <th>Applied At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.id} role="button" onClick={() => navigate(`/student/applications/${a.id}`)}>
              <td>{a.job_title}</td>
              <td>{a.company_name}</td>
              <td><StatusBadge status={a.status} /></td>
              <td>{a.applied_at}</td>
              <td>View</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
