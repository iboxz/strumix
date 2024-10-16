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
        try {
          let htmlContent = await fs.readFile(filePath, "utf-8");

          // Update the version numbers
          htmlContent = htmlContent.replace(/v=1\.0\.\d+/g, "v=1.0.11");

          await fs.writeFile(filePath, htmlContent, "utf-8");
          console.log(`File ${filePath} successfully updated.`);
        } catch (err) {
          console.error(`Error updating ${filePath}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    handleError(err);
  }
}

const projectPath = "."; // Start from the current directory
updateHTMLFiles(projectPath).then(() => {
  console.log("All files processed.");
});