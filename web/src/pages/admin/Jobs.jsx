import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { getApiErrorMessage } from "../../services/api";
import JobCard from "../../components/JobCard";
import Loading from "../../components/Loading";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ department: "", min_cgpa: "" });
  const navigate = useNavigate();

  const fetchJobs = () => {
    setLoading(true);
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "")
    );
    api
      .get("/jobs", { params })
      .then((res) => setJobs(res.data.items || res.data))
      .catch((err) => setError(getApiErrorMessage(err, "Failed to load jobs")))
      .finally(() => setLoading(false));
  };

  useEffect(fetchJobs, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      alert(getApiErrorMessage(err, "Delete failed"));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Jobs</h3>
        <button className="btn btn-primary" onClick={() => navigate("/admin/jobs/add")}>
          + Add Job
        </button>
      </div>

      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Filter by department"
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Minimum CGPA"
          value={filters.min_cgpa}
          onChange={(e) => setFilters({ ...filters, min_cgpa: e.target.value })}
        />
        <button className="btn btn-outline-secondary" onClick={fetchJobs}>
          Apply Filters
        </button>
      </div>

      {loading && <Loading />}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && jobs.length === 0 && <div className="text-muted">No jobs found.</div>}

      <div className="row">
        {jobs.map((j) => (
          <div className="col-md-4" key={j.id}>
            <JobCard job={j} onClick={() => navigate(`/admin/jobs/${j.id}/edit`)} />
            <button className="btn btn-sm btn-outline-danger mb-3" onClick={() => handleDelete(j.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
