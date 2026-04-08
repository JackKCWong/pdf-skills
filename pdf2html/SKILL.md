---
name: pdf2html
description: convert pdf document into html format
---

# PDF to html skill

## description

First convert a pdf into png images, store them in a system temp folder. Then convert the images to vanilla html & css and clean up the temp folder.


## conversion instructions

1. Exact content and layout match - Replicated all text/lines/form from the PDF. Use placeholders for images/logo/empty spaces inside the pdf file. For any text that looks like a fillable input in the original pdf, mark the html element with `data-xxx` attribute to make it easy for replace the value programmatically. 

2. A4 optimized - Uses @page CSS rule with A4 dimensions (210mm x 297mm) and appropriate margins

3. Print-ready - When printed, it will fit perfectly on a single A4 page

4. Styling - Uses similar font to the original PDF file whenever possible, proper spacing, horizontal lines, and underlined section titles matching the original

5. Screen preview - Shows with a shadow effect on screen for easy viewing

