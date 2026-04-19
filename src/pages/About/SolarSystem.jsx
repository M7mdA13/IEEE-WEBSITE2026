import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import gsap from 'gsap';

export const PLANETS = [
  {
    id: 'story',   name: 'Our Story',
    color: 0xf59e0b, orbitRadius: 5.5,  size: 0.55, speed: 0.0048, angle: 0.5,
    roughness: 0.85, metalness: 0.05, emissiveBase: 0.08,
    atmosphereColor: 0xf59e0b, atmosphereScale: 2.4,
    hasRing: false,
    dispAmplitude: 0,    dispFreq: 4,
  },
  {
    id: 'mission', name: 'Our Mission',
    color: 0x3b82f6, orbitRadius: 9.0,  size: 0.50, speed: 0.0030, angle: 2.1,
    roughness: 0.40, metalness: 0.55, emissiveBase: 0.06,
    atmosphereColor: 0x3b82f6, atmosphereScale: 2.6,
    hasRing: true,  ringColor: 0x1d4ed8, ringInner: 0.68, ringOuter: 1.15, ringTilt: 0.42,
    dispAmplitude: 0.04, dispFreq: 5,
  },
  {
    id: 'team',    name: 'Our Team',
    color: 0xef4444, orbitRadius: 12.5, size: 0.62, speed: 0.0020, angle: 4.2,
    roughness: 0.70, metalness: 0.20, emissiveBase: 0.07,
    atmosphereColor: 0xef4444, atmosphereScale: 2.3,
    hasRing: false,
    dispAmplitude: 0.08, dispFreq: 6,
  },
  {
    id: 'impact',  name: 'Our Impact',
    color: 0x22c55e, orbitRadius: 16.5, size: 0.46, speed: 0.0013, angle: 1.2,
    roughness: 0.50, metalness: 0.35, emissiveBase: 0.06,
    atmosphereColor: 0x22c55e, atmosphereScale: 2.8,
    hasRing: true,  ringColor: 0x16a34a, ringInner: 0.65, ringOuter: 1.10, ringTilt: -0.35,
    dispAmplitude: 0.05, dispFreq: 4,
  },
];

// ═══════════════════════════════════════════════════════
//  Shared helpers
// ═══════════════════════════════════════════════════════

function makeGlowTexture(r, g, b) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0,   `rgba(${r},${g},${b},0.9)`);
  grad.addColorStop(0.3, `rgba(${r},${g},${b},0.3)`);
  grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function hexToRgb(hex) {
  return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
}

function makeSunGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0,    'rgba(255, 230, 120, 0.95)');
  g.addColorStop(0.25, 'rgba(255, 170,  40, 0.55)');
  g.addColorStop(0.6,  'rgba(255, 100,   0, 0.18)');
  g.addColorStop(1,    'rgba(255,  60,   0, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

// ═══════════════════════════════════════════════════════
//  Sun — animated granulation surface
// ═══════════════════════════════════════════════════════

function drawSolarSurface(ctx, size) {
  ctx.fillStyle = '#b84000';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 8 + Math.random() * 14;
    const bright = 0.55 + Math.random() * 0.45;
    const g2 = ctx.createRadialGradient(x, y, 0, x, y, r);
    g2.addColorStop(0,    `rgba(255,${Math.floor(200 + bright * 55)},${Math.floor(bright * 100)},${0.6 + bright * 0.35})`);
    g2.addColorStop(0.55, `rgba(255,150,0,${(0.2 * bright).toFixed(2)})`);
    g2.addColorStop(1,    'rgba(200,60,0,0)');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createSolarSurfaceTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  drawSolarSurface(canvas.getContext('2d'), size);
  const texture = new THREE.CanvasTexture(canvas);
  return { canvas, texture };
}

// ═══════════════════════════════════════════════════════
//  Planets — procedural colour textures
// ═══════════════════════════════════════════════════════

function makePlanetColorTexture(id) {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');

  if (id === 'story') {
    const bands = ['#b87700','#f59e0b','#d97706','#fbbf24','#b45309','#f59e0b','#c97a00','#b87700'];
    const bh = size / bands.length;
    bands.forEach((col, i) => { ctx.fillStyle = col; ctx.fillRect(0, i * bh, size, bh + 1); });
    for (let y = 0; y < size; y++) {
      const a = (0.06 * Math.abs(Math.sin(y * 0.22 + 0.8))).toFixed(3);
      ctx.fillStyle = `rgba(255,200,80,${a})`;
      ctx.fillRect(0, y, size, 1);
    }
    const spot = ctx.createRadialGradient(186, 130, 0, 186, 130, 28);
    spot.addColorStop(0,   'rgba(130,45,0,0.78)');
    spot.addColorStop(0.6, 'rgba(150,55,0,0.4)');
    spot.addColorStop(1,   'rgba(150,55,0,0)');
    ctx.fillStyle = spot;
    ctx.beginPath(); ctx.ellipse(186, 130, 28, 16, 0, 0, Math.PI * 2); ctx.fill();

  } else if (id === 'mission') {
    ctx.fillStyle = '#1e3a8a'; ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 7; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 30 + Math.random() * 55);
      g.addColorStop(0,   'rgba(56,189,248,0.55)');
      g.addColorStop(0.5, 'rgba(14,165,233,0.25)');
      g.addColorStop(1,   'rgba(30,58,138,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
    }
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * size, y = 40 + Math.random() * 176;
      const g2 = ctx.createRadialGradient(x, y, 0, x, y, 16 + Math.random() * 28);
      g2.addColorStop(0, 'rgba(200,240,255,0.5)'); g2.addColorStop(1, 'rgba(200,240,255,0)');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, size, size);
    }
    const ice = ctx.createLinearGradient(0, 0, 0, 42);
    ice.addColorStop(0, 'rgba(220,240,255,0.85)'); ice.addColorStop(1, 'rgba(220,240,255,0)');
    ctx.fillStyle = ice; ctx.fillRect(0, 0, size, 42);

  } else if (id === 'team') {
    ctx.fillStyle = '#9b1a1a'; ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 15 + Math.random() * 32);
      g.addColorStop(0, 'rgba(70,8,0,0.55)'); g.addColorStop(1, 'rgba(70,8,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
    }
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * size, y = Math.random() * size;
      const g2 = ctx.createRadialGradient(x, y, 0, x, y, 20 + Math.random() * 38);
      g2.addColorStop(0, 'rgba(230,100,45,0.35)'); g2.addColorStop(1, 'rgba(230,100,45,0)');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, size, size);
    }
    const pc = ctx.createLinearGradient(0, 0, 0, 26);
    pc.addColorStop(0, 'rgba(255,235,220,0.65)'); pc.addColorStop(1, 'rgba(255,235,220,0)');
    ctx.fillStyle = pc; ctx.fillRect(0, 0, size, 26);

  } else if (id === 'impact') {
    ctx.fillStyle = '#1a4db5'; ctx.fillRect(0, 0, size, size);
    [[58,82,44,32,0.3],[184,103,37,25,0.8],[112,170,31,21,1.1],[224,62,25,31,-0.2],[38,183,27,19,0.5]]
      .forEach(([cx, cy, rx, ry, ang]) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
        g.addColorStop(0,    'rgba(34,197,94,0.92)');
        g.addColorStop(0.55, 'rgba(22,163,74,0.65)');
        g.addColorStop(1,    'rgba(21,128,61,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, ang, 0, Math.PI * 2); ctx.fill();
      });
    const p1 = ctx.createLinearGradient(0, 0, 0, 30);
    p1.addColorStop(0, 'rgba(255,255,255,0.88)'); p1.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = p1; ctx.fillRect(0, 0, size, 30);
    const p2 = ctx.createLinearGradient(0, size, 0, size - 26);
    p2.addColorStop(0, 'rgba(255,255,255,0.72)'); p2.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = p2; ctx.fillRect(0, size - 26, size, 26);
  }

  return new THREE.CanvasTexture(c);
}

// ═══════════════════════════════════════════════════════
//  Planets — grayscale bump maps
// ═══════════════════════════════════════════════════════

function makePlanetBumpTexture(id) {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#555'; ctx.fillRect(0, 0, size, size);
  const count = id === 'team' ? 65 : id === 'impact' ? 42 : 22;
  for (let i = 0; i < count; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    const r = 5 + Math.random() * (id === 'team' ? 24 : 14);
    const bright = 110 + Math.floor(Math.random() * 145);
    const dim    = Math.floor(bright * 0.55);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0,   `rgb(${bright},${bright},${bright})`);
    g.addColorStop(0.5, `rgb(${dim},${dim},${dim})`);
    g.addColorStop(1,   'rgb(85,85,85)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  return new THREE.CanvasTexture(c);
}

// ═══════════════════════════════════════════════════════
//  Planets — vertex displacement (in-place)
// ═══════════════════════════════════════════════════════

function displacePlanetGeo(geo, amplitude, freq) {
  if (amplitude === 0) return;
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const len = Math.sqrt(x * x + y * y + z * z);
    const nx = x / len, ny = y / len, nz = z / len;
    const n = (
      Math.sin(nx * freq * 7.1 + ny * freq * 3.7) *
      Math.sin(ny * freq * 5.3 + nz * freq * 9.1) +
      Math.sin(nz * freq * 4.7 + nx * freq * 2.3) * 0.5
    ) / 1.5;
    const disp = n * amplitude;
    pos.setXYZ(i, x + nx * disp, y + ny * disp, z + nz * disp);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.computeBoundingSphere(); // critical: keeps raycaster bounding-sphere in sync
}

// ═══════════════════════════════════════════════════════
//  Black hole — EHT-style photon-ring texture
//  (sprite approach: always faces camera, correct radial mapping)
//
//  The ring texture is a 512×512 radial gradient:
//    centre → transparent (black sphere sits there)
//    ~28–44 % radius → bright orange-white photon ring
//    outer edge → fades to transparent
//  One side is boosted to mimic Doppler brightening (M87* style).
// ═══════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════
//  Component
// ═══════════════════════════════════════════════════════

export default function SolarSystem({ onPlanetSelect }) {
  const mountRef    = useRef(null);
  const callbackRef = useRef(onPlanetSelect);

  useEffect(() => { callbackRef.current = onPlanetSelect; }, [onPlanetSelect]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const isMobile   = el.clientWidth < 768;
    const orbitScale = isMobile ? 0.65 : 1.0;
    const sizeScale  = isMobile ? 1.45 : 1.0;

    // ── Renderers ─────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x05090f, 1);
    el.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(el.clientWidth, el.clientHeight);
    Object.assign(labelRenderer.domElement.style, {
      position: 'absolute', top: '0', left: '0', pointerEvents: 'none',
    });
    el.appendChild(labelRenderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 78 : 58, el.clientWidth / el.clientHeight, 0.1, 600
    );
    const defaultCamPos = isMobile
      ? new THREE.Vector3(0, 16, 26)
      : new THREE.Vector3(0, 20, 34);
    camera.position.copy(defaultCamPos);
    const lookTarget = new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookTarget);

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x1a2540, 6));
    const sunLight = new THREE.PointLight(0xfff4d0, 140, 90);
    scene.add(sunLight);
    const fillLight = new THREE.PointLight(0x203050, 20, 80);
    fillLight.position.set(-20, 10, -20);
    scene.add(fillLight);

    // ── Star field ───────────────────────────────────────────────────────
    const makeStars = (count, spread, size) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < pos.length; i++) pos[i] = (Math.random() - 0.5) * spread;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      return new THREE.Points(geo, new THREE.PointsMaterial({
        color: 0xffffff, size, sizeAttenuation: true, transparent: true, opacity: 0.85,
      }));
    };
    const starsSmall = makeStars(10000, 450, 0.16);
    const starsBig   = makeStars(800,   400, 0.45);
    const starsGroup = new THREE.Group();
    starsGroup.add(starsSmall);
    starsGroup.add(starsBig);
    scene.add(starsGroup);

    // ── Nebula blobs ──────────────────────────────────────────────────────
    const nebulaColors = [0x0a1a4a, 0x1a0a3a, 0x0a2a1a];
    nebulaColors.forEach((col, i) => {
      const [r, g, b] = hexToRgb(col);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture(r, g, b),
        blending: THREE.AdditiveBlending,
        transparent: true, depthWrite: false, opacity: 0.18,
      }));
      sprite.scale.set(80, 80, 1);
      sprite.position.set(Math.cos(i * 2.1) * 40, (Math.random() - 0.5) * 20, Math.sin(i * 2.1) * 40);
      scene.add(sprite);
    });

    // ── Sun ───────────────────────────────────────────────────────────────
    const { canvas: solarCanvas, texture: solarTexture } = createSolarSurfaceTexture();
    const solarCtx = solarCanvas.getContext('2d');

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(2.1, 48, 48),
      new THREE.MeshStandardMaterial({
        map: solarTexture,
        color: 0xffe066, emissive: 0xff8800, emissiveIntensity: 1.6, roughness: 0.9,
      }),
    );
    scene.add(sun);

    [3.2, 4.5, 6.5].forEach((r, i) => {
      const corona = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture(255, 200, 80),
        blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
        opacity: 0.12 - i * 0.03,
      }));
      corona.scale.set(r * 2, r * 2, 1);
      sun.add(corona);
    });

    const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeSunGlowTexture(),
      blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
    }));
    glowSprite.scale.set(16, 16, 1);
    sun.add(glowSprite);

    // ── Planets ───────────────────────────────────────────────────────────
    const planetTextures = [];

    const planetObjects = PLANETS.map(data => {
      const orbitR = data.orbitRadius * orbitScale;
      const pSize  = data.size * sizeScale;

      // Orbit ring
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(orbitR, 0.032, 8, 200),
        new THREE.MeshBasicMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.5 }),
      );
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);

      // Procedural textures
      const colorTex = makePlanetColorTexture(data.id);
      const bumpTex  = makePlanetBumpTexture(data.id);
      planetTextures.push(colorTex, bumpTex);

      // Geometry + vertex displacement
      const geo = new THREE.SphereGeometry(pSize, 40, 40);
      displacePlanetGeo(geo, data.dispAmplitude * sizeScale, data.dispFreq);

      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({
          map:              colorTex,
          bumpMap:          bumpTex,
          bumpScale:        data.id === 'team' ? 0.06 : 0.03,
          emissive:         data.color,
          emissiveIntensity: data.emissiveBase,
          roughness:        data.roughness,
          metalness:        data.metalness,
        }),
      );
      scene.add(mesh);

      // ── Invisible hit sphere — 1.6× visual size so clicks register reliably ──
      // transparent: true + opacity: 0 keeps the object "visible" to the raycaster
      // while rendering nothing to screen.
      const hitMesh = new THREE.Mesh(
        new THREE.SphereGeometry(pSize * 1.6, 10, 10),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
      );
      mesh.add(hitMesh);

      // Atmospheric glow
      const [r, g, b] = hexToRgb(data.atmosphereColor);
      const atmo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture(r, g, b),
        blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.38,
      }));
      atmo.scale.set(pSize * data.atmosphereScale, pSize * data.atmosphereScale, 1);
      mesh.add(atmo);

      // Saturn rings
      if (data.hasRing) {
        const ringMesh = new THREE.Mesh(
          new THREE.RingGeometry(pSize * data.ringInner, pSize * data.ringOuter, 64),
          new THREE.MeshBasicMaterial({
            color: data.ringColor, side: THREE.DoubleSide, transparent: true, opacity: 0.55,
          }),
        );
        ringMesh.rotation.x = data.ringTilt;
        mesh.add(ringMesh);
      }

      // CSS2D label
      const div = document.createElement('div');
      div.className = 'planet-label';
      div.textContent = data.name;
      const labelObj = new CSS2DObject(div);
      labelObj.position.set(0, pSize + 1.1, 0);
      mesh.add(labelObj);

      return { data, mesh, hitMesh, labelObj, angle: data.angle, currentSpeed: data.speed, orbitR };
    });

    // Raycast targets are now the invisible hit spheres, not the visual meshes.
    // This avoids both the displaced-bounding-sphere issue and the "too small to click" problem.
    const hitMeshes   = planetObjects.map(p => p.hitMesh);
    const planetMeshes = planetObjects.map(p => p.mesh); // still used for hover emissive

    // ── Asteroid belt ─────────────────────────────────────────────────────
    const beltCount = 280;
    const beltInner = 13.5 * orbitScale;
    const beltOuter = 15.0 * orbitScale;
    const beltPos   = new Float32Array(beltCount * 3);
    for (let i = 0; i < beltCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r     = beltInner + Math.random() * (beltOuter - beltInner);
      beltPos[i * 3]     = Math.cos(angle) * r;
      beltPos[i * 3 + 1] = (Math.random() - 0.5) * 0.9;
      beltPos[i * 3 + 2] = Math.sin(angle) * r;
    }
    const beltGeo = new THREE.BufferGeometry();
    beltGeo.setAttribute('position', new THREE.BufferAttribute(beltPos, 3));
    const asteroidBelt = new THREE.Points(beltGeo, new THREE.PointsMaterial({
      color: 0x8899aa, size: 0.09, sizeAttenuation: true, transparent: true, opacity: 0.55,
    }));
    scene.add(asteroidBelt);

    // ── Shooting stars ────────────────────────────────────────────────────
    const spawnShootingStar = () => {
      const theta  = Math.random() * Math.PI * 2;
      const startX = Math.cos(theta) * (60 + Math.random() * 40);
      const startY = 20 + Math.random() * 25;
      const startZ = Math.sin(theta) * (60 + Math.random() * 40);
      const dirX   = (Math.random() - 0.5) * 70;
      const dirY   = -(12 + Math.random() * 18);
      const dirZ   = (Math.random() - 0.5) * 70;
      const tailLen = 0.14;

      const pts = [
        new THREE.Vector3(startX, startY, startZ),
        new THREE.Vector3(startX + dirX * tailLen, startY + dirY * tailLen, startZ + dirZ * tailLen),
      ];
      const sGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const sMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
      const line = new THREE.Line(sGeo, sMat);
      scene.add(line);

      const proxy = { t: 0 };
      gsap.to(proxy, {
        t: 1, duration: 0.5 + Math.random() * 0.4, ease: 'power1.in',
        onUpdate: () => {
          const p = sGeo.attributes.position.array;
          p[0] = startX + dirX * proxy.t;
          p[1] = startY + dirY * proxy.t;
          p[2] = startZ + dirZ * proxy.t;
          p[3] = startX + dirX * (proxy.t + tailLen);
          p[4] = startY + dirY * (proxy.t + tailLen);
          p[5] = startZ + dirZ * (proxy.t + tailLen);
          sGeo.attributes.position.needsUpdate = true;
          sMat.opacity = proxy.t < 0.65 ? 0.9 : 0.9 * (1 - (proxy.t - 0.65) / 0.35);
        },
        onComplete: () => { scene.remove(line); sGeo.dispose(); sMat.dispose(); },
      });
    };
    let ssTimeout = null;
    let ssCancelled = false;
    const scheduleShootingStar = () => {
      ssTimeout = setTimeout(() => {
        if (!ssCancelled) { spawnShootingStar(); scheduleShootingStar(); }
      }, 3000 + Math.random() * 5000);
    };
    scheduleShootingStar();

    // ── Mouse parallax ────────────────────────────────────────────────────
    let starParallaxX = 0, starParallaxY = 0;
    const onMouseMoveParallax = (e) => {
      starParallaxX = (e.clientY / el.clientHeight - 0.5) * 0.05;
      starParallaxY = (e.clientX / el.clientWidth  - 0.5) * 0.05;
    };
    el.addEventListener('mousemove', onMouseMoveParallax);

    // ── Particle burst ────────────────────────────────────────────────────
    const spawnBurst = (position, color) => {
      const count = 40;
      const positions = new Float32Array(count * 3);
      const geo = new THREE.BufferGeometry();
      for (let i = 0; i < count; i++) {
        positions[i * 3] = position.x; positions[i * 3 + 1] = position.y; positions[i * 3 + 2] = position.z;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({ color, size: 0.18, sizeAttenuation: true, transparent: true, opacity: 1 });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      const velocities = Array.from({ length: count }, () =>
        new THREE.Vector3((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3)
      );
      const proxy = { t: 0 };
      gsap.to(proxy, {
        t: 1, duration: 0.9, ease: 'power2.out',
        onUpdate: () => {
          const pos = geo.attributes.position.array;
          for (let i = 0; i < count; i++) {
            pos[i * 3]     = position.x + velocities[i].x * proxy.t;
            pos[i * 3 + 1] = position.y + velocities[i].y * proxy.t;
            pos[i * 3 + 2] = position.z + velocities[i].z * proxy.t;
          }
          geo.attributes.position.needsUpdate = true;
          mat.opacity = 1 - proxy.t;
        },
        onComplete: () => { scene.remove(points); geo.dispose(); mat.dispose(); },
      });
    };

    // ── Interaction ───────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse     = new THREE.Vector2();
    let   hovered   = null;
    let   selected  = null;
    let   trackingActive = false;

    const pullBack = 10;
    const camRise  = 10;

    const toMouse = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      mouse.x =  ((e.clientX - r.left) / r.width)  * 2 - 1;
      mouse.y = -((e.clientY - r.top)  / r.height) * 2 + 1;
    };

    const onMouseMove = (e) => {
      toMouse(e);
      raycaster.setFromCamera(mouse, camera);
      // Raycast against hit spheres (large, invisible) — map back to planet via index
      const hits = raycaster.intersectObjects(hitMeshes);
      const hit  = hits.length ? planetObjects[hitMeshes.indexOf(hits[0].object)] : null;

      if (hit === hovered) return;

      if (hovered && hovered !== selected) {
        hovered.mesh.material.emissiveIntensity = hovered.data.emissiveBase;
        hovered.labelObj.element.classList.remove('hovered');
        gsap.to(hovered, { currentSpeed: hovered.data.speed, duration: 0.6 });
      }
      hovered = hit;
      if (hit) {
        hit.mesh.material.emissiveIntensity = 0.45;
        hit.labelObj.element.classList.add('hovered');
        if (hit !== selected) gsap.to(hit, { currentSpeed: 0, duration: 0.5 });
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = '';
      }
    };

    const onClick = (e) => {
      toMouse(e);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(hitMeshes);

      if (hits.length) {
        const hit = planetObjects[hitMeshes.indexOf(hits[0].object)];
        if (!hit) return;

        if (selected && selected !== hit) {
          gsap.to(selected, { currentSpeed: selected.data.speed, duration: 0.8 });
          selected.mesh.material.emissiveIntensity = selected.data.emissiveBase;
          selected.labelObj.element.classList.remove('hovered');
        }

        selected = hit;
        spawnBurst(hit.mesh.position.clone(), hit.data.color);
        trackingActive = false;
        gsap.to(hit, { currentSpeed: hit.data.speed * 0.08, duration: 0.6 });

        const tp  = hit.mesh.position;
        const dir = tp.clone().normalize();
        let tCamX, tCamY, tCamZ, tLookX, tLookY, tLookZ;

        if (isMobile) {
          const orbitDist = tp.length();
          const pullDist  = orbitDist * 0.55;
          tCamX = tp.x - dir.x * pullDist; tCamY = 11; tCamZ = tp.z - dir.z * pullDist + 7;
          tLookX = tp.x; tLookY = -1; tLookZ = tp.z;
        } else {
          tCamX = tp.x - dir.x * pullBack; tCamY = camRise; tCamZ = tp.z - dir.z * pullBack;
          tLookX = tp.x * 0.7; tLookY = 0; tLookZ = tp.z * 0.7;
        }

        gsap.to(camera.position, {
          x: tCamX, y: tCamY, z: tCamZ, duration: 1.8, ease: 'power2.out', overwrite: true,
          onComplete: () => { if (selected === hit) trackingActive = true; },
        });
        gsap.to(lookTarget, {
          x: tLookX, y: tLookY, z: tLookZ, duration: 1.8, ease: 'power2.out', overwrite: true,
        });
        callbackRef.current(hit.data);
      } else {
        trackingActive = false;
        if (selected) {
          gsap.to(selected, { currentSpeed: selected.data.speed, duration: 0.8 });
          selected.mesh.material.emissiveIntensity = selected.data.emissiveBase;
          selected.labelObj.element.classList.remove('hovered');
          selected = null;
        }
        gsap.to(camera.position, {
          x: defaultCamPos.x, y: defaultCamPos.y, z: defaultCamPos.z,
          duration: 1.8, ease: 'power2.out', overwrite: true,
        });
        gsap.to(lookTarget, { x: 0, y: 0, z: 0, duration: 1.8, ease: 'power2.out', overwrite: true });
        callbackRef.current(null);
      }
    };

    const onResetOrbit = () => {
      trackingActive = false;
      if (selected) {
        gsap.to(selected, { currentSpeed: selected.data.speed, duration: 0.8 });
        selected.mesh.material.emissiveIntensity = selected.data.emissiveBase;
        selected.labelObj.element.classList.remove('hovered');
        selected = null;
      }
      gsap.to(camera.position, {
        x: defaultCamPos.x, y: defaultCamPos.y, z: defaultCamPos.z,
        duration: 1.8, ease: 'power2.out', overwrite: true,
      });
      gsap.to(lookTarget, { x: 0, y: 0, z: 0, duration: 1.8, ease: 'power2.out', overwrite: true });
      callbackRef.current(null);
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click',     onClick);
    document.addEventListener('reset-orbit', onResetOrbit);

    // ── Animation loop ────────────────────────────────────────────────────
    let animId;
    let frameCount = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      frameCount++;

      // Sun: emissive pulse + granulation redraw every ~90 frames
      sun.material.emissiveIntensity = 1.6 + Math.sin(clock.elapsedTime * 1.2) * 0.3;
      if (frameCount % 90 === 0) {
        drawSolarSurface(solarCtx, 256);
        solarTexture.needsUpdate = true;
      }

      sun.rotation.y          += delta * 0.18;
      starsSmall.rotation.y   += delta * 0.003;
      starsBig.rotation.y     += delta * 0.005;
      asteroidBelt.rotation.y -= delta * 0.04;

      starsGroup.rotation.x += (starParallaxX - starsGroup.rotation.x) * 0.04;
      starsGroup.rotation.y += (starParallaxY - starsGroup.rotation.y) * 0.04;

      planetObjects.forEach(p => {
        p.angle += p.currentSpeed;
        p.mesh.position.set(Math.cos(p.angle) * p.orbitR, 0, Math.sin(p.angle) * p.orbitR);
        p.mesh.rotation.y += delta * 0.5;
        p.mesh.rotation.x += delta * 0.05;
      });

      if (trackingActive && selected) {
        const tp  = selected.mesh.position;
        const dir = tp.clone().normalize();
        let tCamX, tCamY, tCamZ, tLookX, tLookY, tLookZ;

        if (isMobile) {
          const orbitDist = tp.length(), pullDist = orbitDist * 0.55;
          tCamX = tp.x - dir.x * pullDist; tCamY = 11; tCamZ = tp.z - dir.z * pullDist + 7;
          tLookX = tp.x; tLookY = -1; tLookZ = tp.z;
        } else {
          tCamX = tp.x - dir.x * pullBack; tCamY = camRise; tCamZ = tp.z - dir.z * pullBack;
          tLookX = tp.x * 0.7; tLookY = 0; tLookZ = tp.z * 0.7;
        }

        const lerpT = 1 - Math.pow(0.04, delta);
        camera.position.x += (tCamX - camera.position.x) * lerpT;
        camera.position.y += (tCamY - camera.position.y) * lerpT;
        camera.position.z += (tCamZ - camera.position.z) * lerpT;
        lookTarget.x += (tLookX - lookTarget.x) * lerpT;
        lookTarget.y += (tLookY - lookTarget.y) * lerpT;
        lookTarget.z += (tLookZ - lookTarget.z) * lerpT;
      }

      camera.lookAt(lookTarget);
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.fov    = el.clientWidth < 768 ? 78 : 58;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
      labelRenderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      ssCancelled = true;
      clearTimeout(ssTimeout);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click',     onClick);
      document.removeEventListener('reset-orbit', onResetOrbit);
      el.removeEventListener('mousemove', onMouseMoveParallax);
      solarTexture.dispose();
      planetTextures.forEach(t => t.dispose());
      renderer.dispose();
      if (el.contains(renderer.domElement))      el.removeChild(renderer.domElement);
      if (el.contains(labelRenderer.domElement)) el.removeChild(labelRenderer.domElement);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={mountRef} className="solar-system-mount" />;
}
