import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/students", label: "Students" },
  { to: "/admin/companies", label: "Companies" },
  { to: "/admin/jobs", label: "Jobs" },
  { to: "/admin/applications", label: "Applications" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/profile", label: "Profile" },
];

const studentLinks = [
  { to: "/student/dashboard", label: "Dashboard" },
  { to: "/student/profile", label: "My Profile" },
  { to: "/student/jobs", label: "Available Jobs" },
  { to: "/student/applications", label: "My Applications" },
];

export default function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === "admin" ? adminLinks : studentLinks;

  return (
    <div className="bg-light border-end vh-100 p-3" style={{ width: "220px" }}>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `d-block py-2 px-2 rounded mb-1 text-decoration-none ${
              isActive ? "bg-primary text-white" : "text-dark"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );
}
