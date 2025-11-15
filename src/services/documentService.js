import mammoth from 'mammoth';

// Lazy load PDF.js to avoid webpack issues
let pdfjsLib = null;
const loadPdfJs = async () => {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }
  return pdfjsLib;
};

class DocumentService {
  constructor() {
    this.documents = new Map(); // In-memory storage
  }

  /**
   * Add a document to memory storage
   */
  addDocument(id, document) {
    this.documents.set(id, document);
  }

  /**
   * Get a document from memory by ID
   */
  getDocument(id) {
    return this.documents.get(id);
  }

  /**
   * Get all documents from memory
   */
  getAllDocuments() {
    return Array.from(this.documents.values());
  }

  /**
   * Remove a document from memory
   */
  removeDocument(id) {
    return this.documents.delete(id);
  }

  /**
   * Extract text from PDF file
   */
  async extractPdfText(file) {
    const pdfjs = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    let fullText = '';

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText;
  }

  /**
   * Extract text from DOCX file
   */
  async extractDocxText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  /**
   * Extract text from TXT file
   */
  async extractTxtText(file) {
    return await file.text();
  }

  /**
   * Process and store a document based on its type
   */
  async processDocument(file) {
    const fileType = file.name.split('.').pop().toLowerCase();
    let text = '';
    let metadata = {
      id: Date.now().toString(),
      name: file.name,
      type: fileType,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };

    try {
      switch (fileType) {
        case 'pdf':
          text = await this.extractPdfText(file);
          break;
        case 'docx':
        case 'doc':
          text = await this.extractDocxText(file);
          break;
        case 'txt':
          text = await this.extractTxtText(file);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      const document = {
        ...metadata,
        text,
        wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
      };

      this.addDocument(metadata.id, document);
      return document;
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }

  /**
   * Search for text within documents
   */
  searchInDocuments(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    for (const [id, doc] of this.documents) {
      if (doc.text.toLowerCase().includes(lowerQuery)) {
        const index = doc.text.toLowerCase().indexOf(lowerQuery);
        const start = Math.max(0, index - 50);
        const end = Math.min(doc.text.length, index + query.length + 50);
        const snippet = doc.text.substring(start, end);

        results.push({
          documentId: id,
          documentName: doc.name,
          snippet: '...' + snippet + '...',
          position: index,
        });
      }
    }

    return results;
  }

  /**
   * Clear all documents from memory
   */
  clearAllDocuments() {
    this.documents.clear();
  }
}

export default new DocumentService();
