import * as CANNON from "cannon-es";
import * as THREE from "three";
export function loadNapkin(world, scene, x, y, z) {
  const axesHelper = new THREE.AxesHelper(3);
  axesHelper.position.set(x, y - 5, z);
  axesHelper.scale.setScalar(12);
  scene.add(axesHelper);

  const Nx = 10;
  const Ny = 10;
  const mass = 1;
  const clothSize = 60;
  const dist = clothSize / Nx;

  const shape = new CANNON.Particle();

  const particles = [];

  for (let i = 0; i < Nx + 1; i++) {
    particles.push([]);
    for (let j = 0; j < Ny + 1; j++) {
      const particle = new CANNON.Body({
        mass,
        shape,
        position: new CANNON.Vec3(
          x - (i - Nx * 0.5) * dist,
          y,
          z - (j - Ny * 0.5) * dist,
        ),
      });
      particles[i].push(particle);
      world.addBody(particle);
    }
  }

  function connect(i1, j1, i2, j2) {
    world.addConstraint(
      new CANNON.DistanceConstraint(particles[i1][j1], particles[i2][j2], dist),
    );
  }

  for (let i = 0; i < Nx + 1; i++) {
    for (let j = 0; j < Ny + 1; j++) {
      if (i < Nx) connect(i, j, i + 1, j);
      if (j < Ny) connect(i, j, i, j + 1);
    }
  }

  const clothGeometry = new THREE.PlaneGeometry(10, 10, Nx, Ny);
  const clothMat = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    wireframe: false,
    map: new THREE.TextureLoader().load("./objects/cloth-texture.jpg"),
  });

  const clothMesh = new THREE.Mesh(clothGeometry, clothMat);
  clothMesh.receiveShadow = true;
  clothMesh.castShadow = true;
  scene.add(clothMesh);

  return updateParticles;

  function updateParticles() {
    for (let i = 0; i < Nx + 1; i++) {
      for (let j = 0; j < Ny + 1; j++) {
        const index = j * (Nx + 1) + i;
        const positionAttribute = clothGeometry.attributes.position;
        const position = particles[i][Ny - j].position;
        positionAttribute.setXYZ(index, position.x, position.y, position.z);
        positionAttribute.needsUpdate = true;
      }
    }
  }
}
