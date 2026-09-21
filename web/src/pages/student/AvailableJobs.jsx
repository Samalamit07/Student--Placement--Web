import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import JobCard from "../../components/JobCard";
import Loading from "../../components/Loading";

export default function AvailableJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ department: "", location: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchJobs = () => {
    setLoading(true);
    api
      .get("/jobs", { params: { search, ...filters } })
      .then((res) => setJobs(res.data.items || res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load jobs"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchJobs, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div>
      <h3 className="mb-3">Available Jobs</h3>

      <form className="d-flex gap-2 mb-3" onSubmit={handleSearch}>
        <input
          className="form-control"
          placeholder="Search by title, company, skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="form-control"
          placeholder="Department"
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <button className="btn btn-outline-secondary">Search</button>
      </form>

      {loading && <Loading />}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && jobs.length === 0 && <div className="text-muted">No jobs available right now.</div>}

      <div className="row">
        {jobs.map((j) => (
          <div className="col-md-4" key={j.id}>
            <JobCard job={j} onClick={() => navigate(`/student/jobs/${j.id}`)} />
          </div>
        ))}
      </div>
    </div>
  );
}
