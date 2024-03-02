gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  contect: "#smooth-content",
  smooth: 1,
  effects: true,
  smoothTouch: false,
});
window.addEventListener("load", (event) => {
  gsap.to(".splashScreen", {
    y: "-100%",
    delay: 1,
    duration: 1,
    ease: "power3.out",
  });
  gsap.from(
    new SplitText(".hero div h1", {
      type: "words",
      tagName: "span",
      tag: "span",
    }).words,
    {
      delay: 1.2,
      opacity: 0.2,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.15,
    }
  );

  gsap.from(".hero img", {
    delay: 1.1,
    x: "40vw",
    duration: 1,
    ease: "back.out(1.7)",
  });

  var timeline = gsap.timeline();
  timeline.to(CSSRulePlugin.getRule(".hero div > div:before"), {
    transform: "scaleX(1)",
    delay: 1.2,
  });

  timeline.to(CSSRulePlugin.getRule(".hero div > div:before"), {
    transform: "scaleX(0)",
  });
});

// .hero img on scroll change scale
gsap.to(".hero img", {
  scrollTrigger: {
    trigger: ".hero img",
    start: "top top",
    end: "bottom top",
    scrub: 2,
    // markers: true,
  },
  y: "20%",
  duration: 1,
  scale: 1.2,
});

if (window.innerWidth > 992) {
  // pin: true .hero div section
  var section3 = document.querySelector(".section3");
  gsap.to(".hero > div", {
    scrollTrigger: {
      trigger: ".hero > div",
      start: "-10% top",
      end: `+=${section3.offsetTop} top`,
      scrub: 2,
      pin: true,
      // markers: true,
      markers: true,
      pinSpacing: false,
    },
    duration: 1,
  });

  // change text color
  gsap.to(".hero > div", {
    scale: "0.8",
    opacity: "0.8",
    x: "10%",
    zIndex: -1,
    color: "#f2ecdc",
    duration: 0.3,

    scrollTrigger: {
      trigger: ".section2",
      start: "top center",
      end: `+=${document.body.offsetHeight} bottom`,
      toggleActions: "play reverse play reverse",
    },
  });
  // add background color
  gsap.to(CSSRulePlugin.getRule(".hero div > div:before"), {
    transform: "scaleX(1)",
    scrollTrigger: {
      trigger: ".section2",
      start: "top center",
      end: `+=${document.body.offsetHeight} bottom`,
      toggleActions: "play reverse play reverse",
    },
  });
}

// --------------------------------------------------
function addSection(products) {
  const otherProductContent = document.querySelector(".otherProductContent");

  products.forEach((product) => {
    const otherProductItem = document.createElement("div");
    otherProductItem.classList.add("otherProductItem");

    const productInfo = document.createElement("div");

    const titleFa = document.createElement("h3");
    titleFa.textContent = product.name.fa;

    const titleEn = document.createElement("span");
    titleEn.classList.add("englishText");
    titleEn.textContent = product.name.en;

    productInfo.appendChild(titleEn);
    productInfo.appendChild(titleFa);

    const image = document.createElement("img");
    image.src = `../assets/productImg/${product.image}`;
    image.alt = `${product.image} Image`;

    const LinkContainer = document.createElement("a");
    LinkContainer.href = product.url;

    LinkContainer.appendChild(productInfo);
    LinkContainer.appendChild(image);
    otherProductItem.appendChild(LinkContainer);

    otherProductContent.appendChild(otherProductItem);
  });
}
function getRandomItems(array, count) {
  return array.sort(() => 0.5 - Math.random()).slice(0, count);
}

fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    const currentUrl = window.location.href;

    const selectedCategories = [];
    for (const category of data.categories) {
      const products = category.products.filter((product) => currentUrl.includes(product.url));
      if (products.length) {
        selectedCategories.push(category);
      }
    }

    for (const category of selectedCategories) {
      const randomProducts = getRandomItems(category.products, 10);
      addSection(randomProducts);
    }
    data.categories.forEach((category) => {
      category.products.forEach((product) => {
        if (currentUrl.includes(product.url)) {
          const MainImg = document.querySelector(".hero img");

          MainImg.src = `../assets/productImg/${product.image}`;
          MainImg.alt = `This is ${product.image} products photo`;
        }
      });
    });
  })
  .catch((error) => console.error("Error fetching data:", error));

// --------------------------------------------------
window.addEventListener("load", async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const COMPONENT_SELECTOR = ".otherProductWrapper";
  const CONTROLS_SELECTOR = ".otherProductControls";
  const CONTENT_SELECTOR = ".otherProductContent";

  const components = document.querySelectorAll(COMPONENT_SELECTOR);

  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    const content = component.querySelector(CONTENT_SELECTOR);
    let x = 0;
    let mx = 0;
    const maxScrollWidth = content.scrollWidth - content.clientWidth / 2 - content.clientWidth / 2;
    const nextButton = component.querySelector(".arrow-next");
    const prevButton = component.querySelector(".arrow-prev");

    if (maxScrollWidth !== 0) {
      component.classList.add("has-arrows");
    }

    const otherProductHeader = document.querySelector(".otherProductHeader");
    if (nextButton) {
      nextButton.addEventListener("click", function (event) {
        otherProductHeader.classList.add("active");
        setTimeout(() => {
          otherProductHeader.classList.remove("active");
        }, 300);
        event.preventDefault();
        x = content.clientWidth / 2 + content.scrollLeft + 0;
        content.scroll({
          left: x,
          behavior: "smooth",
        });
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", function (event) {
        otherProductHeader.classList.add("active");
        setTimeout(() => {
          otherProductHeader.classList.remove("active");
        }, 300);
        event.preventDefault();
        x = content.clientWidth / 2 - content.scrollLeft + 0;
        content.scroll({
          left: -x,
          behavior: "smooth",
        });
      });
    }

    const mousemoveHandler = (e) => {
      const mx2 = e.pageX - content.offsetLeft;
      if (mx) {
        content.classList.add("dragging");
        content.scrollLeft = content.sx + mx - mx2;
      }
    };
    const mousedownHandler = (e) => {
      content.sx = content.scrollLeft;
      mx = e.pageX - content.offsetLeft;
      otherProductHeader.classList.add("active");
    };

    const scrollHandler = () => {
      toggleArrows();
    };
    const toggleArrows = () => {
      if (-content.scrollLeft > maxScrollWidth - 10) {
        prevButton.classList.add("disabled");
      } else if (-content.scrollLeft < 10) {
        nextButton.classList.add("disabled");
      } else {
        nextButton.classList.remove("disabled");
        prevButton.classList.remove("disabled");
      }
    };
    const mouseupHandler = () => {
      mx = 0;
      content.classList.remove("dragging");
      otherProductHeader.classList.remove("active");
    };

    content.addEventListener("mousemove", mousemoveHandler);
    content.addEventListener("mousedown", mousedownHandler);
    if (component.querySelector(CONTROLS_SELECTOR) !== undefined) {
      content.addEventListener("scroll", scrollHandler);
    }
    content.addEventListener("mouseup", mouseupHandler);
    content.addEventListener("mouseleave", mouseupHandler);
  }
  // --------------------------------------------------

  const boxes = document.querySelectorAll(".otherProduct .otherProductItem");

  boxes.forEach((box, index) => {
    box.addEventListener("mouseover", () => {
      boxes.forEach((resetBox) => {
        resetBox.style.backgroundColor = "transparent";
      });

      box.style.backgroundColor = "#e9e5db";
    });
  });
});
