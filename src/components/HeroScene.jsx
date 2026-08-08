import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The hero centrepiece: a faceted mineral form that turns slowly and leans
 * toward the cursor. Red against white, lit like a studio product shot.
 *
 * Deliberately dependency-light — plain three, no r3f — because it is one
 * object with one material and never needs to reconcile with React state.
 */
export function HeroScene({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Size the canvas from CSS, not from its buffer, so resize() can never
    // feed its own output back into the element it measures.
    Object.assign(renderer.domElement.style, {
      display: "block",
      width: "100%",
      height: "100%",
    });
    mount.appendChild(renderer.domElement);

    // --- Geometry: subdivided icosahedron pushed around by layered sines.
    // Cheaper than real noise and reads the same once the facets are flat.
    const geometry = new THREE.IcosahedronGeometry(1.35, 6);
    const pos = geometry.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = v.clone().normalize();

      const d =
        0.34 * Math.sin(n.x * 2.1 + n.y * 1.4) +
        0.22 * Math.sin(n.y * 3.3 - n.z * 2.7) +
        0.14 * Math.sin(n.z * 5.1 + n.x * 4.2) +
        0.07 * Math.sin(n.x * 8.4 - n.y * 7.1 + n.z * 6.3);

      v.setLength(1.35 + d * 0.42);
      pos.setXYZ(i, v.x, v.y, v.z);
    }

    // Flat shading needs unique vertices per face
    geometry.deleteAttribute("normal");
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ef4136"),
      roughness: 0.42,
      metalness: 0.08,
      flatShading: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Lighting: key / rim / fill, so the facets separate cleanly on white
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(3, 4, 4);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xffd9d4, 1.9);
    rim.position.set(-4, 1.5, -3);
    scene.add(rim);

    const fill = new THREE.DirectionalLight(0xffffff, 0.9);
    fill.position.set(-1.5, -3, 2.5);
    scene.add(fill);

    // --- Sizing
    // The form is bounded by the displacement above, so we can solve for the
    // camera distance that keeps it at a fixed fraction of the frame rather
    // than hard-coding z per breakpoint and hoping it never crops.
    const OBJECT_RADIUS = 1.35 * 1.42;
    const FILL = 0.82;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;

      renderer.setSize(w, h, false);

      const aspect = w / h;
      camera.aspect = aspect;

      // Half-extent the object must fit inside, in world units
      const needed = OBJECT_RADIUS / FILL;
      const halfHeight = aspect >= 1 ? needed : needed / aspect;
      camera.position.z = halfHeight / Math.tan(halfFov);

      camera.updateProjectionMatrix();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // --- Cursor lean
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onPointerMove = (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // --- Loop
    let raf;
    const clock = new THREE.Clock();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      current.x += (target.x - current.x) * 0.045;
      current.y += (target.y - current.y) * 0.045;

      if (!reduced) {
        mesh.rotation.y = t * 0.16 + current.x * 0.45;
        mesh.rotation.x = Math.sin(t * 0.21) * 0.12 + current.y * 0.3;
        mesh.position.y = Math.sin(t * 0.55) * 0.06;
      } else {
        mesh.rotation.set(0.2, 0.6, 0);
      }

      renderer.render(scene, camera);
    };
    tick();

    // Stop rendering when the hero is off screen
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !raf) tick();
        else if (!entry.isIntersecting && raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      },
      { threshold: 0 },
    );
    io.observe(mount);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
