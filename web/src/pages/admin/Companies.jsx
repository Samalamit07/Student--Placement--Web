import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCompanies = () => {
    setLoading(true);
    api
      .get("/companies")
      .then((res) => setCompanies(res.data.items || res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load companies"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchCompanies, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    try {
      await api.delete(`/companies/${id}`);
      fetchCompanies();
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Companies</h3>
        <button className="btn btn-primary" onClick={() => navigate("/admin/companies/add")}>
          + Add Company
        </button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {!error && companies.length === 0 && <div className="text-muted">No companies yet.</div>}
      <table className="table table-hover bg-white">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Website</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.location}</td>
              <td>
                <a href={c.website} target="_blank" rel="noreferrer">{c.website}</a>
              </td>
              <td className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/admin/companies/${c.id}/edit`)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
