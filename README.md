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

## Chat (GraphQL powered)

This project includes an experimental GraphQL server for Chat with token counting (local MVP). To run the server and use the Chat UI:

1. Start the GraphQL server (server folder):

```powershell
cd server
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

2. Start the front-end (root):

```powershell
npm install
npm run dev
```

3. Visit `http://localhost:5173` (or Vite dev URL) and click the Chat link in the nav bar.

Notes:
- The backend uses SQLite for local development and can be switched to Postgres/PostGIS by updating `prisma/schema.prisma` and `DATABASE_URL`.
- Token estimation uses a simplified whitespace-based estimator; for production use `@dqbd/tiktoken`.
 - Gemini / Google Generative AI: The server includes an optional adapter to call Google Gemini models if `GOOGLE_API_KEY` is provided. Set `GOOGLE_API_KEY`, `GOOGLE_PROJECT_ID`, and `GOOGLE_LOCATION` in `server/.env` to enable.

CSS and Component Styles:
  - Component-specific styles have been moved to `public/js/styles/components.css`. Any inline styles were removed and replaced with CSS classes and CSS variables where dynamic values are required.
  - Dynamic per-element values (e.g., subject color, hero-grid transforms, and carousel pill positions) are passed via CSS custom properties (`--subject-color`, `--x`, `--rotation`, etc.) set in component render logic.

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
