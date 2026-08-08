import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

/**
 * The Nexa mark, extruded from its real path data and rendered as dispersive
 * glass, surrounded by a field of glass satellites.
 *
 * Three compositions, matching the reference renders:
 *   stack   — clear tiles laid flat on white, one copper accent
 *   shards  — copper mark on black, angular fragments floating around it
 *   bouquet — copper mark on black, curved lenses and spheres arranged radially
 */

/* The outer square with the two angled cutouts, straight from NexaLogo.jsx. */
const MARK_PATH =
  "M0,0V72.45H72.46V0ZM29,58H14.49V14.49L29,29Zm29,0h0L43.47,43.47v-29H58Z";

let markShapesCache = null;

function markShapes() {
  if (markShapesCache) return markShapesCache;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72.46 72.45"><path d="${MARK_PATH}"/></svg>`;
  const parsed = new SVGLoader().parse(svg);
  // createShapes resolves the cutouts into holes using the fill rule
  markShapesCache = SVGLoader.createShapes(parsed.paths[0]);
  return markShapesCache;
}

/**
 * Extrudes the mark and normalises it: SVG space is Y-down and 72 units wide,
 * so it gets flipped and scaled to roughly 2 world units before use.
 */
function buildMarkGeometry({ depth = 0.34, bevel = 0.055 } = {}) {
  const geo = new THREE.ExtrudeGeometry(markShapes(), {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments: 6,
    curveSegments: 12,
  });

  geo.center();
  // SVG Y grows downward; flip so the mark reads the right way up
  geo.scale(1, -1, 1);
  const SCALE = 2 / 72.46;
  geo.scale(SCALE, SCALE, 1);
  geo.computeVertexNormals();
  return geo;
}

function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  const rr = Math.min(r, w / 2, h / 2);
  s.moveTo(x + rr, y);
  s.lineTo(x + w - rr, y);
  s.quadraticCurveTo(x + w, y, x + w, y + rr);
  s.lineTo(x + w, y + h - rr);
  s.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  s.lineTo(x + rr, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - rr);
  s.lineTo(x, y + rr);
  s.quadraticCurveTo(x, y, x + rr, y);
  return s;
}

function plateGeometry(w, h, thickness = 0.1, radius = 0.16) {
  const geo = new THREE.ExtrudeGeometry(roundedRectShape(w, h, radius), {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.06,
    bevelSegments: 5,
    curveSegments: 10,
  });
  geo.center();
  return geo;
}

/** Deterministic pseudo-random, so a layout never reshuffles between renders. */
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/* ------------------------------------------------------------ environment --- */

function buildEnvironment(renderer, variant) {
  const W = 1024;
  const H = 512;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  const light = variant === "stack";

  const base = ctx.createLinearGradient(0, 0, 0, H);
  if (light) {
    base.addColorStop(0, "#ffffff");
    base.addColorStop(0.55, "#f2eee9");
    base.addColorStop(1, "#cfc7bd");
  } else {
    base.addColorStop(0, "#6e6e78");
    base.addColorStop(0.5, "#2a2a30");
    base.addColorStop(1, "#101014");
  }
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // Hard-edged softboxes. Dispersion needs sharp light/dark boundaries to
  // split against — a smooth gradient produces no rainbow at all.
  const box = (x, y, w, h, a, blur) => {
    ctx.save();
    ctx.filter = `blur(${blur}px)`;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
  };

  box(40, 20, 330, 200, 1, 12);
  box(420, 10, 210, 130, light ? 0.7 : 1, 14);
  box(720, 30, 260, 170, light ? 0.55 : 0.95, 12);
  box(180, 300, 200, 90, light ? 0.4 : 0.7, 20);
  box(600, 330, 240, 100, light ? 0.35 : 0.6, 22);

  // Copper glow — the warm bloom running through every one of the references
  const copper = ctx.createRadialGradient(690, 250, 0, 690, 250, 300);
  copper.addColorStop(0, `rgba(255,138,60,${light ? 0.5 : 0.95})`);
  copper.addColorStop(0.5, `rgba(224,90,40,${light ? 0.22 : 0.45})`);
  copper.addColorStop(1, "rgba(224,90,40,0)");
  ctx.fillStyle = copper;
  ctx.fillRect(0, 0, W, H);

  if (!light) {
    const copper2 = ctx.createRadialGradient(120, 330, 0, 120, 330, 220);
    copper2.addColorStop(0, "rgba(255,120,50,0.55)");
    copper2.addColorStop(1, "rgba(255,120,50,0)");
    ctx.fillStyle = copper2;
    ctx.fillRect(0, 0, W, H);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  pmrem.dispose();
  tex.dispose();
  return env;
}

/**
 * A backdrop plane *inside* the scene, not a CSS background.
 *
 * three's transmission works by re-rendering the scene into a buffer and
 * sampling it through the refraction. With an alpha canvas and nothing behind
 * the glass, that buffer is empty and every transmissive mesh collapses into a
 * flat slab. Giving it something to bend is what makes it read as glass.
 */
function buildBackdrop(variant) {
  const W = 1024;
  const H = 1024;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  const light = variant === "stack";

  ctx.fillStyle = light ? "#f4f1ec" : "#050505";
  ctx.fillRect(0, 0, W, H);

  if (light) {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.55, "#f1ece5");
    g.addColorStop(1, "#e2dad0");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // Copper bloom — the warm mass the glass picks colour up from
  const warm = ctx.createRadialGradient(
    W * 0.72,
    H * 0.38,
    0,
    W * 0.72,
    H * 0.38,
    W * 0.55,
  );
  warm.addColorStop(0, light ? "rgba(255,150,80,0.5)" : "rgba(255,132,58,0.9)");
  warm.addColorStop(0.28, light ? "rgba(240,110,60,0.14)" : "rgba(198,68,26,0.32)");
  warm.addColorStop(1, "rgba(150,45,12,0)");
  ctx.fillStyle = warm;
  ctx.fillRect(0, 0, W, H);

  if (!light) {
    const warm2 = ctx.createRadialGradient(
      W * 0.16,
      H * 0.72,
      0,
      W * 0.16,
      H * 0.72,
      W * 0.28,
    );
    warm2.addColorStop(0, "rgba(255,120,50,0.4)");
    warm2.addColorStop(1, "rgba(255,120,50,0)");
    ctx.fillStyle = warm2;
    ctx.fillRect(0, 0, W, H);

    // A couple of bright streaks so refraction has hard edges to smear
    ctx.save();
    ctx.filter = "blur(28px)";
    ctx.fillStyle = "rgba(255,225,200,0.55)";
    ctx.translate(W * 0.55, H * 0.6);
    ctx.rotate(-0.5);
    ctx.fillRect(-260, -14, 520, 28);
    ctx.restore();
  }

  if (!light) {
    const core = ctx.createRadialGradient(
      W * 0.5, H * 0.46, 0, W * 0.5, H * 0.46, W * 0.34,
    );
    core.addColorStop(0, "rgba(255,196,150,0.85)");
    core.addColorStop(0.35, "rgba(255,120,55,0.5)");
    core.addColorStop(1, "rgba(120,35,10,0)");
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, W, H);
  }

  const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.44, W / 2, H / 2, W * 0.82);
  vig.addColorStop(0, light ? "rgba(244,241,236,0)" : "rgba(5,5,5,0)");
  vig.addColorStop(1, light ? "rgba(244,241,236,1)" : "rgba(5,5,5,1)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }),
  );
  mesh.userData.texture = tex;
  return mesh;
}

/* -------------------------------------------------------------- materials --- */

const clearGlass = () =>
  new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.01,
    transmission: 1,
    thickness: 0.3,
    ior: 1.5,
    dispersion: 9,
    iridescence: 0.4,
    iridescenceIOR: 1.4,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    envMapIntensity: 3,
  });

const clearGlassThin = () => {
  const m = clearGlass();
  m.side = THREE.DoubleSide;
  m.thickness = 0.12;
  return m;
};

const copperGlass = () =>
  new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.03,
    transmission: 1,
    thickness: 0.75,
    ior: 1.5,
    dispersion: 7,
    attenuationColor: new THREE.Color(0xff6a2e),
    attenuationDistance: 4.5,
    iridescence: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    envMapIntensity: 2.8,
  });

/* ------------------------------------------------------------- satellites --- */

function buildSatellites(variant, materials) {
  const items = [];
  const r = rng(20260808);

  if (variant === "stack") {
    // Tiles lying in a shared plane, overlapping like scattered glass coasters
    const layout = [
      [-2.5, 1.5, 1.5, 1.5, 0],
      [0.4, 2.2, 2.6, 1.0, 0],
      [2.9, 1.7, 2.0, 1.6, 1],
      [-3.0, -0.9, 2.2, 1.4, 0],
      [2.6, -1.3, 2.4, 1.8, 1],
      [-0.6, -2.4, 2.8, 1.2, 0],
      [1.4, -2.9, 1.6, 1.3, 0],
    ];
    layout.forEach(([x, y, w, h, tinted], i) => {
      items.push({
        geometry: plateGeometry(w, h, 0.16, 0.22),
        material: tinted ? materials.copper : materials.clear,
        position: [x, y, -0.35 - i * 0.06],
        rotation: [0, 0, 0],
      });
    });
    return items;
  }

  if (variant === "shards") {
    // Angular fragments at loose orientations, drifting around the mark
    for (let i = 0; i < 11; i++) {
      const w = 0.7 + r() * 2.4;
      const h = 0.6 + r() * 2.0;
      const angle = (i / 11) * Math.PI * 2 + r() * 0.5;
      const dist = 2.4 + r() * 2.2;
      items.push({
        geometry: plateGeometry(w, h, 0.07, 0.05),
        material: r() > 0.65 ? materials.copper : materials.clear,
        position: [
          Math.cos(angle) * dist,
          Math.sin(angle) * dist * 0.75,
          -1.2 - r() * 2.2,
        ],
        rotation: [r() * 1.4 - 0.7, r() * 1.4 - 0.7, r() * Math.PI],
      });
    }
    return items;
  }

  // bouquet — curved lenses radiating outward, with a few clear spheres
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    const arc = new THREE.CylinderGeometry(
      1.5 + r() * 0.6,
      1.5 + r() * 0.6,
      1.8 + r() * 1.4,
      28,
      1,
      true,
      0,
      Math.PI * 0.55,
    );
    items.push({
      geometry: arc,
      material: materials.clearThin,
      position: [Math.cos(angle) * 2.3, Math.sin(angle) * 1.9, -1.4 - r() * 1.2],
      rotation: [Math.PI / 2 + r() * 0.5, r() * Math.PI, angle],
    });
  }

  for (let i = 0; i < 3; i++) {
    items.push({
      geometry: new THREE.SphereGeometry(0.32 + r() * 0.26, 32, 24),
      material: materials.clear,
      position: [
        (r() - 0.5) * 6.5,
        (r() - 0.5) * 4.5,
        -0.6 - r() * 1.6,
      ],
      rotation: [0, 0, 0],
    });
  }
  return items;
}

const VARIANTS = {
  stack: { markMaterial: "clear", markTilt: [-0.62, 0.42, 0.24], fill: 0.62 },
  shards: { markMaterial: "copper", markTilt: [0.06, -0.16, 0.04], fill: 0.5 },
  bouquet: { markMaterial: "copper", markTilt: [-0.5, 0.36, 0.5], fill: 0.52 },
};

/* ------------------------------------------------------------------ scene --- */

export function NexaGlassScene({ variant = "shards", className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const cfg = VARIANTS[variant] ?? VARIANTS.shards;
    const light = variant === "stack";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = light ? 1.05 : 1.5;
    // Every transmissive mesh costs a scene re-render; halving the resolution
    // of that pass is invisible through refraction and roughly doubles the fps.
    renderer.transmissionResolutionScale = 0.5;
    Object.assign(renderer.domElement.style, {
      display: "block",
      width: "100%",
      height: "100%",
    });
    mount.appendChild(renderer.domElement);

    const envMap = buildEnvironment(renderer, variant);
    scene.environment = envMap;

    const materials = {
      clear: clearGlass(),
      clearThin: clearGlassThin(),
      copper: copperGlass(),
    };

    const backdrop = buildBackdrop(variant);
    backdrop.position.z = -9;
    scene.add(backdrop);

    const group = new THREE.Group();
    scene.add(group);

    // The mark itself
    const markGeo = buildMarkGeometry({ depth: light ? 0.3 : 0.42 });
    const mark = new THREE.Mesh(markGeo, materials[cfg.markMaterial]);
    mark.scale.setScalar(1.55);
    group.add(mark);

    // Satellites
    const satellites = buildSatellites(variant, materials);
    const satelliteGeometries = [];
    satellites.forEach((s) => {
      const m = new THREE.Mesh(s.geometry, s.material);
      m.position.set(...s.position);
      m.rotation.set(...s.rotation);
      group.add(m);
      satelliteGeometries.push(s.geometry);
    });

    group.rotation.set(...cfg.markTilt);

    // Direct light on top of the environment sharpens the bevel edges
    const key = new THREE.DirectionalLight(0xffffff, light ? 1.6 : 2.4);
    key.position.set(3, 4, 5);
    scene.add(key);

    const warm = new THREE.DirectionalLight(0xff8a3c, light ? 0.8 : 2.0);
    warm.position.set(-4, -2, 2);
    scene.add(warm);

    scene.add(new THREE.AmbientLight(0xffffff, light ? 0.7 : 0.25));

    // --- Fit
    const bounds = new THREE.Box3().setFromObject(group);
    const radius = bounds.getBoundingSphere(new THREE.Sphere()).radius;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      camera.aspect = aspect;
      const needed = radius / (cfg.fill * 2);
      const halfHeight = aspect >= 1 ? needed : needed / aspect;
      camera.position.z = halfHeight / Math.tan(halfFov);
      camera.updateProjectionMatrix();

      // Stretch the backdrop to cover the frustum at its own depth, with a
      // margin so a leaning camera never exposes an edge
      const dist = camera.position.z - backdrop.position.z;
      const bh = 2 * Math.tan(halfFov) * dist * 1.15;
      backdrop.scale.set(bh * aspect, bh, 1);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // --- Interaction
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onPointerMove = (e) => {
      const r = mount.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      target.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let raf = null;
    const clock = new THREE.Clock();
    const base = cfg.markTilt;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;

      if (reduced) {
        group.rotation.set(base[0], base[1], base[2]);
      } else {
        group.rotation.x = base[0] + Math.sin(t * 0.18) * 0.08 + current.y * 0.28;
        group.rotation.y = base[1] + t * 0.07 + current.x * 0.45;
        group.rotation.z = base[2] + Math.sin(t * 0.13) * 0.04;
        group.position.y = Math.sin(t * 0.42) * 0.12;

        // Independent environment drift keeps the dispersion moving even
        // when the geometry is nearly still
        scene.environmentRotation.y = -t * 0.05;
      }

      renderer.render(scene, camera);
    };
    tick();

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
      markGeo.dispose();
      backdrop.geometry.dispose();
      backdrop.material.dispose();
      backdrop.userData.texture.dispose();
      satelliteGeometries.forEach((g) => g.dispose());
      materials.clear.dispose();
      materials.clearThin.dispose();
      materials.copper.dispose();
      envMap.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [variant]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
