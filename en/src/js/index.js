gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

let Smoother = null;

Smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 0.8,
  effects: true,
  smoothTouch: false,
});

if (!("ontouchstart" in window)) {
  window.addEventListener("resize", () => {
    if (window.innerWidth !== window.__pw) {
      location.reload();
    }
  });
  window.__pw = window.innerWidth;
}

async function initializeTriggers() {
  if (window.innerWidth >= 769) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    let sections = gsap.utils.toArray(
      ".section2, .section3, .section4, .noPinSection"
    );

    sections.forEach((section, i) => {
      let trigger = null;
      if (i < 3) {
        trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          pin: true,
          pinSpacing: false,
          onUpdate: (self) => {
            if (self.direction === -1) {
              section.style.borderRadius = "";
            } else {
              section.style.borderRadius = "0";
            }
          },
        });
      } else if (i === 3) {
        trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          endTrigger: sections[i - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
          onUpdate: (self) => {
            if (self.direction === -1) {
              section.style.borderRadius = "";
            } else {
              section.style.borderRadius = "0";
            }
          },
        });
      }
    });
  }
}
initializeTriggers();

document.addEventListener("mousemove", function (e) {
  var { innerWidth: pageWidth, innerHeight: pageHeight } = window;

  var mouseXPercent = (e.clientX / pageWidth) * 100;
  var mouseYPercent = (e.clientY / pageHeight) * 100;

  document.getElementById(
    "movingBox"
  ).style.transform = `rotate(-35deg) translate(${
    (-50 + mouseXPercent) / 6
  }%, ${(-50 + mouseYPercent) * 2}%)`;
});

gsap.to("#movingBox", {
  scrollTrigger: {
    trigger: "#movingBox",
    start: "bottom top",
    end: "bottom top",
    toggleActions: "play none none reset",
  },
  display: "none",
});

gsap.to(".hero .scrollFlesh", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    toggleActions: "play none none reverse",
  },
  opacity: 0,
  duration: 0.5,
});

if (window.innerWidth > 768) {
  section2Triggers = [];
  gsap.to(".section2 img", {
    scrollTrigger: {
      trigger: ".section2 img",
      start: "top 90%",
      end: "bottom 90%",
      scrub: 2,
    },
    width: "100%",
    margin: "2vw 0",
    duration: 1,
  });
  gsap.to(".section2", {
    scrollTrigger: {
      trigger: ".section2 img",
      start: "bottom 70%",
      end: "bottom 50%",
      scrub: 2,
    },
    filter: "blur(5px)",
  });
  gsap.to(".section2 .Circles", {
    scrollTrigger: {
      trigger: ".section2 .Circles",
      start: "top 100%",
      end: "bottom 10%",
      scrub: 2,
    },
    transform: "rotate3d(0, 1, 0, 180deg)",
  });
  gsap.to(".cyclingCircles", {
    scrollTrigger: {
      trigger: ".section2",
      start: "100vh top",
      end: "100vh top",
      toggleActions: "play none none reset",
    },
    display: "none",
  });
}

gsap.from(".section3 div:nth-child(1) img", {
  scrollTrigger: {
    trigger: ".section3",
    start: "top center",
    end: "top top",
    scrub: 4,
  },
  scale: "1.1"
});
gsap.to(".section3 .textSide hr", {
  scrollTrigger: {
    trigger: ".section3",
    start: "60% bottom",
    end: "60% top",
    scrub: 4,
  },
  width: "100%",
});
if (!navigator.userAgent.match(/iPhone/i)) {
  gsap.from(
    new SplitText(".section3 .textSide h2", {
      type: "chars",
      tagName: "span",
      tag: "span",
    }).chars,
    {
      scrollTrigger: {
        trigger: ".section3 .textSide h2",
        start: "40% bottom",
        end: "40% top",
        toggleActions: "play none none reset",
      },
      delay: 0.5,
      opacity: 0.2,
      ease: "power3.out",
      stagger: 0.15,
    }
  );
}
if (!navigator.userAgent.match(/iPhone/i)) {
  gsap.from(
    new SplitText(".section4 h3", {
      type: "chars",
      tagName: "span",
      tag: "span",
    }).chars,
    {
      scrollTrigger: {
        trigger: ".section4 h3",
        start: "40% bottom",
        end: "40% top",
        toggleActions: "play none none reset",
      },
      delay: 0.5,
      opacity: 0.3,
      ease: "power3.out",
      stagger: 0.15,
    }
  );
}
gsap.to(".section4 h3 > #line", {
  scrollTrigger: {
    trigger: ".section4 h3",
    start: "40% bottom",
    end: "40% top",
    scrub: 4,
  },
  width: "15vmin",
});

const productImg = document.getElementById("productImg");
const windowWidth = window.innerWidth;
const imgWidth = productImg.offsetWidth;
const centerX = windowWidth / 2 - imgWidth / 3;

gsap.set(productImg, {
  xPercent: -50,
  yPercent: -50,
  transformOrigin: "center",
  left: centerX + "px",
});

const followMouse = (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const distanceFromCenter = mouseX - centerX;

  gsap.to(productImg, {
    duration: 1,
    ease: "power3",
    x: distanceFromCenter * 0.3,
  });
  gsap.to(productImg, {
    duration: 1,
    ease: "power3",
    y: mouseY,
  });

  const clipPath = `polygon(
${(mouseX / window.innerWidth) * 10}% 0%,
${100 - (mouseY / window.innerHeight) * 10}% 0%,
${100 - (mouseX / window.innerWidth) * 10}% 100%,
${(mouseY / window.innerHeight) * 10}% 100%)`;

  gsap.to(productImg, {
    duration: 1,
    ease: "power3",
    clipPath: clipPath,
  });
};
document.addEventListener("mousemove", followMouse);

const products = {
  concreteAdditive: "struproof-hp.jpg",
  constructionChemicals: "strutop-rm450.jpg",
  waterstop: "struswell.jpg",
  "plastic-spacers": "plastic-spacers.jpg",
  executiveAndConsulting: "strusin-concrete2.jpg",
  "raw-materials": "Strumin-gel4.jpg",
};

const section4 = document.querySelector(".section4");
const boxes = section4.querySelectorAll(
  "div:not(:first-child):not(:last-child)"
);

boxes.forEach((box) => {
  box.addEventListener("mouseover", function () {
    productImg.style.opacity = "1";
    productImg.style.filter = "blur(0)";
    productImg.innerHTML = `<img src="assets/productImg/${
      products[box.id]
    }" alt="" />`;
  });

  box.addEventListener("mouseout", function () {
    productImg.style.opacity = "0";
    productImg.style.filter = "blur(5vmin)";
  });

  box.addEventListener("click", function () {
    const productID = this.id;
    const url = `products/?productID=${productID}`;
    window.location.href = url;
  });
});


gsap.to(".section5 > div", {
  scrollTrigger: {
    trigger: ".section5",
    start: "top center",
    end: "bottom center",
    scrub: 2,
  },
  y: "100%",
});
let loops = gsap.utils
    .toArray(".section5 .infiniteScrollText div")
    .map((line, i) => {
      const links = line.querySelectorAll(
        ".section5  .infiniteScrollText div span"
      );
      return horizontalLoop(links, {
        repeat: -1,
        speed: 1.5 + i * 0.5,
        reversed: false,
        paddingRight: parseFloat(
          gsap.getProperty(links[0], "marginRight", "px")
        ),
      });
    }),
  currentScroll = 0,
  scrollDirection = 1;

window.addEventListener("scroll", () => {
  let direction = window.pageYOffset > currentScroll ? 1 : -1;
  if (direction !== scrollDirection) {
    loops.forEach((tl) => {
      gsap.to(tl, { timeScale: direction, overwrite: true });
    });
    scrollDirection = direction;
  }
  currentScroll = window.pageYOffset;
});

function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1),
    totalWidth,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i;

  gsap.set(items, {
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
          gsap.getProperty(el, "xPercent")
      );
      return xPercents[i];
    },
  });

  gsap.set(items, { x: 0 });
  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);

  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }

  function toIndex(index, vars) {
    vars = vars || {};
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length);
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }

  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;

  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  return tl;
}
gsap.from(CSSRulePlugin.getRule(".section7::before"), {
  scrollTrigger: {
    trigger: ".section7",
    start: "top center",
    end: "top top",
    scrub: 4,
  },
  backgroundSize: "200% auto",
});

