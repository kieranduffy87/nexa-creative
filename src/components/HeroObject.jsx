import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The hero centrepiece, in three material treatments.
 *
 * The thing that makes web 3D look expensive is not geometry, it is what the
 * surface does with light. So every variant here is driven by a generated
 * environment map, and that environment slowly rotates independently of the
 * mesh — which is what keeps highlights crawling across the form even when it
 * is barely turning.
 */

const VARIANTS = {
  glass: {
    detail: 3, // chunky facets read as a cut gem rather than a smooth ball
    flatShading: true,
    displacement: 0.34,
    envIntensity: 1.7,
    spin: 0.13,
    material: () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0.06,
        transmission: 1,
        thickness: 2.4,
        ior: 1.55,
        dispersion: 4,
        attenuationColor: new THREE.Color(0xef4136),
        attenuationDistance: 1.1,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        flatShading: true,
      }),
  },

  chrome: {
    detail: 6,
    flatShading: false,
    displacement: 0.42,
    envIntensity: 1.5,
    spin: 0.16,
    material: () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xef4136,
        metalness: 1,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
      }),
  },

  mineral: {
    detail: 5,
    flatShading: true,
    displacement: 0.5,
    envIntensity: 0.9,
    spin: 0.1,
    material: () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xd4402f,
        metalness: 0.15,
        roughness: 0.72,
        clearcoat: 0.3,
        clearcoatRoughness: 0.6,
        flatShading: true,
      }),
  },
};

/**
 * Equirectangular gradient painted to a canvas, then prefiltered by PMREM.
 * Cheaper than shipping an HDR and it can be tuned to match the CSS backdrop
 * exactly, so the reflections agree with the page behind them.
 */
function buildEnvironment(renderer, dark) {
  const W = 1024;
  const H = 512;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");

  // A soft gradient reflects as a flat blob. What makes metal read as metal
  // is a hard horizon and bright softbox strips — high-contrast structure the
  // surface can smear as it turns. This is a studio HDRI, painted by hand.

  const HORIZON = H * 0.52;

  const sky = ctx.createLinearGradient(0, 0, 0, HORIZON);
  if (dark) {
    sky.addColorStop(0, "#3a3a42");
    sky.addColorStop(1, "#0e0e11");
  } else {
    sky.addColorStop(0, "#ffffff");
    sky.addColorStop(1, "#efe9e0");
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, HORIZON);

  const ground = ctx.createLinearGradient(0, HORIZON, 0, H);
  if (dark) {
    ground.addColorStop(0, "#08080a");
    ground.addColorStop(1, "#161618");
  } else {
    ground.addColorStop(0, "#b9b1a5");
    ground.addColorStop(1, "#8d857a");
  }
  ctx.fillStyle = ground;
  ctx.fillRect(0, HORIZON, W, H - HORIZON);

  // Softboxes — the bright bands that travel across the form as it rotates
  const softbox = (x, y, w, h, strength) => {
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, `rgba(255,255,255,0)`);
    g.addColorStop(0.5, `rgba(255,255,255,${strength})`);
    g.addColorStop(1, `rgba(255,255,255,0)`);
    ctx.fillStyle = g;
    ctx.filter = "blur(6px)";
    ctx.fillRect(x, y, w, h);
    ctx.filter = "none";
  };

  softbox(60, 40, 300, 120, dark ? 1 : 0.95);
  softbox(560, 90, 220, 80, dark ? 0.8 : 0.6);
  softbox(830, 20, 160, 60, dark ? 0.65 : 0.45);

  // Warm bounce so the shadow side picks up brand colour rather than going grey
  const warm = ctx.createRadialGradient(700, 340, 0, 700, 340, 300);
  warm.addColorStop(0, "rgba(239,65,54,0.6)");
  warm.addColorStop(1, "rgba(239,65,54,0)");
  ctx.fillStyle = warm;
  ctx.fillRect(0, 0, W, H);

  // A cool counter-bounce keeps the reds from flattening into one hue
  const cool = ctx.createRadialGradient(240, 300, 0, 240, 300, 240);
  cool.addColorStop(0, "rgba(120,150,200,0.28)");
  cool.addColorStop(1, "rgba(120,150,200,0)");
  ctx.fillStyle = cool;
  ctx.fillRect(0, 0, W, H);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;

  pmrem.dispose();
  tex.dispose();
  return env;
}

export function HeroObject({ variant = "glass", dark = false, className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const cfg = VARIANTS[variant] ?? VARIANTS.glass;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = dark ? 1.35 : 1.05;
    Object.assign(renderer.domElement.style, {
      display: "block",
      width: "100%",
      height: "100%",
    });
    mount.appendChild(renderer.domElement);

    const envMap = buildEnvironment(renderer, dark);
    scene.environment = envMap;

    // --- Geometry: layered sines give an organic, bounded silhouette
    const BASE = 1.35;
    const geometry = new THREE.IcosahedronGeometry(BASE, cfg.detail);
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
      v.setLength(BASE + d * cfg.displacement);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geometry.deleteAttribute("normal");
    geometry.computeVertexNormals();

    const material = cfg.material();
    material.envMapIntensity = cfg.envIntensity;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // A little direct light on top of the environment keeps edges crisp
    const key = new THREE.DirectionalLight(0xffffff, dark ? 2.2 : 1.4);
    key.position.set(3, 4, 4);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xffd9d4, 1.2);
    rim.position.set(-4, 1.5, -3);
    scene.add(rim);

    // --- Fit the camera so the form is a fixed fraction of the frame
    const RADIUS = BASE + cfg.displacement * 0.77;
    const FILL = 0.8;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      camera.aspect = aspect;
      const needed = RADIUS / FILL;
      const halfHeight = aspect >= 1 ? needed : needed / aspect;
      camera.position.z = halfHeight / Math.tan(halfFov);
      camera.updateProjectionMatrix();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onPointerMove = (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let raf = null;
    const clock = new THREE.Clock();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      current.x += (target.x - current.x) * 0.045;
      current.y += (target.y - current.y) * 0.045;

      if (reduced) {
        mesh.rotation.set(0.2, 0.6, 0);
      } else {
        mesh.rotation.y = t * cfg.spin + current.x * 0.5;
        mesh.rotation.x = Math.sin(t * 0.23) * 0.14 + current.y * 0.32;
        mesh.rotation.z = Math.sin(t * 0.17) * 0.06;
        mesh.position.y = Math.sin(t * 0.5) * 0.07;

        // Counter-rotating environment: highlights travel across the surface
        // on their own clock, so the form never looks like a static texture.
        scene.environmentRotation.y = -t * 0.06;
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
      geometry.dispose();
      material.dispose();
      envMap.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [variant, dark]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
