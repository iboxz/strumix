const fs = require("fs-extra");
const path = require("path");

function handleError(err) {
  console.error(err);
  process.exit(1);
}

async function updateHTMLFiles() {
  try {
    const productPath = "products";
    const files = await fs.readdir(productPath);

    for (const file of files) {
      if (file.endsWith(".html")) {
        const filePath = path.join(productPath, file);

        try {
          let htmlContent = await fs.readFile(filePath, "utf-8");

          // Remove old link and script tags
          htmlContent = htmlContent.replace(
            /<link rel="stylesheet" href="\.\.\/src\/css\/main\.css" \/>/g,
            ''
          );
          htmlContent = htmlContent.replace(
            /<link rel="stylesheet" href="\.\.\/src\/css\/products\.css" \/>/g,
            ''
          );
          htmlContent = htmlContent.replace(
            /<script async="" src="\.\.\/src\/js\/main\.js"><\/script>/g,
            ''
          );

          // Add new link and script tags
          const newTags = `
<link rel="stylesheet" href="../src/css/main.css?v=1.0.1" />
<link rel="stylesheet" href="../src/css/products.css?v=1.0.1" />
<script async="" src="../src/js/main.js?v=1.0.1"></script>
`;

          // Add new tags before closing </head> tag or at the end of the file if </head> not found
          if (htmlContent.includes('</head>')) {
            htmlContent = htmlContent.replace('</head>', `${newTags}</head>`);
          } else {
            htmlContent += newTags;
          }

          await fs.writeFile(filePath, htmlContent, "utf-8");
          console.log(`File ${file} successfully updated.`);
        } catch (err) {
          console.error(`Error updating ${file}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    handleError(err);
  }

  console.log("All files processed.");
}

updateHTMLFiles();
