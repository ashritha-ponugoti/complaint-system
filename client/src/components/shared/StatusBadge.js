import React from 'react';

const statusClassMap = {
  Open: 'badge-open',
  'In Progress': 'badge-in-progress',
  Resolved: 'badge-resolved',
  Closed: 'badge-closed',
  Rejected: 'badge-rejected',
};

const StatusBadge = ({ status }) => {
  const className = statusClassMap[status] || 'badge-closed';
  return <span className={`badge ${className}`}>{status}</span>;
};

export default StatusBadge;