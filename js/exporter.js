/**
 * Exporter Module - Handles exporting data to Excel
 */

/**
 * Exports the processed data to an Excel file
 * @param {Object} data - Object containing headers and rows
 */
export function exportToExcel(data) {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Format data for Excel
    const excelData = data.rows;
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const columnWidths = data.headers.map(() => ({ wch: 15 }));
    worksheet['!cols'] = columnWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'Table_Data.xlsx');
    
    // Show success feedback
    showExportFeedback();
  } catch (error) {
    console.error('Export Error:', error);
    alert('Error exporting to Excel: ' + (error.message || 'Unknown error'));
  }
}

/**
 * Shows temporary visual feedback after export
 */
function showExportFeedback() {
  const exportBtn = document.getElementById('exportBtn');
  const originalText = exportBtn.innerHTML;
  
  // Show success state
  exportBtn.innerHTML = 'Exported!';
  exportBtn.classList.add('btn-success');
  
  // Reset after a delay
  setTimeout(() => {
    exportBtn.innerHTML = originalText;
    exportBtn.classList.remove('btn-success');
  }, 2000);
}