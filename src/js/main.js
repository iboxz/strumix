const createEl = (tag, attrs = {}, textContent = "") => {
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
  { name: "مواد اولیه افزودنی بتن و شیمی ساختمان", id: "raw-materials" },
];

const navigation = createEl("nav");
const divLogo = createEl("div");
const logoImg = createEl("img", {
  src: new URL("/assets/VectorLogo.svg", baseUrl),
  alt: "Strumix mini logo",
});
const divProducts = createEl("div");
const productsParagraph = createEl("p", { class: "productsButton" }, "محصولات");
const productsSpan = createEl("span", { class: "fleshDown" });
const divArticles = createEl("div");
const articlesParagraph = createEl("p", {}, "مقالات");
const divContact = createEl("div");
const contactParagraph = createEl("p", {}, "ارتباط با ما");
const divHamburger = createEl("div", { class: "hamburger" });
const technicalParagraph = createEl("p", {}, "مدارک فنی");
const divTechnical = createEl("div");
const hamburgerSpan1 = createEl("span");
const hamburgerSpan2 = createEl("span");
const sectionProducts = createEl("section", { class: "products" });
const sectionProductsDiv1 = createEl("div");
const sectionProductsDiv2 = createEl("div");

for (const category of categories) {
  const catagoryList = createEl("p", { "data-cursor": "pointerFocus" }, category.name);
  const linkContainer = createEl("a", {
    href: `${baseUrl}/products.html?productID=${category.id}`,
  });
  linkContainer.appendChild(catagoryList);
  sectionProductsDiv1.appendChild(linkContainer);
}

productsParagraph.appendChild(productsSpan);
navigation.append(
  divLogo,
  divProducts,
  divArticles,
  divTechnical,
  divContact,
  divHamburger,
  sectionProducts
);
divLogo.append(logoImg);
divProducts.append(productsParagraph);
divArticles.append(articlesParagraph);
divContact.append(contactParagraph);
divTechnical.append(technicalParagraph);
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
  .to("nav > div:nth-child(5) > p", { text: "", duration: 0.5, ease: "none" }, 0.5)
  .to(
    "nav > div:nth-child(5)",
    {
      background: "hsla(39, 100%, 70%, 0)",
      duration: 0.5,
      ease: "none",
    },
    0.5
  )
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
document.querySelector("nav > div:nth-child(5)").addEventListener("click", function () {
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
    toggleActiveClass();
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
    { text: "مدارک فنی", href: "#" },
    { text: "ارتباط با ما", href: baseUrl + "/contact.html" },
  ];

  for (var i = 0; i < links.length; i++) {
    var newLink = document.createElement("a");
    newLink.textContent = links[i].text;
    newLink.setAttribute("href", links[i].href);

    if (links[i].text === "مدارک فنی") {
      newLink.onclick = function () {
        generateSection();
      };
    }
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

const scrollContainer2 = document.querySelector("nav .products > div:nth-child(1) ");

scrollContainer2.addEventListener("wheel", (event) => {
  event.preventDefault();

  scrollContainer2.scrollLeft += -event.deltaY;
});

// Create section footer
const section = document.createElement("section");
section.className = "footer";
section.setAttribute("data-cursor", "pointerWhite");

const div1 = document.createElement("div");

const mainpageLink = document.createElement("a");
mainpageLink.href = baseUrl;
mainpageLink.setAttribute("data-cursor", "pointerLink");
mainpageLink.innerHTML = "<span></span>صفحه‌ی اصلی";
div1.appendChild(mainpageLink);

const catalogLink = document.createElement("a");
catalogLink.href = baseUrl + "/products.html";
catalogLink.setAttribute("data-cursor", "pointerLink");
catalogLink.innerHTML = "<span></span>کاتالوگ محصولات";
div1.appendChild(catalogLink);

const articlesLink = document.createElement("a");
articlesLink.href = "#";
articlesLink.setAttribute("data-cursor", "pointerLink");
articlesLink.innerHTML = "<span></span>مقالات";
div1.appendChild(articlesLink);

const technicalLink = document.createElement("a");
technicalLink.setAttribute("data-cursor", "pointerLink");
technicalLink.innerHTML = "<span></span>مدارک فنی";
div1.appendChild(technicalLink);
technicalLink.onclick = function () {
  generateSection();
};


const contactLink = document.createElement("a");
contactLink.href = baseUrl + "/contact.html";
contactLink.setAttribute("data-cursor", "pointerLink");
contactLink.innerHTML = "<span></span>ارتباط با ما";
div1.appendChild(contactLink);

const div2 = document.createElement("div");
const contactDiv = document.createElement("div");
const contactHeader = document.createElement("h6");
contactHeader.textContent = "ارتباط با ما";
contactDiv.appendChild(contactHeader);

const contactInfo1 = document.createElement("div");
contactInfo1.innerHTML = "<p>تلفن ثابت</p><p>021-44403448<br />021-44000408</p>";
contactDiv.appendChild(contactInfo1);

const contactInfo2 = document.createElement("div");
contactInfo2.innerHTML = "<p>تماس ضروری</p><p>0912-2991782<br />0912-2087393</p>";
contactDiv.appendChild(contactInfo2);

const contactInfo3 = document.createElement("div");
contactInfo3.innerHTML = "<p>کد پستی</p><p>1469916541</p>";
contactDiv.appendChild(contactInfo3);

const contactInfo4 = document.createElement("div");
contactInfo4.innerHTML = "<p>ایمیل</p><p>info@strumix.com</p>";
contactDiv.appendChild(contactInfo4);

div2.appendChild(contactDiv);

const socialMediaDiv = document.createElement("div");
const socialMediaHeader = document.createElement("h6");
socialMediaHeader.textContent = "صفحات مجازی";
socialMediaDiv.appendChild(socialMediaHeader);

const instagramLink = document.createElement("a");
instagramLink.setAttribute("data-cursor", "pointerNavbar");
instagramLink.setAttribute("target", "_blank");
instagramLink.href = "https://www.instagram.com/strumix.co/";
instagramLink.textContent = "اینستاگرام";
socialMediaDiv.appendChild(instagramLink);

const technicalSupportLink = document.createElement("a");
technicalSupportLink.setAttribute("data-cursor", "pointerNavbar");
technicalSupportLink.setAttribute("target", "_blank");
technicalSupportLink.href = "https://api.whatsapp.com/send?phone=989122087393";
technicalSupportLink.textContent = "پشتیبانی فنی";
socialMediaDiv.appendChild(technicalSupportLink);

const salesSupportLink = document.createElement("a");
salesSupportLink.setAttribute("data-cursor", "pointerNavbar");
salesSupportLink.setAttribute("target", "_blank");
salesSupportLink.href = "https://api.whatsapp.com/send?phone=989928210625";
salesSupportLink.textContent = "پشتیبانی فروش";
socialMediaDiv.appendChild(salesSupportLink);

div2.appendChild(socialMediaDiv);

const copyrightParagraph = document.createElement("p");
copyrightParagraph.innerHTML =
  'Copyright © 2024 strumix / All rights reserved / Developed by <a target="_blank" data-cursor="pointerNavbar" href="https://firstibox.glitch.me/">FirstIBOX</a> / <a target="_blank" data-cursor="pointerNavbar" href="">Privacy Policy</a>';

section.appendChild(div1);
section.appendChild(div2);
section.appendChild(copyrightParagraph);

document.getElementById("smooth-content").appendChild(section);

activateCustomCursors();

/* ------------------------------------------------- */

const items = {
  کاتالوگ: [
    {
      text: "کاتالوگ جامع محصولات استرامیکس",
      url: "https://strumix.com/wp-content/uploads/2020/11/Strumix-cataloge-2018-for-internet-marketing.pdf",
    },
    {
      text: "بروشور استرامیکس",
      url: "https://strumix.com/wp-content/uploads/2020/11/Brochure-Strumix-2020.pdf",
    },
  ],
  استانداردها: [
    {
      text: "استاندارد فوق روان کننده و روان کننده بتن و استاندارد زودگیر کننده بتن (ضدیخ بتن مسلح فاقد یون کلر)",
      url: "https://strumix.com/wp-content/uploads/2022/09/Standard-Strumix.pdf",
    },
    {
      text: "گواهی نامه استاندارد ISO 9001",
      url: "https://strumix.com/wp-content/uploads/2023/10/ISO-9001.jpg",
    },
    {
      text: "گواهی نامه استاندارد ISO 14001",
      url: "https://strumix.com/wp-content/uploads/2023/10/ISO-14001.jpg",
    },
    {
      text: "گواهی نامه استاندارد ISO 29001",
      url: "https://strumix.com/wp-content/uploads/2023/10/ISO-29001.jpg",
    },
    {
      text: "گواهی نامه استاندارد ISO 45001",
      url: "https://strumix.com/wp-content/uploads/2023/10/ISO-45001.jpg",
    },
  ],
  "گواهی نامه فنی مرکز تحقیقات راه، مسکن و شهرسازی": [
    {
      text: "گواهی نامه فنی مرکز تحقیقات راه، مسکن و شهرسازی برای محصول “Strusin فوق روان کننده (ابر روان کننده) بتن بر پایه پلی کربوکسیلات اتر”",
      url: "https://strumix.com/wp-content/uploads/2023/09/%DA%AF%D9%88%D8%A7%D9%87%DB%8C-%D9%86%D8%A7%D9%85%D9%87-%D9%81%D9%86%DB%8C-%D9%85%D8%B1%DA%A9%D8%B2-%D8%AA%D8%AD%D9%82%DB%8C%D9%82%D8%A7%D8%AA-%D9%85%D8%B3%DA%A9%D9%86-Strusin.jpg",
    },
  ],
  "تائیدیه محصولات": [
    {
      text: "تاییدیه محصول “Struseal C512 افزودنی آب بند کننده کریستالی داخلی بتن با عملکرد خود ترمیمی رشد یابنده” در مرکز تحقیقات راه، مسکن و شهرسازی",
      url: "https://strumix.com/wp-content/uploads/2020/11/%D8%AA%D8%A7%DB%8C%DB%8C%D8%AF%DB%8C%D9%87-%D9%81%D9%86%DB%8C-%D9%85%D8%AD%D8%B5%D9%88%D9%84-Struseal-C512-%D8%AF%D8%B1-%D9%85%D8%B1%DA%A9%D8%B2-%D8%AA%D8%AD%D9%82%DB%8C%D9%82%D8%A7%D8%AA-%D8%B1%D8%A7%D9%87%D8%8C-%D9%85%D8%B3%DA%A9%D9%86-%D9%88-%D8%B4%D9%87%D8%B1%D8%B3%D8%A7%D8%B2%DB%8C.pdf",
    },
    {
      text: "تاییدیه محصول “Supramix Alfa افزودنی کاهنده نفوذپذیری چند منظوره ویژه سوپرامیکس آلفا بتن” در مرکز تحقیقات راه، مسکن و شهرسازی",
      url: "https://strumix.com/wp-content/uploads/2020/11/%D8%AA%D8%A7%DB%8C%DB%8C%D8%AF%DB%8C%D9%87-%D9%81%D9%86%DB%8C-%D9%85%D8%AD%D8%B5%D9%88%D9%84-Supramix-Alfa-%D8%AF%D8%B1-%D9%85%D8%B1%DA%A9%D8%B2-%D8%AA%D8%AD%D9%82%DB%8C%D9%82%D8%A7%D8%AA-%D8%B1%D8%A7%D9%87%D8%8C-%D9%85%D8%B3%DA%A9%D9%86-%D9%88-%D8%B4%D9%87%D8%B1%D8%B3%D8%A7%D8%B2%DB%8C.pdf",
    },
    {
      text: "تاییدیه محصول “Supramix Beta افزودنی کاهنده نفوذپذیری چند منظوره ویژه سوپرامیکس بتا بتن” در مرکز تحقیقات راه، مسکن و شهرسازی",
      url: "https://strumix.com/wp-content/uploads/2020/11/%DA%AF%D8%B2%D8%A7%D8%B1%D8%B4-%D9%81%D9%86%DB%8C-%D8%B4%D8%B1%DA%A9%D8%AA-%D8%A8%D8%B3%D9%BE%D8%A7%D8%B1-%D8%A8%D8%AA%D9%86-%D8%A7%DB%8C%D8%B1%D8%A7%D9%86%DB%8C%D8%A7%D9%86-%D9%87%D9%88%D8%B4%D9%85%D9%86%D8%AF-%DA%AF%D8%B2%D8%A7%D8%B1%D8%B4-2.pdf",
    },
    {
      text: "تاییدیه محصول “Struset Nitro  ضد یخ بتن مسلح فاقد یون کلر (زودگیر کننده بتن)” در انستیتو مصالح ساختمانی دانشگاه تهران",
      url: "https://strumix.com/wp-content/uploads/2021/02/%D8%AA%D8%A7%DB%8C%DB%8C%D8%AF%DB%8C%D9%87-%D8%B9%D9%85%D9%84%DA%A9%D8%B1%D8%AF-%D9%81%D9%86%DB%8C-%D8%A7%D8%B2-%D8%AF%D8%A7%D9%86%D8%B4%DA%AF%D8%A7%D9%87-%D8%AA%D9%87%D8%B1%D8%A7%D9%86-%D8%A8%D8%B1%D8%A7%DB%8C-%D9%85%D8%AD%D8%B5%D9%88%D9%84-%D8%B6%D8%AF-%DB%8C%D8%AE-%D8%A8%D8%AA%D9%86-%D9%85%D8%B3%D9%84%D8%AD-Struset-Nitro.pdf",
    },
    {
      text: "تاییدیه محصول “Strucure SW50  کیورینگ (عمل آورنده) بتن پایه آب)” در انستیتو مصالح ساختمانی دانشگاه تهران",
      url: "https://strumix.com/wp-content/uploads/2023/09/Strucure-SW50-%D8%A7%D9%86%D8%B3%D8%AA%DB%8C%D8%AA%D9%88-%D9%85%D8%B5%D8%A7%D9%84%D8%AD-%D8%B3%D8%A7%D8%AE%D8%AA%D9%85%D8%A7%D9%86%DB%8C-%D8%AF%D8%A7%D9%86%D8%B4%DA%AF%D8%A7%D9%87-%D8%AA%D9%87%D8%B1%D8%A7%D9%86.pdf",
    },
  ],
  "رزومه استرامیکس": [
    {
      text: "برخی از پروژه های ملی و شخصی انجام شده با همکاری استرامیکس",
      url: "https://strumix.com/wp-content/uploads/2020/11/Resume-Strumix.pdf",
    },
    {
      text: "برخی از پروژه های آب بندی حجمی بتن با استفاده از محصولات استرامیکس",
      url: "https://strumix.com/wp-content/uploads/2021/02/resume-Strumix-internal-waterproofing.pdf",
    },
  ],
};

technicalParagraph.onclick = function () {
  generateSection();
};
function generateSection() {
  var section = document.querySelector("body");
  var content = `<div class="downloadDataSheet"><div>`;
  Object.keys(items).forEach((key) => {
    content += `<h3 onclick="replaceText(this)">${key}</h3>`;
  });
  content += `</div></div>`;
  section.insertAdjacentHTML("beforeend", content);

  const removeMainContainer = document.querySelector(".downloadDataSheet");
  removeMainContainer.addEventListener("click", function (event) {
    if (event.target === removeMainContainer) {
      this.remove();
    }
  });
}

function replaceText(element) {
  const mainContainer = document.querySelector(".downloadDataSheet > div:nth-child(1)");
  mainContainer.innerHTML = "";

  items[element.innerText]?.forEach((item) => {
    const aTag = document.createElement("a");
    aTag.innerText = item.text;
    aTag.href = item.url;
    mainContainer.appendChild(aTag);
  });

  const h3Tag = document.createElement("h3");
  const ImgTag = document.createElement("img");
  ImgTag.src = new URL("/assets/VectorFlesh4.svg", baseUrl);
  h3Tag.appendChild(ImgTag);
  h3Tag.appendChild(document.createTextNode(element.innerText));
  h3Tag.onclick = function () {
    const removeMainContainer = document.querySelector(".downloadDataSheet");
    removeMainContainer.remove();
    generateSection();
  };
  mainContainer.appendChild(h3Tag);
}
