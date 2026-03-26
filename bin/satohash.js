#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const program = new Command();

program
  .name('satohash')
  .description('CLI for Bitcoin Proof-of-Existence via Satohash Protocol')
  .version('1.0.0');

program.command('stamp')
  .description('Stamp a file on the Bitcoin blockchain')
  .argument('<file>', 'file to stamp')
  .option('-s, --server <url>', 'Satohash server URL', 'http://localhost:3001')
  .action(async (file, options) => {
    try {
        const absolutePath = path.resolve(file);
        if (!fs.existsSync(absolutePath)) {
            console.error('File not found:', absolutePath);
            process.exit(1);
        }

        const fileBuffer = fs.readFileSync(absolutePath);
        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        const filename = path.basename(file);

        console.log(`🚀 Hashing file: ${filename}`);
        console.log(`🔗 SHA-256: ${hash}`);

        const response = await axios.post(`${options.server}/api/stamp`, {
            hash,
            filename
        });

        console.log('✅ Successfully anchored!');
        console.log('🆔 Proof ID:', response.data.id);
        console.log('📡 Status:', response.data.status);
    } catch (error) {
        console.error('❌ Stamping failed:', error.message);
    }
  });

program.command('stamp-dir')
  .description('Stamp an entire directory of files (Bulk Tool)')
  .argument('<directory>', 'directory to scan')
  .option('-s, --server <url>', 'Satohash server URL', 'http://localhost:3001')
  .action(async (directory, options) => {
    try {
        const absoluteDir = path.resolve(directory);
        if (!fs.statSync(absoluteDir).isDirectory()) {
            console.error('Path is not a directory:', absoluteDir);
            process.exit(1);
        }

        console.log(`📂 Scanning directory: ${absoluteDir}`);
        const files = fs.readdirSync(absoluteDir)
            .filter(f => !fs.statSync(path.join(absoluteDir, f)).isDirectory())
            .filter(f => !f.startsWith('.'));

        console.log(`🔎 Found ${files.length} files. Starting bulk anchor...`);

        for (const file of files) {
            const filePath = path.join(absoluteDir, file);
            const fileBuffer = fs.readFileSync(filePath);
            const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

            process.stdout.write(`⚡ Anchoring ${file.substring(0, 15)}... `);

            try {
                const response = await axios.post(`${options.server}/api/stamp`, {
                    hash,
                    filename: file
                });
                console.log(`✅ [${response.data.id.substring(0, 8)}]`);
            } catch (err) {
                console.log(`❌ Failed: ${err.message}`);
            }
        }
        console.log('💯 Bulk operation complete.');
    } catch (error) {
        console.error('❌ Bulk operation failed:', error.message);
    }
  });

program.parse();
