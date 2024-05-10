const createEl = (tag, attrs = {}, textContent = '') => {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  el.textContent = textContent;
  return el;
};

const baseUrl = window.location.origin;
const categories = [
  { name: "همه‌ی محصولات", id: "" },
  { name: "افزودنی بتن", id: "concreteAdditive" },
  { name: "مواد شیمیایی صنعت ساختمان", id: "constructionChemicals" },
  { name: "واتراستاپ", id: "waterstop" },
  { name: "اسپیسر پلاستیکی بتن", id: "plastic-spacers" },
  { name: "مواد اولیه افزودنی بتن و شیمی ساختمان", id: "raw-materials" }
];

const navigation = createEl("nav");
const divLogo = createEl("div");
const logoImg = createEl("img", { src: new URL("/assets/VectorLogo.svg", baseUrl), alt: "Strumix mini logo" });
const divProducts = createEl("div");
const productsParagraph = createEl("p", { class: "productsButton" }, "محصولات");
const productsSpan = createEl("span", { class: "fleshDown" });
const divArticles = createEl("div");
const articlesParagraph = createEl("p", {}, "مقالات");
const divContact = createEl("div");
const contactParagraph = createEl("p", {}, "ارتباط با ما");
const divHamburger = createEl("div", { class: "hamburger" });
const hamburgerSpan1 = createEl("span");
const hamburgerSpan2 = createEl("span");
const sectionProducts = createEl("section", { class: "products" });
const sectionProductsDiv1 = createEl("div");
const sectionProductsDiv2 = createEl("div");

for (const category of categories) {
  const catagoryList = createEl("p", { "data-cursor": "pointerFocus" }, category.name);
  const linkContainer = createEl("a", { href: `${baseUrl}/products.html?productID=${category.id}` });
  linkContainer.appendChild(catagoryList);
  sectionProductsDiv1.appendChild(linkContainer);
}

productsParagraph.appendChild(productsSpan);
navigation.append(divLogo, divProducts, divArticles, divContact, divHamburger, sectionProducts);
divLogo.append(logoImg);
divProducts.append(productsParagraph);
divArticles.append(articlesParagraph);
divContact.append(contactParagraph);
divHamburger.append(hamburgerSpan1, hamburgerSpan2);
sectionProducts.append(sectionProductsDiv1, sectionProductsDiv2);
document.body.appendChild(navigation);


gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, TextPlugin);

gsap.set("nav .products", { y: "0%" });

var menuTimeline = gsap
  .timeline({ paused: true, reversed: true })
  .from("nav .products", { y: "-100%", duration: 1, ease: "power2.inOut" })
  .to(
    "nav > div:nth-child(3) > p",
    { text: "محصولات", scale: "1.3", duration: 0.5, ease: "none" },
    0.5
  )
  .to("nav > div:nth-child(2) > p", { text: "", duration: 0.5, ease: "none" }, 0.5)
  .to(
    "nav > div:nth-child(2) ",
    {
      background: "hsla(39, 100%, 70%, 0)",
      duration: 0.5,
      ease: "none",
    },
    0.5
  )
  .to("nav > div:nth-child(4) > p", { text: "", duration: 0.5, ease: "none" }, 0.5)
  .to("nav > div:nth-child(3)", { border: "0.1vmin black solid", duration: 0.5, ease: "none" }, 0.5)
  .to(
    "nav > div:nth-child(4)",
    {
      background: "hsla(39, 100%, 70%, 0)",
      duration: 0.5,
      ease: "none",
    },
    0.5
  );

document.querySelector(".hamburger").addEventListener("click", function () {
  if (menuEnabled) {
    menuEnabled = false;
    fetchDataForProducts();
    toggleMenu();
    toggleActiveClass();
    document.body.style.overflow = "hidden";
  } else {
    menuEnabled = true;
    toggleMenu();
    toggleActiveClass();
    document.body.style.overflow = "visible";
  }
});

function toggleActiveClass() {
  var hamburger = document.querySelector(".hamburger");
  hamburger.classList.toggle("active");
}

function toggleMenu() {
  menuTimeline.reversed() ? menuTimeline.timeScale(1).play() : menuTimeline.timeScale(2).reverse();
}
let menuEnabled = true;

document.querySelector("nav > div:nth-child(2)").addEventListener("click", function () {
  if (menuEnabled) {
    menuEnabled = false;
    fetchDataForProducts();
    toggleMenu();
    document.body.style.overflow = "hidden";
  }
});

document.querySelector("nav > div:nth-child(3)").addEventListener("click", function () {
  if (!menuEnabled) {
    toggleMenu();
    menuEnabled = true;
    document.body.style.overflow = "visible";
  } else {
    window.open(baseUrl + "/#", "_self");
  }
});
document.querySelector("nav > div:nth-child(4)").addEventListener("click", function () {
  window.open(baseUrl + "/contact.html", "_self");
});
document.querySelector("nav > div:nth-child(1)").addEventListener("click", function () {
  window.open(baseUrl, "_self");
});

document.querySelector("nav > div:nth-child(3)").addEventListener("click", function () {});
document.body.addEventListener("click", function (event) {
  if (!menuEnabled && !event.target.closest("nav")) {
    menuEnabled = true;
    toggleMenu();
    document.body.style.overflow = "visible";
  }
});

function fetchDataForProducts() {
  fetch(new URL("/products/products.json", baseUrl))
    .then((response) => response.json())
    .then((data) => {
      const selectedProducts = [];

      data.categories.forEach((category) => {
        const randomProducts = getRandomItems(category.products, 1);
        selectedProducts.push(...randomProducts);
      });

      const randomSelectedProducts = getRandomItems(selectedProducts, 4);

      document.querySelector("nav .products div:nth-child(2)").innerHTML = "";

      addSectionProducts(randomSelectedProducts);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function addSectionProducts(products) {
  const otherProductContent = document.querySelector("nav .products div:nth-child(2)");

  products.forEach((product) => {
    const otherProductItem = document.createElement("div");

    const productInfo = document.createElement("div");

    const titleFa = document.createElement("h5");
    titleFa.textContent = product.name.fa;

    const titleEn = document.createElement("span");
    titleEn.classList.add("englishText");
    titleEn.textContent = product.name.en;

    productInfo.appendChild(titleEn);
    productInfo.appendChild(titleFa);

    const image = document.createElement("img");
    productInfo.setAttribute("data-cursor", "pointerLinkNavbar");
    image.setAttribute("data-cursor", "pointerLinkNavbar");
    image.src = `../assets/productImg/${product.image}`;
    image.alt = `${product.image} Image`;

    const linkContainer = document.createElement("a");
    linkContainer.href = baseUrl + "/products/" + product.url;

    linkContainer.appendChild(image);
    linkContainer.appendChild(productInfo);
    otherProductItem.appendChild(linkContainer);

    otherProductContent.appendChild(otherProductItem);
  });

  var links = [
    { text: "مقالات", href: "#" },
    { text: "ارتباط با ما", href: baseUrl + "/contact.html" },
  ];

  for (var i = 0; i < links.length; i++) {
    var newLink = document.createElement("a");
    newLink.textContent = links[i].text;
    newLink.setAttribute("href", links[i].href);

    var newDiv = document.createElement("div");
    newDiv.appendChild(newLink);

    otherProductContent.appendChild(newLink);
  }
  activateCustomCursors();
}

function getRandomItems(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
var prevScrollpos = window.pageYOffset;

function hideNavbarOnScroll() {
  var currentScrollPos = window.pageYOffset;

  const nav = document.querySelector("nav");
  if (prevScrollpos > currentScrollPos) {
    nav.style.top = "0";
  } else {
    nav.style.top = "-15vmax";
  }

  prevScrollpos = currentScrollPos;
}

document.addEventListener("scroll", hideNavbarOnScroll);

window.addEventListener("load", (event) => {
  const path = document.querySelector(".splashScreen svg path");
  var pathData =
    "M3 252.473C7 236.473 36.2346 186.5 41 179C44.3333 142 80.9 58.4725 198.5 16.4725C222.333 6.30583 282.5 -7.9275 332.5 16.4725C319.167 31.3059 293 71 283.5 83.9727C274 96.9453 245 132.473 183 132.473C150.667 129.982 72.6582 138.3 39.4582 181.5C39.4582 181.5 91.5 54.5 265.5 33";

  path.setAttribute("d", pathData);
  var length = path.getTotalLength();
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

  gsap.to(path, { strokeDashoffset: 0, duration: 3, ease: "ease-in-out" });

  var splashScreenTimeline = gsap
    .timeline({ paused: true, reversed: true })
    .from(
      new SplitText(".splashScreen p:nth-child(1)", {
        type: "chars",
        tagName: "span",
        tag: "span",
      }).chars,
      {
        opacity: 0.2,
        ease: "power3.out",
        stagger: 0.3,
      }
    )
    .to(".splashScreen", { y: "-100%", delay: 1, duration: 1, ease: "power3.out" });

  splashScreenTimeline.play();
});

/*----------------------------------- */

const cursor = document.createElement("div");
const cursorBorder = document.createElement("div");

cursor.classList.add("cursor");
cursorBorder.classList.add("cursorBorder");

document.body.appendChild(cursor);
document.body.appendChild(cursorBorder);

if (window.innerWidth < 768) {
  cursorBorder.style.display = "none";
  cursor.style.display = "none";
} else {
  cursorBorder.style.display = "inline";
  cursor.style.display = "inline";
}

const cursorPos = { x: 0, y: 0 };
const cursorBorderPos = { x: 0, y: 0 };

document.addEventListener("mousemove", (e) => {
  cursorPos.x = e.clientX;
  cursorPos.y = e.clientY;
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

const easting = 8;

function loop() {
  cursorBorderPos.x += (cursorPos.x - cursorBorderPos.x) / easting;
  cursorBorderPos.y += (cursorPos.y - cursorBorderPos.y) / easting;
  cursorBorder.style.transform = `translate(${cursorBorderPos.x}px, ${cursorBorderPos.y}px) rotate(45deg)`;
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

document.addEventListener("click", function () {
  cursorBorder.style.borderRadius = "0";
  cursorBorder.style.setProperty("--size", "2vmin");
  setTimeout(function () {
    requestAnimationFrame(function () {
      cursorBorder.style.borderRadius = "50%";
      cursorBorder.style.setProperty("--size", "5vmin");
    });
  }, 150);
});

if ("ontouchstart" in window || navigator.maxTouchPoints) {
  cursorBorder.style.display = "none";
  cursor.style.display = "none";
}
function activateCustomCursors() {
  if ("ontouchstart" in window || navigator.maxTouchPoints) return;
  document.querySelectorAll("[data-cursor]").forEach((item) => {
    item.addEventListener("mouseover", (e) => {
      switch (item.dataset.cursor) {
        case "pointerWhite":
          cursorBorder.style.boxShadow = "0 0 0 0.1vmin white";
          cursor.style.backgroundColor = "white";
          break;
        case "pointerDisable":
          cursorBorder.style.display = "none";
          cursor.style.display = "none";
          break;
        case "pointerBlendMode":
          cursorBorder.style.backgroundColor = "white";
          cursorBorder.style.mixBlendMode = "difference";
          cursorBorder.style.setProperty("--size", "15vmin");
          break;
        case "pointerFocus":
          cursor.style.backgroundColor = "black";
          cursorBorder.style.borderRadius = "0";
          cursorBorder.style.setProperty("--size", "4vmin");
          cursorBorder.style.backgroundColor = "white";
          cursorBorder.style.mixBlendMode = "difference";
          break;
        case "pointerLink":
          cursor.style.display = "none";
          cursorBorder.style.setProperty("--size", "15vmin");
          cursorBorder.style.backgroundColor = "#f2ecdc ";
          cursorBorder.style.backgroundImage = "url(../../assets/VectorFlesh4.svg)";
          cursorBorder.style.backgroundSize = "3vmin 3vmin";

          break;
        case "pointerLinkNavbar":
          cursor.style.display = "none";
          cursorBorder.style.setProperty("--size", "15vmin");
          cursorBorder.style.backgroundColor = "#f8dba0";
          cursorBorder.style.backgroundImage = "url(../../assets/VectorFlesh4.svg)";
          cursorBorder.style.backgroundSize = "3vmin 3vmin";

          break;
        case "pointerWaveBorder":
          cursorBorder.style.display = "none";

          cursor.style.setProperty("--sizeMainCursor", "30vmin");
          cursor.style.background =
            "linear-gradient(120deg, #ffffff, #000000, #ffffff, #000000, #ffffff)";
          cursor.style.backgroundSize = " 1600% 1600%";

          cursor.style.animation = "blobRadius 5s ease infinite, blobBackground 15s ease infinite";
          cursor.style.mixBlendMode = "difference";

          break;
        case "pointerNavbar":
          cursorBorder.style.borderRadius = "0";
          cursorBorder.style.setProperty("--size", "3vmin");
          break;
      }
    });

    item.addEventListener("mouseout", (e) => {
      cursorBorder.style.backgroundImage = "unset";
      cursorBorder.style.backgroundColor = "unset";
      cursor.style.background = "unset";

      cursorBorder.style.mixBlendMode = "unset";

      cursorBorder.style.setProperty("--size", "5vmin");
      cursor.style.setProperty("--sizeMainCursor", "0.8vmin");

      cursor.style.animation = "unset";
      cursorBorder.style.animation = "unset";

      cursor.style.display = "inline";
      cursorBorder.style.display = "inline";
      cursorBorder.style.borderRadius = "50%";

      cursorBorder.style.boxShadow = "0 0 0 0.1vmin black";
      cursor.style.backgroundColor = "black";
      cursor.style.mixBlendMode = "unset";

      cursor.style.width = "var(--sizeMainCursor)";
      cursor.style.borderRadius = "50%";
    });
  });
}
activateCustomCursors();

const scrollContainer2 = document.querySelector("nav .products > div:nth-child(1) ");

scrollContainer2.addEventListener("wheel", (event) => {
  event.preventDefault();

  scrollContainer2.scrollLeft += -event.deltaY;
});
