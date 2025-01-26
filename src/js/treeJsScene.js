// Device VRAM calculation, changing the 3D Scene to video if the rendering power is low

import { Application } from "@splinetool/runtime";

function checkVRAMAndWebGLSupport() {
  var gl = document.createElement("canvas").getContext("webgl");
  var maxVRAM = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  console.log(maxVRAM);
  const mainSec = document.querySelector("#sceneHolder");
  const canvas3D = document.createElement("canvas");
  canvas3D.setAttribute("class", "header3D");
  canvas3D.setAttribute("id", "canvas3d");
  mainSec.appendChild(canvas3D);

  const canvas = document.getElementById("canvas3d");
  const app = new Application(canvas);

  let counter = 0;
  function loadingCounter() {}
  loadingCounter();

  app
    .load("https://prod.spline.design/icAwEm0R-BIUTVS3/scene.splinecode")
    .then(() => {
      counter = 100;
      document.body.style.overflow = "auto";
    })
    .catch((error) => {
      console.error("Error loading the 3D scene:", error);
    });
}

checkVRAMAndWebGLSupport();
