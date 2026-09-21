import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const formattedDeadline = job
    ? new Date(job.deadline).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load job"));

    api
      .get(`/jobs/${id}/eligibility`)
      .then((res) => setEligibility(res.data))
      .catch(() => setEligibility(null));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setApplyError("");
    try {
      await api.post("/applications", { job_id: id });
      navigate("/student/applications");
    } catch (err) {
      setApplyError(err.response?.data?.detail || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!job) return <Loading />;

  return (
    <div>
      <h3>{job.title}</h3>
      <h6 className="text-muted">{job.company_name}</h6>
      <div className="card mt-3 p-3" style={{ maxWidth: "600px" }}>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Salary:</strong> {job.salary}</p>
        <p><strong>Minimum CGPA:</strong> {job.minimum_cgpa}</p>
        <p><strong>Department:</strong> {job.department}</p>
        <p><strong>Graduation Year:</strong> {job.graduation_year}</p>
        <p><strong>Deadline:</strong> {formattedDeadline}</p>
        <p><strong>Description:</strong> {job.description}</p>

        {eligibility && (
          <div className={`alert ${eligibility.eligible ? "alert-success" : "alert-danger"}`}>
            {eligibility.eligible ? "Eligible ✓" : `Not Eligible ✗ — ${eligibility.reason}`}
          </div>
        )}

        {applyError && <div className="alert alert-danger">{applyError}</div>}

        <button
          className="btn btn-primary"
          disabled={applying || (eligibility && !eligibility.eligible)}
          onClick={handleApply}
        >
          {applying ? "Applying..." : "Apply for this Job"}
        </button>
      </div>
    </div>
  );
}
