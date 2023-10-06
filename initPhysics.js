import * as CANNON from "cannon-es";
import * as THREE from "three";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";

export function initPhysics() {
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0),
  });

  // set a collision box on top of the table for other physical objects to collide on
  const planeWidth = 440;
  const planeHeight = 280;

  // THREE object
  const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  const planeMesh = new THREE.Mesh(
    planeGeometry,
    new THREE.MeshBasicMaterial(),
  );
  planeMesh.receiveShadow = true;
  planeMesh.rotateX(-Math.PI * 0.5);
  planeMesh.rotateZ(-Math.PI * 0.25);
  planeMesh.position.x = -244;
  planeMesh.position.y = -203;
  planeMesh.position.z = 582;

  // add to scene for debug purposes only
  // scene.add(planeMesh);

  // CANNON object with same position and rotation as the THREE object
  const planeBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(planeWidth / 2, planeHeight / 2, 5)),
    position: new CANNON.Vec3(
      planeMesh.position.x,
      planeMesh.position.y,
      planeMesh.position.z,
    ),
  });

  planeBody.quaternion.setFromEuler(
    planeMesh.rotation.x,
    planeMesh.rotation.y,
    planeMesh.rotation.z,
  );
  world.addBody(planeBody);
  return world;
}
