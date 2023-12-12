import React from 'react';

function CustomCard({ id, title, description, label, url, avatarUrl, style }) {
  // Adjust the description to be concise if needed
  const shortDescription = description.length > 150 ? `${description.substring(0, 150)}...` : description;

  return (
    <div style={{ ...style, border: '1px solid #ccc', borderRadius: '6px', padding: '15px', marginBottom: '10px', position: 'relative', backgroundColor: '#f0f0f0', fontSize: '0.85rem' }}>
      {avatarUrl && (
        <div style={{ position: 'absolute', top: '10px', right: '10px', textAlign: 'right' }}>
          <img src={avatarUrl} alt="Assignee" style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        <p style={{ margin: '0', fontSize: '0.95rem' }}>{title}</p>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px', marginBottom: '10px', overflow: 'auto', maxHeight: '80px', backgroundColor: '#ffffff', fontSize: '0.8rem' }}>
        <p style={{ margin: '0' }}>{shortDescription}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ fontSize: '0.75rem', color: '#666' }}>
          {label}
        </div>
        <button style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontSize: '0.75rem' }} onClick={() => window.open(url, '_blank')}>
          View Issue
        </button>
      </div>
    </div>
  );
}

export default CustomCard;
