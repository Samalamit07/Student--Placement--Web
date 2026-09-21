import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function EditCompany() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get(`/companies/${id}`)
      .then((res) => setForm(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load company"));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.put(`/companies/${id}`, form);
      navigate("/admin/companies");
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (error && !form) return <div className="alert alert-danger">{error}</div>;
  if (!form) return <Loading />;

  return (
    <div>
      <h3 className="mb-3">Edit Company</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="row g-3" style={{ maxWidth: "600px" }}>
        {["name", "description", "website", "location"].map((field) => (
          <div className="col-md-6" key={field}>
            <label className="form-label text-capitalize">{field}</label>
            <input
              name={field}
              className="form-control"
              value={form[field] ?? ""}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="col-12">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
