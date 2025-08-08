import { Application } from "@splinetool/runtime";
const getGPUTier = () => {
  const gl = document.createElement("canvas").getContext("webgl");
  if (!gl) return 0;

  const info = gl.getExtension("WEBGL_debug_renderer_info");
  if (!info) return 0;

  const renderer = gl.getParameter(info.UNMASKED_RENDERER_WEBGL).toLowerCase();
  if (renderer.includes("rtx") || renderer.includes("rx 6") || renderer.includes("apple m2 pro")) return 3;
  if (renderer.includes("gtx 16") || renderer.includes("rx 5") || renderer.includes("m1") || renderer.includes("iris xe")) return 2;
  if (renderer.includes("intel") || renderer.includes("uhd") || renderer.includes("mali") || renderer.includes("adreno")) return 1;
  return 0;
};



const checkGraphicsCapability = () => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return false;

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const isShaderPrecisionValid = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const tier = getGPUTier();

    const meetsRequirements =
      maxTextureSize >= 16384 &&
      isShaderPrecisionValid &&
      navigator.hardwareConcurrency >= 8 &&
      screen.width >= 1280 &&
      screen.height >= 720 &&
      tier >= 2 &&
      !isMobile;

    console.log(maxTextureSize, navigator.hardwareConcurrency);
    return meetsRequirements;
  } catch (error) {
    return false;
  }
};

const createFallbackVideo = () => {
  const video = document.createElement("video");
  video.src = window.innerWidth < 1100
    ? "../../assets/3DsceneVidMobile.mp4"
    : "../../assets/3DsceneVidDesktop.mp4";
  Object.assign(video, {
    autoplay: true,
    muted: true,
    loop: true,
    playbackRate: 1.5,
    width: "100%",
    height: "100%"
  });
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
