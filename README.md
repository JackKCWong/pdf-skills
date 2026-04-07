# PDF Skills

A collection of PDF processing utilities and skills, starting with PDF to PNG conversion.

## Overview

This project provides tools for working with PDF files, initially focusing on converting PDF documents to PNG images. Each page of the PDF is rendered as a separate PNG file.

## Features

- **PDF to PNG Conversion**: Convert PDF files to high-quality PNG images
- **Page-by-page processing**: Each PDF page is rendered as a separate PNG file
- **Configurable scaling**: Adjustable DPI settings for high-resolution output
- **Performance metrics**: Optional verbose mode shows rendering times and performance statistics

## Installation

### Prerequisites
- Node.js 14.x or higher
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pdf-skills
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Usage

### PDF to PNG Conversion

To convert a PDF file to PNG images:

```bash
# Using the source file
node pdf2png.mjs <input.pdf> <output_directory>

# Using the built version
node pdf2png/run.js <input.pdf> <output_directory>
```

### Options

- `-v`: Enable verbose mode to see performance metrics and progress information

### Example

```bash
# Convert a PDF to PNG images with verbose output
node pdf2png.mjs -v document.pdf output_images
```

This will create PNG files named `page_1.png`, `page_2.png`, etc. in the `output_images` directory.

