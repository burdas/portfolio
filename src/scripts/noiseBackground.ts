import * as THREE from 'three';

const CONFIG = {
  COLOR: { r: 0.388, g: 0.400, b: 0.945 },
  BG_COLOR: { r: 0.0, g: 0.0, b: 0.0 },
  TH_CORE: 0.88,
  FEATHER: 0.30,
  TARGET_FPS: 30
};

export function initNoiseBackground(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  const sizes = { width: window.innerWidth, height: window.innerHeight };
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene.add(camera);

  const vertexShader = `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision lowp float;

    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uBgColor;

    float hash31(vec3 p) {
      p = fract(p * vec3(443.8975, 397.2973, 491.1871));
      p += dot(p, p.yzx + 19.19);
      return fract((p.x + p.y) * p.z);
    }

    float valueNoise3(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      
      vec3 u = f * f * (3.0 - 2.0 * f);
      
      float n000 = hash31(i + vec3(0,0,0));
      float n100 = hash31(i + vec3(1,0,0));
      float n010 = hash31(i + vec3(0,1,0));
      float n110 = hash31(i + vec3(1,1,0));
      float n001 = hash31(i + vec3(0,0,1));
      float n101 = hash31(i + vec3(1,0,1));
      float n011 = hash31(i + vec3(0,1,1));
      float n111 = hash31(i + vec3(1,1,1));
      
      return mix(
        mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
        mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y),
        u.z
      );
    }

    float fbm3(vec3 p) {
      float value = 0.2;
      float amplitude = 0.48;
      float frequency = 1.0;
      
      mat2 R = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      
      for (int i = 0; i < 3; i++) {
        value += valueNoise3(p * frequency) * amplitude;
        
        p.xy = R * p.xy;
        p.z += amplitude * 1.0;
        
        frequency *= 1.9;
        amplitude *= 0.8;
      }
      
      return value;
    }

    float soft(float x, float a, float b){ return smoothstep(a, b, x); }

    void main() {
      vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
      float t = uTime * 0.1;

      float n = fbm3(vec3(p * 3.0, t));

      float core = soft(n, ${CONFIG.TH_CORE.toFixed(2)}, ${(CONFIG.TH_CORE + CONFIG.FEATHER).toFixed(2)});
      float halo = soft(n, ${(CONFIG.TH_CORE - 0.10).toFixed(2)}, ${(CONFIG.TH_CORE + CONFIG.FEATHER * 0.5).toFixed(2)}) - core;

      vec3 bg = uBgColor;
      vec3 color = uColor;

      vec3 col = bg;
      col += color * 0.25 * halo;
      col = mix(col, color, core);

      float alpha = core + halo * 0.25;
      gl_FragColor = vec4(col, alpha);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uResolution: { value: new THREE.Vector2(sizes.width, sizes.height) },
      uTime: { value: 0 },
      uColor: { value: new THREE.Vector3(CONFIG.COLOR.r, CONFIG.COLOR.g, CONFIG.COLOR.b) },
      uBgColor: { value: new THREE.Vector3(CONFIG.BG_COLOR.r, CONFIG.BG_COLOR.g, CONFIG.BG_COLOR.b) }
    }
  });

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(plane);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    powerPreference: 'high-performance',
    precision: 'lowp',
    antialias: false
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);
  renderer.render(scene, camera);

  const clock = new THREE.Clock();
  const frameTime = 1000 / CONFIG.TARGET_FPS;
  let lastTime = 0;

  function animate(currentTime: number) {
    if (currentTime - lastTime < frameTime) {
      requestAnimationFrame(animate);
      return;
    }
    lastTime = currentTime;

    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate(0);

  let resizeTimeout: ReturnType<typeof setTimeout>;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      renderer.setSize(sizes.width, sizes.height);
      material.uniforms.uResolution.value.set(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    }, 100);
  }

  window.addEventListener('resize', handleResize);
}
