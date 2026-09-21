import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roll_number: "",
    department: "",
    course: "",
    cgpa: "",
    graduation_year: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        ...form,
        role: "student",
        cgpa: Number(form.cgpa),
        graduation_year: Number(form.graduation_year),
      });
      navigate("/login");
    } catch (err) {
      const detail = err.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail.map((item) => item.msg).join(", ")
        : detail;
      setError(message || "Registration failed. Check the entered details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-4">
      <div className="card p-4 shadow-sm" style={{ width: "420px" }}>
        <h3 className="mb-3 text-center">Student Registration</h3>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Roll Number</label>
            <input
              className="form-control"
              required
              value={form.roll_number}
              onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Department</label>
            <input
              className="form-control"
              required
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Course</label>
            <input
              className="form-control"
              required
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">CGPA</label>
              <input
                type="number"
                className="form-control"
                required
                min="0"
                max="10"
                step="0.01"
                value={form.cgpa}
                onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Graduation Year</label>
              <input
                type="number"
                className="form-control"
                required
                min="2000"
                max="2100"
                value={form.graduation_year}
                onChange={(e) => setForm({ ...form, graduation_year: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Phone (optional)</label>
            <input
              type="tel"
              className="form-control"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <div className="text-center mt-3">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}
