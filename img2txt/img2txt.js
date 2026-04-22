#!/usr/bin/env node

import { createWorker } from 'tesseract.js';
import { readdir, writeFile } from 'fs/promises';
import { join, basename, extname } from 'path';
import { cpus } from 'os';

const inputDir = process.argv[2];
if (!inputDir) {
  console.error('Usage: img2txt <directory>');
  process.exit(1);
}

const cpuCount = cpus().length;
const workerCount = Math.max(1, cpuCount - 1);
console.log(`Starting ${workerCount} workers (CPU count: ${cpuCount})`);

const imageExtensions = ['.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif'];
const files = await readdir(inputDir);
const imageFiles = files.filter(f => {
  const ext = extname(f).toLowerCase();
  return imageExtensions.includes(ext);
}).sort();

if (imageFiles.length === 0) {
  console.log('No image files found.');
  process.exit(0);
}

console.log(`Found ${imageFiles.length} images`);

const workers = [];
const taskQueue = [...imageFiles];
let completed = 0;

async function processImage(worker, file) {
  const inputPath = join(inputDir, file);
  const outputFile = basename(file, extname(file)) + '.txt';
  const outputPath = join(inputDir, outputFile);

  try {
    const { data: { text } } = await worker.recognize(inputPath);
    await writeFile(outputPath, text, 'utf-8');
    completed++;
    console.log(`[${completed}/${imageFiles.length}] Created ${outputFile}`);
  } catch (err) {
    console.error(`Failed to process ${file}: ${err.message}`);
  }
}

async function runWorker(workerId) {
  const worker = await createWorker('eng');
  console.log(`Worker ${workerId} ready`);

  while (taskQueue.length > 0) {
    const file = taskQueue.shift();
    if (file) {
      await processImage(worker, file);
    }
  }

  await worker.terminate();
  console.log(`Worker ${workerId} done`);
}

for (let i = 0; i < workerCount; i++) {
  workers.push(runWorker(i));
}

await Promise.all(workers);
console.log('All done!');