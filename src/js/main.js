const nav = document.createElement("nav");
const div1 = document.createElement("div");
const img = document.createElement("img");
const div2 = document.createElement("div");
const p1 = document.createElement("p");
const span1 = document.createElement("span");
const div3 = document.createElement("div");
const p2 = document.createElement("p");
const div4 = document.createElement("div");
const p3 = document.createElement("p");
const div5 = document.createElement("div");
const span2 = document.createElement("span");
const span3 = document.createElement("span");
const section = document.createElement("section");

img.src = "assets/VectorLogo.svg";
img.alt = "";
p1.textContent = "محصولات و خدمات";
p1.appendChild(span1);
p1.classList.add("productsButton");
p2.textContent = "مقالات";
p3.textContent = "ارتباط با ما";
div5.classList.add("hamburger");
section.classList.add("products");

nav.appendChild(div1);
div1.appendChild(img);
nav.appendChild(div2);
div2.appendChild(p1);
nav.appendChild(div3);
div3.appendChild(p2);
nav.appendChild(div4);
div4.appendChild(p3);
nav.appendChild(div5);
div5.appendChild(span2);
div5.appendChild(span3);
nav.appendChild(section);

document.body.appendChild(nav);

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, TextPlugin);

gsap.set("nav .products", { y: "0%" });

var menu = gsap
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
  if (buttonEnabled) {
    buttonEnabled = false;
    fetchDataForProducts();
    toggleMenu();
    toggleActiveClass();
    document.body.style.overflow = "hidden";
  } else {
    buttonEnabled = true;
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
  menu.reversed() ? menu.timeScale(1).play() : menu.timeScale(2).reverse();
}
let buttonEnabled = true;

document.querySelector("nav > div:nth-child(2)").addEventListener("click", function () {
  if (buttonEnabled) {
    buttonEnabled = false;
    fetchDataForProducts();
    toggleMenu();
    document.body.style.overflow = "hidden";
  }
});

document.querySelector("nav > div:nth-child(3)").addEventListener("click", function () {
  if (!buttonEnabled) {
    toggleMenu();
    buttonEnabled = true;
    document.body.style.overflow = "visible";
  }
});

document.body.addEventListener("click", function (event) {
  if (!buttonEnabled && !event.target.closest("nav")) {
    buttonEnabled = true;
    toggleMenu();
    document.body.style.overflow = "visible";
  }
});

function fetchDataForProducts() {
  fetch("products/products.json")
    .then((response) => response.json())
    .then((data) => {
      const selectedProducts = [];

      data.categories.forEach((category) => {
        const randomProducts = getRandomItems(category.products, 1);
        selectedProducts.push(...randomProducts);
      });

      const randomSelectedProducts = getRandomItems(selectedProducts, 3);

      document.querySelector("nav .products").innerHTML = "";

      addSection(randomSelectedProducts);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function addSection(products) {
  const otherProductContent = document.querySelector("nav .products");

  const outerDiv = document.createElement("div");
  const link = document.createElement("a");
  const innerDiv = document.createElement("div");
  const paragraph = document.createElement("p");

  link.setAttribute("href", "./products.html");
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

    // var hostname = window.location.hostname;

    const LinkContainer = document.createElement("a");
    LinkContainer.href = `./products/${product.url}`;

    LinkContainer.appendChild(image);
    LinkContainer.appendChild(productInfo);
    otherProductItem.appendChild(LinkContainer);

    otherProductContent.appendChild(otherProductItem);
  });

  var links = [
    { text: "لیست همه‌ی محصولات", href: "wqdwqd" },
    { text: "مقالات", href: "dqwdwq" },
    { text: "ارتباط با ما", href: "dqwqwdqdw" },
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
