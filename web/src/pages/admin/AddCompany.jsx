import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const empty = { name: "", description: "", website: "", location: "" };

export default function AddCompany() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/companies", form);
      navigate("/admin/companies");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="mb-3">Add Company</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="row g-3" style={{ maxWidth: "600px" }}>
        {Object.keys(empty).map((field) => (
          <div className="col-md-6" key={field}>
            <label className="form-label text-capitalize">{field}</label>
            <input
              name={field}
              className="form-control"
              required={field !== "description"}
              value={form[field]}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="col-12">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Add Company"}
          </button>
        </div>
      </form>
    </div>
  );
}
