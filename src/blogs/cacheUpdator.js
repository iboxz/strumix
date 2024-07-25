var randomVersion = Math.floor(Math.random() * 100000);

var filesToUpdate = [
  "../src/blogs/index.css",
  "../src/blogs/home.css",
  "../src/css/main.css",
  "../src/blogs/index.js",
];

filesToUpdate.forEach(function (file) {
  var elements;

  if (file.endsWith(".js")) {
    elements = document.querySelectorAll('script[src="' + file + '"]');
  } else if (file.endsWith(".css")) {
    elements = document.querySelectorAll('link[href="' + file + '"]');
  }

  elements.forEach(function (element) {
    var newSrc = file + "?v=" + randomVersion;
    if (element.tagName === "SCRIPT") {
      element.src = newSrc;
    } else if (element.tagName === "LINK") {
      element.href = newSrc;
    }
  });
});
