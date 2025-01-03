const baseUrl = window.location.origin;

let cursor;
let cursorBorder;
cursor = document.createElement("div");
cursorBorder = document.createElement("div");

cursor.classList.add("cursor");
cursorBorder.classList.add("cursorBorder");

document.body.appendChild(cursor);
document.body.appendChild(cursorBorder);

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
  cursorBorder.style.boxShadow = "0 0 0 0.1vmin black";
  cursorBorder.style.borderRadius = "0";
  cursorBorder.style.setProperty("--size", "2vmin");
  setTimeout(function () {
    requestAnimationFrame(function () {
      cursorBorder.style.boxShadow = "unset";
      cursorBorder.style.borderRadius = "50%";
      cursorBorder.style.setProperty("--size", "0vmin");
    });
  }, 200);
});
if ("ontouchstart" in window) {
  cursorBorder.style.display = "none";
  cursor.style.display = "none";
}
function activateCustomCursors() {
  if ("ontouchstart" in window) return;
  document.querySelectorAll("[data-cursor]").forEach((item) => {
    item.addEventListener("mouseover", (e) => {
      switch (item.dataset.cursor) {
        case "pointerWhite":
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
          cursorBorder.style.boxShadow = "0 0 0 0.1vmin black";

          break;
        case "pointerFocus":
          cursor.style.backgroundColor = "black";
          cursorBorder.style.borderRadius = "0";
          cursorBorder.style.setProperty("--size", "4vmin");
          cursorBorder.style.backgroundColor = "white";
          cursorBorder.style.mixBlendMode = "difference";
          cursorBorder.style.boxShadow = "0 0 0 0.1vmin black";

          break;
        case "pointerLink":
          cursor.style.display = "none";
          cursorBorder.style.setProperty("--size", "15vmin");
          cursorBorder.style.backgroundColor = "#f2ecdc ";
          cursorBorder.style.backgroundImage = "url(../../assets/VectorFlesh4.svg)";
          cursorBorder.style.backgroundSize = "3vmin 3vmin";
          cursorBorder.style.boxShadow = "0 0 0 0.1vmin black";

          break;
        case "pointerLinkNavbar":
          cursor.style.display = "none";
          cursorBorder.style.setProperty("--size", "15vmin");
          cursorBorder.style.backgroundColor = "#ffffff90";
          cursorBorder.style.backdropFilter = "blur(0.5vmin)";
          cursorBorder.style.backgroundImage = "url(../../assets/VectorFlesh4.svg)";
          cursorBorder.style.backgroundSize = "3vmin 3vmin";
          cursorBorder.style.boxShadow = "0 0 0 0.1vmin black";
          cursorBorder.style.filter = "invert(99%) sepia(0%) saturate(0%) hue-rotate(141deg) brightness(109%) contrast(101%)";

          break;
        case "pointerWaveBorder":
          cursorBorder.style.display = "none";

          cursor.style.setProperty("--sizeMainCursor", "30vmin");
          cursor.style.background = "linear-gradient(120deg, #ffffff, #000000, #ffffff, #000000, #ffffff)";
          cursor.style.backgroundSize = " 1600% 1600%";

          cursor.style.animation = "blobRadius 5s ease infinite, blobBackground 15s ease infinite";
          cursor.style.mixBlendMode = "difference";
          cursorBorder.style.boxShadow = "0 0 0 0.1vmin black";

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

      cursorBorder.style.setProperty("--size", "0vmin");
      cursor.style.setProperty("--sizeMainCursor", "0");

      cursor.style.animation = "unset";

      cursorBorder.style.animation = "unset";

      cursor.style.display = "inline";
      cursorBorder.style.display = "inline";
      cursorBorder.style.borderRadius = "50%";

      cursorBorder.style.boxShadow = "unset";
      cursor.style.backgroundColor = "black";
      cursor.style.mixBlendMode = "unset";

      cursorBorder.style.filter = "unset";
      cursorBorder.style.backdropFilter = "unset";
      cursorBorder.style.backgroundColor = "transparent";

      cursor.style.width = "var(--sizeMainCursor)";
      cursor.style.borderRadius = "50%";
    });
  });
}
window.addEventListener("load", (event) => {
  /* popup */
  let popup = "";

  function showPopup() {
    popup = document.createElement("div");
    popup.className = "langPopup";
    popup.innerHTML = `
          <p>Do you want to change the website language?</p>
          <button id="noBtn">No</button>
          <button id="yesBtn">Yes</button>
      `;
    document.body.appendChild(popup);

    document.getElementById("noBtn").addEventListener("click", () => {
      localStorage.setItem("langPopupShown", "true");
      popup.remove();
    });

    document.getElementById("yesBtn").addEventListener("click", () => {
      languageSelector.classList.add("visible");
      toggleLanguageMenu();
      menulanguageEnabled = true;
      popup.remove();
    });
  }

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const popupShown = localStorage.getItem("langPopupShown");

  if (userTimeZone !== "Asia/Tehran" && !popupShown) {
    showPopup();
  }

  /* */

  languageSelector = document.createElement("section");
  languageSelector.className = "languageSelector";

  const persianDiv = document.createElement("div");
  const persianFa = document.createElement("p");
  persianFa.textContent = "فارسی/";
  const persianEn = document.createElement("p");
  persianEn.textContent = "PERSIAN";
  persianDiv.appendChild(persianFa);
  persianDiv.appendChild(persianEn);

  const englishDiv = document.createElement("div");
  const englishFa = document.createElement("p");
  englishFa.textContent = "انگلیسی/";
  const englishEn = document.createElement("p");
  englishEn.textContent = "ENGLISH";
  englishDiv.appendChild(englishFa);
  englishDiv.appendChild(englishEn);

  languageSelector.appendChild(persianDiv);
  languageSelector.appendChild(englishDiv);

  const selectLangEn = document.createElement("p");
  selectLangEn.textContent = "Select website language";
  const selectLangFa = document.createElement("p");
  selectLangFa.textContent = "زبان وبسایت را انتخاب کنید";

  languageSelector.appendChild(selectLangEn);
  languageSelector.appendChild(selectLangFa);

  document.body.appendChild(languageSelector);

  /*------ */

  const createEl = (tag, attrs = {}, textContent = "") => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    el.textContent = textContent;
    return el;
  };

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
    src: new URL("/assets/VectorLogotype.svg", baseUrl),
    alt: "Strumix Logotype",
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

  const divLanguage = createEl("div");
  const languageParagraph = createEl("p", {}, "زبان وبسایت");
  const languageSpan = createEl("span", { class: "vectorLanguage" });

  languageParagraph.appendChild(languageSpan);
  divLanguage.appendChild(languageParagraph);

  const hamburgerSpan1 = createEl("span");
  const hamburgerSpan2 = createEl("span");
  const sectionProducts = createEl("section", { class: "products" });
  const sectionProductsDiv1 = createEl("div");
  const sectionProductsDiv2 = createEl("div");

  for (const category of categories) {
    const catagoryList = createEl("p", { "data-cursor": "pointerFocus" }, category.name);
    const linkContainer = createEl("a", {
      href: `${baseUrl}/products/?productID=${category.id}`,
    });
    linkContainer.appendChild(catagoryList);
    sectionProductsDiv1.appendChild(linkContainer);
  }

  productsParagraph.appendChild(productsSpan);
  navigation.append(divLogo, divProducts, divArticles, divTechnical, divContact, divLanguage, divHamburger, sectionProducts);
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

  var menuTimeline = gsap.timeline({ paused: true, reversed: true });

  var navDivs = "nav > div:nth-child";
  var duration = 0.5;
  var easeType = "none";

  menuTimeline
    .from("nav .products", { y: "-100%", duration: duration, ease: "sine.out" })
    .to(`${navDivs}(2)`, { opacity: 0, duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(2) > p`, { text: "", duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(3)`, { opacity: 0, duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(3) > p`, { text: "", duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(4)`, { border: "0.1vmin black solid", duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(4) > p`, { text: "محصولات", scale: "1.3", duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(5)`, { opacity: 0, duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(5) > p`, { text: "", duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(6)`, { opacity: 0, duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(6) > p`, { text: "", duration: duration, ease: easeType }, 0.5);

  var menuLanguageTimeline = gsap.timeline({ paused: true, reversed: true });

  menuLanguageTimeline
    .from("nav .products", { y: "-100%", duration: duration, ease: "sine.out" })
    .to(`${navDivs}(2)`, { opacity: 0, duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(2) > p`, { text: "", duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(3)`, { opacity: 0, duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(3) > p`, { text: "", duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(4)`, { border: "0.1vmin black solid", duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(4) > p`, { text: "زبان وبسایت", scale: "1.3", duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(5)`, { opacity: 0, duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(5) > p`, { text: "", duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(6)`, { opacity: 0, duration: duration, ease: easeType }, 0.5)
    .to(`${navDivs}(6) > p`, { text: "", duration: duration, ease: easeType }, 0.5);

  document.querySelector(".hamburger").addEventListener("click", function () {
    if (!menuEnabled) {
      menuEnabled = true;
      fetchDataForProducts();
      toggleMenu();
      toggleActiveClass();
      document.body.style.overflow = "hidden";
    } else {
      menuEnabled = false;
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
  function toggleLanguageMenu() {
    menuLanguageTimeline.reversed() ? menuLanguageTimeline.timeScale(1).play() : menuLanguageTimeline.timeScale(2).reverse();
  }
  let menuEnabled = false;
  let menulanguageEnabled = false;

  document.querySelector("nav > div:nth-child(1)").addEventListener("click", function () {
    window.open(baseUrl, "_self");
  });

  document.querySelector("nav > div:nth-child(2)").addEventListener("click", function () {
    if (menulanguageEnabled) {
    } else if (!menuEnabled) {
      menuEnabled = true;
      fetchDataForProducts();
      toggleMenu();
      document.body.style.overflow = "hidden";
      languageSelector.classList.remove("visible");
    }
  });
  document.querySelector("nav > div:nth-child(3)").addEventListener("click", function () {
    window.open(baseUrl + "/blogs", "_self");
  });
  document.querySelector("nav > div:nth-child(4)").addEventListener("click", function () {
    if (menuEnabled) {
      toggleMenu();
      menuEnabled = false;
      document.body.style.overflow = "visible";
    } else if (menulanguageEnabled) {
      menulanguageEnabled = false;
      toggleLanguageMenu();
      languageSelector.classList.remove("visible");
    } else {
      generateSection();
    }
  });
  document.querySelector("nav > div:nth-child(5)").addEventListener("click", function () {
    window.open(baseUrl + "/contact", "_self");
  });
  document.querySelector("nav > div:nth-child(6)").addEventListener("click", function () {
    if (menuEnabled) {
    } else if (!menulanguageEnabled) {
      toggleLanguageMenu();
      languageSelector.classList.add("visible");
      menulanguageEnabled = true;
    }
  });
  document.body.addEventListener("click", function (event) {
    if (menuEnabled && !event.target.closest("nav")) {
      menuEnabled = false;
      toggleMenu();
      toggleActiveClass();
      document.body.style.overflow = "visible";
    } else if (
      menulanguageEnabled &&
      !event.target.closest("nav") &&
      !event.target.closest(".langPopup") &&
      !event.target.closest(".languageSelector")
    ) {
      menulanguageEnabled = false;
      toggleLanguageMenu();
      languageSelector.classList.remove("visible");
    }
  });

  document.querySelector(".languageSelector > div:nth-child(1)").addEventListener("click", function () {
    menulanguageEnabled = false;
    toggleLanguageMenu();
    languageSelector.classList.remove("visible");
  });
  document.querySelector(".languageSelector > div:nth-child(2)").addEventListener("click", function () {
    let currentUrl = window.location.href;
    let domainEndIndex = currentUrl.indexOf("/", currentUrl.indexOf("//") + 2);
    let path = currentUrl.slice(domainEndIndex);
    let newPath = "";
    if (path.includes("/products/")) {
      newPath = "/products/";
    } else {
      newPath = path;
    }
    let newUrl = currentUrl.slice(0, domainEndIndex) + "/en" + newPath;
    window.location.href = newUrl;
  });

  function fetchDataForProducts() {
    fetch(new URL("/serverAssets/products.json", baseUrl))
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
      { text: "مقالات", href: baseUrl + "/blogs" },
      { text: "مدارک فنی", href: "#" },
      { text: "ارتباط با ما", href: baseUrl + "/contact" },
      { text: "Language | تغییر زبان", href: "#" },
    ];

    for (var i = 0; i < links.length; i++) {
      var newLink = document.createElement("a");
      newLink.textContent = links[i].text;
      newLink.setAttribute("href", links[i].href);

      var newDiv = document.createElement("div");
      newDiv.appendChild(newLink);

      if (links[i].text === "مدارک فنی") {
        newLink.onclick = function () {
          generateSection();
        };
      }
      if (links[i].text === "Language | تغییر زبان") {
        newLink.onclick = function () {
          toggleLanguageMenu();
          languageSelector.classList.add("visible");
          menulanguageEnabled = true;
          menuEnabled = false;
          toggleMenu();
          toggleActiveClass();
          document.body.style.overflow = "visible";
        };
      }
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

  const path = document.querySelector(".splashScreen svg path");
  var pathData =
    "M3 252.473C7 236.473 36.2346 186.5 41 179C44.3333 142 80.9 58.4725 198.5 16.4725C222.333 6.30583 282.5 -7.9275 332.5 16.4725C319.167 31.3059 293 71 283.5 83.9727C274 96.9453 245 132.473 183 132.473C150.667 129.982 72.6582 138.3 39.4582 181.5C39.4582 181.5 91.5 54.5 265.5 33";

  path.setAttribute("d", pathData);
  var length = path.getTotalLength();
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

  gsap.to(path, { strokeDashoffset: 0, duration: 1.5, ease: "ease-in-out" });

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
        stagger: 0.2,
      }
    )
    .to(".splashScreen", {
      y: "-100%",
      delay: 0.2,
      duration: 0.6,
      ease: "power2.in",
    });

  splashScreenTimeline.play();

  /*----------------------------------- */
  const scrollContainer2 = document.querySelector("nav .products > div:nth-child(1) ");

  scrollContainer2.addEventListener("wheel", (event) => {
    event.preventDefault();

    scrollContainer2.scrollLeft += -event.deltaY;
  });

  const section = document.createElement("section");
  section.className = "footer";
  section.setAttribute("data-cursor", "pointerWhite");

  const div1 = document.createElement("div");

  const mainpageLink = document.createElement("a");
  mainpageLink.href = baseUrl;
  mainpageLink.setAttribute("data-cursor", "pointerLinkNavbar");
  mainpageLink.innerHTML = "<span></span>صفحه‌ی اصلی";
  div1.appendChild(mainpageLink);

  const catalogLink = document.createElement("a");
  catalogLink.href = baseUrl + "/products";
  catalogLink.setAttribute("data-cursor", "pointerLinkNavbar");
  catalogLink.innerHTML = "<span></span> محصولات";
  div1.appendChild(catalogLink);

  const articlesLink = document.createElement("a");
  articlesLink.href = baseUrl + "/blogs";
  articlesLink.setAttribute("data-cursor", "pointerLinkNavbar");
  articlesLink.innerHTML = "<span></span>مقالات";
  div1.appendChild(articlesLink);

  const technicalLink = document.createElement("a");
  technicalLink.setAttribute("data-cursor", "pointerLinkNavbar");
  technicalLink.innerHTML = "<span></span>مدارک فنی";
  div1.appendChild(technicalLink);
  technicalLink.onclick = function () {
    generateSection();
  };

  const contactLink = document.createElement("a");
  contactLink.href = baseUrl + "/contact";
  contactLink.setAttribute("data-cursor", "pointerLinkNavbar");
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

  const logo = document.createElement("img");
  logo.src = "../assets/faviconPackage/LogoWhite.svg";
  logo.alt = "لوگوی سفید رنگ استرامیکس";
  socialMediaDiv.appendChild(logo);

  div2.appendChild(socialMediaDiv);

  const copyrightParagraph = document.createElement("p");
  copyrightParagraph.innerHTML =
    'Copyright © 2024 strumix / All rights reserved / Developed by <a target="_blank" data-cursor="pointerNavbar" href="https://firstibox.glitch.me/">FirstIBOX</a> / <a target="_blank" data-cursor="pointerNavbar" href="https://strumix.com/privacyPolicy">Privacy Policy</a>';

  section.appendChild(div1);
  section.appendChild(div2);
  section.appendChild(copyrightParagraph);

  document.getElementById("smooth-content").appendChild(section);

  document.body.insertAdjacentHTML(
    "afterend",
    `
    <section class="settingsCSS">
      <div data-cursor="pointerFocus" class="copyButton">
        <p>کپی لینک صفحه!</p>
        <img src="../assets/VectorShare.svg" alt="Vector copy" />
      </div>
      <div data-cursor="pointerFocus">
        <img src="../assets/VectorPhone.svg" alt="Vector phone" />
      </div>
      <div>
        <a
          target="_blank"
          href="https://api.whatsapp.com/send?phone=989122087393"
          ><p>پشتیبانی فنی</p></a
        >
        <a
          target="_blank"
          href="https://api.whatsapp.com/send?phone=989928210625"
          ><p>پشتیبانی فروش</p></a
        >
        <a href="tel:02144403448">
          <p>تلفن تماس</p>
          <p>021-44403448</p>
        </a>
        <a href="tel:021-44000408">
          <p>تلفن تماس 2</p>
          <p>021-44000408</p>
        </a>
        <a href="mailto:info@strumix.com">
          <p>ایمیل</p>
          <p>info@strumix.com</p>
        </a>
      </div>
    </section>    `
  );
  document.querySelector(".copyButton").addEventListener("click", () => {
    const shareText = document.querySelector(".copyButton p");
    const originalText = shareText.textContent;
    const url = window.location.href;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          shareText.textContent = "کپی شد.";
          setTimeout(() => (shareText.textContent = originalText), 3000);
        })
        .catch((err) => console.error("Failed to copy: ", err));
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        shareText.textContent = "کپی شد.";
        setTimeout(() => (shareText.textContent = originalText), 3000);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
      document.body.removeChild(textarea);
    }
  });

  function isMobileDevice() {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }
  function addClickListener(selector) {
    document.querySelector(selector).addEventListener("click", function (event) {
      event.preventDefault();
      const copyText = document.querySelector(`${selector} p`);
      const originalText = copyText.textContent;

      const phoneNumber = this.getAttribute("href");
      if (isMobileDevice()) {
        window.location.href = phoneNumber;
      } else {
        const numberToCopy = phoneNumber.replace("tel:", "");
        navigator.clipboard.writeText(numberToCopy).then(function () {
          copyText.textContent = "کپی شد.";
          setTimeout(() => {
            copyText.textContent = originalText;
          }, 3000);
        });
      }
    });
  }

  addClickListener(".settingsCSS > div:last-child a:nth-child(3)");
  addClickListener(".settingsCSS > div:last-child a:nth-child(4)");
  addClickListener(".settingsCSS > div:last-child a:nth-child(5)");

  var hoverContainer = document.querySelector(".settingsCSS > div:nth-child(2)");
  var hoverElement = document.querySelector(".settingsCSS > div:nth-child(3)");
  var hideTimeout;

  const showElement = () => {
    clearTimeout(hideTimeout);
    hoverElement.style.marginLeft = "0";
  };

  const hideElement = () => {
    hideTimeout = setTimeout(() => {
      hoverElement.style.marginLeft = "-100%";
    }, 1500);
  };

  hoverContainer.addEventListener("mouseover", showElement);
  hoverElement.addEventListener("mouseover", showElement);
  hoverContainer.addEventListener("mouseout", hideElement);
  hoverElement.addEventListener("mouseout", hideElement);
  document.addEventListener("click", (event) => {
    if (!hoverContainer.contains(event.target) && !hoverElement.contains(event.target)) {
      hoverElement.style.marginLeft = "-100%";
    }
  });

  activateCustomCursors();

  /* ------------------------------------------------- */
});

let items = {};

const url = new URL("/serverAssets/technicalDoc.json", baseUrl);

url.searchParams.set("t", new Date().getTime());

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    items = data;
  })
  .catch((error) => console.error("Error fetching data:", error));

function generateSection() {
  var section = document.querySelector("body");
  var content = `<div class="downloadDataSheet"><div>`;
  Object.keys(items).forEach((key) => {
    content += `<h3 onclick="replaceText(this)">${key}</h3>`;
  });
  content += `</div></div>`;
  section.insertAdjacentHTML("beforeend", content);

  document.body.style.overflow = "hidden";

  const removeMainContainer = document.querySelector(".downloadDataSheet");
  removeMainContainer.addEventListener("click", function (event) {
    if (event.target === removeMainContainer) {
      this.remove();
      document.body.style.overflow = "visible";
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
    aTag.target = "_blank";
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
