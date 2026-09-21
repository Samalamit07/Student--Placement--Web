import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import StudentCard from "../../components/StudentCard";
import Loading from "../../components/Loading";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchStudents = () => {
    setLoading(true);
    api
      .get("/students", { params: { search, page } })
      .then((res) => {
        setStudents(res.data.items || res.data);
        setTotalPages(res.data.total_pages || 1);
      })
      .catch((err) => setError(err.response?.data?.detail || "Failed to load students"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Students</h3>
        <button className="btn btn-primary" onClick={() => navigate("/admin/students/add")}>
          + Add Student
        </button>
      </div>

      <form className="d-flex mb-3" onSubmit={handleSearch}>
        <input
          className="form-control me-2"
          placeholder="Search by name, roll no, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline-secondary">Search</button>
      </form>

      {loading && <Loading />}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && students.length === 0 && (
        <div className="text-muted">No students found.</div>
      )}

      <div className="row">
        {students.map((s) => (
          <div className="col-md-4" key={s.id}>
            <StudentCard student={s} onClick={() => navigate(`/admin/students/${s.id}`)} />
            <div className="d-flex gap-2 mb-3">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate(`/admin/students/${s.id}/edit`)}
              >
                Edit
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                <button className="page-link" onClick={() => setPage(p)}>
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
