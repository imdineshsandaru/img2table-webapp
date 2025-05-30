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

// Initialize the app
function init() {
  setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
  // File input change
  fileInput.addEventListener('change', handleFileSelection);
  
  // Drag and drop
  uploadContainer.addEventListener('dragover', handleDragOver);
  uploadContainer.addEventListener('dragleave', handleDragLeave);
  uploadContainer.addEventListener('drop', handleDrop);
  uploadContainer.addEventListener('click', () => fileInput.click());
  
  // Buttons
  exportBtn.addEventListener('click', handleExport);
  resetBtn.addEventListener('click', resetApp);
  errorResetBtn.addEventListener('click', resetApp);
}

// Handle file selection from input
function handleFileSelection(event) {
  const file = event.target.files[0];
  if (file) {
    processFile(file);
  }
}

// Handle drag over
function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  uploadContainer.classList.add('drag-over');
}

// Handle drag leave
function handleDragLeave(event) {
  event.preventDefault();
  event.stopPropagation();
  uploadContainer.classList.remove('drag-over');
}

// Handle drop
function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  uploadContainer.classList.remove('drag-over');
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith('image/')) {
      processFile(file);
    } else {
      showError('Please upload an image file.');
    }
  }
}

// Process the uploaded file
async function processFile(file) {
  try {
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
  processedData = null;
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

// Show error
function showError(message) {
  errorMessage.textContent = message;
  showSection(errorSection);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);