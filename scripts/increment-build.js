import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const metadataPath = path.join(__dirname, '../build-metadata.json');

try {
  let metadata = { buildNumber: 0 };
  if (fs.existsSync(metadataPath)) {
    const rawData = fs.readFileSync(metadataPath, 'utf-8');
    metadata = JSON.parse(rawData);
  }
  
  metadata.buildNumber += 1;
  metadata.lastUpdated = new Date().toISOString();
  
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`Build number incremented to ${metadata.buildNumber}`);
} catch (error) {
  console.error('Failed to increment build number:', error);
  process.exit(1);
}
