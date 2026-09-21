import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/students/${id}`)
      .then((res) => setStudent(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load student"));
  }, [id]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!student) return <Loading />;

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h3>{student.name}</h3>
        <button className="btn btn-outline-primary" onClick={() => navigate(`/admin/students/${id}/edit`)}>
          Edit
        </button>
      </div>
      <div className="card mt-3 p-3">
        <p><strong>Roll Number:</strong> {student.roll_number}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone:</strong> {student.phone}</p>
        <p><strong>Department:</strong> {student.department}</p>
        <p><strong>Course:</strong> {student.course}</p>
        <p><strong>CGPA:</strong> {student.cgpa}</p>
        <p><strong>Graduation Year:</strong> {student.graduation_year}</p>
        <p><strong>Skills:</strong> {(student.skills || []).map((s) => s.skill_name).join(", ") || "—"}</p>
      </div>
    </div>
  );
}
