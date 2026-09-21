import { useAuth } from "../../context/AuthContext";

export default function AdminProfile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <h3 className="mb-3">Admin Profile</h3>
      <div className="card p-3" style={{ maxWidth: "400px" }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
}
