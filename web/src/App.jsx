import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Students from "./pages/admin/Students";
import AddStudent from "./pages/admin/AddStudent";
import EditStudent from "./pages/admin/EditStudent";
import StudentDetails from "./pages/admin/StudentDetails";
import Companies from "./pages/admin/Companies";
import AddCompany from "./pages/admin/AddCompany";
import EditCompany from "./pages/admin/EditCompany";
import Jobs from "./pages/admin/Jobs";
import AddJob from "./pages/admin/AddJob";
import EditJob from "./pages/admin/EditJob";
import Applications from "./pages/admin/Applications";
import ApplicationDetails from "./pages/admin/ApplicationDetails";
import Reports from "./pages/admin/Reports";
import AdminProfile from "./pages/admin/AdminProfile";

import StudentDashboard from "./pages/student/StudentDashboard";
import MyProfile from "./pages/student/MyProfile";
import EditProfile from "./pages/student/EditProfile";
import AvailableJobs from "./pages/student/AvailableJobs";
import JobDetails from "./pages/student/JobDetails";
import MyApplications from "./pages/student/MyApplications";
import StudentApplicationDetails from "./pages/student/StudentApplicationDetails";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<Students />} />
              <Route path="/admin/students/add" element={<AddStudent />} />
              <Route path="/admin/students/:id/edit" element={<EditStudent />} />
              <Route path="/admin/students/:id" element={<StudentDetails />} />
              <Route path="/admin/companies" element={<Companies />} />
              <Route path="/admin/companies/add" element={<AddCompany />} />
              <Route path="/admin/companies/:id/edit" element={<EditCompany />} />
              <Route path="/admin/jobs" element={<Jobs />} />
              <Route path="/admin/jobs/add" element={<AddJob />} />
              <Route path="/admin/jobs/:id/edit" element={<EditJob />} />
              <Route path="/admin/applications" element={<Applications />} />
              <Route path="/admin/applications/:id" element={<ApplicationDetails />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<MyProfile />} />
              <Route path="/student/profile/edit" element={<EditProfile />} />
              <Route path="/student/jobs" element={<AvailableJobs />} />
              <Route path="/student/jobs/:id" element={<JobDetails />} />
              <Route path="/student/applications" element={<MyApplications />} />
              <Route path="/student/applications/:id" element={<StudentApplicationDetails />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
