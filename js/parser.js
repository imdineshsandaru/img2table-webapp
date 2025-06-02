/**
 * Parser Module - Converts raw OCR text into structured data
 */

/**
 * Parses raw OCR text into structured table data
 * @param {string} text - The raw text from OCR
 * @returns {Object} - Object containing headers and rows
 */
export function parseTableData(text) {
  try {
    // Split text into lines and filter out empty lines
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
      throw new Error('Not enough data detected in the image.');
    }
    
    // Process the header row to identify columns
    const headerRow = lines[0].trim();
    const headers = parseRowIntoCells(headerRow);
    
    if (!headers || headers.length === 0) {
      throw new Error('Could not detect valid column headers.');
    }
    
    // Extract data rows (skip header)
    const dataRows = lines.slice(1);
    const parsedData = [];
    
    for (const row of dataRows) {
      const cells = parseRowIntoCells(row);
      if (cells && cells.length === headers.length) {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = cells[index];
        });
        parsedData.push(rowData);
      }
    }
    
    if (parsedData.length === 0) {
      throw new Error('No valid data rows found in the image.');
    }
    
    return {
      headers,
      rows: parsedData
    };
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
  // Try different splitting strategies
  let cells;
  
  // Try splitting by multiple spaces
  cells = row.trim().split(/\s{2,}/);
  
  // If that didn't work well, try splitting by tabs
  if (cells.length < 2) {
    cells = row.trim().split(/\t+/);
  }
  
  // If still not good, try a more aggressive approach
  if (cells.length < 2) {
    cells = row.match(/[^\s|]+/g) || [];
  }
  
  return cells.map(cell => cell.trim());
}