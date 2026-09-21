export default function StudentCard({ student, onClick }) {
  return (
    <div className="card mb-3 shadow-sm" role="button" onClick={onClick}>
      <div className="card-body">
        <h5 className="card-title">{student.name}</h5>
        <p className="card-text mb-1">Roll No: {student.roll_number}</p>
        <p className="card-text mb-1">{student.department} — {student.course}</p>
        <p className="card-text">CGPA: {student.cgpa}</p>
      </div>
    </div>
  );
}
