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
  },
  {
    id: 'mission', name: 'Our Mission',
    color: 0x3b82f6, orbitRadius: 9.0,  size: 0.50, speed: 0.0030, angle: 2.1,
    roughness: 0.40, metalness: 0.55, emissiveBase: 0.06,
    atmosphereColor: 0x3b82f6, atmosphereScale: 2.6,
    hasRing: true,  ringColor: 0x1d4ed8, ringInner: 0.68, ringOuter: 1.15, ringTilt: 0.42,
  },
  {
    id: 'team',    name: 'Our Team',
    color: 0xef4444, orbitRadius: 12.5, size: 0.62, speed: 0.0020, angle: 4.2,
    roughness: 0.70, metalness: 0.20, emissiveBase: 0.07,
    atmosphereColor: 0xef4444, atmosphereScale: 2.3,
    hasRing: false,
  },
  {
    id: 'impact',  name: 'Our Impact',
    color: 0x22c55e, orbitRadius: 16.5, size: 0.46, speed: 0.0013, angle: 1.2,
    roughness: 0.50, metalness: 0.35, emissiveBase: 0.06,
    atmosphereColor: 0x22c55e, atmosphereScale: 2.8,
    hasRing: true,  ringColor: 0x16a34a, ringInner: 0.65, ringOuter: 1.10, ringTilt: -0.35,
  },
];

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
  g.addColorStop(0,   'rgba(255, 230, 120, 0.95)');
  g.addColorStop(0.25,'rgba(255, 170,  40, 0.55)');
  g.addColorStop(0.6, 'rgba(255, 100,   0, 0.18)');
  g.addColorStop(1,   'rgba(255,  60,   0, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export default function SolarSystem({ onPlanetSelect }) {
  const mountRef    = useRef(null);
  const callbackRef = useRef(onPlanetSelect);

  useEffect(() => { callbackRef.current = onPlanetSelect; }, [onPlanetSelect]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const isMobile   = el.clientWidth < 768;
    const orbitScale = isMobile ? 0.52 : 1.0;  // shrink orbits to fit mobile viewport
    const sizeScale  = isMobile ? 1.55 : 1.0;  // bigger planets for easier tapping

    // ── Renderers ──────────────────────────────────────────────────────────
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

    // ── Scene / Camera ─────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 78 : 58, el.clientWidth / el.clientHeight, 0.1, 600
    );
    const defaultCamPos = isMobile
      ? new THREE.Vector3(0, 18, 28)
      : new THREE.Vector3(0, 20, 34);
    camera.position.copy(defaultCamPos);
    const lookTarget = new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookTarget);

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x1a2540, 6));
    const sunLight = new THREE.PointLight(0xfff4d0, 140, 90);
    scene.add(sunLight);

    // secondary fill light for planet backsides
    const fillLight = new THREE.PointLight(0x203050, 20, 80);
    fillLight.position.set(-20, 10, -20);
    scene.add(fillLight);

    // ── Star field (two layers: small + large) ────────────────────────────
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
    scene.add(starsSmall);
    scene.add(starsBig);

    // ── Nebula cloud (additive sprite blobs) ─────────────────────────────
    const nebulaColors = [0x0a1a4a, 0x1a0a3a, 0x0a2a1a];
    nebulaColors.forEach((col, i) => {
      const [r, g, b] = hexToRgb(col);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture(r, g, b),
        blending: THREE.AdditiveBlending,
        transparent: true, depthWrite: false, opacity: 0.18,
      }));
      sprite.scale.set(80, 80, 1);
      sprite.position.set(
        Math.cos(i * 2.1) * 40,
        (Math.random() - 0.5) * 20,
        Math.sin(i * 2.1) * 40,
      );
      scene.add(sprite);
    });

    // ── Sun ───────────────────────────────────────────────────────────────
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(2.1, 48, 48),
      new THREE.MeshStandardMaterial({
        color: 0xffe066, emissive: 0xff8800, emissiveIntensity: 1.6, roughness: 0.9,
      }),
    );
    scene.add(sun);

    // Sun corona rings
    [3.2, 4.5, 6.5].forEach((r, i) => {
      const corona = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture(255, 200, 80),
        blending: THREE.AdditiveBlending,
        transparent: true, depthWrite: false,
        opacity: 0.12 - i * 0.03,
      }));
      corona.scale.set(r * 2, r * 2, 1);
      sun.add(corona);
    });

    // Sun main glow sprite
    const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeSunGlowTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true, depthWrite: false,
    }));
    glowSprite.scale.set(16, 16, 1);
    sun.add(glowSprite);

    // ── Planets ───────────────────────────────────────────────────────────
    const planetObjects = PLANETS.map(data => {
      const orbitR = data.orbitRadius * orbitScale;
      const pSize  = data.size * sizeScale;

      // Orbit ring — slightly glowing
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(orbitR, 0.032, 8, 200),
        new THREE.MeshBasicMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.5 }),
      );
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);

      // Planet sphere — detailed geometry
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(pSize, 40, 40),
        new THREE.MeshStandardMaterial({
          color: data.color,
          emissive: data.color,
          emissiveIntensity: data.emissiveBase,
          roughness: data.roughness,
          metalness: data.metalness,
        }),
      );
      scene.add(mesh);

      // Atmospheric glow
      const [r, g, b] = hexToRgb(data.atmosphereColor);
      const atmo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: makeGlowTexture(r, g, b),
        blending: THREE.AdditiveBlending,
        transparent: true, depthWrite: false, opacity: 0.38,
      }));
      atmo.scale.set(pSize * data.atmosphereScale, pSize * data.atmosphereScale, 1);
      mesh.add(atmo);

      // Saturn-style rings
      if (data.hasRing) {
        const ringMesh = new THREE.Mesh(
          new THREE.RingGeometry(pSize * data.ringInner, pSize * data.ringOuter, 64),
          new THREE.MeshBasicMaterial({
            color: data.ringColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.55,
          }),
        );
        ringMesh.rotation.x = data.ringTilt;
        mesh.add(ringMesh);
      }

      // CSS2D label — sits clearly above the planet sphere
      const div = document.createElement('div');
      div.className = 'planet-label';
      div.textContent = data.name;
      const labelObj = new CSS2DObject(div);
      labelObj.position.set(0, pSize + 1.1, 0);
      mesh.add(labelObj);

      return { data, mesh, labelObj, angle: data.angle, currentSpeed: data.speed, orbitR };
    });

    const planetMeshes = planetObjects.map(p => p.mesh);

    // ── Interaction ───────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse     = new THREE.Vector2();
    let   hovered   = null;
    let   selected  = null;
    let   trackingActive = false;   // true while camera should follow selected planet

    const pullBack     = isMobile ? 6   : 9;
    const camRise      = isMobile ? -1  : 7;   // mobile: camera level/below planet so it appears high in frame
    const zOffset      = isMobile ? 1   : 6;
    const lookOffsetY  = isMobile ? -4  : 0;   // mobile: look well below planet → planet sits near top of viewport

    const toMouse = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      mouse.x =  ((e.clientX - r.left) / r.width)  * 2 - 1;
      mouse.y = -((e.clientY - r.top)  / r.height) * 2 + 1;
    };

    const onMouseMove = (e) => {
      toMouse(e);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(planetMeshes);
      const hit  = hits.length ? planetObjects.find(p => p.mesh === hits[0].object) : null;

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
      const hits = raycaster.intersectObjects(planetMeshes);

      if (hits.length) {
        const hit = planetObjects.find(p => p.mesh === hits[0].object);
        if (!hit) return;

        if (selected && selected !== hit) {
          gsap.to(selected, { currentSpeed: selected.data.speed, duration: 0.8 });
          selected.mesh.material.emissiveIntensity = selected.data.emissiveBase;
          selected.labelObj.element.classList.remove('hovered');
        }

        selected = hit;
        trackingActive = false; // disable while GSAP animates
        gsap.to(hit, { currentSpeed: hit.data.speed * 0.08, duration: 0.6 });

        const tp = hit.mesh.position;
        const dir = tp.clone().normalize();
        gsap.to(camera.position, {
          x: tp.x - dir.x * pullBack, y: tp.y + camRise, z: tp.z - dir.z * pullBack + zOffset,
          duration: 1.3, ease: 'power2.inOut',
          onComplete: () => { if (selected === hit) trackingActive = true; },
        });
        gsap.to(lookTarget, {
          x: tp.x * 0.55, y: lookOffsetY, z: tp.z * 0.55,
          duration: 1.3, ease: 'power2.inOut',
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
          duration: 1.3, ease: 'power2.inOut',
        });
        gsap.to(lookTarget, { x: 0, y: 0, z: 0, duration: 1.3, ease: 'power2.inOut' });
        callbackRef.current(null);
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click',     onClick);

    // ── Animation loop ────────────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      sun.rotation.y     += delta * 0.18;
      starsSmall.rotation.y += delta * 0.003;
      starsBig.rotation.y   += delta * 0.005;

      planetObjects.forEach(p => {
        p.angle += p.currentSpeed;
        p.mesh.position.set(
          Math.cos(p.angle) * p.orbitR,
          0,
          Math.sin(p.angle) * p.orbitR,
        );
        p.mesh.rotation.y += delta * 0.5;
        p.mesh.rotation.x += delta * 0.05;
      });

      // Smoothly track the selected planet while it slowly orbits
      if (trackingActive && selected) {
        const tp = selected.mesh.position;
        const dir = tp.clone().normalize();
        const tCamX = tp.x - dir.x * pullBack;
        const tCamY = tp.y + camRise;
        const tCamZ = tp.z - dir.z * pullBack + zOffset;
        const lerpT = 1 - Math.pow(0.04, delta); // smooth, frame-rate independent
        camera.position.x += (tCamX - camera.position.x) * lerpT;
        camera.position.y += (tCamY - camera.position.y) * lerpT;
        camera.position.z += (tCamZ - camera.position.z) * lerpT;
        lookTarget.x += (tp.x * 0.55 - lookTarget.x) * lerpT;
        lookTarget.y += (lookOffsetY  - lookTarget.y) * lerpT;
        lookTarget.z += (tp.z * 0.55 - lookTarget.z) * lerpT;
      }

      camera.lookAt(lookTarget);
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      const nowMobile = el.clientWidth < 768;
      camera.fov    = nowMobile ? 78 : 58;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
      labelRenderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click',     onClick);
      renderer.dispose();
      if (el.contains(renderer.domElement))      el.removeChild(renderer.domElement);
      if (el.contains(labelRenderer.domElement)) el.removeChild(labelRenderer.domElement);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={mountRef} className="solar-system-mount" />;
}
