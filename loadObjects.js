import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";

const OBJECTS_DIR = "./objects";
export function loadObjects(renderFn, scene, renderer, camera, renderTarget) {
  // table
  const TABLE_POSITION = {
    X: -250,
    Y: -390,
    Z: 590,
  };
  const TABLE_ROTATION_Y = Math.PI * 0.75;
  new FBXLoader().load(`${OBJECTS_DIR}/table.FBX`, (object) => {
    object.receiveShadow = true;
    object.position.x = TABLE_POSITION.X;
    object.position.y = TABLE_POSITION.Y;
    object.position.z = TABLE_POSITION.Z;
    object.rotation.y = TABLE_ROTATION_Y;
    object.scale.setScalar(2.5);
    castAndReceiveShadows(object);
    scene.add(object);
  });

  // plate
  const PLATE_POSITION = {
    X: -210,
    Y: -200,
    Z: 545,
  };

  let plateMaterial = new THREE.MeshStandardMaterial({
    envMap: renderTarget,
    roughness: 0.1,
    metalness: 0.8,
    color: 0x909090,
  });

  new FBXLoader().load(`${OBJECTS_DIR}/plate.fbx`, (object) => {
    object.position.x = PLATE_POSITION.X;
    object.position.y = PLATE_POSITION.Y;
    object.position.z = PLATE_POSITION.Z;
    scene.add(object);

    object.castShadow = true;
    object.receiveShadow = true;
    castAndReceiveShadows(object);
    applyMaterial(object, plateMaterial);
    addLightning(object);
  });

  new FBXLoader().load(`${OBJECTS_DIR}/plate.fbx`, (object) => {
    object.position.x = PLATE_POSITION.X - 70;
    object.position.y = PLATE_POSITION.Y;
    object.position.z = PLATE_POSITION.Z + 70;
    object.scale.setScalar(0.5);
    scene.add(object);

    object.castShadow = true;
    object.receiveShadow = true;
    castAndReceiveShadows(object);
    applyMaterial(object, plateMaterial);
    addLightning(object);
  });

  new FBXLoader().load(`${OBJECTS_DIR}/qr-code.fbx`, (object) => {
    object.position.x = -222;
    object.position.y = -200;
    object.position.z = 517;
    object.scale.setScalar(0.1);
    scene.add(object);
    castAndReceiveShadows(object);
  });

  new FBXLoader().load(`${OBJECTS_DIR}/plant.fbx`, (object) => {
    object.position.x = PLATE_POSITION.X + 20;
    object.position.y = PLATE_POSITION.Y + 2;
    object.position.z = PLATE_POSITION.Z + 180;
    scene.add(object);
    object.scale.setScalar(0.2);
    castAndReceiveShadows(object);
  });

  // cuttlery
  let cuttleryMaterial = new THREE.MeshPhongMaterial({
    envMap: renderTarget,
    emissive: 0x121212,
  });

  new OBJLoader().load(`${OBJECTS_DIR}/knife.obj`, (object) => {
    object.position.x = PLATE_POSITION.X - 55;
    object.position.y = PLATE_POSITION.Y;
    object.position.z = PLATE_POSITION.Z - 25;
    object.rotation.y = TABLE_ROTATION_Y;
    object.scale.setScalar(3);
    castAndReceiveShadows(object);

    applyMaterial(object, cuttleryMaterial);
    scene.add(object);
  });

  new OBJLoader().load(`${OBJECTS_DIR}/fork.obj`, (object) => {
    object.position.x = PLATE_POSITION.X + 25;
    object.position.y = PLATE_POSITION.Y;
    object.position.z = PLATE_POSITION.Z + 50;
    object.rotation.y = TABLE_ROTATION_Y;
    object.scale.setScalar(3);
    castAndReceiveShadows(object);

    applyMaterial(object, cuttleryMaterial);
    scene.add(object);
  });

  // glass
  let glassMaterial = new THREE.MeshPhongMaterial({
    envMap: renderTarget,
    opacity: 0.6,
    color: 0xeeeeee,
    transparent: true,
  });

  new OBJLoader().load(`${OBJECTS_DIR}/glass.obj`, (object) => {
    object.position.x = PLATE_POSITION.X - 380;
    object.position.y = PLATE_POSITION.Y;
    object.position.z = PLATE_POSITION.Z + 10;
    object.scale.setScalar(3);
    castAndReceiveShadows(object);

    applyMaterial(object, glassMaterial);
    scene.add(object);
  });

  new FBXLoader().load(`${OBJECTS_DIR}/candle.fbx`, (object) => {
    object.position.x = PLATE_POSITION.X - 170;
    object.position.y = PLATE_POSITION.Y;
    object.position.z = PLATE_POSITION.Z - 50;
    object.scale.setScalar(1);
    castAndReceiveShadows(object);
    scene.add(object);
  });

  /**
   * Helper function to apply any material to an object (yes, it's that ugly).
   *
   * @param object - object you want to apply the material onto
   * @param material - the material
   */

  function applyMaterial(object, material) {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
  }

  /**
   * Enables moving an object.
   * @param object - object to move
   */
  function addTransformControl(object) {
    const controls = new TransformControls(camera, renderer.domElement);
    controls.addEventListener("change", renderFn);
    controls.addEventListener("dragging-changed", (_) =>
      console.log(object.position),
    );
    controls.attach(object);
    scene.add(controls);
  }

  /**
   * Enables rotating an object.
   * @param object - object to rotate
   */
  function addRotationControl(object) {
    const controls = new TransformControls(camera, renderer.domElement);
    controls.addEventListener("change", renderFn);
    controls.addEventListener("dragging-changed", (_) =>
      console.log(object.rotation),
    );
    controls.attach(object);
    controls.mode = "rotate";
    scene.add(controls);
  }

  /**
   * Enables scaling an object.
   * @param object - object to scale
   */
  function addScaleControl(object) {
    const controls = new TransformControls(camera, renderer.domElement);
    controls.addEventListener("change", renderFn);
    controls.attach(object);
    controls.mode = "scale";
    scene.add(controls);
  }

  function addLightning(target) {
    const light = new THREE.AmbientLight(0xe0e1e5);
    light.intensity = 0.025;
    scene.add(light);
    const spotLight = new THREE.SpotLight(0xffffff, 200);
    spotLight.position.set(-142, 250, 655);
    spotLight.angle = 0.8;
    spotLight.decay = 1.5;
    spotLight.distance = 800;
    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 500;
    spotLight.target = target;
    scene.add(spotLight);
  }
}

function castAndReceiveShadows(object) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}
