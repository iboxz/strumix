const fs = require("fs-extra");
const path = require("path");

function handleError(err) {
  console.error(err);
  process.exit(1);
}

async function updateHTMLFiles(dir) {
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        await updateHTMLFiles(filePath); // Recursively call for directories
      } else if (file.endsWith(".html")) {
        // Check if we're in the target directory (./en/products/)
        if (filePath.includes("en\\products")) {
          try {
            let htmlContent = await fs.readFile(filePath, "utf-8");

            // Replace specific script tags for ScrollSmoother.min.js and SplitText.min.js
            htmlContent = htmlContent.replace(
              /src="(\.*\/)*(src\/js\/ScrollSmoother\.min\.js)"/g,
              'src="../../$2"'
            );

            htmlContent = htmlContent.replace(
              /src="(\.*\/)*(src\/js\/SplitText\.min\.js)"/g,
              'src="../../$2"'
            );

            await fs.writeFile(filePath, htmlContent, "utf-8");
            console.log(`File ${filePath} successfully updated.`);
          } catch (err) {
            console.error(`Error updating ${filePath}: ${err.message}`);
          }
        }
      }
    }
  } catch (err) {
    handleError(err);
  }
}

// Define the path to the en/products directory
const projectPath = path.join(".", "en", "products");
updateHTMLFiles(projectPath).then(() => {
  console.log("All files in en/products processed.");
});
