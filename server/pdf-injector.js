import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import logger from './logger.js';

/**
 * Inject the OTS hash into a PDF's XMP metadata AND draw a visual watermark.
 */
export const injectMetadata = async (pdfBuffer, hash, id) => {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // 1. Set standard metadata
    pdfDoc.setSubject(`Bitcoin Proof of Existence: ${hash}`);
    pdfDoc.setKeywords(['satohash', 'bitcoin', 'opentimestamps', hash]);
    pdfDoc.setProducer('Satohash Protocol');
    pdfDoc.setCreator('Satohash Node');
    pdfDoc.setTitle(`SatoHash-ProofID-${id}`);

    // 2. Add visual stamp to the first page (Item 13: PDF Watermarker)
    const pages = pdfDoc.getPages();
    if (pages.length > 0) {
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
        
        // Draw a glassmorphism style banner at the top
        firstPage.drawRectangle({
            x: 0,
            y: height - 35,
            width: width,
            height: 35,
            color: rgb(0.05, 0.07, 0.1), // Dark Navy
            opacity: 0.85
        });

        firstPage.drawText(`SATOHASH CRYPTOGRAPHIC PROOF: ${id}`, {
            x: 50,
            y: height - 22,
            size: 9,
            font: helveticaFont,
            color: rgb(0.4, 0.5, 1), // Indigo Blue
        });

        firstPage.drawText(`HASH: ${hash.substring(0, 32)}...`, {
            x: width - 240,
            y: height - 22,
            size: 7,
            font: helveticaFont,
            color: rgb(0.6, 0.6, 0.6),
        });
    }

    const savedPdfBuffer = await pdfDoc.save();
    return savedPdfBuffer;
  } catch (error) {
    logger.error('PDF Injection Error: %o', error);
    throw error;
  }
};
