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
      delay: 3.5,
      opacity: 0.2,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.15,
    }
  );
}

//---------------------------------------------------------------------------
window.addEventListener("load", (event) => {
  const scrollContainer = document.getElementById("scrollContainer");

  scrollContainer.addEventListener("wheel", (event) => {
    event.preventDefault();

    scrollContainer.scrollLeft += -event.deltaY;
  });
  const productList = document.querySelector(".productList");
  const bottomSectionContainer = document.getElementById("bottomSection");

  const fetchDataForSearch = async () => {
    try {
      const data = await (await fetch("../products/products.json")).json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const searchProduct = async (productName) => {
    smoother.scrollTo(bottomSectionContainer, true, "bottom top");
    const data = await fetchDataForSearch();
    if (data) {
      const foundProducts = findProductsByName(data, productName);
      displaySearchResults(foundProducts);
    }
  };

  const findProductsByName = (data, productName) => {
    const foundProducts = [];
    for (const category of data.categories) {
      for (const product of category.products) {
        const productNameFa = product.name.fa.toLowerCase();
        const productNameEn = product.name.en.toLowerCase();
        if (
          productNameFa.includes(productName.toLowerCase()) ||
          productNameEn.includes(productName.toLowerCase())
        ) {
          foundProducts.push(product);
        }
      }
    }
    return foundProducts;
  };

  const displaySearchResults = (products) => {
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
  //-----------------------------------search system--------------------------------\\
  function fetchDataAndRender(subCategory) {
    return async () => {
      try {
        const data = await (await fetch("../products/products.json")).json();
        const categoryLists = data.categories.filter(
          (category) => category.subCategory === subCategory
        );
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  }

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

  document
    .getElementById("concreteAdditive")
    .addEventListener("click", fetchDataAndRender("concreteAdditive"));
  document
    .getElementById("constructionChemicals")
    .addEventListener("click", fetchDataAndRender("constructionChemicals"));
  document.getElementById("waterstop").addEventListener("click", fetchDataAndRender("waterstop"));

  const fetchData = async () => {
    try {
      const data = await (await fetch("../products/products.json")).json();
      productList.innerHTML = "";

      let buttons = document.querySelectorAll(".selection .buttonCards");
      buttons.forEach((button) => button.classList.remove("active"));
      document.getElementById("allProducts").classList.add("active");

      bottomSectionContainer.className = "";
      bottomSectionContainer.innerHTML = "";

      const uniqueNames = new Set();

      data.categories.forEach((category) => {
        category.products.forEach((product) => {
          if (!uniqueNames.has(product.name.en)) {
            uniqueNames.add(product.name.en);

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
          }
        });
      });

      activateCustomCursors();
      const productCount = uniqueNames.size;
      const counter = document.querySelector(".counter");
      counter.textContent = `${productCount} محصول`;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAndLogProducts = async (categoryName) => {
    try {
      let buttons = document.querySelectorAll(".selection .buttonCards");
      buttons.forEach((button) => button.classList.remove("active"));
      document.getElementById(categoryName).classList.add("active");

      const data = await (await fetch("../products/products.json")).json();
      const category = data.categories.find((cat) => cat.name === categoryName);

      const counter = document.querySelector(".counter");
      counter.textContent = `${category.products.length} محصول`;

      if (category) {
        productList.innerHTML = "";
        renderProducts(category.products);
      } else {
        console.log(`Category "${categoryName}" not found.`);
      }
    } catch (error) {
      console.error("Error yfetching or logging data:", error);
    }
  };

  const resetData = () => {
    bottomSectionContainer.className = "";
    bottomSectionContainer.innerHTML = "";
  };

  document.getElementById("allProducts").addEventListener("click", fetchData);
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
  fetchData();

  function getUrlParameter(name) {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    const value = searchParams.get(name);
    return value;
  }
  const UrlGetProductID = getUrlParameter("productID");
  if (UrlGetProductID != null) {
    setTimeout(() => {
      document.getElementById(UrlGetProductID).click();
    }, 1000);
  }
});
