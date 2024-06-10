gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, TextPlugin);

Smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 0.8,
  effects: true,
  smoothTouch: false,
});

window.addEventListener("load", (event) => {
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

            cursor.style.animation =
              "blobRadius 5s ease infinite, blobBackground 15s ease infinite";
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

  /*--------------*/

  let loops = gsap.utils.toArray(".section5 .infiniteScrollText div").map((line, i) => {
      const links = line.querySelectorAll(".section5  .infiniteScrollText div span");
      return horizontalLoop(links, {
        repeat: -1,
        speed: 1 + i * 0.5,
        reversed: false,
        paddingRight: parseFloat(gsap.getProperty(links[0], "marginRight", "px")),
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
          (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 + gsap.getProperty(el, "xPercent")
        );
        return xPercents[i];
      },
    });

    gsap.set(items, { x: 0 });
    totalWidth =
      items[length - 1].offsetLeft +
      (xPercents[length - 1] / 100) * widths[length - 1] -
      startX +
      items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") +
      (parseFloat(config.paddingRight) || 0);

    for (i = 0; i < length; i++) {
      item = items[i];
      curX = (xPercents[i] / 100) * widths[i];
      distanceToStart = item.offsetLeft + curX - startX;
      distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
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
          { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
          {
            xPercent: xPercents[i],
            duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
            immediateRender: false,
          },
          distanceToLoop / pixelsPerSecond
        )
        .add("label" + i, distanceToStart / pixelsPerSecond);
      times[i] = distanceToStart / pixelsPerSecond;
    }

    function toIndex(index, vars) {
      vars = vars || {};
      Math.abs(index - curIndex) > length / 2 && (index += index > curIndex ? -length : length);
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
  /*---------------------- */
  function runAfterResize() {
    var tl = gsap.timeline();
    tl.to(".section5", {
      yPercent: -100,
    });
  }

  runAfterResize();

  window.addEventListener("resize", function () {
    runAfterResize();
  });

  gsap.to(".section5", {
    scrollTrigger: {
      trigger: ".section5",
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
      pin: true,
      markers: true,
      pinSpacing: false,
    },
  });
  /* function runAnimation() {
  gsap.killTweensOf(".section5");

  
}

runAnimation();
window.addEventListener("resize", runAnimation);
 */
});

function validateEmailInput(emailInputMain) {
  const emailInput = emailInputMain.value;
  const feedbackElement = document.querySelector("#emailFeedback");
  const registerButton = document.querySelector(".section4 > p:nth-child(6)");

  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  registerButton.style.right = "65%";
  registerButton.style.top = "50%";
  if (emailRegex.test(emailInput)) {
    emailInputMain.style.color = "#70cd5d";
    feedbackElement.textContent = "";
  } else {
    emailInputMain.style.color = "#c6383d";
    feedbackElement.textContent = "“فرمت ایمیل درست نیست!”";
    feedbackElement.classList.remove("animate");
    void feedbackElement.offsetWidth;
    feedbackElement.classList.add("animate");
  }
}
