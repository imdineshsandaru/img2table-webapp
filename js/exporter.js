/**
 * Exporter Module - Handles exporting data to Excel
 */

/**
 * Exports the processed data to an Excel file
 * @param {Array} data - Array of student data with totals and ranks
 */
export function exportToExcel(data) {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Format data for Excel
    const excelData = formatDataForExcel(data);
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const columnWidths = [
      { wch: 10 },  // Rank
      { wch: 20 },  // Name
      { wch: 10 },  // Math
      { wch: 10 },  // Science
      { wch: 10 },  // English
      { wch: 10 }   // Total
    ];
    
    worksheet['!cols'] = columnWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Marks');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'Student_Marks_Analysis.xlsx');
    
    // Show success feedback
    showExportFeedback();
  } catch (error) {
    console.error('Export Error:', error);
    alert('Error exporting to Excel: ' + (error.message || 'Unknown error'));
  }
}

/**
 * Formats the data for Excel export
 * @param {Array} data - Array of student data
 * @returns {Array} - Formatted data for Excel
 */
function formatDataForExcel(data) {
  // Sort data by rank
  const sortedData = [...data].sort((a, b) => a.rank - b.rank);
  
  // Map to Excel format
  return sortedData.map(student => ({
    'Rank': student.rank,
    'Name': student.name,
    'Math': student.math,
    'Science': student.science,
    'English': student.english,
    'Total': student.total
  }));
}

/**
 * Shows temporary visual feedback after export
 */
function showExportFeedback() {
  const exportBtn = document.getElementById('exportBtn');
  const originalText = exportBtn.innerHTML;
  
  // Show success state
  exportBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    Exported!
  `;
  exportBtn.classList.add('btn-success');
  
  // Reset after a delay
  setTimeout(() => {
    exportBtn.innerHTML = originalText;
    exportBtn.classList.remove('btn-success');
  }, 2000);
}