import * as THREE from 'three';

const RIDGES = 8;
const OUTER_R = 0.45;
const INNER_R = 0.26;
const HALF_LENGTH = 1.4;
const SEGMENTS_PER_HALF = 32;
const S = RIDGES * 2;
const DIP_FRACTION = 0.32;
const DIP_SCALE = 1.05;
const WAVE_AMP = 0.1;
const WAVE_FREQ = 5;

function det(i: number): number {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function ridgeColor(i: number): [number, number, number] {
  const r = 0.56 + det(i) * 0.04;
  const g = 0.34 + det(i + 3) * 0.04;
  const b = 0.16 + det(i + 7) * 0.03;
  return [r, g, b];
}

function valleyColor(i: number): [number, number, number] {
  const r = 0.80 + det(i) * 0.04;
  const g = 0.62 + det(i + 3) * 0.04;
  const b = 0.30 + det(i + 7) * 0.03;
  return [r, g, b];
}

function capCenterColor(): [number, number, number] {
  return [0.62, 0.38, 0.18];
}

function dipColor(i: number): [number, number, number] {
  const r = 0.17 + det(i) * 0.04;
  const g = 0.06 + det(i + 3) * 0.03;
  const b = 0.02 + det(i + 7) * 0.02;
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
  star: [number, number][], x: number, t: number,
  isDip = false,
) {
  for (let i = 0; i < S; i++) {
    const [y, z] = star[i];
    pos.push(x, y, z);
    const len = Math.hypot(y, z);
    norm.push(0, y / len, z / len);
    uv.push(t, i / S);
    if (isDip) {
      const c = dipColor(i);
      col.push(c[0], c[1], c[2]);
    } else {
      const isRidge = i % 2 === 0;
      const c = isRidge ? ridgeColor(i) : valleyColor(i);
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
  isDip = false,
) {
  const center = pos.length / 3;
  pos.push(x, 0, 0);
  norm.push(reverse ? -1 : 1, 0, 0);
  uv.push(0.5, 0.5);
  const cc = isDip ? dipColor(0) : capCenterColor();
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

  writeCap(idx, pos, norm, uv, col, star, xStart, true, 0, false);
  writeCap(idx, pos, norm, uv, col, star, xEnd, false, segs * S, false);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  return geo;
}

function buildDip(): THREE.BufferGeometry {
  const star = starPoints(OUTER_R * DIP_SCALE, INNER_R * DIP_SCALE);
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];

  const dipEnd = HALF_LENGTH;
  const dipLength = HALF_LENGTH * DIP_FRACTION;
  const dipStart = dipEnd - dipLength;
  const dipSegs = Math.max(8, Math.floor(SEGMENTS_PER_HALF * DIP_FRACTION) + 4);

  for (let s = 0; s <= dipSegs; s++) {
    const t = s / dipSegs;
    const xBase = dipStart + t * dipLength;
    for (let i = 0; i < S; i++) {
      const angle = (i / S) * Math.PI * 2;
      const wave = Math.sin(angle * WAVE_FREQ) * WAVE_AMP * (1 - t);
      const x = xBase + wave;
      const [y, z] = star[i];
      pos.push(x, y, z);
      const len = Math.hypot(y, z);
      norm.push(0, y / len, z / len);
      uv.push(t, i / S);
      const c = dipColor(i);
      col.push(c[0], c[1], c[2]);
    }
  }

  for (let s = 0; s < dipSegs; s++) {
    for (let i = 0; i < S; i++) {
      const ni = (i + 1) % S;
      idx.push(s * S + i, (s + 1) * S + i, s * S + ni);
      idx.push(s * S + ni, (s + 1) * S + i, (s + 1) * S + ni);
    }
  }

  const rightRow = dipSegs * S;
  writeCap(idx, pos, norm, uv, col, star, dipEnd, false, rightRow, true);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  return geo;
}

export interface ChurroGeometries {
  leftBody: THREE.BufferGeometry;
  rightBody: THREE.BufferGeometry;
  dip: THREE.BufferGeometry;
}

export function createChurroGeometries(): ChurroGeometries {
  return {
    leftBody: buildHalfBody('left'),
    rightBody: buildHalfBody('right'),
    dip: buildDip(),
  };
}

export function generateSugarGrainPositions(
  _halfLength: number,
  star: [number, number][],
  count: number,
): Float32Array {
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  for (let g = 0; g < count; g++) {
    const x = (Math.random() - 0.5) * _halfLength * 2;
    const angle = Math.random() * Math.PI;
    const rIdx = Math.floor((angle / Math.PI) * S) % S;
    const pt = star[rIdx];
    const r = Math.hypot(pt[0], pt[1]);
    const y = ((Math.cos(angle) * OUTER_R + Math.cos(angle + Math.PI / (RIDGES * 2)) * INNER_R) / 2) * 1.06;
    const z = ((Math.sin(angle) * OUTER_R + Math.sin(angle + Math.PI / (RIDGES * 2)) * INNER_R) / 2) * 1.06;
    positions[g * 3] = x;
    positions[g * 3 + 1] = y;
    positions[g * 3 + 2] = z;
    scales[g] = 0.015 + Math.random() * 0.025;
  }
  return positions;
}
