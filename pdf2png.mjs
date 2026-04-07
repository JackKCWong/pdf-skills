import { PDFiumLibrary } from "@hyzyla/pdfium";
import { promises as fs } from 'fs';
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
  const inputFile = process.argv[2];
  const outputDir = process.argv[3];

  if (!inputFile || !outputDir) {
    console.error('Usage: node pdf2png.js <input.pdf> <output_dir>');
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
  for (const page of document.pages()) {
    console.log(`${page.number} - rendering...`);

    // Render PDF page to PNG image
    const image = await page.render({
      scale: 3, // 3x scale (72 DPI is the default)
      render: renderFunction,  // sharp function to convert raw bitmap data to PNG
    });

    // Save the PNG image to the output folder
    await fs.writeFile(`${outputDir}/${page.number}.png`, Buffer.from(image.data));
  }

  // Do not forget to destroy the document and the library
  // when you are done.
  document.destroy();
  library.destroy();
}

main();
