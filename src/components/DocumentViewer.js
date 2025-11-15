import React, { useState } from 'react';
import documentService from '../services/documentService';

const DocumentViewer = ({ document }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  if (!document) {
    return (
      <div className="document-viewer empty">
        <h2>Document Viewer</h2>
        <p>Select a document from the list to view its contents</p>
      </div>
    );
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const results = documentService.searchInDocuments(searchTerm);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="document-viewer">
      <div className="viewer-header">
        <h2>{document.name}</h2>
        <div className="document-stats">
          <span>📊 {document.wordCount} words</span>
          <span>📏 {(document.size / 1024).toFixed(2)} KB</span>
          <span>📅 {new Date(document.uploadedAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search in document..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results ({searchResults.length})</h3>
          {searchResults.map((result, index) => (
            <div key={index} className="search-result-item">
              <strong>{result.documentName}</strong>
              <p>{result.snippet}</p>
            </div>
          ))}
        </div>
      )}

      <div className="document-content">
        <pre>{searchTerm ? highlightText(document.text, searchTerm) : document.text}</pre>
      </div>
    </div>
  );
};

export default DocumentViewer;
