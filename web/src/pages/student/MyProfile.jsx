import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/students/me")
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load profile"));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!profile) return <Loading />;

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h3>My Profile</h3>
        <button className="btn btn-outline-primary" onClick={() => navigate("/student/profile/edit")}>
          Edit Profile
        </button>
      </div>
      <div className="card mt-3 p-3" style={{ maxWidth: "500px" }}>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Roll Number:</strong> {profile.roll_number}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
        <p><strong>Department:</strong> {profile.department}</p>
        <p><strong>Course:</strong> {profile.course}</p>
        <p><strong>CGPA:</strong> {profile.cgpa}</p>
        <p><strong>Graduation Year:</strong> {profile.graduation_year}</p>
        <p><strong>Skills:</strong> {(profile.skills || []).map((s) => s.skill_name).join(", ") || "None added yet"}</p>
      </div>
    </div>
  );
}
