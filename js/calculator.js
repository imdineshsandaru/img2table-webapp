/**
 * Calculator Module - Processes parsed data to calculate totals and ranks
 */

/**
 * Calculates total marks for each student and assigns ranks
 * @param {Array} parsedData - Array of student data objects
 * @returns {Array} - Enhanced data with totals and ranks
 */
export function calculateTotalsAndRanks(parsedData) {
  try {
    // Calculate total marks for each student
    const dataWithTotals = parsedData.map(student => {
      const total = calculateTotal(student);
      return { ...student, total };
    });
    
    // Sort students by total marks (descending)
    const sortedData = [...dataWithTotals].sort((a, b) => b.total - a.total);
    
    // Assign ranks (handling ties)
    let currentRank = 1;
    let previousTotal = null;
    let sameRankCount = 0;
    
    const rankedData = sortedData.map((student, index) => {
      // If this student has the same total as the previous one, assign the same rank
      if (previousTotal !== null && student.total === previousTotal) {
        sameRankCount++;
      } else {
        // Otherwise, set the rank to the current position (accounting for ties)
        currentRank = index + 1 - sameRankCount;
        sameRankCount = 0;
      }
      
      previousTotal = student.total;
      
      return {
        ...student,
        rank: currentRank
      };
    });
    
    return rankedData;
  } catch (error) {
    console.error('Calculation Error:', error);
    throw new Error('Error calculating results: ' + (error.message || 'Unknown error'));
  }
}

/**
 * Calculates the total marks for a student
 * @param {Object} student - Student data object
 * @returns {number} - Total marks
 */
function calculateTotal(student) {
  // Convert any non-numeric values to 0
  const math = parseFloat(student.math) || 0;
  const science = parseFloat(student.science) || 0;
  const english = parseFloat(student.english) || 0;
  
  return math + science + english;
}