import React, { useState, useEffect } from 'react';
import DocumentUploader from './components/DocumentUploader';
import DocumentList from './components/DocumentList';
import DocumentViewer from './components/DocumentViewer';
import documentService from './services/documentService';

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    // Load documents from memory on mount
    setDocuments(documentService.getAllDocuments());
  }, []);

  const handleDocumentAdded = (document) => {
    setDocuments([...documents, document]);
    setSelectedDocument(document);
  };

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all documents?')) {
      documentService.clearAllDocuments();
      setDocuments([]);
      setSelectedDocument(null);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Kingidy</h1>
        <p className="tagline">Your AI Study Partner</p>
      </header>

      <div className="app-container">
        <aside className="sidebar">
          <DocumentUploader onDocumentAdded={handleDocumentAdded} />
          <DocumentList
            documents={documents}
            onDocumentSelect={handleDocumentSelect}
            selectedDocumentId={selectedDocument?.id}
          />
          {documents.length > 0 && (
            <button className="clear-all-btn" onClick={handleClearAll}>
              Clear All Documents
            </button>
          )}
        </aside>

        <main className="main-content">
          <DocumentViewer document={selectedDocument} />
        </main>
      </div>

      <footer className="app-footer">
        <p>Multi-platform support: Web ✓ | Android (Coming Soon) | iOS (Coming Soon)</p>
      </footer>
    </div>
  );
}

export default App;
