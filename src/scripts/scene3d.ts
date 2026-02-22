import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

const CONFIG = {
  ZOOM: { MOBILE: 50, TABLET: 20, DESKTOP: 20 },
  BREAKPOINTS: { MOBILE: 768, TABLET: 1024 },
  CAMERA: { POSITION: { x: -11.77, y: 7, z: 18.75 }, NEAR: -10, FAR: 40 },
  MODEL: { SCALE_FACTOR: 5, BASE_DIMENSION: 8, Y_OFFSET: 5 },
  ANIMATION: {
    HOVER_SCALE: 1.05,
    HOVER_DURATION: 0.6,
    HOVER_EASE: 'elastic.out(1, 0.55)',
    LEAVE_DURATION: 0.6,
    LEAVE_EASE: 'elastic.out(1, 0.55)',
    CLICK_SCALE: 0.9,
    CLICK_DURATION: 0.15,
    CLICK_EASE: 'power2.out',
    RELEASE_DURATION: 0.5,
    RELEASE_EASE: 'elastic.out(1, 0.55)',
    ENTRY_DURATION: 1.2,
    ENTRY_EASE: 'elastic.out(1, 0.5)',
    LEVITATION_SPEED: 2,
    LEVITATION_AMPLITUDE: 0.1,
    ROTATION_SPEED: 1.5,
    ROTATION_AMPLITUDE: 0.05,
    SHAKE_INTENSITY: 0.06,
    SHAKE_DURATION: 0.04
  }
};

function getZoomForWidth(width: number): number {
  if (width < CONFIG.BREAKPOINTS.MOBILE) return CONFIG.ZOOM.MOBILE;
  if (width < CONFIG.BREAKPOINTS.TABLET) return CONFIG.ZOOM.TABLET;
  return CONFIG.ZOOM.DESKTOP;
}

function calculateModelScale(model: THREE.Object3D): number {
  const box = new THREE.Box3().setFromObject(model);
  const maxDim = Math.max(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z);
  return (CONFIG.MODEL.BASE_DIMENSION / maxDim) * CONFIG.MODEL.SCALE_FACTOR;
}

function centerModel(model: THREE.Object3D): void {
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
}

function enableShadows(model: THREE.Object3D): void {
  model.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
}

function updatePointerPosition(event: MouseEvent, renderer: THREE.WebGLRenderer, sizes: { width: number; height: number }, pointer: THREE.Vector2): void {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / sizes.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / sizes.height) * 2 + 1;
}

function checkHover(model: THREE.Object3D, raycaster: THREE.Raycaster, camera: THREE.Camera, pointer: THREE.Vector2): boolean {
  raycaster.setFromCamera(pointer, camera);
  return raycaster.intersectObjects(model.children, true).length > 0;
}

function applyHoverEffect(model: THREE.Object3D, originalScale: number, isEntering: boolean): void {
  const targetScale = isEntering ? originalScale * CONFIG.ANIMATION.HOVER_SCALE : originalScale;
  const duration = isEntering ? CONFIG.ANIMATION.HOVER_DURATION : CONFIG.ANIMATION.LEAVE_DURATION;
  const ease = isEntering ? CONFIG.ANIMATION.HOVER_EASE : CONFIG.ANIMATION.LEAVE_EASE;
  gsap.to(model.scale, { x: targetScale, y: targetScale, z: targetScale, duration, ease });
}

function applyClickEffect(model: THREE.Object3D, originalScale: number): gsap.core.Tween {
  gsap.to(model.scale, {
    x: originalScale * CONFIG.ANIMATION.CLICK_SCALE,
    y: originalScale * CONFIG.ANIMATION.CLICK_SCALE,
    z: originalScale * CONFIG.ANIMATION.CLICK_SCALE,
    duration: CONFIG.ANIMATION.CLICK_DURATION,
    ease: CONFIG.ANIMATION.CLICK_EASE
  });
  return gsap.to(model.position, {
    x: `+=${CONFIG.ANIMATION.SHAKE_INTENSITY}`,
    y: `+=${CONFIG.ANIMATION.SHAKE_INTENSITY}`,
    z: `+=${CONFIG.ANIMATION.SHAKE_INTENSITY}`,
    yoyo: true, repeat: -1, duration: CONFIG.ANIMATION.SHAKE_DURATION, ease: 'steps(10)'
  });
}

function applyReleaseEffect(model: THREE.Object3D, originalScale: number): void {
  gsap.to(model.scale, {
    x: originalScale, y: originalScale, z: originalScale,
    duration: CONFIG.ANIMATION.RELEASE_DURATION,
    ease: CONFIG.ANIMATION.RELEASE_EASE
  });
  gsap.to(model.position, { x: 0, y: 0, z: 0 });
}

function updateLevitation(model: THREE.Object3D, elapsedTime: number, isPressed: boolean): void {
  if (!isPressed) {
    model.position.y = CONFIG.MODEL.Y_OFFSET + Math.sin(elapsedTime * CONFIG.ANIMATION.LEVITATION_SPEED) * CONFIG.ANIMATION.LEVITATION_AMPLITUDE;
    model.rotation.y = Math.sin(elapsedTime * CONFIG.ANIMATION.ROTATION_SPEED) * CONFIG.ANIMATION.ROTATION_AMPLITUDE;
  }
}

export function initScene3D(): void {
  console.log('initScene3D called');
  const container = document.getElementById('canvas-container');
  if (!container) {
    console.error('Container not found');
    return;
  }

  const sizes = { width: container.clientWidth, height: container.clientHeight };
  const scene = new THREE.Scene();

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.8));

  const mainDir = new THREE.DirectionalLight(0xffffff, 1.5);
  mainDir.position.set(5, 10, 7);
  scene.add(mainDir);

  const secondaryDir = new THREE.DirectionalLight(0xffffff, 1);
  secondaryDir.position.set(-5, -5, -5);
  scene.add(secondaryDir);

  const primaryPoint = new THREE.PointLight(0x6366f1, 1, 100);
  primaryPoint.position.set(-5, 5, 5);
  scene.add(primaryPoint);

  const secondaryPoint = new THREE.PointLight(0xf472b6, 1, 100);
  secondaryPoint.position.set(5, -5, 5);
  scene.add(secondaryPoint);

  const rightDir = new THREE.DirectionalLight(0xffffff, 1.2);
  rightDir.position.set(10, 0, 5);
  scene.add(rightDir);

  const aspectRatio = sizes.width / sizes.height;
  const zoom = getZoomForWidth(sizes.width);

  const camera = new THREE.OrthographicCamera(
    -aspectRatio * zoom + 0.6, aspectRatio * zoom - 1, zoom, -zoom + 0.6,
    CONFIG.CAMERA.NEAR, CONFIG.CAMERA.FAR
  );
  camera.position.set(CONFIG.CAMERA.POSITION.x, CONFIG.CAMERA.POSITION.y, CONFIG.CAMERA.POSITION.z);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({
    canvas: container.appendChild(document.createElement('canvas')),
    powerPreference: 'high-performance',
    alpha: true
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableRotate = false;
  controls.enableDamping = false;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let model: THREE.Object3D | null = null;
  let originalScale = 1;
  let isPressed = false;
  let isHovered = false;
  let shakeAnimation: gsap.core.Tween | null = null;

  const loader = new GLTFLoader();
  loader.load('/B.glb', (gltf) => {
    model = gltf.scene;
    centerModel(model);
    enableShadows(model);

    originalScale = calculateModelScale(model);
    model.scale.setScalar(0);

    gsap.to(model.scale, {
      x: originalScale, y: originalScale, z: originalScale,
      duration: CONFIG.ANIMATION.ENTRY_DURATION,
      ease: CONFIG.ANIMATION.ENTRY_EASE
    });

    scene.add(gltf.scene);
  });

  const onInteractionMove = (event: MouseEvent) => {
    if (!model) return;
    updatePointerPosition(event, renderer, sizes, pointer);
    const isHovering = checkHover(model, raycaster, camera, pointer);

    if (isHovering && !isHovered) {
      isHovered = true;
      document.body.style.cursor = 'pointer';
      applyHoverEffect(model, originalScale, true);
    } else if (!isHovering && isHovered) {
      isHovered = false;
      document.body.style.cursor = 'default';
      applyHoverEffect(model, originalScale, false);
    }
  };

  const onMouseDown = (event: MouseEvent) => {
    if (!model) return;
    updatePointerPosition(event, renderer, sizes, pointer);
    const isHovering = checkHover(model, raycaster, camera, pointer);
    if (isHovering) {
      isPressed = true;
      shakeAnimation = applyClickEffect(model, originalScale);
    }
  };

  const onMouseUp = () => {
    if (!model || !isPressed) return;
    isPressed = false;
    if (shakeAnimation) { shakeAnimation.kill(); shakeAnimation = null; }
    applyReleaseEffect(model, originalScale);
  };

  container.addEventListener('mousemove', onInteractionMove);
  container.addEventListener('mousedown', onMouseDown);
  container.addEventListener('mouseup', onMouseUp);
  container.addEventListener('mouseleave', () => {
    if (isHovered && model) {
      isHovered = false;
      document.body.style.cursor = 'default';
      applyHoverEffect(model, originalScale, false);
    }
  });

  const clock = new THREE.Clock();
  const animate = () => {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    if (model) updateLevitation(model, elapsedTime, isPressed);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  const handleResize = () => {
    sizes.width = container.clientWidth;
    sizes.height = container.clientHeight;
    const aspectRatio = sizes.width / sizes.height;
    const zoom = getZoomForWidth(sizes.width);
    camera.left = -aspectRatio * zoom + 0.6;
    camera.right = aspectRatio * zoom - 1;
    camera.top = zoom;
    camera.bottom = -zoom + 0.6;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  window.addEventListener('resize', handleResize);
}

document.addEventListener('DOMContentLoaded', initScene3D);
