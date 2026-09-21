import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

const statuses = ["Applied", "Under Review", "Shortlisted", "Selected", "Rejected"];

export default function ApplicationDetails() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchApplication = () => {
    api
      .get(`/applications/${id}`)
      .then((res) => setApplication(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load application"));
  };

  useEffect(fetchApplication, [id]);

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      await api.put(`/applications/${id}/status`, { status });
      fetchApplication();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!application) return <Loading />;

  return (
    <div>
      <h3>Application Details</h3>
      <div className="card mt-3 p-3" style={{ maxWidth: "600px" }}>
        <p><strong>Student:</strong> {application.student_name}</p>
        <p><strong>Job:</strong> {application.job_title}</p>
        <p><strong>Company:</strong> {application.company_name}</p>
        <p><strong>Applied At:</strong> {application.applied_at}</p>
        <p><strong>Current Status:</strong> {application.status}</p>
        <label className="form-label mt-2">Update Status</label>
        <select
          className="form-select"
          value={application.status}
          disabled={updating}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
