import React, { useState } from 'react';
import documentService from '../services/documentService';

const DocumentUploader = ({ onDocumentAdded }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const document = await documentService.processDocument(file);
      onDocumentAdded(document);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  return (
    <div className="document-uploader">
      <h2>Upload Document</h2>
      <div className="upload-area">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          disabled={uploading}
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-label">
          {uploading ? 'Processing...' : 'Choose File (PDF, DOCX, TXT)'}
        </label>
      </div>
      {error && <div className="error-message">{error}</div>}
      <p className="upload-info">
        Supported formats: PDF, DOCX, DOC, TXT
      </p>
    </div>
  );
};

export default DocumentUploader;
