---
name: img2html 
description: convert pdf / image into html format
---

# PDF/Image to html skill

## description

If given a pdf, First convert it into png images, store them in a system temp folder. Then convert the images to vanilla html & css and clean up the temp folder.

If given an image, convert it to html directly.


## conversion instructions

* Exact content and layout match - Replicated all text/colors/lines/form/background colors from the original file. Use placeholders for images/logo/empty spaces to keep the layout exactly the same to the original file. 

* Fillable input marker - For any space that looks like a fillable form field in the original file, mark the html element with a unique id to make it easy for replace those values programmatically. 

* Entity marker - For any text that are recognize as an entity in the original file, mark the html element with a unique id to make it easy for replace those values programmatically. 

* A4 optimized - Uses @page CSS rule with A4 dimensions (210mm x 297mm) and appropriate margins

* Print-ready - When printed, it will fit perfectly on a single A4 page

* Styling - Uses similar font to the original PDF file whenever possible, proper spacing, horizontal lines, and underlined section titles matching the original

