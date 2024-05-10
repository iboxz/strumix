const fs = require("fs").promises;
const path = require("path");
const cheerio = require("cheerio");

// Helper function to handle errors gracefully
function handleError(err) {
  console.error(err);
  process.exit(1); // Exit the process with an error code
}

// Improved main function with error handling and logging
async function updateTitles() {
  try {
    const productPath = "products";

    // Read product data asynchronously
    const jsonFilePath = path.join(productPath, "products.json");
    const data = await fs.readFile(jsonFilePath, "utf-8");

    // Parse JSON data asynchronously for potential errors
    const jsonData = JSON.parse(data);

    for (const category of jsonData.categories) {
      for (const product of category.products) {
        const filePath = path.join(productPath, product.url);

        try {
          // Read product file asynchronously
          const htmlContent = await fs.readFile(filePath, "utf-8");

          // Load Cheerio instance asynchronously, handling potential errors
          const $ = cheerio.load(htmlContent);

          // Update title tag content
          $("head title").text(`${product.name.fa}`);

          // Write changes to the file asynchronously
          await fs.writeFile(filePath, $.html(), "utf-8");

          console.log(`Title of ${product.url} successfully updated.`);
        } catch (err) {
          console.error(`Error updating title of ${product.url}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    handleError(err);
  }

  console.log("All titles processed.");
}

// Call the main function
updateTitles();
