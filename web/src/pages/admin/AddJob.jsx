import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const empty = {
  company_id: "",
  title: "",
  description: "",
  location: "",
  salary: "",
  minimum_cgpa: "",
  graduation_year: "",
  department: "",
  deadline: "",
};

export default function AddJob() {
  const [form, setForm] = useState(empty);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/companies").then((res) => setCompanies(res.data.items || res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/jobs", {
        ...form,
        company_id: Number(form.company_id),
        minimum_cgpa: Number(form.minimum_cgpa),
        graduation_year: Number(form.graduation_year),
        deadline: new Date(form.deadline).toISOString(),
      });
      navigate("/admin/jobs");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="mb-3">Add Job</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="row g-3" style={{ maxWidth: "700px" }}>
        <div className="col-md-6">
          <label className="form-label">Company</label>
          <select name="company_id" className="form-select" required value={form.company_id} onChange={handleChange}>
            <option value="">Select company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        {["title", "location", "salary", "minimum_cgpa", "graduation_year", "department", "deadline"].map((field) => (
          <div className="col-md-6" key={field}>
            <label className="form-label text-capitalize">{field.replace("_", " ")}</label>
            <input
              name={field}
              type={field === "deadline" ? "datetime-local" : "text"}
              className="form-control"
              required
              value={form[field]}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" rows={4} value={form.description} onChange={handleChange} />
        </div>
        <div className="col-12">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Add Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
