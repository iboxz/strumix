const fs = require("fs");
const path = require("path");

// مسیر فایل JSON خود را در اینجا وارد کنید
const filePath = path.join(__dirname, "./products/products.json");

// خواندن فایل JSON
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // پارس کردن داده‌های JSON
  let jsonData;
  try {
    jsonData = JSON.parse(data);
  } catch (parseErr) {
    console.error("Error parsing JSON:", parseErr);
    return;
  }

  // تابع برای حذف ".html" از URL
  const removeHtmlExtension = (obj) => {
    if (typeof obj === "object") {
      for (let key in obj) {
        if (obj[key] && typeof obj[key] === "string" && key === "url") {
          obj[key] = obj[key].replace(/\.html$/, "");
        } else if (typeof obj[key] === "object") {
          removeHtmlExtension(obj[key]);
        }
      }
    }
  };

  // اعمال تغییرات
  removeHtmlExtension(jsonData);

  // نوشتن داده‌های جدید به فایل JSON
  fs.writeFile(
    filePath,
    JSON.stringify(jsonData, null, 2),
    "utf8",
    (writeErr) => {
      if (writeErr) {
        console.error("Error writing file:", writeErr);
        return;
      }
      console.log("File updated successfully.");
    }
  );
});
