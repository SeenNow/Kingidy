# Deployment Guide

## Overview

This guide covers various deployment options for the Kingidy web application.

## Build for Production

Before deploying, create a production build:

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

## Deployment Options

### 1. Static Hosting (Recommended for Web App)

The application is a static web app and can be deployed to any static hosting service.
````markdown
# Kingidy Architecture

## System Overview

Kingidy is a client-side web application built with React that processes academic documents in the browser. The application uses a modular architecture with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│            User Interface (React)            │
├─────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐        │
│  │   Document   │  │   Document   │        │
│  │   Uploader   │  │    Viewer    │        │
│  └──────────────┘  └──────────────┘        │
│         ↓                  ↓                 │
│  ┌──────────────────────────────┐          │
│  │      Document List           │          │
│  └──────────────────────────────┘          │
├─────────────────────────────────────────────┤
│          Service Layer                       │
│  ┌──────────────────────────────┐          │
│  │    Document Service          │          │
│  │  - Upload & Processing       │          │
│  │  - In-Memory Storage (Map)   │          │
│  │  - Text Extraction           │          │
│  │  - Search                    │          │
│  └──────────────────────────────┘          │
├─────────────────────────────────────────────┤
│        Document Processors                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  PDF.js  │  │ Mammoth  │  │   Text   │ │
│  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────┘
```

## Component Architecture

### 1. App Component (Container)
- **Purpose**: Main application container
- **Responsibilities**:
  - State management for documents
  - Orchestrates child components
  - Handles document selection and clearing
- **State**:
  - `documents`: Array of all uploaded documents
  - `selectedDocument`: Currently viewed document

### 2. DocumentUploader Component
- **Purpose**: Handle file uploads
- **Responsibilities**:
  - File input handling
  - Upload progress indication
  - Error handling
  - Trigger document processing
- **Props**:
  - `onDocumentAdded`: Callback when document is processed

### 3. DocumentList Component
- **Purpose**: Display all uploaded documents
- **Responsibilities**:
  - Render document items
  - Handle document selection
  - Delete documents
- **Props**:
  - `documents`: Array of documents
  - `onDocumentSelect`: Callback for document selection
  - `selectedDocumentId`: ID of currently selected document

### 4. DocumentViewer Component
- **Purpose**: Display document contents
- **Responsibilities**:
  - Render document text
  - Search functionality
  - Highlight search results
  - Display document metadata
- **Props**:
  - `document`: Document object to display

## Service Layer

### DocumentService

The DocumentService is a singleton that manages all document operations:

#### Storage
- Uses JavaScript `Map` for in-memory storage
- Key: Document ID (timestamp-based)
- Value: Document object with metadata and text

#### Document Processing Pipeline
```
File Upload → Type Detection → Text Extraction → Metadata Generation → Storage
```

#### Supported Operations
1. **addDocument(id, document)**: Store document in memory
2. **getDocument(id)**: Retrieve document by ID
3. **getAllDocuments()**: Get all stored documents
4. **removeDocument(id)**: Delete document from memory
5. **processDocument(file)**: Main processing pipeline
6. **extractPdfText(file)**: PDF text extraction
7. **extractDocxText(file)**: DOCX text extraction
8. **extractTxtText(file)**: Plain text reading
9. **searchInDocuments(query)**: Cross-document search
10. **clearAllDocuments()**: Clear all stored documents

## Data Models

### Document Object
```javascript
{
  id: String,              // Unique identifier (timestamp)
  name: String,            // Original filename
  type: String,            // File extension (pdf, docx, txt)
  size: Number,            // File size in bytes
  uploadedAt: String,      // ISO timestamp
  text: String,            // Extracted text content
  wordCount: Number        // Total words in document
}
```

### Search Result Object
```javascript
{
  documentId: String,      // Document ID
  documentName: String,    // Document name
  snippet: String,         // Context around match
  position: Number         // Character position in text
}
```

## Text Extraction

### PDF Processing (PDF.js)
- Loads PDF as ArrayBuffer
- Iterates through all pages
- Extracts text items from each page
- Concatenates into full text

### DOCX Processing (Mammoth)
- Loads DOCX as ArrayBuffer
- Extracts raw text (no styling)
- Returns plain text content

### TXT Processing
- Direct file.text() reading
- No special processing needed

## State Management

Currently uses React's built-in state management:
- Component state for UI interactions
- Props for data flow
- Service singleton for data persistence

### Future Considerations
- Consider Redux/Context API for complex state
- Add localStorage for persistence across sessions
- Implement undo/redo functionality

## Performance Considerations

### Current Implementation
- In-memory storage: Fast but limited by browser memory
- Client-side processing: No server dependency
- Single-threaded: May block UI for large files

### Optimization Opportunities
1. **Web Workers**: Process documents in background thread
2. **Lazy Loading**: Load documents on-demand
3. **Virtualization**: Render large documents efficiently
4. **Caching**: Cache processed documents

## Security Considerations

1. **Client-Side Processing**: Documents never leave the browser
2. **No Server Upload**: Privacy-focused approach
3. **File Type Validation**: Checks file extensions
4. **Error Handling**: Graceful failure for malformed files

## Extensibility

### Adding New Document Types
1. Add extraction method to DocumentService
2. Update file input accept attribute
3. Add case to processDocument switch

### Mobile Apps (Future)
The architecture supports React Native conversion:
- Service layer can be reused
- Components need mobile-specific versions
- Document pickers replace file input
- Consider native libraries for better performance

## Browser Compatibility

- Modern browsers with ES6+ support
- FileReader API for file handling
- Required APIs:
  - File API
  - ArrayBuffer
  - Promise
  - Map

## Build and Deployment

### Development
- Webpack Dev Server with hot reload
- Source maps for debugging
- Fast refresh for React components

### Production
- Minified bundle
- Tree shaking for smaller size
- Optimized assets
- Static file deployment (any web server)

## Testing Strategy (Future)

1. **Unit Tests**:
   - DocumentService methods
   - Text extraction functions
   - Search functionality

2. **Component Tests**:
   - Component rendering
   - User interactions
   - Props handling

3. **Integration Tests**:
   - Document upload flow
   - Search across documents
   - Document deletion

4. **E2E Tests**:
   - Complete user workflows
   - Cross-browser testing
   - Performance testing

````
```
