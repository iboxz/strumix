function getScrollPercentage() {
  const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  const bodyHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  const scrollPercentage = (scrollPosition / (bodyHeight - windowHeight)) * 100;
  return scrollPercentage;
}

function updateScrollbar() {
  const scrollbar = document.getElementById("scrollbar");
  const scrollPercentage = getScrollPercentage();
  scrollbar.style.width = scrollPercentage + "%";
}

window.addEventListener("scroll", updateScrollbar);
