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

          htmlContent = htmlContent.replace(
            /<link\s+rel="icon"\s+href="https:\/\/strumix.com\/assetsVectorLogo-favicon.ico"\s+type="image\/x-icon"\s*\/?>/i,
            '<link rel="icon" href="https://strumix.com/assets/VectorLogo-favicon.ico" type="image/x-icon" />'
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
