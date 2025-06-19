import React, { useState } from 'react';
import axios from '../axios';

function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.name.endsWith('.pdf') || selectedFile.name.endsWith('.txt'))) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a PDF or TXT file.');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUpload(response.data.text, response.data.summary);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload document.');
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Upload Document</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>
        {error && <p className="text-error text-sm">{error}</p>}
        <button
          type="submit"
          disabled={!file}
          className="btn btn-primary"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default FileUpload;