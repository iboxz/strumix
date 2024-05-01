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

          // Add script tags to the head section
          htmlContent = htmlContent.replace(
            /<head>([\s\S]*?)<\/head>/,
            `<head>$1
              <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js"></script>
              <script async src="../src/js/main.js"></script>
            </head>`
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
