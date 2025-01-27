import { Application } from "@splinetool/runtime";

const checkGraphicsCapability = () => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return false;

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const isShaderPrecisionValid = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const meetsRequirements = maxTextureSize >= 4096 && isShaderPrecisionValid && navigator.hardwareConcurrency >= 4 && !isMobile;

    return meetsRequirements;
  } catch (error) {
    return false;
  }
};

const createFallbackVideo = () => {
  const video = document.createElement("video");
  video.src = window.innerWidth < 1100 ? "../../assets/3DsceneVidMobile.mp4" : "../../assets/3DsceneVidDesktop.mp4";
  video.setAttribute("width", "100%");
  video.setAttribute("height", "100%");

  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  return video;
};

const configureCanvas = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const mainSec = document.querySelector("#sceneHolder");
if (checkGraphicsCapability()) {
  const canvas3D = document.createElement("canvas");
  configureCanvas(canvas3D);
  canvas3D.className = "header3D";
  canvas3D.id = "canvas3d";
  mainSec.appendChild(canvas3D);

  const app = new Application(canvas3D);
  app
    .load("https://prod.spline.design/icAwEm0R-BIUTVS3/scene.splinecode")
    .then(() => {
      document.body.style.overflow = "auto";
    })
    .catch((error) => {
      console.error("Error loading 3D scene:", error);
      mainSec.removeChild(canvas3D);
      mainSec.appendChild(createFallbackVideo());
    });
} else {
  mainSec.appendChild(createFallbackVideo());
}
