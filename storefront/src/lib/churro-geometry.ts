import * as THREE from 'three';

const RIDGES = 9; // Star shape points
const OUTER_R = 0.45;
const INNER_R = 0.22;
const HALF_LENGTH = 1.6;
const SEGMENTS_PER_HALF = 128; // Massive increase for displacement realism
const S = RIDGES * 2;
const DIP_FRACTION = 0.35;
const DIP_SCALE = 1.0;
const WAVE_AMP = 0.12;
const WAVE_FREQ = 6;

// Simplex noise inspired pseudo-random 3D noise for organic displacement
function hash(n: number) {
  const x = Math.sin(n) * 43758.5453;
  return x - Math.floor(x);
}

function noise3D(x: number, y: number, z: number) {
  const p = new THREE.Vector3(x, y, z);
  const i = new THREE.Vector3(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z));
  const f = new THREE.Vector3(p.x - i.x, p.y - i.y, p.z - i.z);
  
  // smoothstep
  const u = new THREE.Vector3(
    f.x * f.x * (3.0 - 2.0 * f.x),
    f.y * f.y * (3.0 - 2.0 * f.y),
    f.z * f.z * (3.0 - 2.0 * f.z)
  );

  const n = i.x + i.y * 57.0 + i.z * 113.0;

  const res = THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(hash(n + 0.0), hash(n + 1.0), u.x),
      THREE.MathUtils.lerp(hash(n + 57.0), hash(n + 58.0), u.x),
      u.y
    ),
    THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(hash(n + 113.0), hash(n + 114.0), u.x),
      THREE.MathUtils.lerp(hash(n + 170.0), hash(n + 171.0), u.x),
      u.y
    ),
    u.z
  );
  return res * 2.0 - 1.0;
}

function fbm(x: number, y: number, z: number, octaves = 4) {
  let total = 0;
  let frequency = 1;
  let amplitude = 1;
  let maxValue = 0;
  for (let i = 0; i < octaves; i++) {
    total += noise3D(x * frequency, y * frequency, z * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return total / maxValue;
}

// Organic vertex displacement
function displace(x: number, y: number, z: number): [number, number, number] {
  // Low frequency wiggles (bent churro shape)
  const bendY = Math.sin(x * 1.5) * 0.04;
  const bendZ = Math.cos(x * 2.0) * 0.03;
  
  // High frequency bumps for crispy texture
  const n = fbm(x * 8, y * 8, z * 8, 3) * 0.025;
  
  // Add noise along the normal (which is roughly [0, y/r, z/r])
  const r = Math.hypot(y, z) || 1;
  const nx = 0;
  const ny = y / r;
  const nz = z / r;

  return [
    x,
    y + bendY + ny * n,
    z + bendZ + nz * n
  ];
}

// Base colors using vertex colors to add subtle baking variations (browns and golds)
function bakeColor(x: number, y: number, z: number, isRidge: boolean): [number, number, number] {
  // Bake intensity based on noise and ridge vs valley
  let intensity = fbm(x * 3, y * 3, z * 3, 2) * 0.5 + 0.5;
  if (isRidge) {
    // Ridges are slightly darker/crispier
    intensity *= 0.8;
  } else {
    // Valleys are lighter
    intensity *= 1.2;
  }

  const r = THREE.MathUtils.lerp(0.45, 0.85, intensity);
  const g = THREE.MathUtils.lerp(0.25, 0.60, intensity);
  const b = THREE.MathUtils.lerp(0.10, 0.30, intensity);

  return [r, g, b];
}

function internalColor(x: number, y: number, z: number): [number, number, number] {
  let intensity = fbm(x * 10, y * 10, z * 10, 3) * 0.5 + 0.5;
  const r = THREE.MathUtils.lerp(0.85, 0.95, intensity);
  const g = THREE.MathUtils.lerp(0.70, 0.85, intensity);
  const b = THREE.MathUtils.lerp(0.45, 0.60, intensity);
  return [r, g, b];
}

function starPoints(outer = OUTER_R, inner = INNER_R): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < RIDGES; i++) {
    const outerAng = (i / RIDGES) * Math.PI * 2;
    const innerAng = outerAng + Math.PI / RIDGES;
    pts.push([Math.cos(outerAng) * outer, Math.sin(outerAng) * outer]);
    pts.push([Math.cos(innerAng) * inner, Math.sin(innerAng) * inner]);
  }
  return pts;
}

function writeSection(
  pos: number[], norm: number[], uv: number[], col: number[],
  star: [number, number][], x: number, t: number, isInternal = false
) {
  for (let i = 0; i < S; i++) {
    const [y, z] = star[i];
    const [dx, dy, dz] = displace(x, y, z);
    
    pos.push(dx, dy, dz);
    uv.push(t, i / S);
    
    // Normals will be recomputed later using computeVertexNormals, but we set dummies here
    norm.push(0, y, z); 

    if (isInternal) {
      const c = internalColor(dx, dy, dz);
      col.push(c[0], c[1], c[2]);
    } else {
      const isRidge = i % 2 === 0;
      const c = bakeColor(dx, dy, dz, isRidge);
      col.push(c[0], c[1], c[2]);
    }
  }
}

function writeQuads(idx: number[], rowA: number, rowB: number) {
  for (let i = 0; i < S; i++) {
    const ni = (i + 1) % S;
    idx.push(rowA + i, rowB + i, rowA + ni);
    idx.push(rowA + ni, rowB + i, rowB + ni);
  }
}

function writeCap(
  idx: number[], pos: number[], norm: number[], uv: number[], col: number[],
  star: [number, number][], x: number, reverse: boolean, sectionStart: number,
  isInternal = false
) {
  const center = pos.length / 3;
  const [dx, dy, dz] = displace(x, 0, 0);
  
  pos.push(dx, dy, dz);
  norm.push(reverse ? -1 : 1, 0, 0);
  uv.push(0.5, 0.5);
  
  const cc = isInternal ? internalColor(dx, dy, dz) : bakeColor(dx, dy, dz, false);
  col.push(cc[0], cc[1], cc[2]);
  
  for (let i = 0; i < S; i++) {
    const ni = (i + 1) % S;
    if (reverse) {
      idx.push(center, sectionStart + ni, sectionStart + i);
    } else {
      idx.push(center, sectionStart + i, sectionStart + ni);
    }
  }
}

// Builds the very rugged broken surface at the crack
function writeRuggedCap(
  idx: number[], pos: number[], norm: number[], uv: number[], col: number[],
  star: [number, number][], x: number, reverse: boolean, sectionStart: number
) {
  const center = pos.length / 3;
  
  // Center point pushed deeply into or out of the mesh to create a "torn" look
  const tearDepth = reverse ? -0.3 : 0.3;
  const cx = x + tearDepth + fbm(x*10, 0, 0, 3)*0.1;
  pos.push(cx, 0, 0);
  norm.push(reverse ? -1 : 1, 0, 0);
  uv.push(0.5, 0.5);
  
  const cc = internalColor(cx, 0, 0);
  col.push(cc[0], cc[1], cc[2]);

  // Insert a middle ring for more geometric detail on the broken face
  const midRingStart = pos.length / 3;
  for (let i = 0; i < S; i++) {
    const [y, z] = star[i];
    // Scale inward by 50%
    const my = y * 0.5;
    const mz = z * 0.5;
    // Add noise to the depth of the crack
    const nx = x + tearDepth * 0.5 + fbm(x*15, my*15, mz*15, 3)*0.15;
    pos.push(nx, my, mz);
    norm.push(reverse ? -1 : 1, 0, 0);
    uv.push(0.5, 0.5);
    const c = internalColor(nx, my, mz);
    col.push(c[0], c[1], c[2]);
  }

  // Connect outer ring to mid ring
  for (let i = 0; i < S; i++) {
    const ni = (i + 1) % S;
    if (reverse) {
      idx.push(sectionStart + i, sectionStart + ni, midRingStart + i);
      idx.push(sectionStart + ni, midRingStart + ni, midRingStart + i);
    } else {
      idx.push(sectionStart + i, midRingStart + i, sectionStart + ni);
      idx.push(sectionStart + ni, midRingStart + i, midRingStart + ni);
    }
  }

  // Connect mid ring to center
  for (let i = 0; i < S; i++) {
    const ni = (i + 1) % S;
    if (reverse) {
      idx.push(center, midRingStart + ni, midRingStart + i);
    } else {
      idx.push(center, midRingStart + i, midRingStart + ni);
    }
  }
}


function buildHalfBody(side: 'left' | 'right'): THREE.BufferGeometry {
  const star = starPoints();
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];

  const xStart = side === 'left' ? -HALF_LENGTH : 0;
  const xEnd = side === 'left' ? 0 : HALF_LENGTH;
  const segs = SEGMENTS_PER_HALF;

  for (let s = 0; s <= segs; s++) {
    const t = s / segs;
    const x = xStart + t * (xEnd - xStart);
    writeSection(pos, norm, uv, col, star, x, t, false);
  }

  for (let s = 0; s < segs; s++) {
    writeQuads(idx, s * S, (s + 1) * S);
  }

  if (side === 'left') {
    writeCap(idx, pos, norm, uv, col, star, xStart, true, 0, false);
    writeRuggedCap(idx, pos, norm, uv, col, star, xEnd, false, segs * S);
  } else {
    writeRuggedCap(idx, pos, norm, uv, col, star, xStart, true, 0);
    writeCap(idx, pos, norm, uv, col, star, xEnd, false, segs * S, false);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  
  // Very important: Recompute normals based on the actual displaced vertices!
  geo.computeVertexNormals();
  return geo;
}

export interface ChurroGeometries {
  leftBody: THREE.BufferGeometry;
  rightBody: THREE.BufferGeometry;
}

export function createChurroGeometries(): ChurroGeometries {
  return {
    leftBody: buildHalfBody('left'),
    rightBody: buildHalfBody('right'),
  };
}

export function generateSugarGrainPositions(
  _halfLength: number,
  count: number,
  side: 'left' | 'right'
): { positions: Float32Array; scales: Float32Array } {
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const star = starPoints();
  
  const xStart = side === 'left' ? -HALF_LENGTH : 0;
  const xEnd = side === 'left' ? 0 : HALF_LENGTH;

  for (let g = 0; g < count; g++) {
    const x = xStart + Math.random() * (xEnd - xStart);
    const angle = Math.random() * Math.PI * 2;
    const rIdx = Math.floor((angle / (Math.PI * 2)) * S) % S;
    const pt = star[rIdx];
    
    // Roughly approximate position on the displaced mesh
    const y = pt[0];
    const z = pt[1];
    const [dx, dy, dz] = displace(x, y, z);

    // Push sugar out along normal slightly
    const r = Math.hypot(dy, dz) || 1;
    const nx = 0;
    const ny = dy / r;
    const nz = dz / r;

    positions[g * 3] = dx + nx * 0.02;
    positions[g * 3 + 1] = dy + ny * 0.02;
    positions[g * 3 + 2] = dz + nz * 0.02;
    
    scales[g] = 0.01 + Math.random() * 0.02; // Tiny sugar crystals
  }
  return { positions, scales };
}
