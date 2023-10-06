import * as THREE from "three";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

export function initScene() {
  const mql = setupResponsiveBody();
  const [width, height] = getCanvasDimensions(mql);
  const container = document.getElementById("container");
  const renderer = addRenderer(container);
  const camera = addCamera();
  const { renderTarget, scene } = addEnvironmentMap();
  const controls = addControls(camera, renderer);
  onWindowResize([width, height]);

  return [scene, camera, renderer, renderTarget, controls];

  function setupResponsiveBody() {
    let mql = window.matchMedia("(max-width: 1300px)");
    mql.addEventListener(
      "change",
      () => (document.body.className = mql.matches ? "md" : ""),
    );
    window.addEventListener("resize", () =>
      onWindowResize(getCanvasDimensions(mql)),
    );
    document.body.className = mql.matches ? "md" : "";
    return mql;
  }

  function onWindowResize([width, height]) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
}

function getCanvasDimensions(mql) {
  return mql.matches
    ? [document.body.clientWidth, document.body.clientHeight * 0.7]
    : [document.body.clientWidth * 0.7, document.body.clientHeight];
}

function addControls(camera, renderer) {
  const controls = new FirstPersonControls(camera, renderer.domElement);
  controls.movementSpeed = 0;
  controls.lookSpeed = 0.15;
  controls.enabled = false;
  return controls;
}

function addEnvironmentMap() {
  const piazzaImages = [
    "px.jpg",
    "nx.jpg",
    "py.jpg",
    "ny.jpg",
    "pz.jpg",
    "nz.jpg",
  ];

  const renderTarget = new THREE.CubeTextureLoader()
    .setPath("./piazza/")
    .load(piazzaImages);

  const scene = new THREE.Scene();
  scene.background = renderTarget;
  return { renderTarget, scene };
}
function addCamera() {
  const camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
  camera.position.set(20, 0, 300);
  camera.rotateY(Math.PI * 0.75);
  camera.rotateX(Math.PI * -0.15);
  return camera;
}

function addRenderer(container) {
  const renderer = new THREE.WebGLRenderer();
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileCubemapShader();
  renderer.toneMappingExposure = 100;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.enabled = true;

  THREE.DefaultLoadingManager.onLoad = function () {
    pmremGenerator.dispose();
  };

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth * 0.8, window.innerHeight);
  container.appendChild(renderer.domElement);
  return renderer;
}
