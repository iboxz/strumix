/**
   * این اسکریپت دو فایل sitemap XML را می‌خواند و صفحاتی را که در sitemap اول وجود دارند ولی در sitemap دوم وجود ندارند،
   * به sitemap دوم اضافه می‌کند.
   *
   * نحوه اجرا:
   *   node sitemap-update-nodejs.js sitemap1.xml sitemap2.xml output-sitemap.xml
   *
   * برای اجرای این اسکریپت نیاز به نصب کتابخانه xml2js دارید. با دستور:
   *   npm install xml2js
   */
  
const fs = require('fs').promises;
const xml2js = require('xml2js');

// تابعی برای خواندن و parse کردن فایل XML به JSON
async function parseXMLFile(filePath) {
  try {
    const xmlData = await fs.readFile(filePath, 'utf-8');
    const parser = new xml2js.Parser();
    const jsonData = await parser.parseStringPromise(xmlData);
    return jsonData;
  } catch (error) {
    console.error(`خطا در خواندن یا پارس کردن فایل ${filePath}:`, error);
    process.exit(1);
  }
}

// تابعی برای تبدیل JSON به XML و ذخیره در فایل
async function writeXMLFile(jsonData, filePath) {
  try {
    const builder = new xml2js.Builder();
    const xmlData = builder.buildObject(jsonData);
    await fs.writeFile(filePath, xmlData, 'utf-8');
    console.log(`فایل به روز شده در ${filePath} ذخیره شد.`);
  } catch (error) {
    console.error(`خطا در نوشتن فایل ${filePath}:`, error);
    process.exit(1);
  }
}

// تابع اصلی برای به روز رسانی sitemap
async function updateSitemap(sitemap1Path, sitemap2Path, outputPath) {
  // خواندن و پارس کردن دو فایل سایت مپ
  const sitemap1 = await parseXMLFile(sitemap1Path);
  const sitemap2 = await parseXMLFile(sitemap2Path);

  // اطمینان از وجود ساختار urlset و url در هر دو فایل
  if (!sitemap1.urlset || !sitemap1.urlset.url) {
    console.error("ساختار فایل sitemap اول (URLSet) صحیح نیست.");
    process.exit(1);
  }
  if (!sitemap2.urlset) {
    // اگر فایل دوم فاقد urlset هست، یک ساختار جدید ایجاد می‌کنیم
    sitemap2.urlset = { url: [] };
  } else if (!sitemap2.urlset.url) {
    sitemap2.urlset.url = [];
  }

  // ایجاد یک مجموعه از URL های موجود در sitemap دوم
  const sitemap2URLs = new Set(sitemap2.urlset.url.map(urlEntry => urlEntry.loc && urlEntry.loc[0]).filter(Boolean));

  // بررسی و اضافه کردن URL های اصلی که در دوم نیستند
  const addedURLs = [];
  sitemap1.urlset.url.forEach(urlEntry => {
    if (urlEntry.loc && urlEntry.loc[0] && !sitemap2URLs.has(urlEntry.loc[0])) {
      sitemap2.urlset.url.push(urlEntry);
      addedURLs.push(urlEntry.loc[0]);
    }
  });

  if (addedURLs.length > 0) {
    console.log("صفحات زیر به sitemap دوم اضافه شدند:");
    addedURLs.forEach(url => console.log(url));
  } else {
    console.log("هیچ صفحه جدیدی برای اضافه کردن یافت نشد.");
  }

  // ذخیره فایل به روز شده
  await writeXMLFile(sitemap2, outputPath);
}

// اعتبار سنجی ورودی‌ها از خط فرمان
if (process.argv.length < 5) {
  console.error("Usage: node sitemap-update-nodejs.js <sitemap1.xml> <sitemap2.xml> <output-sitemap.xml>");
  process.exit(1);
}

const [ , , sitemap1Path, sitemap2Path, outputPath] = process.argv;

// اجرای تابع اصلی
updateSitemap(sitemap1Path, sitemap2Path, outputPath);