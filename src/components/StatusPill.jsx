export default function StatusPill({ status, className = '' }) {
    const statusClasses = {
        draft: 'status-pill-draft',
        waiting: 'status-pill-waiting',
        signed: 'status-pill-signed',
        timestamped: 'status-pill-timestamped',
        pending: 'status-pill-pending',
        error: 'status-pill-error'
    };

    const statusClass = statusClasses[status] || 'status-pill-draft';

    return (
        <span className={`status-pill ${statusClass} ${className}`}>
            {status}
        </span>
    );
}
