// const fs = require("fs").promises;
// const path = require("path");
// const cheerio = require("cheerio");

// Helper function to handle errors gracefully
function handleError(err) {
  console.error(err);
  process.exit(1); // Exit the process with an error code
}

// Improved main function with error handling and logging
async function updateImages() {
  try {
    const productPath = "products";

    // Read directory contents asynchronously
    const files = await fs.readdir("products");

    // Read product data asynchronously
    const jsonFilePath = path.join(productPath, "products.json");
    const data = await fs.readFile(jsonFilePath, "utf-8");

    // Parse JSON data asynchronously for potential errors
    const jsonData = JSON.parse(data);

    const uniqueNames = new Set();

    for (const category of jsonData.categories) {
      for (const product of category.products) {
        const filePath = path.join("products.html");

        if (!uniqueNames.has(product.name.en)) {
          uniqueNames.add(product.name.en);
          console.log(`Processing product: ${product.url}`);

          try {
            // Read product file asynchronously
            const htmlContent = await fs.readFile("products.html", "utf-8");

            // Load Cheerio instance asynchronously, handling potential errors
            const $ = await cheerio.load(htmlContent);

            const divHTML = `<div>
                <a href="products/${product.url}">
                  <img src="./assets/productImg/${product.image}" alt="${product.name.en} image, تصویر ${product.name.fa}" loading="lazy" />
                  <p class="englishText">${product.name.en}</p>
                  <p class="englishText">${product.name.fa}</p>
                </a>
              </div>`;

            // Update content within the "section.hero" element
            $(".productList").append(divHTML);
            // $(".productList").html(divHTML);

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
