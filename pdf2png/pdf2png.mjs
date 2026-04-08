#!/usr/bin/env node

import { PDFiumLibrary } from "@hyzyla/pdfium";
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';


/**
 * For this and the following examples, we will use "sharp" library to convert
 * the raw bitmap data to PNG images. You can use any other library or write
 * your own function to convert the raw bitmap data to PNG images.
 */
async function renderFunction(options) {
  return await sharp(options.data, {
    raw: {
      width: options.width,
      height: options.height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();
}


async function main() {
  let inputFile;
  let outputDir;
  let verbose = false;

  // Parse command line arguments
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '-v') {
      verbose = true;
    } else if (!inputFile) {
      inputFile = process.argv[i];
    } else if (!outputDir) {
      outputDir = process.argv[i];
    }
  }

  if (!inputFile || !outputDir) {
    console.error('Usage: node pdf2png.js [ -v ] <input.pdf> <output_dir>');
    process.exit(1);
  }

  // Create output directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true });

  const buff = await fs.readFile(inputFile);

  // Initialize the library, you can do this once for the whole application
  // and reuse the library instance.
  const library = await PDFiumLibrary.init();

  // Load the document from the buffer
  // You can also pass "password" as the second argument if the document is encrypted.
  const document = await library.loadDocument(buff);

  // Iterate over the pages, render them to PNG images and
  // save to the output folder
  let totalTime = 0;
  let pageCount = 0;

  for (const page of document.pages()) {
    if (verbose) {
      console.log(`${page.number} - rendering...`);
    }
    
    const startTime = performance.now();

    // Render PDF page to PNG image
    const image = await page.render({
      scale: 3, // 3x scale (72 DPI is the default)
      render: renderFunction,  // sharp function to convert raw bitmap data to PNG
    });

    // Save the PNG image to the output folder
    const outputPath = path.resolve(`${outputDir}/page_${page.number}.png`);
    await fs.writeFile(outputPath, Buffer.from(image.data));
    
    const endTime = performance.now();
    const pageTime = endTime - startTime;
    totalTime += pageTime;
    pageCount++;
    
    if (verbose) {
      console.log(`${page.number} - rendered in ${pageTime.toFixed(2)} ms`);
    }
    console.log(`saved ${outputPath}`);
  }
  
  // Summary
  if (verbose && pageCount > 0) {
    const avgTimePerPage = totalTime / pageCount;
    const pagesPerSecond = pageCount / (totalTime / 1000);
    console.log(`\nSummary:`);
    console.log(`Total pages: ${pageCount}`);
    console.log(`Total time: ${totalTime.toFixed(2)} ms`);
    console.log(`Average time per page: ${avgTimePerPage.toFixed(2)} ms`);
    console.log(`Pages per second: ${pagesPerSecond.toFixed(2)}`);
  }

  // Do not forget to destroy the document and the library
  // when you are done.
  document.destroy();
  library.destroy();
}

main();
// Test change
