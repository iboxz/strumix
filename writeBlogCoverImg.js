const fs = require("fs-extra");
const path = require("path");

function handleError(err) {
  console.error(err);
  process.exit(1);
}

async function updateBlogFiles(dir) {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await updateBlogFiles(filePath); // Recursively call for directories
      } else if (file.endsWith(".html") && file !== "index.html") {
        try {
          let htmlContent = await fs.readFile(filePath, "utf-8");

          // Extract keywords from meta tag
          const keywordsMatch = htmlContent.match(/<meta name="keywords" content="([^"]*)"/);
          let keywords = keywordsMatch ? keywordsMatch[1] : "";

          // If keywords are empty, extract headline from title tag
          if (!keywords || keywords.trim() === "") {
            const titleMatch = htmlContent.match(/<title>([^<]*)<\/title>/);
            keywords = titleMatch ? titleMatch[1] : "بلاگ استرامیکس";
          }

          // Get filename without extension
          const fileName = path.basename(file, ".html");

          // Check if mainBlogContainer already has blogCoverImgContainer parent
          if (htmlContent.includes('class="blogCoverImgContainer"')) {
            // Already updated but might need keyword fix
            if (htmlContent.includes('alt="keywords"')) {
              htmlContent = htmlContent.replace(/alt="keywords"/g, `alt="${keywords}"`);
              await fs.writeFile(filePath, htmlContent, "utf-8");
              console.log(`File ${file} - Fixed alt="keywords" placeholder.`);
            } else {
              console.log(`File ${file} already has blogCoverImgContainer, skipping...`);
            }
            continue;
          }

          // Find and replace mainBlogContainer
          const pattern = /<div class=['"]mainBlogContainer['"]>([\s\S]*?)<\/div>\s*<\/section>/;

          const replacement = `<div class="blogCoverImgContainer">
          <img src="../serverAssets/blogsCoverImg/${fileName}.jpg" alt="${keywords}" />
          <div class='mainBlogContainer'>$1</div>
        </div>
      </section>`;

          if (pattern.test(htmlContent)) {
            htmlContent = htmlContent.replace(pattern, replacement);
            await fs.writeFile(filePath, htmlContent, "utf-8");
            console.log(`File ${file} successfully updated.`);
          } else {
            console.log(`Pattern not found in ${file}.`);
          }
        } catch (err) {
          console.error(`Error updating ${file}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    handleError(err);
  }
}

const projectPath = "./blogs"; // Start from blogs directory
updateBlogFiles(projectPath).then(() => {
  console.log("All blog files processed.");
});
