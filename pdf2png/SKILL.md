---
name: pdf2png
description: convert pdf file into png images, 1 image per page.
---

# PDF to PNG Conversion Skill

## Description
Converts PDF files to PNG images using PDFium library and Sharp image processing.

## Inputs
- `inputFile`: Path to the PDF file to convert
- `outputDir`: Directory where the PNG images will be saved

## Outputs
- PNG images saved to the specified output directory, named by page number (e.g., `1.png`, `2.png`)

## Usage

```bash
npm install # if depdencies not already installed
npx pdf2png <input.pdf> <output_dir>
```

