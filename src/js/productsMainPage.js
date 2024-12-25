gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 0.4,
  effects: true,
  smoothTouch: false,
});
if (!navigator.userAgent.match(/iPhone/i)) {
  gsap.from(
    new SplitText(".hero > p:nth-child(2)", {
      type: "chars",
      tagName: "span",
      tag: "span",
    }).chars,
    {
      delay: 2.5,
      opacity: 0.2,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.15,
    }
  );
}

//---------------------------------------------------------------------------
const productList = document.querySelector(".productList");
const bottomSectionContainer = document.getElementById("bottomSection");

let data = null;

const fetchData = async () => {
  if (!data) {
    try {
      const today = new Date();
      const version = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;

      data = await (await fetch(`../serverAssets/products.json?version=${version}`)).json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  return data;
};

const searchProduct = async (productName) => {
  const bottomSectionContainer = document.getElementById("bottomSection");
  const productList = document.querySelector(".productList");
  smoother.scrollTo(bottomSectionContainer, true, "bottom top");
  const data = await fetchData();
  if (data) {
    const foundProducts = findProductsByName(data, productName);
    displaySearchResults(foundProducts, productList);
  }
};

const findProductsByName = (data, productName) => {
  const foundProducts = [];
  for (const category of data.categories) {
    for (const product of category.products) {
      const productNameFa = product.name.fa.toLowerCase();
      const productNameEn = product.name.en.toLowerCase();
      if (productNameFa.includes(productName.toLowerCase()) || productNameEn.includes(productName.toLowerCase())) {
        foundProducts.push(product);
      }
    }
  }
  return foundProducts;
};

const displaySearchResults = (products, productList) => {
  productList.innerHTML = "";
  if (products.length > 0) {
    for (const product of products) {
      const div = document.createElement("div");
      div.setAttribute("data-cursor", "pointerLinkNavbar");
      const link = document.createElement("a");
      link.href = `${product.url}`;
      const img = document.createElement("img");
      img.src = `../assets/productImg/${product.image}`;
      img.alt = `${product.name.en} image, تصویر ${product.name.fa}`;
      img.setAttribute("loading", "lazy");
      link.appendChild(img);
      [product.name.en, product.name.fa].forEach((name) => {
        const p = document.createElement("p");
        p.className = "englishText";
        p.textContent = name;
        link.appendChild(p);
      });
      div.appendChild(link);
      productList.appendChild(div);
      activateCustomCursors();
    }
  } else {
    productList.textContent = "محصولی یافت نشد";
  }
  const counter = document.querySelector(".counter");
  counter.textContent = `${products.length} محصول`;
};

const renderAllProducts = async () => {
  const data = await fetchData();
  if (data) {
    productList.innerHTML = "";
    let allProducts = [];

    let buttons = document.querySelectorAll(".selection .buttonCards");
    buttons.forEach((button) => button.classList.remove("active"));
    document.getElementById("allProducts").classList.add("active");

    data.categories.forEach((category) => {
      allProducts = allProducts.concat(category.products);
    });
    displaySearchResults(allProducts, productList);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await fetchData();

  const fetchDataAndRender = (subCategory) => {
    return async () => {
      const data = await fetchData();
      if (data) {
        const categoryLists = data.categories.filter((category) => category.subCategory === subCategory);
        bottomSectionContainer.className = "bottomSectionContainer";
        bottomSectionContainer.innerHTML = "";
        let buttons = document.querySelectorAll(".selection .buttonCards");
        buttons.forEach((button) => button.classList.remove("active"));
        document.getElementById(subCategory).classList.add("active");
        productList.innerHTML = "";
        let productCount = 0;
        categoryLists.forEach((category) => {
          const buttonCard = document.createElement("div");
          buttonCard.className = "buttonCards";
          [1, 2].forEach(() => {
            const paragraph = document.createElement("p");
            paragraph.textContent = category.faName;
            buttonCard.id = category.name;
            buttonCard.appendChild(paragraph);
          });
          bottomSectionContainer.appendChild(buttonCard);
          productCount += renderProducts(category.products);
          document.getElementById(category.name).addEventListener("click", () => {
            fetchAndLogProducts(category.name);
            smoother.scrollTo(bottomSectionContainer, true, "bottom top");
          });
        });
        const counter = document.querySelector(".counter");
        counter.textContent = `${productCount} محصول`;
      }
    };
  };

  const renderProducts = (products) => {
    let categoryProductCount = 0;
    products.forEach((product) => {
      const div = document.createElement("div");
      div.setAttribute("data-cursor", "pointerLinkNavbar");
      const link = document.createElement("a");
      link.href = `${product.url}`;
      const img = document.createElement("img");
      img.src = `../assets/productImg/${product.image}`;
      img.alt = `${product.name.en} image, تصویر ${product.name.fa}`;
      img.setAttribute("loading", "lazy");
      link.appendChild(img);
      [product.name.en, product.name.fa].forEach((name) => {
        const p = document.createElement("p");
        p.className = "englishText";
        p.textContent = name;
        link.appendChild(p);
      });
      div.appendChild(link);
      productList.appendChild(div);
      categoryProductCount++;
    });
    activateCustomCursors();
    return categoryProductCount;
  };

  const fetchAndLogProducts = async (categoryName) => {
    const data = await fetchData();
    if (data) {
      let buttons = document.querySelectorAll(".selection .buttonCards");
      buttons.forEach((button) => button.classList.remove("active"));
      document.getElementById(categoryName).classList.add("active");
      const category = data.categories.find((cat) => cat.name === categoryName);
      const counter = document.querySelector(".counter");
      counter.textContent = `${category.products.length} محصول`;
      if (category) {
        productList.innerHTML = "";
        renderProducts(category.products);
      } else {
        console.log(`Category "${categoryName}" not found.`);
      }
    }
  };

  const resetData = () => {
    bottomSectionContainer.className = "";
    bottomSectionContainer.innerHTML = "";
  };

  document.getElementById("concreteAdditive").addEventListener("click", fetchDataAndRender("concreteAdditive"));
  document.getElementById("constructionChemicals").addEventListener("click", fetchDataAndRender("constructionChemicals"));
  document.getElementById("waterstop").addEventListener("click", fetchDataAndRender("waterstop"));
  document.getElementById("allProducts").addEventListener("click", () => {
    renderAllProducts();
    smoother.scrollTo(bottomSectionContainer, true, "bottom top");
    resetData();
  });
  document.getElementById("plastic-spacers").addEventListener("click", () => {
    fetchAndLogProducts("plastic-spacers");
    smoother.scrollTo(bottomSectionContainer, true, "bottom top");
    resetData();
  });
  document.getElementById("raw-materials").addEventListener("click", () => {
    fetchAndLogProducts("raw-materials");
    smoother.scrollTo(bottomSectionContainer, true, "bottom top");
    resetData();
  });

  await renderAllProducts();

  function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  const productID = getUrlParameter("productID");
  if (productID) {
    setTimeout(() => {
      const element = document.getElementById(productID);
      if (element) {
        element.click();
      }
    }, 1000);
  }
});
