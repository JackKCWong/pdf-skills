#!/usr/bin/env node
import pkg from 'pdfjs-dist';
const { getDocument } = pkg;
import path from 'path';
import fs from 'fs';

async function extractTextFromPdf(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdf = await getDocument(data).promise;
  const numPages = pdf.numPages;

  const baseName = path.basename(pdfPath, '.pdf');
  const outputDir = path.join(process.cwd(), baseName);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map(item => item.str).join(' ');
    const pageNum = String(i).padStart(3, '0');
    const outputPath = path.join(outputDir, `page_${pageNum}.txt`);
    fs.writeFileSync(outputPath, text);
  }

  console.log(`Extracted ${numPages} pages to ${outputDir}`);
}

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error('Usage: pdf2txt <input.pdf>');
  process.exit(1);
}

extractTextFromPdf(pdfPath).catch(console.error);