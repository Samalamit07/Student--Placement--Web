import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((res) => setForm(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load job"));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.put(`/jobs/${id}`, {
        ...form,
        minimum_cgpa: Number(form.minimum_cgpa),
        graduation_year: Number(form.graduation_year),
        deadline: new Date(form.deadline).toISOString(),
      });
      navigate("/admin/jobs");
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (error && !form) return <div className="alert alert-danger">{error}</div>;
  if (!form) return <Loading />;

  const fields = ["title", "location", "salary", "minimum_cgpa", "graduation_year", "department", "deadline"];

  return (
    <div>
      <h3 className="mb-3">Edit Job</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="row g-3" style={{ maxWidth: "700px" }}>
        {fields.map((field) => (
          <div className="col-md-6" key={field}>
            <label className="form-label text-capitalize">{field.replace("_", " ")}</label>
            <input
              name={field}
              type={field === "deadline" ? "datetime-local" : "text"}
              className="form-control"
              value={field === "deadline" ? form[field]?.slice(0, 16) ?? "" : form[field] ?? ""}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" rows={4} value={form.description ?? ""} onChange={handleChange} />
        </div>
        <div className="col-12">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
