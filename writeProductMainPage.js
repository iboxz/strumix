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

          // Replace the old script tag with the new one
          htmlContent = htmlContent.replace(
            /<script async="" src="\.\.\/src\/js\/main\.js\?v=1\.0\.4"><\/script>/,
            '<script async="" src="../src/js/main.js?v=1.0.5"></script>'
          );

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
