import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import vertexShader from "../static/shaders/vertex.glsl";
import fragmentShader from "../static/shaders/fragment.glsl";
import GUI from "lil-gui";

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const gui = new GUI();
var controls = {
  showHeatMap: true,
};

let originalMaterials = {};

const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/Car/scene.gltf", (gltf) => {
  let model = gltf.scene;
  scene.add(model);

  // store the original material
  model.traverse((child) => {
    if (child.isMesh) {
      originalMaterials[child.uuid] = child.material.clone();
    }
  });

  // intially show the heat map
  let material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });
  model.traverse((child) => {
    if (child.isMesh) {
      child.material = material;
    }
  });

  gui
    .add(controls, "showHeatMap")
    .name("Show HeatMap")
    .onChange((showHeatMap) => {
      if (showHeatMap) {
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = material;
          }
        });
      } else {
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = originalMaterials[child.uuid];
          }
        });
      }
    });
});

const directionalLight = new THREE.DirectionalLight(0xffffff, 50);
directionalLight.position.set(-5, 5, 0);
scene.add(directionalLight);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 0, 4);
scene.add(camera);

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.target.set(0, 0.75, 0);
orbitControls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
  orbitControls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
