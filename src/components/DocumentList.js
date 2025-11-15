import React from 'react';
import documentService from '../services/documentService';

const DocumentList = ({ documents, onDocumentSelect, selectedDocumentId }) => {
  const handleDelete = (id, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document?')) {
      documentService.removeDocument(id);
      window.location.reload(); // Simple refresh - in production, use state management
    }
  };

  if (documents.length === 0) {
    return (
      <div className="document-list empty">
        <p>No documents uploaded yet. Upload a document to get started!</p>
      </div>
    );
  }

  return (
    <div className="document-list">
      <h2>Your Documents ({documents.length})</h2>
      <div className="documents-container">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`document-item ${selectedDocumentId === doc.id ? 'selected' : ''}`}
            onClick={() => onDocumentSelect(doc)}
          >
            <div className="document-icon">📄</div>
            <div className="document-info">
              <h3>{doc.name}</h3>
              <p className="document-meta">
                {doc.type.toUpperCase()} • {doc.wordCount} words • {new Date(doc.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              className="delete-btn"
              onClick={(e) => handleDelete(doc.id, e)}
              title="Delete document"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
