// The studio: seven holographic layers that make one instrument (hud.ts draws each layer's part of the dial), in a
// dark room with particles. Each motion has one job:
//   load     each layer arrives from its own angle and materialises under a scan line, oldest first
//   scroll   the instrument comes apart along one axis and the camera stops at one role at a time; particles stream
//            up the axis with you; at the AI layer the room turns to night and the particles draw the whole dial
//            as stars; at the end the layers close into one face with an empty slot on top
//   pointer  the camera leans a few degrees toward the pointer; a proof in the hero lifts its own layer out
// Nothing moves on its own: it renders only while something is changing.
import * as THREE from 'three';
import { drawLayer, brightPoints } from './hud';

type Layer = { id: string; root: THREE.Group; plane: THREE.Mesh; u: Record<string, THREE.IUniform>; entry: THREE.Vector3 };
type Key = { pos: THREE.Vector3; gap: number; cam: THREE.Vector3; look: THREE.Vector3; focus: number; stream: number; night: number; ghost: number };

const SIZE = { w: 3.6, d: 2.4 };
const HERO_GAP = 0.26;
const OPEN = 1.05;
const SHUT = 0.05;
const YAW = -0.62;
const N_STREAM = 900;
const N_STARS = 900;

const clamp = (t: number) => Math.min(1, Math.max(0, t));
const smooth = (t: number) => t * t * (3 - 2 * t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const HOLO_VERT = /* glsl */ `
  varying vec2 vUv;
  varying float vFres;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    vFres = pow(1.0 - abs(dot(n, normalize(-mv.xyz))), 2.0);
    gl_Position = projectionMatrix * mv;
  }`;
const HOLO_FRAG = /* glsl */ `
  uniform sampler2D uFace;
  uniform sampler2D uLabel;
  uniform vec3 uTint;
  uniform float uOpacity;
  uniform float uGlow;
  uniform float uLabelA;
  uniform float uReveal;
  uniform float uBody;
  uniform float uDash;
  varying vec2 vUv;
  varying float vFres;
  void main() {
    float r = 1.0 - vUv.y;                       // materialises top to bottom
    if (r > uReveal + 0.001) discard;
    vec4 f = texture2D(uFace, vUv);
    vec4 l = texture2D(uLabel, vUv);
    float scan = 0.8 + 0.2 * step(0.5, fract(vUv.y * 190.0));
    vec2 e = abs(vUv - 0.5) * 2.0;
    float frame = max(smoothstep(0.988, 1.0, e.x), smoothstep(0.982, 1.0, e.y));
    float along = e.x > 0.988 ? vUv.y * 64.0 : vUv.x * 96.0;
    frame *= mix(1.0, step(0.45, fract(along)), uDash); // the unfinished layer's frame is dashed
    float corner = step(0.88, e.x) * step(0.82, e.y) * frame;
    float body = uBody * (0.55 + 0.9 * vFres);
    float sweep = smoothstep(0.02, 0.0, abs(r - uReveal)) * (1.0 - step(0.999, uReveal));
    vec3 col = uTint * (body + frame * 0.32 + corner * 0.7)
             + f.rgb * f.a * uGlow * scan
             + l.rgb * l.a * uLabelA
             + vec3(0.75, 1.0, 0.96) * sweep;
    gl_FragColor = vec4(col * uOpacity, 1.0);
  }`;
const DOT_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  uniform float uPx;
  varying float vA;
  varying vec3 vC;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPx / -mv.z;
    vA = aAlpha;
    vC = aColor;
  }`;
const DOT_FRAG = /* glsl */ `
  varying float vA;
  varying vec3 vC;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vC * a * a * vA, 1.0);
  }`;

function radial(inner: string, outer: string, size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gr.addColorStop(0, inner);
  gr.addColorStop(1, outer);
  g.fillStyle = gr;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function dots(n: number) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(n), 1));
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(n), 1));
  geo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  const mat = new THREE.ShaderMaterial({
    vertexShader: DOT_VERT,
    fragmentShader: DOT_FRAG,
    uniforms: { uPx: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  return { pts, geo, mat };
}

export async function mountStudio(stage: HTMLElement, canvas: HTMLCanvasElement, sources: HTMLElement[], featured: string[]) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.setClearColor('#04080a');
  const aniso = renderer.capabilities.getMaxAnisotropy();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);
  scene.add(camera);
  // two backdrops that travel with the camera: the studio, and the night it turns into at the AI layer
  const backdrop = (inner: string, outer: string) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: radial(inner, outer), transparent: true, depthWrite: false, toneMapped: false }));
    m.position.z = -60;
    camera.add(m);
    return m;
  };
  const studioBg = backdrop('#14262a', '#04080a');
  const nightBg = backdrop('#11463d', '#03100d');
  studioBg.renderOrder = -2;
  nightBg.renderOrder = -1;

  const group = new THREE.Group();
  group.rotation.y = YAW;
  scene.add(group);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({ map: radial('rgba(99,214,200,0.2)', 'rgba(99,214,200,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }),
  );
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  const planeGeo = new THREE.PlaneGeometry(SIZE.w, SIZE.d);
  planeGeo.rotateX(-Math.PI / 2);
  const tex = (c: HTMLCanvasElement) => {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = aniso;
    return t;
  };
  const faces: HTMLCanvasElement[] = [];
  const layers: Layer[] = sources.map((src, i) => {
    const { face, label } = drawLayer(src.dataset.id!);
    faces.push(face);
    const [r, g, b] = (src.dataset.tint ?? '150,200,190').split(',').map((v) => Number(v) / 255);
    const u = {
      uFace: { value: tex(face) },
      uLabel: { value: tex(label) },
      uTint: { value: new THREE.Color(r, g, b).lerp(new THREE.Color('#bff3ec'), 0.5) },
      uOpacity: { value: 1 },
      uGlow: { value: 1 },
      uLabelA: { value: 0 },
      uReveal: { value: 0 },
      uBody: { value: 0.05 },
      uDash: { value: src.dataset.progress === '1' ? 1 : 0 },
    };
    const plane = new THREE.Mesh(
      planeGeo,
      new THREE.ShaderMaterial({ vertexShader: HOLO_VERT, fragmentShader: HOLO_FRAG, uniforms: u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
    );
    plane.userData.id = src.dataset.id;
    plane.renderOrder = 1;
    const root = new THREE.Group();
    root.add(plane);
    group.add(root);
    const a = (i * 137.5 * Math.PI) / 180;
    return { id: src.dataset.id!, root, plane, u, entry: new THREE.Vector3(Math.cos(a) * 3.4, 1.2, Math.sin(a) * 3.4) };
  });
  const n = layers.length;

  // the empty slot on top, "your team is the next layer": a dashed frame, nothing drawn in it yet
  const ghostU = {
    uFace: { value: new THREE.Texture() },
    uLabel: { value: new THREE.Texture() },
    uTint: { value: new THREE.Color('#dff9f4') },
    uOpacity: { value: 0 },
    uGlow: { value: 0 },
    uLabelA: { value: 0 },
    uReveal: { value: 1 },
    uBody: { value: 0.02 },
    uDash: { value: 1 },
  };
  const ghost = new THREE.Mesh(planeGeo, new THREE.ShaderMaterial({ vertexShader: HOLO_VERT, fragmentShader: HOLO_FRAG, uniforms: ghostU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
  group.add(ghost);

  // particles: a stream up the axis, which gathers into the whole dial at night; and stars
  const stream = dots(N_STREAM);
  group.add(stream.pts);
  const seeds = Array.from({ length: N_STREAM }, () => [Math.random(), Math.random(), Math.random()]);
  const all = faces.flatMap((f, layer) => brightPoints(f, 7).map(([u, v]) => [u, v, layer] as [number, number, number]));
  const dial = Array.from({ length: N_STREAM }, () => all[Math.floor(Math.random() * all.length)]);
  const sColor = stream.geo.getAttribute('aColor') as THREE.BufferAttribute;
  const sSize = stream.geo.getAttribute('aSize') as THREE.BufferAttribute;
  seeds.forEach(([a, b], i) => {
    const amber = b > 0.985;
    sColor.setXYZ(i, amber ? 1 : 0.6 + 0.3 * a, amber ? 0.7 : 0.95, amber ? 0.3 : 0.92);
    sSize.setX(i, 0.035 + 0.05 * a);
  });
  const stars = dots(N_STARS);
  scene.add(stars.pts);
  const starPos = stars.geo.getAttribute('position') as THREE.BufferAttribute;
  const starA = stars.geo.getAttribute('aAlpha') as THREE.BufferAttribute;
  const starBase = new Float32Array(N_STARS);
  for (let i = 0; i < N_STARS; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(30 + Math.random() * 30);
    starPos.setXYZ(i, v.x, v.y, v.z);
    (stars.geo.getAttribute('aSize') as THREE.BufferAttribute).setX(i, 0.12 + Math.random() * 0.22);
    (stars.geo.getAttribute('aColor') as THREE.BufferAttribute).setXYZ(i, 0.85, 0.97, 1);
    starBase[i] = 0.25 + Math.random() * 0.75;
  }

  const localY = (i: number, gap: number) => (i - (n - 1) / 2) * gap;
  const tmp = new THREE.Object3D();
  tmp.rotation.y = YAW;
  const world = (pos: THREE.Vector3, i: number, gap: number) => {
    tmp.position.copy(pos);
    tmp.updateMatrixWorld();
    return new THREE.Vector3(0, localY(i, gap), 0).applyMatrix4(tmp.matrixWorld);
  };

  // keyframes: hero (closed, to the right of the copy), one per featured role, night at the AI layer, closed into one face
  const heroPos = new THREE.Vector3(1.45, 0.1, 0);
  const openPos = new THREE.Vector3(1.2, 0, 0);
  const K = (pos: THREE.Vector3, gap: number, cam: THREE.Vector3, look: THREE.Vector3, o: Partial<Key> = {}): Key => ({ pos, gap, cam, look, focus: -1, stream: 0, night: 0, ghost: 0, ...o });
  const keys: Key[] = [
    // high enough that the dial face reads as a dial, low enough that the layers still show as layers
    K(heroPos, HERO_GAP, new THREE.Vector3(3.65, 12.5, 8.0), new THREE.Vector3(-1.05, -0.6, 0), { stream: 0.35 }),
  ];
  featured.forEach((id) => {
    const i = layers.findIndex((l) => l.id === id);
    const look = world(openPos, i, OPEN).add(new THREE.Vector3(-2.3, -0.2, 0));
    keys.push(K(openPos, OPEN, look.clone().add(new THREE.Vector3(4.4, 5.2, 10.2)), look, { focus: i, stream: 1 }));
  });
  const top = world(openPos, n - 1, OPEN);
  const nightCam = top.clone().addScaledVector(new THREE.Vector3(0.1, 1, 0.42).normalize(), 10.5);
  const nightRight = new THREE.Vector3().crossVectors(top.clone().sub(nightCam).normalize(), new THREE.Vector3(0, 1, 0)).normalize();
  keys.push(K(openPos, OPEN, nightCam, top.clone().addScaledVector(nightRight, -1.7), { night: 1 }));
  keys.push(K(new THREE.Vector3(1.4, -0.2, 0), SHUT, new THREE.Vector3(3.6, 8.6, 7.6), new THREE.Vector3(-0.4, -0.4, 0), { ghost: 1 }));

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let tTarget = 0;
  let tNow = 0;
  let boot = -1;
  let raf = 0;
  let shown = true; // false while a daylight section covers the whole stage
  let hiK = -1; // the layer a proof in the hero points at (hover or focus), or none
  const hiW = new Float32Array(n);

  const resize = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const bh = 2 * 60 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.3;
    [studioBg, nightBg].forEach((m) => m.scale.set(bh * camera.aspect, bh, 1));
    const px = h * renderer.getPixelRatio() * 0.9;
    stream.mat.uniforms.uPx.value = px;
    stars.mat.uniforms.uPx.value = px;
    wake();
  };

  const draw = (now: number) => {
    const i = Math.min(keys.length - 2, Math.max(0, Math.floor(tNow)));
    const e = smooth(clamp((tNow - i - 0.12) / 0.76));
    const A = keys[i];
    const B = keys[i + 1];
    const mix = (k: 'gap' | 'night' | 'stream' | 'ghost') => A[k] * (1 - e) + B[k] * e;
    const gap = mix('gap');
    const night = mix('night');
    const streamW = mix('stream');
    const ghostW = mix('ghost');
    group.position.lerpVectors(A.pos, B.pos, e);
    const focusW = (k: number) => (A.focus === k ? 1 - e : 0) + (B.focus === k ? e : 0);
    const anyFocus = (A.focus >= 0 ? 1 - e : 0) + (B.focus >= 0 ? e : 0);

    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;
    const look = new THREE.Vector3().lerpVectors(A.look, B.look, e);
    camera.position.lerpVectors(A.cam, B.cam, e);
    camera.lookAt(look);
    camera.position.add(new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).multiplyScalar(pointer.x * 0.5));
    camera.position.add(new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).multiplyScalar(pointer.y * 0.3));
    camera.lookAt(look);
    group.updateMatrixWorld();
    const camLocal = group.worldToLocal(camera.position.clone());

    // a proof in the hero under the pointer or focused: its layer lifts out of the stack and shows its callout
    let hiAny = 0;
    let hiMoving = false;
    for (let k = 0; k < n; k++) {
      const to = k === hiK ? 1 : 0;
      hiW[k] += (to - hiW[k]) * 0.14;
      if (Math.abs(to - hiW[k]) > 0.002) hiMoving = true;
      hiAny = Math.max(hiAny, hiW[k]);
    }

    let booting = false;
    layers.forEach((l, k) => {
      l.root.position.set(0, localY(k, gap), 0);
      let reveal = 0;
      let bootA = 0;
      if (boot >= 0) {
        const s = (now - boot) / 1000 - k * 0.11;
        if (s < 1.4) booting = true;
        l.root.position.addScaledVector(l.entry, 1 - easeOut(clamp(s / 0.9)));
        reveal = clamp((s - 0.25) / 0.55);
        bootA = clamp(s / 0.3);
      }
      // a featured role comes forward and turns toward you; the others step back
      const w = Math.max(focusW(k), hiW[k]);
      if (w > 0) l.root.position.addScaledVector(camLocal.clone().sub(l.root.position).normalize(), 0.9 * w);
      l.root.rotation.x = -0.18 * w;
      const dim = 1 - 0.72 * Math.max(anyFocus, hiAny) * (1 - w);
      l.u.uReveal.value = reveal;
      l.u.uOpacity.value = bootA * dim * (1 - 0.82 * night);
      l.u.uGlow.value = 1 + 0.55 * w;
      l.u.uBody.value = 0.045 + 0.09 * w;
      l.u.uLabelA.value = w;
    });
    floor.position.y = localY(0, gap) - 0.55;
    ghost.position.set(0, localY(n - 1, gap) + 0.55, 0);
    ghostU.uOpacity.value = 0.9 * ghostW;
    (nightBg.material as THREE.MeshBasicMaterial).opacity = night;

    // the stream rises with your scroll; at night it gathers into the whole dial, drawn on the top layer
    const sp = stream.geo.getAttribute('position') as THREE.BufferAttribute;
    const sa = stream.geo.getAttribute('aAlpha') as THREE.BufferAttribute;
    const lo = localY(0, gap) - 0.4;
    const hi = localY(n - 1, gap) + 0.6;
    const topY = localY(n - 1, gap);
    const live = boot >= 0 ? clamp((now - boot) / 1000 - 0.6) : 0;
    if (live < 1) booting = booting || boot >= 0;
    for (let p = 0; p < N_STREAM; p++) {
      const [a, b, c] = seeds[p];
      const s = (a + tNow * 0.16) % 1;
      const rad = 0.2 + 1.5 * Math.pow(b, 1.6);
      const ang = c * Math.PI * 2 + s * 1.4;
      const sx = Math.cos(ang) * rad;
      const sz = Math.sin(ang) * rad;
      const sy = lo + (hi - lo) * s;
      const g = smooth(clamp((Math.max(night, ghostW) - 0.25 * a) / 0.75));
      const home = smooth(clamp((ghostW - 0.15 * a) / 0.85));
      const [du, dv, layer] = dial[p];
      const dx = (du - 0.5) * SIZE.w;
      const dz = -(dv - 0.5) * SIZE.d;
      const dy = topY + 0.02 + (localY(layer, gap) + 0.02 - topY - 0.02) * home;
      sp.setXYZ(p, sx + (dx - sx) * g, sy + (dy - sy) * g, sz + (dz - sz) * g);
      const along = Math.sin(Math.PI * s);
      const settle = 1 - smooth(clamp((ghostW - 0.6) / 0.4));
      sa.setX(p, live * Math.max(streamW * along * (0.35 + 0.5 * b), g * 0.95 * settle));
    }
    sp.needsUpdate = true;
    sa.needsUpdate = true;
    for (let p = 0; p < N_STARS; p++) starA.setX(p, starBase[p] * (0.16 + 0.8 * night) * live);
    starA.needsUpdate = true;

    renderer.render(scene, camera);
    return booting || hiMoving || Math.abs(tTarget - tNow) > 0.0005 || Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.002;
  };

  const frame = (now: number) => {
    raf = 0;
    tNow += (tTarget - tNow) * 0.12;
    if (draw(now)) raf = requestAnimationFrame(frame);
  };
  function wake() {
    if (!raf && shown) raf = requestAnimationFrame(frame);
  }

  new ResizeObserver(resize).observe(stage);
  resize();
  addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      pointer.tx = (e.clientX / innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / innerHeight) * 2 - 1);
      wake();
    },
    { passive: true },
  );

  return {
    boot() {
      boot = performance.now();
      wake();
    },
    // lift one layer out of the hero stack (a proof in the grid points at it), or settle it back with null
    point(id: string | null) {
      hiK = id ? layers.findIndex((l) => l.id === id) : -1;
      wake();
    },
    // stop drawing while nothing can see it
    show(v: boolean) {
      shown = v;
      wake();
    },
    // t runs 0 → keys − 1 across the pinned scroll
    setT(t: number, instant = false) {
      tTarget = t;
      if (instant) tNow = t;
      wake();
    },
    // which layer is under the pointer (to open its story)
    pick(x: number, y: number): string | null {
      const r = canvas.getBoundingClientRect();
      ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(layers.map((l) => l.plane), false)[0];
      return hit ? (hit.object.userData.id as string) : null;
    },
    keys: keys.length,
  };
}
