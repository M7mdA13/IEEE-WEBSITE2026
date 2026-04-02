import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import gsap from 'gsap';

export const PLANETS = [
  { id: 'story',   name: 'Our Story',   color: 0xf59e0b, orbitRadius: 5.5,  size: 0.55, speed: 0.0048, angle: 0.5  },
  { id: 'mission', name: 'Our Mission', color: 0x3b82f6, orbitRadius: 9.0,  size: 0.50, speed: 0.0030, angle: 2.1  },
  { id: 'team',    name: 'Our Team',    color: 0xef4444, orbitRadius: 12.5, size: 0.62, speed: 0.0020, angle: 4.2  },
  { id: 'impact',  name: 'Our Impact',  color: 0x22c55e, orbitRadius: 16.5, size: 0.46, speed: 0.0013, angle: 1.2  },
];

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

    // ── Renderers ─────────────────────────────────────────────────────
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

    // ── Scene / Camera ─────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, el.clientWidth / el.clientHeight, 0.1, 600);
    camera.position.set(0, 20, 34);
    const lookTarget = new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookTarget);

    // ── Lights ─────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x1a2540, 6));
    const sunLight = new THREE.PointLight(0xfff4d0, 140, 90);
    scene.add(sunLight);

    // ── Star field ─────────────────────────────────────────────────────
    const starPos = new Float32Array(9000 * 3);
    for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 450;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.22, sizeAttenuation: true,
    }));
    scene.add(stars);

    // ── Sun ────────────────────────────────────────────────────────────
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(2.1, 40, 40),
      new THREE.MeshStandardMaterial({ color: 0xffe066, emissive: 0xff8800, emissiveIntensity: 1.4, roughness: 0.9 }),
    );
    scene.add(sun);

    const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeSunGlowTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }));
    glowSprite.scale.set(14, 14, 1);
    sun.add(glowSprite);

    // ── Planets ────────────────────────────────────────────────────────
    const planetObjects = PLANETS.map(data => {
      // Orbit ring
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(data.orbitRadius, 0.028, 8, 160),
        new THREE.MeshBasicMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.55 }),
      );
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);

      // Sphere
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(data.size, 28, 28),
        new THREE.MeshStandardMaterial({
          color: data.color,
          emissive: 0x000000,
          emissiveIntensity: 0,
          roughness: 0.55,
          metalness: 0.15,
        }),
      );
      scene.add(mesh);

      // CSS2D label
      const div = document.createElement('div');
      div.className = 'planet-label';
      div.textContent = data.name;
      const labelObj = new CSS2DObject(div);
      labelObj.position.set(0, data.size + 0.55, 0);
      mesh.add(labelObj);

      return { data, mesh, angle: data.angle, currentSpeed: data.speed };
    });

    const planetMeshes = planetObjects.map(p => p.mesh);

    // ── Raycaster / interaction ────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse     = new THREE.Vector2();
    let   hovered   = null;

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

      if (hovered) {
        hovered.mesh.material.emissive.set(0x000000);
        hovered.mesh.material.emissiveIntensity = 0;
        hovered.mesh.children[0]?.element.classList.remove('hovered');
        gsap.to(hovered, { currentSpeed: hovered.data.speed, duration: 0.6 });
      }
      hovered = hit;
      if (hit) {
        hit.mesh.material.emissive.setHex(hit.data.color);
        hit.mesh.material.emissiveIntensity = 0.45;
        hit.mesh.children[0]?.element.classList.add('hovered');
        gsap.to(hit, { currentSpeed: 0, duration: 0.5 });
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
        const tp = hit.mesh.position;
        const dir = tp.clone().normalize();
        gsap.to(camera.position, {
          x: tp.x - dir.x * 9,
          y: tp.y + 7,
          z: tp.z - dir.z * 9 + 6,
          duration: 1.3, ease: 'power2.inOut',
        });
        gsap.to(lookTarget, {
          x: tp.x * 0.55, y: 0, z: tp.z * 0.55,
          duration: 1.3, ease: 'power2.inOut',
        });
        callbackRef.current(hit.data);
      } else {
        gsap.to(camera.position, { x: 0, y: 20, z: 34, duration: 1.3, ease: 'power2.inOut' });
        gsap.to(lookTarget,       { x: 0, y: 0,  z: 0,  duration: 1.3, ease: 'power2.inOut' });
        callbackRef.current(null);
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click',     onClick);

    // ── Animation loop ─────────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      sun.rotation.y   += delta * 0.12;
      stars.rotation.y += delta * 0.004;

      planetObjects.forEach(p => {
        p.angle += p.currentSpeed;
        p.mesh.position.set(
          Math.cos(p.angle) * p.data.orbitRadius,
          0,
          Math.sin(p.angle) * p.data.orbitRadius,
        );
        p.mesh.rotation.y += delta * 0.4;
      });

      camera.lookAt(lookTarget);
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    // ── Resize ─────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
      labelRenderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup ────────────────────────────────────────────────────────
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
