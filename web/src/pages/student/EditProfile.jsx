import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function EditProfile() {
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const navigate = useNavigate();

  const fetchProfile = () => {
    api
      .get("/students/me")
      .then((res) => setForm(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load profile"));
  };

  useEffect(fetchProfile, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.put(`/students/${form.id}`, {
        name: form.name,
        phone: form.phone || null,
        department: form.department,
        course: form.course,
        cgpa: Number(form.cgpa),
        graduation_year: Number(form.graduation_year),
      });
      navigate("/student/profile");
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      await api.post(`/students/${form.id}/skills`, { skill_name: newSkill.trim() });
      setNewSkill("");
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add skill");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await api.delete(`/skills/${skillId}`);
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to remove skill");
    }
  };

  if (error && !form) return <div className="alert alert-danger">{error}</div>;
  if (!form) return <Loading />;

  const fields = ["name", "phone", "department", "course", "cgpa", "graduation_year"];

  return (
    <div>
      <h3 className="mb-3">Edit Profile</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="row g-3" style={{ maxWidth: "600px" }}>
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

      <h5 className="mt-4">Skills</h5>
      <div className="d-flex gap-2 mb-2" style={{ maxWidth: "400px" }}>
        <input
          className="form-control"
          placeholder="Add a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
        />
        <button className="btn btn-outline-primary" onClick={handleAddSkill} type="button">
          Add
        </button>
      </div>
      <div className="d-flex flex-wrap gap-2">
        {(form.skills || []).map((s) => (
          <span key={s.id} className="badge bg-secondary d-flex align-items-center gap-2 p-2">
            {s.skill_name}
            <button
              type="button"
              className="btn-close btn-close-white"
              style={{ fontSize: "0.6rem" }}
              onClick={() => handleDeleteSkill(s.id)}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
