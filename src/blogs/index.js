gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, TextPlugin);

Smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 0.8,
  effects: true,
  smoothTouch: false,
});
gsap.to(".hero h1", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
  top: "40%",
});
const section2 = document.querySelector(".section2");

gsap.to(".section2", {
  scrollTrigger: {
    trigger: ".section2",
    start: "top top",
    end: "bottom top",
    pin: ".section2 header",
    pinSpacing: false,
    onEnter: () => {
      document.querySelector(".section2 header").style.borderBottomWidth = "0.1vmin";
    },
    onLeaveBack: () => {
      document.querySelector(".section2 header").style.borderBottomWidth = "0";
    },
    markers: true,
  },
});
// const baseUrl = window.location.origin;
// window.addEventListener("load", (event) => {
//   const path = document.querySelector(".splashScreen svg path");
//   var pathData =
//     "M3 252.473C7 236.473 36.2346 186.5 41 179C44.3333 142 80.9 58.4725 198.5 16.4725C222.333 6.30583 282.5 -7.9275 332.5 16.4725C319.167 31.3059 293 71 283.5 83.9727C274 96.9453 245 132.473 183 132.473C150.667 129.982 72.6582 138.3 39.4582 181.5C39.4582 181.5 91.5 54.5 265.5 33";

//   path.setAttribute("d", pathData);
//   var length = path.getTotalLength();
//   gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

//   gsap.to(path, { strokeDashoffset: 0, duration: 3, ease: "ease-in-out" });

//   var splashScreenTimeline = gsap
//     .timeline({ paused: true, reversed: true })
//     .from(
//       new SplitText(".splashScreen p:nth-child(1)", {
//         type: "chars",
//         tagName: "span",
//         tag: "span",
//       }).chars,
//       {
//         opacity: 0.2,
//         ease: "power3.out",
//         stagger: 0.3,
//       }
//     )
//     .to(".splashScreen", { y: "-100%", delay: 1, duration: 1, ease: "power3.out" });

//   splashScreenTimeline.play();
// });

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
