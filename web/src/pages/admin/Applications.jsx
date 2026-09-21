import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import Loading from "../../components/Loading";

const statuses = ["Applied", "Under Review", "Shortlisted", "Selected", "Rejected"];

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchApplications = () => {
    setLoading(true);
    api
      .get("/applications", { params: { status: statusFilter || undefined } })
      .then((res) => setApplications(res.data.items || res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load applications"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchApplications, [statusFilter]);

  return (
    <div>
      <h3 className="mb-3">Applications</h3>
      <select className="form-select mb-3" style={{ maxWidth: "250px" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All Statuses</option>
        {statuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {loading && <Loading />}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && applications.length === 0 && <div className="text-muted">No applications found.</div>}

      <table className="table table-hover bg-white">
        <thead>
          <tr>
            <th>Student</th>
            <th>Job</th>
            <th>Status</th>
            <th>Applied At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.id} role="button" onClick={() => navigate(`/admin/applications/${a.id}`)}>
              <td>{a.student_name}</td>
              <td>{a.job_title}</td>
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
