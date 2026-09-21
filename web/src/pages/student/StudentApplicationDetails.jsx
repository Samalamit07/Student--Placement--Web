import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import Loading from "../../components/Loading";

export default function StudentApplicationDetails() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/applications/${id}`)
      .then((res) => setApplication(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load application"));
  }, [id]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!application) return <Loading />;

  return (
    <div>
      <h3>Application Details</h3>
      <div className="card mt-3 p-3" style={{ maxWidth: "600px" }}>
        <p><strong>Job:</strong> {application.job_title}</p>
        <p><strong>Company:</strong> {application.company_name}</p>
        <p><strong>Applied At:</strong> {application.applied_at}</p>
        <p><strong>Status:</strong> <StatusBadge status={application.status} /></p>
      </div>
    </div>
  );
}
