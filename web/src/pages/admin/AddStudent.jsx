import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const empty = {
  name: "",
  email: "",
  password: "",
  roll_number: "",
  phone: "",
  department: "",
  course: "",
  cgpa: "",
  graduation_year: "",
};

export default function AddStudent() {
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
      await api.post("/students", form);
      navigate("/admin/students");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="mb-3">Add Student</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="row g-3" style={{ maxWidth: "700px" }}>
        {Object.keys(empty).map((field) => (
          <div className="col-md-6" key={field}>
            <label className="form-label text-capitalize">{field.replace("_", " ")}</label>
            <input
              name={field}
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              className="form-control"
              required
              value={form[field]}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="col-12">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
