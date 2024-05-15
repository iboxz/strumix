const fs = require("fs-extra");
const path = require("path");

// Helper function to handle errors gracefully
function handleError(err) {
  console.error(err);
  process.exit(1); // Exit the process with an error code
}

// Improved main function with error handling and logging
async function updateHTMLFiles() {
  try {
    const productPath = "products";

    // Read directory contents asynchronously
    const files = await fs.readdir(productPath);

    for (const file of files) {
      if (file.endsWith(".html")) {
        const filePath = path.join(productPath, file);

        try {
          // Read HTML file asynchronously
          let htmlContent = await fs.readFile(filePath, "utf-8");

          // Remove Glitch script tag from HTML content
          htmlContent = htmlContent.replace(
            /<script src="https:\/\/cdn\.glitch\.global\/[0-9a-f-]+\/CSSRulePlugin\.min\.js"><\/script>/g,
            ""
          );

          // Write changes to the file asynchronously
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

// Call the main function
updateHTMLFiles();
