const fs = require("fs").promises;
const path = require("path");
const cheerio = require("cheerio");

function handleError(err) {
  console.error(err);
  process.exit(1);
}

async function removeIncorrectLinks() {
  try {
    const productPath = "products";
    const jsonFilePath = path.join(productPath, "products.json");
    const data = await fs.readFile(jsonFilePath, "utf-8");
    const jsonData = JSON.parse(data);

    for (const category of jsonData.categories) {
      for (const product of category.products) {
        const filePath = path.join(productPath, product.url);
        try {
          const htmlContent = await fs.readFile(filePath + ".html", "utf-8");
          const $ = cheerio.load(htmlContent);

          // Remove elements with the incorrect link
          $(`a[href^="../assets/productCatalogue/"]`).remove();

          await fs.writeFile(filePath + ".html", $.html(), "utf-8");
          console.log(`Incorrect links removed from ${product.url}.`);
        } catch (err) {
          console.error(`Error processing ${product.url}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    handleError(err);
  }
  console.log("All incorrect links removed.");
}

// Call the main function
removeIncorrectLinks();