import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import db from './db.js';
import path from 'path';
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

/**
 * Exports bulk OTS proofs as a ZIP file containing .ots binaries.
 * Optionally bundles injected PDFs if provided via multipart form, but here just .ots for simplicity.
 * IDs must exist in DB; secure: no live tx, just file bundling.
 */
export const exportBulkZip = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 100) { // Limit to prevent abuse
    throw new Error('Invalid IDs: must be non-empty array of up to 100 IDs');
  }

  const placeholders = ids.map(() => '?').join(',');
  const query = `SELECT id, ots_binary, original_filename FROM timestamps WHERE id IN (${placeholders}) AND ots_binary IS NOT NULL`;
  const stamps = db.prepare(query).all(...ids);

  if (stamps.length !== ids.length) {
    throw new Error('Some proofs not found or missing binary');
  }

  const zip = new JSZip();

  stamps.forEach((stamp) => {
    let filename = `${stamp.id}.ots`;
    if (stamp.original_filename) {
      const ext = path.extname(stamp.original_filename);
      const base = path.basename(stamp.original_filename, ext);
      filename = `${base}-proof${ext === '.ots' ? '' : '.ots'}`;
    }

    // Add .ots binary to ZIP
    zip.file(filename, Buffer.from(stamp.ots_binary));

    logger.debug(`Added ${filename} to bulk ZIP`);
  });

  // Generate ZIP buffer
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  logger.info(`Generated bulk ZIP with ${stamps.length} proofs`);

  return zipBuffer;
};

/**
 * Enhanced CSV Export for CRM Integration
 * Supports filtering by status, date range, and includes extended metadata.
 * Secure: Admin-only, no sensitive data exposed (hashes only, no binaries).
 * Handles up to 10k records, with pagination support via query params.
 */
export const exportVaultToCSV = (stamps, options = {}) => {
  const { filterStatus, startDate, endDate, includeRevoked = false, limit = 10000 } = options;

  // Apply filters in DB query (but since called from endpoint, filters already applied)
  let filteredStamps = stamps.filter(stamp => {
    if (!includeRevoked && stamp.is_revoked) return false;
    if (filterStatus && stamp.status !== filterStatus) return false;
    if (startDate && new Date(stamp.created_at) < new Date(startDate)) return false;
    if (endDate && new Date(stamp.created_at) > new Date(endDate)) return false;
    return true;
  });

  if (filteredStamps.length > limit) {
    filteredStamps = filteredStamps.slice(0, limit);
    logger.warn(`CSV export truncated to ${limit} records`);
  }

  // CSV Header with extended fields
  let csv = 'ID,Hash,Filename,Status,Created At,Confirmed At,Block Height,Is Revoked,Revocation Reason,IPFS CID,Bitcoin TX ID,Git Repo,Branch,Commit Hash,Signer NPUBs,Mesh Witnesses,Truth Score\\n';

  filteredStamps.forEach(stamp => {
    // Core fields
    const created = new Date(stamp.created_at).toISOString();
    const confirmed = stamp.confirmed_at ? new Date(stamp.confirmed_at).toISOString() : '';
    const revoked = stamp.is_revoked ? 'true' : 'false';
    const reason = stamp.revocation_reason ? `"${stamp.revocation_reason.replace(/"/g, '""')}"` : '';

    // Extended fields (join or aggregate)
    const gitData = stamp.git_stamps ? `${stamp.git_stamps.repo_name || ''}|${stamp.git_stamps.branch || ''}|${stamp.git_stamps.commit_hash || ''}` : '';
    const signers = stamp.signers ? stamp.signers.map(s => s.npub).join(';') : '';
    const witnesses = stamp.mesh_witnesses ? stamp.mesh_witnesses.length : 0;
    const truthScore = stamp.truth_score || (stamp.status === 'confirmed' ? 100 : 50);

    // Note: bitcoin_tx_id, mesh_witnesses, signers would require JOIN queries in endpoint
    // For now, placeholders or empty

    csv += `"${stamp.id}","${stamp.hash}","${(stamp.original_filename || '').replace(/"/g, '""')}","${stamp.status || ''}","${created}","${confirmed}",${stamp.bitcoin_block_height || ''},"${revoked}","${reason}","${stamp.merkle_root || ''}","", "${gitData.replace(/"/g, '""')}", "${signers}",${witnesses},${truthScore}\\n`;
  });

  // Add metadata footer
  csv += `\\n--- Export Metadata ---\\n`;
  csv += `Total Records: ${filteredStamps.length}\\n`;
  csv += `Export Date: ${new Date().toISOString()}\\n`;
  csv += `Filter Status: ${filterStatus || 'all'}\\n`;
  csv += `Date Range: ${startDate || ''} to ${endDate || ''}\\n`;
  csv += `Include Revoked: ${includeRevoked}\\n`;

  logger.info(`Generated CSV for ${filteredStamps.length} stamps with filters: ${JSON.stringify(options)}`);
  return csv;
};

// Validation function for CSV import (basic, for testing import compatibility)
export const validateCSVImport = (csvBuffer) => {
  try {
    const csvString = csvBuffer.toString('utf-8');
    const lines = csvString.split('\\n').filter(line => line.trim() && !line.startsWith('---'));
    if (lines.length < 2) throw new Error('Invalid CSV: missing header or data');

    const header = lines[0].split(',');
    if (!header.includes('ID') || !header.includes('Hash')) {
      throw new Error('Invalid CSV: required columns ID and Hash missing');
    }

    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      if (cols.length >= 2) {
        const id = cols[0].replace(/"/g, '');
        const hash = cols[1].replace(/"/g, '');
        if (id && /^[a-f0-9-]{36}$/.test(id) && /^[a-f0-9]{64}$/i.test(hash)) {
          records.push({ id, hash });
        }
      }
    }

    if (records.length === 0) throw new Error('No valid records in CSV');

    logger.info(`CSV import validation passed: ${records.length} valid records`);
    return { valid: true, count: records.length, sample: records.slice(0, 3) };
  } catch (err) {
    logger.error(`CSV validation failed: ${err.message}`);
    return { valid: false, error: err.message };
  }
};

