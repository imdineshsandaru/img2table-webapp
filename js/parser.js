/**
 * Parser Module - Converts raw OCR text into structured data
 */

/**
 * Parses raw OCR text into structured table data
 * @param {string} text - The raw text from OCR
 * @returns {Array} - Array of student data objects
 */
export function parseTableData(text) {
   console.log('TEXT', text);
  try {
    // Split text into lines and filter out empty lines
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
      throw new Error('Not enough data detected in the image.');
    }
    
    // Process the header row to identify columns
    const headerRow = lines[0].trim();
    const headerCells = parseRowIntoCells(headerRow);
    
    // Validate header to ensure it matches expected format
    if (!isValidHeader(headerCells)) {
      throw new Error('Could not detect a valid header row with Name and subject columns.');
    }
    
    // Extract data rows (skip header)
    const dataRows = lines.slice(1);
    const parsedData = [];
    
    for (const row of dataRows) {
      const rowData = parseDataRow(row, headerCells);
      if (rowData) {
        parsedData.push(rowData);
      }
    }
    
    if (parsedData.length === 0) {
      throw new Error('No valid data rows found in the image.');
    }
    
    return parsedData;
  } catch (error) {
    console.error('Parsing Error:', error);
    throw new Error('Error parsing table data: ' + (error.message || 'Invalid table format'));
  }
}

/**
 * Parses a row of text into cells
 * @param {string} row - The row text
 * @returns {Array} - Array of cell values
 */
function parseRowIntoCells(row) {
  // This is a simple implementation that splits by whitespace
  // For real-world use, this would need to be more sophisticated
  
  // First try to split by multiple spaces (common in OCR output)
  let cells = row.trim().split(/\s{2,}/);
  
  // If we don't have enough cells, try another approach
  if (cells.length < 4) {
    // Try to split by tabs
    cells = row.trim().split(/\t+/);
    
    // If still not enough, try regular expression to detect word boundaries
    if (cells.length < 4) {
      // This regex looks for word clusters separated by spaces
      const matches = row.match(/\b[\w]+\b/g);
      if (matches && matches.length >= 4) {
        cells = matches;
      }
    }
  }
  
  return cells.map(cell => cell.trim());
}

/**
 * Validates if the detected header contains required columns
 * @param {Array} headerCells - The detected header cells
 * @returns {boolean} - Whether the header is valid
 */
function isValidHeader(headerCells) {
  // Convert to lowercase for case-insensitive comparison
  const lowerCells = headerCells.map(cell => cell.toLowerCase());
  
  // Check for 'name' column
  const hasName = lowerCells.some(cell => cell.includes('name'));
  
  // Check for subject columns
  const hasSubjects = [
    lowerCells.some(cell => cell.includes('math') || cell.includes('maths')),
    lowerCells.some(cell => cell.includes('science') || cell.includes('sci')),
    lowerCells.some(cell => cell.includes('english') || cell.includes('eng'))
  ];
  
  // Valid if has name and at least 2 subjects
  return hasName && hasSubjects.filter(Boolean).length >= 2;
}

/**
 * Parses a data row into a structured object
 * @param {string} row - The data row text
 * @param {Array} headerCells - The header cells for reference
 * @returns {Object|null} - Parsed student data or null if invalid
 */
function parseDataRow(row, headerCells) {
  const cells = parseRowIntoCells(row);
  
  // Skip rows that don't have enough data
  if (cells.length < 3) {
    return null;
  }
  
  // Basic validation: ensure we have a name and numeric values
  if (!cells[0] || !isValidName(cells[0])) {
    return null;
  }
  
  // Extract marks for each subject (assuming they're numeric)
  const marks = cells.slice(1).map(cell => {
    const number = parseInt(cell.replace(/[^\d]/g, ''), 10);
    return isNaN(number) ? 0 : number;
  });
  
  // Create student object (assuming standard format: Name, Math, Science, English)
  return {
    name: cells[0],
    math: marks[0] || 0,
    science: marks[1] || 0, 
    english: marks[2] || 0
  };
}

/**
 * Validates if a string looks like a name
 * @param {string} str - The string to check
 * @returns {boolean} - Whether it's a valid name
 */
function isValidName(str) {
  // Names should be alphabetic and not just numbers
  return /[a-zA-Z]/.test(str) && !/^\d+$/.test(str);
}