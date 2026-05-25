import * as THREE from 'three';

// --- tune these ---
const CUBE_COLOR = 0xffa500;   // amber — companion to the Blender hero
const BACKGROUND = 0x0a0a0a;   // near-black
const PARTICLE_COUNT = 500;
const PARTICLE_COLOR = 0xffffff;

// --- scene ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(BACKGROUND);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// --- cube — wireframe, breathing ---
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshBasicMaterial({
    color: CUBE_COLOR,
    wireframe: true,
    transparent: true,
    opacity: 0.85,
  })
);
scene.add(cube);

// --- particle field — quiet, drifting ---
const positions = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < positions.length; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}
const particles = new THREE.Points(
  new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(positions, 3)),
  new THREE.PointsMaterial({
    color: PARTICLE_COLOR,
    size: 0.03,
    transparent: true,
    opacity: 0.5,
  })
);
scene.add(particles);

// --- loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  cube.rotation.x = t * 0.5;
  cube.rotation.y = t * 0.3;

  const breathe = 1 + Math.sin(t * 2) * 0.05;
  cube.scale.set(breathe, breathe, breathe);

  particles.rotation.y = t * 0.05;

  renderer.render(scene, camera);
}

// --- responsive ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
