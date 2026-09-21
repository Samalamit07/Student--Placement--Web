export default function JobCard({ job, onClick }) {
  const deadline = new Date(job.deadline).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="card mb-3 shadow-sm" role="button" onClick={onClick}>
      <div className="card-body">
        <h5 className="card-title">{job.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{job.company_name}</h6>
        <p className="card-text mb-1">Location: {job.location}</p>
        <p className="card-text mb-1">Salary: {job.salary}</p>
        <p className="card-text text-muted">Deadline: {deadline}</p>
      </div>
    </div>
  );
}
