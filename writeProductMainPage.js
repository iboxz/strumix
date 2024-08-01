const fs = require("fs-extra");
const path = require("path");

function handleError(err) {
  console.error(err);
  process.exit(1);
}

async function updateHTMLFiles() {
  try {
    const productPath = "products";
    const files = await fs.readdir(productPath);

    for (const file of files) {
      if (file.endsWith(".html")) {
        const filePath = path.join(productPath, file);

        try {
          let htmlContent = await fs.readFile(filePath, "utf-8");

          // بررسی وجود اولین اسکریپت
          if (!htmlContent.includes('<script src="../src/js/chart.js"></script>')) {
            // اضافه کردن اولین اسکریپت به هد
            htmlContent = htmlContent.replace(
              /<\/head>/i,
              '<script src="../src/js/chart.js"></script>\n</head>'
            );
          }

          // بررسی وجود دومین اسکریپت
          if (!htmlContent.includes('<script defer="" src="../src/js/lineChart.js"></script>')) {
            // اضافه کردن دومین اسکریپت به هد
            htmlContent = htmlContent.replace(
              /<\/head>/i,
              '<script defer="" src="../src/js/lineChart.js"></script>\n</head>'
            );
          }

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

updateHTMLFiles();
