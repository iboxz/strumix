const fs = require("fs").promises;
const path = require("path");
const cheerio = require("cheerio");

function handleError(err) {
  console.error(err);
  process.exit(1); 
}

async function updateMetaTags() {
  try {
    const productPath = "products";

    const jsonFilePath = path.join(productPath, "products.json");
    const data = await fs.readFile(jsonFilePath, "utf-8");

    const jsonData = JSON.parse(data);

    for (const category of jsonData.categories) {
      for (const product of category.products) {
        const filePath = path.join(productPath, product.url);

        try {
          const htmlContent = await fs.readFile(filePath, "utf-8");

          const $ = cheerio.load(htmlContent);

          $("head").append(``);

          await fs.writeFile(filePath, $.html(), "utf-8");

          console.log(`Meta tags of ${product.url} successfully updated.`);
        } catch (err) {
          console.error(
            `Error updating meta tags of ${product.url}: ${err.message}`
          );
        }
      }
    }
  } catch (err) {
    handleError(err);
  }

  console.log("All meta tags processed.");
}

// Call the main function
updateMetaTags();
