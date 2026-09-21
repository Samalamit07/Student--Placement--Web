import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get(`/students/${id}`)
      .then((res) => setForm(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load student"));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.put(`/students/${id}`, form);
      navigate(`/admin/students/${id}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (error && !form) return <div className="alert alert-danger">{error}</div>;
  if (!form) return <Loading />;

  const fields = ["name", "email", "roll_number", "phone", "department", "course", "cgpa", "graduation_year"];

  return (
    <div>
      <h3 className="mb-3">Edit Student</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="row g-3" style={{ maxWidth: "700px" }}>
        {fields.map((field) => (
          <div className="col-md-6" key={field}>
            <label className="form-label text-capitalize">{field.replace("_", " ")}</label>
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
