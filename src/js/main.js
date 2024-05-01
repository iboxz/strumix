const navigation = document.createElement("nav");
const divLogo = document.createElement("div");
const logoImg = document.createElement("img");
const divProducts = document.createElement("div");
const productsParagraph = document.createElement("p");
const productsSpan = document.createElement("span");
const divArticles = document.createElement("div");
const articlesParagraph = document.createElement("p");
const divContact = document.createElement("div");
const contactParagraph = document.createElement("p");
const divHamburger = document.createElement("div");
const hamburgerSpan1 = document.createElement("span");
const hamburgerSpan2 = document.createElement("span");
const sectionProducts = document.createElement("section");

const baseUrl = window.location.origin;
console.log(baseUrl);
logoImg.src = new URL("/assets/VectorLogo.svg", baseUrl);
logoImg.alt = "Strumix mini logo";
productsParagraph.textContent = "محصولات و خدمات";
productsSpan.classList.add("fleshDown");
productsParagraph.appendChild(productsSpan);
productsParagraph.classList.add("productsButton");
articlesParagraph.textContent = "مقالات";
contactParagraph.textContent = "ارتباط با ما";
divHamburger.classList.add("hamburger");
sectionProducts.classList.add("products");

navigation.appendChild(divLogo);
divLogo.appendChild(logoImg);
navigation.appendChild(divProducts);
divProducts.appendChild(productsParagraph);
navigation.appendChild(divArticles);
divArticles.appendChild(articlesParagraph);
navigation.appendChild(divContact);
divContact.appendChild(contactParagraph);
navigation.appendChild(divHamburger);
divHamburger.appendChild(hamburgerSpan1);
divHamburger.appendChild(hamburgerSpan2);
navigation.appendChild(sectionProducts);

document.body.appendChild(navigation);

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, TextPlugin);

gsap.set("nav .products", { y: "0%" });

var menuTimeline = gsap
  .timeline({ paused: true, reversed: true })
  .from("nav .products", { y: "-100%", duration: 1, ease: "power2.inOut" })
  .to(
    "nav > div:nth-child(3) > p",
    { text: "محصولات و خدمات", scale: "1.3", duration: 0.5, ease: "none" },
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

      const randomSelectedProducts = getRandomItems(selectedProducts, 3);

      document.querySelector("nav .products").innerHTML = "";

      addSectionProducts(randomSelectedProducts);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function addSectionProducts(products) {
  const otherProductContent = document.querySelector("nav .products");

  const outerDiv = document.createElement("div");
  const link = document.createElement("a");
  const innerDiv = document.createElement("div");
  const paragraph = document.createElement("p");

  link.setAttribute("href", baseUrl + "/products.html");
  paragraph.textContent = "همه‌ی محصولات";
  innerDiv.appendChild(paragraph);
  link.appendChild(innerDiv);
  outerDiv.appendChild(link);

  otherProductContent.appendChild(outerDiv);

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
    { text: "لیست همه‌ی محصولات", href: baseUrl + "/products.html" },
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
    nav.style.top = "-10vmax";
  }

  prevScrollpos = currentScrollPos;
}

document.addEventListener("scroll", hideNavbarOnScroll);
