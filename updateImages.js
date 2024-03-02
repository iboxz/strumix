const fs = require("fs");

(async () => {
  const fetch = require("node-fetch");

  try {
    const response = await fetch("products.json");
    const data = await response.json();

    const currentUrl = "./product"; // Replace with your current URL

    data.categories.forEach((category) => {
      category.products.forEach((product) => {
        if (currentUrl.includes(product.url)) {
          const MainImg = {
            src: `../assets/productImg/${product.image}`,
            alt: `This is ${product.image} products photo`,
          };

          // Save changes to file
          saveChanges(MainImg);

          console.log("Changes saved successfully.");
        }
      });
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

// Function to save changes to file
function saveChanges(updatedData) {
  const filePath = "path/to/your/file"; // Replace with your file path

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // Apply changes
    const updatedFileContent = data.replace(
      /MainImg\.src\s*=\s*`[^`]+`;/,
      `MainImg.src = '${updatedData.src}';`
    );
    const updatedAltContent = updatedFileContent.replace(
      /MainImg\.alt\s*=\s*`[^`]+`;/,
      `MainImg.alt = '${updatedData.alt}';`
    );

    // Save file with changes
    fs.writeFile(filePath, updatedAltContent, "utf8", (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        return;
      }
    });
  });
}
