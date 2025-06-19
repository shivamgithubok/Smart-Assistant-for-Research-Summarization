import React from 'react';

function SummaryDisplay({ summary }) {
  return (
    <div className="card">
      <h2 className="card-title">Document Summary</h2>
      <p className="text-muted">{summary || 'No summary available.'}</p>
    </div>
  );
}

export default SummaryDisplay;