# Kingidy 📚

Your AI Study Partner - A multi-platform academic document reader application

## Overview

Kingidy is a powerful web application (with planned Android and iOS support) designed to help students and academics process and manage textbooks, briefs, and other academic documents. The application provides document upload, text extraction, in-memory storage, search functionality, and an intuitive viewing interface.

## Features

- **📄 Document Upload**: Support for multiple document formats (PDF, DOCX, TXT)
- **🔍 Text Extraction**: Automatically extracts text from uploaded documents
- **💾 In-Memory Storage**: Fast document storage and retrieval from memory
- **🔎 Search**: Search across all documents with highlighted results
- **📊 Document Management**: View, organize, and delete documents
- **📱 Responsive Design**: Works seamlessly on desktop and mobile browsers
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations

## Technology Stack

- **Frontend**: React 19
- **Build Tool**: Webpack 5
- **Document Processing**: 
  - PDF.js for PDF parsing
  - Mammoth for DOCX parsing
- **Styling**: Custom CSS with responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SeenNow/Kingidy.git
cd Kingidy
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`

### Building for Production

To create a production build:
```bash
npm run build
```

The optimized files will be in the `dist` directory.

## Usage

1. **Upload Documents**: Click the "Choose File" button to upload PDF, DOCX, or TXT files
2. **View Documents**: Click on any document in the list to view its contents
3. **Search**: Use the search bar to find specific text within documents
4. **Manage**: Delete individual documents or clear all documents from memory

## Project Structure

```
Kingidy/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # React components
│   │   ├── DocumentUploader.js
│   │   ├── DocumentList.js
│   │   └── DocumentViewer.js
│   ├── services/           # Business logic
│   │   └── documentService.js
│   ├── styles/             # CSS styles
│   │   └── main.css
│   ├── App.js              # Main application component
│   └── index.js            # Application entry point
├── .babelrc                # Babel configuration
├── webpack.config.js       # Webpack configuration
└── package.json            # Project dependencies
```

## Features in Detail

### Document Processing
- Supports PDF, DOCX, DOC, and TXT formats
- Extracts full text content with formatting preserved
- Calculates word count and document metadata

### In-Memory Storage
- Fast document access without database overhead
- Efficient for studying sessions
- Easy document management

### Search Functionality
- Search across all uploaded documents
- Context snippets for search results
- Text highlighting in document viewer

## Roadmap

- [x] Web application with document upload
- [x] In-memory document storage
- [x] Text extraction from PDF, DOCX, TXT
- [x] Document viewer with search
- [ ] React Native mobile apps (Android/iOS)
- [ ] Advanced text analysis and summarization
- [ ] AI-powered study assistance
- [ ] Persistent storage options
- [ ] Document annotations and notes
- [ ] Flashcard generation from documents

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
