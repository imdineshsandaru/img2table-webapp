/**
 * Table Renderer Module - Handles rendering results to the DOM
 */

/**
 * Renders the processed data as a table
 * @param {Object} data - Object containing headers and rows
 */
export function renderResultsTable(data) {
  const { headers, rows } = data;
  const tableBody = document.getElementById('resultsTableBody');
  const tableHead = document.querySelector('#resultsTable thead tr');
  
  // Clear existing table content
  tableBody.innerHTML = '';
  tableHead.innerHTML = '';
  
  // Render headers
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    tableHead.appendChild(th);
  });
  
  // Create table rows
  rows.forEach(rowData => {
    const row = document.createElement('tr');
    
    headers.forEach(header => {
      const cell = document.createElement('td');
      cell.textContent = rowData[header];
      row.appendChild(cell);
    });
    
    tableBody.appendChild(row);
  });
  
  // Add animation
  addTableAnimation();
}

/**
 * Adds staggered animation to table rows
 */
function addTableAnimation() {
  const rows = document.querySelectorAll('#resultsTableBody tr');
  
  rows.forEach((row, index) => {
    // Add initial state
    row.style.opacity = '0';
    row.style.transform = 'translateY(10px)';
    
    // Apply staggered animation
    setTimeout(() => {
      row.style.transition = 'opacity 300ms ease, transform 300ms ease';
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
    }, 50 * index);
  });
}