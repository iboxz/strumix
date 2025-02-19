const fs = require("fs").promises;
const path = require("path");
const cheerio = require("cheerio");

// مسیر ریشه فایل‌های HTML سایت (می‌توانید این مسیر را طبق ساختار پروژه تغییر دهید)
const websiteDir = path.join(__dirname);

// تابعی برای پیدا کردن فایل‌های HTML در یک دایرکتوری به‌صورت بازگشتی
async function getHtmlFiles(dir) {
  let htmlFiles = [];
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory() && !fullPath.includes("/blogs")) {
        htmlFiles = htmlFiles.concat(await getHtmlFiles(fullPath));
      } else if (file.isFile() && file.name.endsWith(".html")) {
        htmlFiles.push(fullPath);
      }
    }
  } catch (err) {
    console.error("Error reading directory", dir, err);
  }
  return htmlFiles;
}

// تابع اصلی به‌روز‌رسانی فایل‌های HTML
async function updateSplashScreenImage() {
  try {
    // دریافت همه فایل‌های HTML
    const htmlFiles = await getHtmlFiles(websiteDir);

    for (const filePath of htmlFiles) {
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const $ = cheerio.load(fileContent);

        // پیدا کردن سکشن با کلاس splashScreen
        const splashSection = $("section.splashScreen");

        if (splashSection.length > 0) {
          // چک می‌کنیم که آیا تگ تصویر از قبل اضافه نشده است یا خیر
          const imgElem = splashSection.find('img[src$="VectorLogo.svg"]');
          if (imgElem.length) {
            console.log(`Image already exists in ${filePath}, skipping.`);
            continue;
          }

          // محاسبه مسیر نسبی تصویر بر اساس عمق فایل
          const relativeDepth = path.relative(websiteDir, path.dirname(filePath)).split(path.sep).length;
          const imageSrc = `${'../'.repeat(relativeDepth)}assets/VectorLogo.svg`;

          // اضافه کردن تصویر به داخل سکشن splashScreen
          splashSection.append(`\n  <img src="${imageSrc}" alt="Strumix logo" />\n`);

          // ذخیره تغییرات در فایل HTML
          await fs.writeFile(filePath, $.html(), "utf-8");
          console.log(`Updated file: ${filePath}`);
        } else {
          console.log(`No splashScreen section found in ${filePath}, skipping.`);
        }
      } catch (err) {
        console.error(`Error processing file ${filePath}`, err);
      }
    }

    console.log("All HTML files have been updated.");
  } catch (err) {
    console.error("Error updating splash screen image:", err);
  }
}

// اجرای تابع اصلی
updateSplashScreenImage();