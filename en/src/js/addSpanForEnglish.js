function wrapEnglishText(element) {
  var englishRegex = /[a-zA-Z]+/g;

  element.childNodes.forEach(function (node) {
    if (node.nodeType === 3) {
      var matches = node.nodeValue.match(englishRegex);
      if (matches) {
        var parent = node.parentNode;
        var newNode = document.createElement("span");
        newNode.className = "englishText";
        matches.forEach(function (match) {
          var index = node.nodeValue.indexOf(match);
          newNode.appendChild(
            document.createTextNode(node.nodeValue.substring(0, index))
          );
          newNode.appendChild(document.createTextNode(match));
          node.nodeValue = node.nodeValue.substring(index + match.length);
        });
        if (node.nodeValue !== "") {
          newNode.appendChild(document.createTextNode(node.nodeValue));
        }
        parent.insertBefore(newNode, node);
        parent.removeChild(node);
      }
    } else if (node.nodeType === 1) {
      wrapEnglishText(node);
    }
  });
}

var mainElement = document.querySelector("main");
wrapEnglishText(mainElement);
