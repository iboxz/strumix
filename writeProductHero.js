const fs = require("fs").promises;
const path = require("path");
const cheerio = require("cheerio");

async function updateProductCatalogLinks() {
  try {
    const productPath = "en/products";
    const catalogPath = "./serverAssets/productCatalogueEn";
    const jsonFilePath = path.join(productPath, "products.json");

    // Read the products JSON file
    const data = await fs.readFile(jsonFilePath, "utf-8");
    const jsonData = JSON.parse(data);

    // Loop through each category and product
    for (const category of jsonData.categories) {
      for (const product of category.products) {
        const filePath = path.join(productPath, product.url);

        // Check if the catalog file exists for this product
        const catalogFileName = `${product.url}.pdf`;
        const catalogFilePath = path.join(catalogPath, catalogFileName);

        try {
          await fs.access(catalogFilePath);

          // Read and modify the product's HTML file
          const htmlContent = await fs.readFile(filePath + ".html", "utf-8");
          const $ = cheerio.load(htmlContent);

          // Locate the target section
          const section2Div = $("section.section2 > div").first();

          if (section2Div.length) {
            // Add the download button to the target div
            const downloadLink = `
              <a href="../../serverAssets/productCatalogueEn/${catalogFileName}" data-cursor="pointerNavbar" target="_blank">
                Download product catalog<span class="iconDownload"></span>
              </a>
            `;
            section2Div.append(downloadLink);

            // Write the updated HTML back to the file
            await fs.writeFile(filePath + ".html", $.html(), "utf-8");
            console.log(`Added catalog download link for ${product.url}.`);
          } else {
            console.warn(`Section2 div not found in ${product.url}.`);
          }
        } catch (err) {
          console.warn(`Catalog not found for ${product.url}, skipping.`);
        }
      }
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("All product catalog links updated.");
}

// Call the main function
updateProductCatalogLinks();
