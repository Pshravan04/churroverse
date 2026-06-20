import * as THREE from 'three';

const RIDGES = 8;
const OUTER_R = 0.5;
const INNER_R = 0.3;
const HALF_LENGTH = 1.25;
const SEGMENTS_PER_HALF = 28;
const S = RIDGES * 2;
const DIP_FRACTION = 0.35;
const DIP_SCALE = 1.04;
const WAVE_AMP = 0.1;
const WAVE_FREQ = 5;

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
  pos: number[], norm: number[], uv: number[],
  star: [number, number][], x: number, t: number,
) {
  for (let i = 0; i < S; i++) {
    const [y, z] = star[i];
    pos.push(x, y, z);
    const len = Math.hypot(y, z);
    norm.push(0, y / len, z / len);
    uv.push(t, i / S);
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
  idx: number[], pos: number[], norm: number[], uv: number[],
  star: [number, number][], x: number, reverse: boolean, sectionStart: number,
) {
  const center = pos.length / 3;
  pos.push(x, 0, 0);
  norm.push(reverse ? -1 : 1, 0, 0);
  uv.push(0.5, 0.5);
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
  const idx: number[] = [];

  const xStart = side === 'left' ? -HALF_LENGTH : 0;
  const xEnd = side === 'left' ? 0 : HALF_LENGTH;
  const segs = SEGMENTS_PER_HALF;

  for (let s = 0; s <= segs; s++) {
    const t = s / segs;
    const x = xStart + t * (xEnd - xStart);
    writeSection(pos, norm, uv, star, x, t);
  }

  for (let s = 0; s < segs; s++) {
    writeQuads(idx, s * S, (s + 1) * S);
  }

  if (side === 'left') {
    writeCap(idx, pos, norm, uv, star, xStart, true, 0);
    writeCap(idx, pos, norm, uv, star, xEnd, false, segs * S);
  } else {
    writeCap(idx, pos, norm, uv, star, xStart, true, 0);
    writeCap(idx, pos, norm, uv, star, xEnd, false, segs * S);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  return geo;
}

function buildDip(): THREE.BufferGeometry {
  const star = starPoints(OUTER_R * DIP_SCALE, INNER_R * DIP_SCALE);
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
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
  writeCap(idx, pos, norm, uv, star, dipEnd, false, rightRow);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
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
