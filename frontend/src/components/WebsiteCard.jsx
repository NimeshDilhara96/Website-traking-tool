import './WebsiteCard.css';

function WebsiteCard({ website, onSelect, onDelete, selected }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      className={`website-card ${selected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="website-card-header">
        <div className="website-info">
          <h3>{website.name}</h3>
          <p className="domain">🌐 {website.domain}</p>
        </div>
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
        <p className="website-id">
          <small>ID: {website.id}</small>
        </p>
        <p className="date">
          <small>Added: {formatDate(website.created_at)}</small>
        </p>
      </div>
    </div>
  );
}

export default WebsiteCard;
