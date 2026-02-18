import './WebsiteCard.css';

function WebsiteCard({ website, onSelect, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="website-card">
      <div className="website-card-header">
        <h3>{website.name}</h3>
        <button 
          className="btn-delete" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete website"
        >
          🗑️
        </button>
      </div>
      
      <div className="website-card-body">
        <p className="domain">🌐 {website.domain}</p>
        <p className="website-id">
          <small>ID: {website.id}</small>
        </p>
        <p className="date">
          <small>Added: {formatDate(website.created_at)}</small>
        </p>
      </div>

      <div className="website-card-footer">
        <button 
          className="btn btn-primary btn-block"
          onClick={onSelect}
        >
          View Analytics
        </button>
      </div>
    </div>
  );
}

export default WebsiteCard;
