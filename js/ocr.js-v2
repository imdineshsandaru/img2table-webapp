import Tesseract from 'tesseract.js';

/**
 * Performs OCR on an uploaded image file
 * @param {File} file - The image file to process
 * @returns {Promise<string>} - The extracted text
 */
export async function performOCR(file) {
  try {
    console.log('[OCR] Starting OCR process...');

    const imageData = await readFileAsDataURL(file);
    console.log('[OCR] Image loaded, starting recognition...');

    const result = await Tesseract.recognize(
      imageData,
      'eng',
      {
        // Optimize settings for table recognition
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789., ',
        preserve_interword_spaces: '1',
        tessedit_pageseg_mode: '6', // Assume uniform text block
        tessedit_ocr_engine_mode: '3', // Use Legacy + LSTM mode for better accuracy
        tessjs_create_pdf: '0', // Disable PDF output for faster processing
        tessjs_create_hocr: '0', // Disable HOCR output
        logger: m => {
          const progress = Math.round(m.progress * 100);
          console.log(`[OCR Progress] ${m.status}: ${progress}%`);
          
          // Update processing status if available
          const statusElement = document.getElementById('processingStatus');
          if (statusElement) {
            statusElement.textContent = `${m.status} (${progress}%)`;
          }
        }
      }
    );

    const text = result.data.text;
    console.log('[OCR] Recognition complete. Extracted text:', text);

    if (!text || text.trim() === '') {
      throw new Error('No text was detected in the image. Please try with a clearer image.');
    }

    return text;
  } catch (error) {
    console.error('[OCR Error]', error);
    throw new Error('Error performing OCR: ' + (error.message || 'Unknown error'));
  }
}

/**
 * Reads a file as a data URL
 * @param {File} file - The file to read
 * @returns {Promise<string>} - The file as a data URL
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      console.log('[FileReader] File loaded successfully');
      resolve(reader.result);
    };

    reader.onerror = () => {
      console.error('[FileReader Error] Error reading file');
      reject(new Error('Error reading file'));
    };

    reader.readAsDataURL(file);
  });
}