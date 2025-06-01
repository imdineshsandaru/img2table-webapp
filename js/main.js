import { performOCR } from './ocr.js';
import { parseTableData } from './parser.js';
import { calculateTotalsAndRanks } from './calculator.js';
import { renderResultsTable } from './tableRenderer.js';
import { exportToExcel } from './exporter.js';

// DOM Elements
const uploadSection = document.getElementById('uploadSection');
const processingSection = document.getElementById('processingSection');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');
const uploadContainer = document.getElementById('uploadContainer');
const fileInput = document.getElementById('fileInput');
const processingStatus = document.getElementById('processingStatus');
const exportBtn = document.getElementById('exportBtn');
const resetBtn = document.getElementById('resetBtn');
const errorResetBtn = document.getElementById('errorResetBtn');
const errorMessage = document.getElementById('errorMessage');

// Global state
let processedData = null;
let isProcessing = false;

// Initialize the app
function init() {
  setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
  // File input change
  fileInput.addEventListener('change', async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file && !isProcessing) {
      if (file.type.startsWith('image/')) {
        await processFile(file);
      } else {
        showError('Please upload an image file.');
      }
    }
  });
  
  // Drag and drop
  uploadContainer.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isProcessing) {
      uploadContainer.classList.add('drag-over');
    }
  });
  
  uploadContainer.addEventListener('dragleave', (event) => {
    event.preventDefault();
    event.stopPropagation();
    uploadContainer.classList.remove('drag-over');
  });
  
  uploadContainer.addEventListener('drop', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    uploadContainer.classList.remove('drag-over');
    
    if (!isProcessing && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        await processFile(file);
      } else {
        showError('Please upload an image file.');
      }
    }
  });
  
  uploadContainer.addEventListener('click', (event) => {
    if (!isProcessing && event.target === uploadContainer) {
      fileInput.value = ''; // Clear the input before opening file dialog
      fileInput.click();
    }
  });
  
  // Buttons
  exportBtn.addEventListener('click', handleExport);
  resetBtn.addEventListener('click', resetApp);
  errorResetBtn.addEventListener('click', resetApp);
}

// Process the uploaded file
async function processFile(file) {
  if (isProcessing) return;
  
  try {
    isProcessing = true;
    fileInput.disabled = true;
    uploadContainer.style.pointerEvents = 'none';
    
    // Show processing section
    showSection(processingSection);
    
    // Step 1: Perform OCR
    processingStatus.textContent = 'Performing OCR on the image...';
    const ocrResult = await performOCR(file);
    
    // Step 2: Parse table data
    processingStatus.textContent = 'Parsing extracted text...';
    const parsedData = parseTableData(ocrResult);
    
    if (!parsedData || parsedData.length === 0) {
      throw new Error('Could not detect a proper table structure in the image. Please try with a clearer image.');
    }
    
    // Step 3: Calculate totals and ranks
    processingStatus.textContent = 'Calculating results...';
    processedData = calculateTotalsAndRanks(parsedData);
    
    // Step 4: Render results
    renderResultsTable(processedData);
    
    // Show results section
    showSection(resultsSection);
  } catch (error) {
    console.error('Error processing file:', error);
    errorMessage.textContent = error.message || 'There was an error processing the image. Please try again with a clearer image.';
    showSection(errorSection);
  } finally {
    isProcessing = false;
    fileInput.disabled = false;
    uploadContainer.style.pointerEvents = 'auto';
    fileInput.value = ''; // Reset file input
  }
}

// Handle export button click
function handleExport() {
  if (processedData) {
    exportToExcel(processedData);
  }
}

// Reset the app
function resetApp() {
  fileInput.value = '';
  fileInput.disabled = false;
  uploadContainer.style.pointerEvents = 'auto';
  processedData = null;
  isProcessing = false;
  showSection(uploadSection);
}

// Show only the specified section
function showSection(sectionToShow) {
  // Hide all sections
  uploadSection.classList.add('hidden');
  processingSection.classList.add('hidden');
  resultsSection.classList.add('hidden');
  errorSection.classList.add('hidden');
  
  // Show the specified section
  sectionToShow.classList.remove('hidden');
  
  // Add fade-in animation
  sectionToShow.classList.add('fade-in');
  
  // Remove animation class after animation completes
  setTimeout(() => {
    sectionToShow.classList.remove('fade-in');
  }, 300);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);