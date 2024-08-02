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
          const htmlContent = await fs.readFile(filePath + ".html", "utf-8");

          const $ = cheerio.load(htmlContent);

          // Define the HTML snippet to add
          const snippet = `
            <a href="../assets/productCatalogue/${product.url}.pdf" data-cursor="pointerNavbar" target="_blank">
              دانلود کاتالوگ محصول <span class="iconDownload"></span>
            </a>
          `;

          // Find the target element and append the snippet
          const targetElement = $(".section2 > div:nth-child(1)");
          if (targetElement.length) {
            targetElement.append(snippet);
          } else {
            console.warn(
              `Element .section2 > div:nth-child(1) not found in ${product.url}`
            );
          }

          await fs.writeFile(filePath + ".html", $.html(), "utf-8");

          console.log(`Content of ${product.url} successfully updated.`);
        } catch (err) {
          console.error(
            `Error updating content of ${product.url}: ${err.message}`
          );
        }
      }
    }
  } catch (err) {
    handleError(err);
  }

  console.log("All content processed.");
}

// Call the main function
updateMetaTags();
