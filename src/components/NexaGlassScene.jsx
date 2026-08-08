import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

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
  // Bevel scales with the slab so big pieces get the fat, pillowy edge the
  // references have rather than a hairline chamfer
  const bevel = Math.min(0.14, thickness * 0.55, radius * 0.6);
  const geo = new THREE.ExtrudeGeometry(roundedRectShape(w, h, radius), {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 8,
    curveSegments: 16,
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
    core.addColorStop(0, "rgba(255,180,130,0.6)");
    core.addColorStop(0.3, "rgba(255,110,50,0.32)");
    core.addColorStop(1, "rgba(120,35,10,0)");
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, W, H);
  }

  const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.72);
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
    dispersion: 14,
    iridescence: 0.55,
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

const frostedGlass = () =>
  new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.42,
    transmission: 1,
    thickness: 0.5,
    ior: 1.5,
    dispersion: 3,
    iridescence: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.35,
    envMapIntensity: 2.4,
  });

const frostedCopper = () => {
  const m = frostedGlass();
  m.attenuationColor = new THREE.Color(0xff6a2e);
  m.attenuationDistance = 3.2;
  m.thickness = 0.9;
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
    dispersion: 11,
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

  // Pieces are deliberately pushed past the frame edge. The references are
  // extreme close-ups where nothing is fully contained, and that cropping is
  // most of why they feel like a photograph rather than a diagram.

  if (variant === "stack") {
    // Chunky tiles lying in a shared plane, overlapping like scattered glass
    const layout = [
      [-4.6, 2.9, 3.4, 3.4, 0],
      [0.2, 3.9, 5.0, 2.0, 0],
      [5.2, 3.1, 4.0, 3.0, 1],
      [-5.4, -1.4, 4.2, 2.7, 0],
      [4.7, -2.3, 4.4, 3.4, 1],
      [-1.1, -4.3, 5.2, 2.3, 2],
      [2.7, -5.2, 3.2, 2.6, 0],
      [-3.4, 0.6, 2.6, 2.6, 2],
    ];
    layout.forEach(([x, y, w, h, kind], i) => {
      items.push({
        geometry: plateGeometry(w, h, 0.5, 0.55),
        material:
          kind === 1
            ? materials.copper
            : kind === 2
              ? materials.frosted
              : materials.clear,
        position: [x, y, -0.7 - i * 0.14],
        rotation: [0, 0, 0],
      });
    });
    return items;
  }

  if (variant === "shards") {
    // Angular fragments at loose orientations, crowding in around the mark
    for (let i = 0; i < 14; i++) {
      const w = 1.6 + r() * 4.2;
      const h = 1.3 + r() * 3.4;
      const angle = (i / 14) * Math.PI * 2 + r() * 0.6;
      const dist = 4.6 + r() * 3.2;
      const pick = r();
      items.push({
        geometry: plateGeometry(w, h, 0.24, 0.12),
        material:
          pick > 0.72
            ? materials.copper
            : pick > 0.55
              ? materials.frostedCopper
              : materials.clear,
        position: [
          Math.cos(angle) * dist,
          Math.sin(angle) * dist * 0.78,
          -2.2 - r() * 3.6,
        ],
        rotation: [r() * 1.5 - 0.75, r() * 1.5 - 0.75, r() * Math.PI],
      });
    }
    return items;
  }

  // bouquet — curved lenses radiating outward, with clear spheres between them
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    const arc = new THREE.CylinderGeometry(
      2.6 + r() * 1.2,
      2.6 + r() * 1.2,
      3.4 + r() * 2.4,
      36,
      1,
      true,
      0,
      Math.PI * 0.5,
    );
    items.push({
      geometry: arc,
      material: r() > 0.75 ? materials.frosted : materials.clearThin,
      position: [Math.cos(angle) * 4.6, Math.sin(angle) * 3.8, -2.6 - r() * 2.2],
      rotation: [Math.PI / 2 + r() * 0.5, r() * Math.PI, angle],
    });
  }

  for (let i = 0; i < 5; i++) {
    items.push({
      geometry: new THREE.SphereGeometry(0.55 + r() * 0.55, 40, 28),
      material: materials.clear,
      position: [(r() - 0.5) * 12, (r() - 0.5) * 8.5, -1.6 - r() * 2.6],
      rotation: [0, 0, 0],
    });
  }
  return items;
}

const VARIANTS = {
  stack: { markMaterial: "clear", markTilt: [-0.62, 0.42, 0.24], fill: 0.86 },
  shards: { markMaterial: "copper", markTilt: [0.06, -0.16, 0.04], fill: 0.8 },
  bouquet: { markMaterial: "copper", markTilt: [-0.5, 0.36, 0.5], fill: 0.84 },
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
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = light ? 1.0 : 1.25;
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

    // Bloom is doing a lot of the "this was rendered offline" work: hot
    // specular edges bleed light the way they do in a path tracer.
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      light ? 0.22 : 0.55, // strength
      0.7, // radius
      light ? 0.95 : 0.84, // threshold
    );
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    const materials = {
      clear: clearGlass(),
      clearThin: clearGlassThin(),
      copper: copperGlass(),
      frosted: frostedGlass(),
      frostedCopper: frostedCopper(),
    };

    const backdrop = buildBackdrop(variant);
    backdrop.position.z = -9;
    scene.add(backdrop);

    const group = new THREE.Group();
    scene.add(group);

    // The mark itself
    const markGeo = buildMarkGeometry({ depth: light ? 0.3 : 0.42 });
    const mark = new THREE.Mesh(markGeo, materials[cfg.markMaterial]);
    mark.scale.setScalar(2.25);
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
      composer.setSize(w, h);
      bloom.setSize(w, h);
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

      composer.render();
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
      Object.values(materials).forEach((m) => m.dispose());
      envMap.dispose();
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [variant]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
