/**
 * Table Renderer Module - Handles rendering results to the DOM
 */

/**
 * Renders the processed data as a table
 * @param {Array} data - Array of student data with totals and ranks
 */
export function renderResultsTable(data) {
  const tableBody = document.getElementById('resultsTableBody');
  
  // Clear existing table content
  tableBody.innerHTML = '';
  
  // Sort data by rank
  const sortedData = [...data].sort((a, b) => a.rank - b.rank);
  
  // Create table rows
  sortedData.forEach(student => {
    const row = document.createElement('tr');
    
    // Add rank cell with appropriate styling
    const rankCell = document.createElement('td');
    rankCell.textContent = student.rank;
    rankCell.style.fontWeight = 'bold';
    
    // Add styling based on rank
    if (student.rank === 1) {
      rankCell.style.color = 'var(--color-success)';
    } else if (student.rank === 2) {
      rankCell.style.color = 'var(--color-primary)';
    } else if (student.rank === 3) {
      rankCell.style.color = 'var(--color-accent)';
    }
    
    row.appendChild(rankCell);
    
    // Add name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = student.name;
    row.appendChild(nameCell);
    
    // Add subject marks
    const mathCell = document.createElement('td');
    mathCell.textContent = student.math;
    row.appendChild(mathCell);
    
    const scienceCell = document.createElement('td');
    scienceCell.textContent = student.science;
    row.appendChild(scienceCell);
    
    const englishCell = document.createElement('td');
    englishCell.textContent = student.english;
    row.appendChild(englishCell);
    
    // Add total marks with highlighting
    const totalCell = document.createElement('td');
    totalCell.textContent = student.total;
    totalCell.style.fontWeight = 'bold';
    
    // Highlight total cell based on performance
    if (student.rank === 1) {
      totalCell.style.color = 'var(--color-success)';
    }
    
    row.appendChild(totalCell);
    
    // Add the completed row to the table
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