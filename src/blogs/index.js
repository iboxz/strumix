gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, TextPlugin);

if (!("ontouchstart" in window)) {
  Smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 0.8,
    effects: true,
    smoothTouch: false,
  });
}
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
        document.querySelector(".section2 header").style.borderBottomWidth =
          "0.1vmin";
      },
      onLeaveBack: () => {
        document.querySelector(".section2 header").style.borderBottomWidth =
          "0";
      },
    },
  });
  const path = document.querySelector(".splashScreen svg path");
  var pathData =
    "M3 252.473C7 236.473 36.2346 186.5 41 179C44.3333 142 80.9 58.4725 198.5 16.4725C222.333 6.30583 282.5 -7.9275 332.5 16.4725C319.167 31.3059 293 71 283.5 83.9727C274 96.9453 245 132.473 183 132.473C150.667 129.982 72.6582 138.3 39.4582 181.5C39.4582 181.5 91.5 54.5 265.5 33";

  path.setAttribute("d", pathData);
  var length = path.getTotalLength();
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

  gsap.to(path, { strokeDashoffset: 0, duration: 2, ease: "ease-in-out" });

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
    .to(".splashScreen", {
      y: "-100%",
      delay: 0.5,
      duration: 1,
      ease: "power3.in",
    });

  splashScreenTimeline.play();

  /*----------------------------------- */

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
    cursorBorder.style.borderRadius = "0";
    cursorBorder.style.setProperty("--size", "2vmin");
    setTimeout(function () {
      requestAnimationFrame(function () {
        cursorBorder.style.borderRadius = "50%";
        cursorBorder.style.setProperty("--size", "5vmin");
      });
    }, 150);
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
            cursorBorder.style.backgroundImage =
              "url(../../assets/VectorFlesh4.svg)";
            cursorBorder.style.backgroundSize = "3vmin 3vmin";

            break;
          case "pointerLinkNavbar":
            cursor.style.display = "none";
            cursorBorder.style.setProperty("--size", "15vmin");
            cursorBorder.style.backgroundColor = "#ffffff30";
            cursorBorder.style.backdropFilter = "blur(0.8vmin)";
            cursorBorder.style.backgroundImage =
              "url(../../assets/VectorFlesh4.svg)";
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
          case "pointerClickable":
            cursorBorder.style.borderRadius = "0";
            cursorBorder.style.setProperty("--size", "3vmin");
            break;
        }
      });

      item.addEventListener("mouseout", (e) => {
        cursorBorder.style.backgroundImage = "unset";
        cursorBorder.style.backgroundColor = "unset";
        cursor.style.background = "unset";

        cursorBorder.style.backdropFilter = "none";
        cursorBorder.style.mixBlendMode = "unset";

        cursorBorder.style.setProperty("--size", "5vmin");
        cursor.style.setProperty("--sizeMainCursor", "0");

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
  /*--------------*/

  let loops = gsap.utils
      .toArray(".section5 .infiniteScrollText div")
      .map((line, i) => {
        const links = line.querySelectorAll(
          ".section5  .infiniteScrollText div span"
        );
        return horizontalLoop(links, {
          repeat: -1,
          speed: 1 + i * 0.5,
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
        onReverseComplete: () =>
          tl.totalTime(tl.rawTime() + tl.duration() * 100),
      }),
      length = items.length,
      startX = items[0].offsetLeft,
      times = [],
      widths = [],
      xPercents = [],
      curIndex = 0,
      pixelsPerSecond = (config.speed || 1) * 100,
      snap =
        config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1),
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
  /*---------------------- */
  const cardsContainer = document.querySelector(".cardsContainer");
  const showRandomButton = document.querySelector(
    ".section5 > div:last-child a:first-child"
  );

  let blogs = [];

  fetch("../serverAssets/blogs.json")
    .then((response) => response.json())
    .then((data) => {
      blogs = data.blogs;

      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      const shuffledBlogs = shuffle(blogs);
      const selectedBlogs = shuffledBlogs.slice(0, 3);

      selectedBlogs.forEach((blog) => {
        const div = document.createElement("div");
        div.innerHTML = `
                  <a href="${blog.url}" data-cursor="pointerLinkNavbar">
                      <div>
                          <p>${blog.category}</p>
                          <p>${blog.date}</p>
                      </div>
                      <img src="../serverAssets/blogsCoverImg/${blog.image}" alt="" />
                      <h6>${blog.title}</h6>
                      <p>${blog.description}</p>
                  </a>
              `;
        cardsContainer.appendChild(div);
      });

      activateCustomCursors();
    })
    .catch((error) => console.error("Error fetching data:", error));

  showRandomButton.addEventListener("click", showRandomArticle);

  function showRandomArticle() {
    if (blogs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * blogs.length);
    const randomBlog = blogs[randomIndex];
    window.location.href = randomBlog.url;
  }

  /* */

  var mWrap = document.querySelectorAll(".mouseSticky");

  function parallaxIt(e, wrap, movement = 0.8) {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var boundingRect = wrap.getBoundingClientRect();
    var halfDiff = Math.abs(boundingRect.width - boundingRect.height) / 2;
    var relX = e.pageX - boundingRect.left - halfDiff;
    var relY = e.pageY - boundingRect.top;

    gsap.to(wrap, {
      x: (relX - boundingRect.width / 6) * movement,
      y: (relY - boundingRect.height / 2 - scrollTop) * movement,
      ease: "power1",
      duration: 0.6,
    });
  }

  mWrap.forEach(function (wrap) {
    wrap.addEventListener("mousemove", function (e) {
      parallaxIt(e, wrap);
    });

    wrap.addEventListener("mouseleave", function (e) {
      gsap.to(wrap, {
        scale: 1,
        x: 0,
        y: 0,
        ease: "power3",
        duration: 0.6,
      });
    });
  });
  /* */
  const changeThemeButton = document.querySelector(".changeTheme");
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  changeThemeButton.addEventListener("click", () => {
    const currentTheme = localStorage.getItem("theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  });

  function setTheme(themeName) {
    const root = document.documentElement;
    const changeThemeButton = document.querySelector(".changeTheme img");

    if (themeName === "light") {
      root.style.setProperty("--background-color", "#f2ecdc");
      root.style.setProperty("--black", "black");
      root.style.setProperty("--black-70percent", "#1d1d1d");
      root.style.setProperty("--black-hover", "#00000020");
      root.style.setProperty("--white", "white");
      root.style.setProperty("--white-90percent", "#f2f2f2");
      root.style.setProperty("--white-70percent", "#d9d9d9");
      root.style.setProperty("--white-10percent", "#ffffff1a");
      root.style.setProperty("--section5-background-first", "#ffab2e");
      root.style.setProperty("--section5-background-second", "#ff9a03");
      root.style.setProperty("--section5-card-first", "#ffcb6d");
      root.style.setProperty("--section5-card-second", "#363029de");
      root.style.setProperty("--invert-icon-color", "none");
      root.style.setProperty("--invert-icon-color2", "none");
      root.style.setProperty(
        "--invert-icon-color3",
        "invert(99%) sepia(0%) saturate(0%) hue-rotate(141deg) brightness(109%) contrast(101%)"
      );
      changeThemeButton.src = "../assets/VectorNight.svg";
    } else if (themeName === "dark") {
      root.style.setProperty("--background-color", "#0f0f0f");
      root.style.setProperty("--black", "#e7e7e7");
      root.style.setProperty("--black-70percent", "#dbdbdb");
      root.style.setProperty("--black-hover", "#ffffff20");
      root.style.setProperty("--white", "black");
      root.style.setProperty("--white-90percent", "#2e2e2e");
      root.style.setProperty("--white-70percent", "#141414");
      root.style.setProperty("--white-10percent", "#ffffff1a");
      root.style.setProperty("--section5-background-first", "#161512");
      root.style.setProperty("--section5-background-second", "#241f14");
      root.style.setProperty("--section5-card-first", "#696969");
      root.style.setProperty("--section5-card-second", "#ff1f1fde");
      root.style.setProperty(
        "--invert-icon-color",
        "invert(48%) brightness(1000%)"
      );
      root.style.setProperty(
        "--invert-icon-color2",
        "invert(99%) sepia(0%) saturate(0%) hue-rotate(338deg) brightness(113%) contrast(100%)"
      );
      root.style.setProperty("--invert-icon-color3", "none");

      changeThemeButton.src = "../assets/VectorDay.svg";
    }

    localStorage.setItem("theme", themeName);
  }
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
    document
      .querySelector(selector)
      .addEventListener("click", function (event) {
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

  addClickListener(".settings > div:last-child a:nth-child(3)");
  addClickListener(".settings > div:last-child a:nth-child(4)");
  addClickListener(".settings > div:last-child a:nth-child(5)");

  var hoverContainer = document.querySelector(".settings > div:nth-child(3)");
  var hoverElement = document.querySelector(".settings > div:nth-child(4)");
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
    if (
      !hoverContainer.contains(event.target) &&
      !hoverElement.contains(event.target)
    ) {
      hoverElement.style.marginLeft = "-100%";
    }
  });
});

/* - */
const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const registerButton = document.querySelector(".section4 > p:nth-child(6)");
function validateEmailInput(emailInputMain) {
  const emailInput = emailInputMain.value;
  const feedbackElement = document.querySelector("#emailFeedback");

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
let processOnlyOnce = false;
function processEmailInput() {
  if (processOnlyOnce === true) return;
  const emailInputMain = document.querySelector("#email");
  const emailInput = emailInputMain.value;

  registerButton.style.right = "65%";
  registerButton.style.top = "50%";
  if (emailRegex.test(emailInput)) {
    var formData = new FormData();
    formData.append("email", emailInput);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../src/php/processEmail.php", true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          registerButton.style.backgroundColor = "#5dba82";
          registerButton.textContent = "ثبت شد!";
          processOnlyOnce = true;
        } else {
          registerButton.style.backgroundColor = "#c44141";
          registerButton.textContent = "ثبت نشد، دوباره تلاش کنید!";

          console.error("Error adding document: ", xhr.status);
        }
      }
    };
    xhr.send(formData);
  } else {
    registerButton.style.backgroundColor = "#c44141";
    registerButton.textContent = "ایمیل را اصلاح کنید!";
  }
}
/* */
