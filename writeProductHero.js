const fs = require("fs").promises;
const path = require("path");
const cheerio = require("cheerio");

// Helper function to handle errors gracefully
function handleError(err) {
  console.error(err);
  process.exit(1); // Exit the process with an error code
}

async function updateImages() {
  try {
    const productPath = "products";
    const splashScreenSection = `
      <section class="splashScreen">
        <p>
          Strumix
          <svg viewBox="0 0 337 255" fill="none">
            <path class="svg-path" />
          </svg>
        </p>
        <p>بسپار بتن ايرانيان هوشمند</p>
      </section>
    `;

    // Read directory contents asynchronously
    const files = await fs.readdir(productPath);

    // Read product data asynchronously
    const jsonFilePath = path.join(productPath, "products.json");
    const data = await fs.readFile(jsonFilePath, "utf-8");

    // Parse JSON data asynchronously for potential errors
    const jsonData = JSON.parse(data);

    for (const category of jsonData.categories) {
      for (const product of category.products) {
        const filePath = path.join(productPath, product.url);

        if (files.includes(product.url)) {
          console.log(`Processing product: ${product.url}`);

          try {
            // Read product file asynchronously
            const htmlContent = await fs.readFile(filePath, "utf-8");

            // Load Cheerio instance asynchronously, handling potential errors
            const $ = await cheerio.load(htmlContent);

            // Add splashScreenSection to the end of the file
            $("body").append(splashScreenSection);

            // Write changes to the file asynchronously
            await fs.writeFile(filePath, $.html(), "utf-8");

            console.log(`File ${product.url} successfully updated.`);
          } catch (err) {
            console.error(`Error updating ${product.url}: ${err.message}`);
          }
        }
      }
    }
  } catch (err) {
    handleError(err);
  }

  console.log("All files processed.");
}

// Call the main function
updateImages();
