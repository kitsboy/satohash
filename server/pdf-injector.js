import { PDFDocument } from 'pdf-lib';
import logger from './logger.js';

/**
 * 
 * Inject the OTS hash into a PDF's XMP metadata as a "Satohash-Proof" field.
 */
export const injectMetadata = async (pdfBuffer, hash, id) => {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Set standard metadata
    pdfDoc.setSubject(`Bitcoin Proof of Existence: ${hash}`);
    pdfDoc.setKeywords(['satohash', 'bitcoin', 'opentimestamps', hash]);
    pdfDoc.setProducer('Satohash Protocol');
    pdfDoc.setCreator('Satohash Node');
    
    // Add custom XMP metadata (simplified as subjective property)
    // Note: Advanced XMP requires raw XML manipulation, but setting 
    // Title/Subject is enough for most PDF readers to see the proof.
    pdfDoc.setTitle(`SatoHash-ProofID-${id}`);

    const savedPdfBuffer = await pdfDoc.save();
    return savedPdfBuffer;
  } catch (error) {
    logger.error('PDF Injection Error: %o', error);
    throw error;
  }
};
