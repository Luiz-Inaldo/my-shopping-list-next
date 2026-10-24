// Gera os efeitos sonoros da aplicação em public/sounds (WAV 16-bit mono).
// Uso: node scripts/generate-sounds.mjs
//
// Os sons são sintetizados (sem amostras externas) e o PRNG tem semente fixa,
// então rodar o script de novo produz exatamente os mesmos arquivos. Para
// ajustar o timbre, altere as constantes ADD / CRUMPLE e gere novamente.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SAMPLE_RATE = 44_100;
const OUT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
  'sounds'
);

// Adição: estalo de bolha seguido de um sino curto e brilhante.
const ADD = {
  duration: 0.45,
  peakDb: -3,
  bubble: {
    duration: 0.06,
    fromHz: 600,
    toHz: 1300,
    gain: 0.55,
  },
  bell: {
    startAt: 0.05,
    hz: 1760,
    decay: 0.1,
    gain: 0.8,
    overtoneGain: 0.2,
    inharmonicGain: 0.08,
    inharmonicRatio: 2.76,
  },
};

// Remoção: papel sendo amassado (camada de ruído + estalos). Calibrado contra
// uma gravação de referência do som de esvaziar a lixeira: ~0,6 s, energia
// concentrada entre 0,5 e 4 kHz (centróide em ~2 a 3 kHz), ataque rápido,
// farfalhar sustentado com variações irregulares e final seco.
const CRUMPLE = {
  duration: 0.63,
  peakDb: -2,
  seed: 20261024,
  bed: {
    highpassHz: 700,
    lowpassHz: 3200,
    gain: 0.3,
    attack: 0.015,
    end: 0.59,
    release: 0.02,
  },
  // Compressão suave (tanh) para os estalos mais fortes não dominarem.
  drive: 1.3,
  crackle: {
    rate: 42,
    clustering: 0.5,
    minLength: 0.0015,
    maxLength: 0.006,
    minHz: 900,
    maxHz: 4200,
    minQ: 1.5,
    maxQ: 3,
    scale: 3.2,
    floor: 0.35,
    tailExponent: 1.5,
  },
};

const FADE_OUT = 0.02;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Filtro biquad (receitas RBJ). Retorna uma função amostra -> amostra com estado.
function biquad(type, freq, q) {
  const w0 = (2 * Math.PI * freq) / SAMPLE_RATE;
  const cos = Math.cos(w0);
  const alpha = Math.sin(w0) / (2 * q);
  let b0;
  let b1;
  let b2;

  if (type === 'lowpass') {
    b0 = (1 - cos) / 2;
    b1 = 1 - cos;
    b2 = (1 - cos) / 2;
  } else if (type === 'highpass') {
    b0 = (1 + cos) / 2;
    b1 = -(1 + cos);
    b2 = (1 + cos) / 2;
  } else {
    b0 = alpha;
    b1 = 0;
    b2 = -alpha;
  }

  const a0 = 1 + alpha;
  const c = {
    b0: b0 / a0,
    b1: b1 / a0,
    b2: b2 / a0,
    a1: (-2 * cos) / a0,
    a2: (1 - alpha) / a0,
  };
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;

  return (x) => {
    const y = c.b0 * x + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
    return y;
  };
}

// Ruído suave em [0, 1], interpolado linearmente entre pontos aleatórios.
function smoothNoise(rand, seconds, rate) {
  const step = SAMPLE_RATE / rate;
  const count = Math.ceil((seconds * SAMPLE_RATE) / step) + 2;
  const values = Array.from({ length: count }, () => rand());

  return (i) => {
    const p = i / step;
    const k = Math.floor(p);
    const f = p - k;
    return values[k] * (1 - f) + values[k + 1] * f;
  };
}

function compress(samples, drive) {
  const peak = samples.reduce((max, v) => Math.max(max, Math.abs(v)), 0);
  for (let i = 0; i < samples.length; i++) {
    samples[i] = Math.tanh((samples[i] / peak) * drive);
  }
  return samples;
}

function finalize(samples, peakDb) {
  const mean = samples.reduce((sum, v) => sum + v, 0) / samples.length;
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    samples[i] -= mean;
    peak = Math.max(peak, Math.abs(samples[i]));
  }

  const target = 10 ** (peakDb / 20);
  const fadeSamples = Math.floor(FADE_OUT * SAMPLE_RATE);
  for (let i = 0; i < samples.length; i++) {
    const fromEnd = samples.length - 1 - i;
    const fade = fromEnd < fadeSamples ? fromEnd / fadeSamples : 1;
    samples[i] = (samples[i] / peak) * target * fade;
  }

  return samples;
}

function renderAdd() {
  const { duration, bubble, bell } = ADD;
  const total = Math.floor(duration * SAMPLE_RATE);
  const out = new Float64Array(total);

  // Bolha: seno com glissando exponencial ascendente e decaimento rápido.
  const bubbleSamples = Math.floor(bubble.duration * SAMPLE_RATE);
  const bubbleDecay = bubble.duration / 3;
  let phase = 0;
  for (let i = 0; i < bubbleSamples && i < total; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / bubbleSamples;
    const hz = bubble.fromHz * (bubble.toHz / bubble.fromHz) ** progress;
    phase += (2 * Math.PI * hz) / SAMPLE_RATE;
    const attack = Math.min(t / 0.002, 1);
    out[i] +=
      Math.sin(phase) * attack * Math.exp(-t / bubbleDecay) * bubble.gain;
  }

  // Sino: fundamental + 2º harmônico + parcial inarmônico (timbre metálico),
  // cada parcial com seu próprio decaimento.
  const bellStart = Math.floor(bell.startAt * SAMPLE_RATE);
  for (let i = bellStart; i < total; i++) {
    const t = (i - bellStart) / SAMPLE_RATE;
    const attack = Math.min(t / 0.003, 1);
    const w = 2 * Math.PI * bell.hz * t;
    const partials =
      Math.sin(w) * Math.exp(-t / bell.decay) +
      Math.sin(2 * w) * bell.overtoneGain * Math.exp(-t / (bell.decay * 0.6)) +
      Math.sin(bell.inharmonicRatio * w) *
        bell.inharmonicGain *
        Math.exp(-t / (bell.decay * 0.35));
    out[i] += partials * attack * bell.gain;
  }

  return finalize(out, ADD.peakDb);
}

function renderCrumple() {
  const { duration, seed, bed, crackle } = CRUMPLE;
  const rand = mulberry32(seed);
  const total = Math.floor(duration * SAMPLE_RATE);
  const out = new Float64Array(total);

  // Envelope global: sobe rápido, se mantém e corta seco em `bed.end`.
  const envelope = (t) => {
    if (t >= bed.end) return 0;
    const attack = Math.min(t / bed.attack, 1);
    const release = Math.min((bed.end - t) / bed.release, 1);
    return attack * release;
  };

  // Fundo de ruído: passa-banda com amplitude modulada de forma irregular
  // (o "aperto" do papel).
  const highpass = biquad('highpass', bed.highpassHz, Math.SQRT1_2);
  const lowpass = biquad('lowpass', bed.lowpassHz, Math.SQRT1_2);
  const slowMod = smoothNoise(rand, duration, 15);
  const fastMod = smoothNoise(rand, duration, 40);
  for (let i = 0; i < total; i++) {
    const t = i / SAMPLE_RATE;
    const noise = lowpass(highpass(rand() * 2 - 1));
    const mod = 0.35 + 0.65 * ((slowMod(i) + fastMod(i)) / 2) ** 2;
    out[i] += noise * mod * envelope(t) * bed.gain;
  }

  // Estalos: rajadas curtas de ruído ressonante, em densidade média constante.
  // Uma modulação lenta agrupa os estalos de leve (`clustering` de 0 a 1).
  const cluster = smoothNoise(rand, duration, 8);
  for (let i = 0; i < total; i++) {
    const t = i / SAMPLE_RATE;
    const density =
      1 - crackle.clustering + 2 * crackle.clustering * cluster(i);
    const probability = (crackle.rate * density) / SAMPLE_RATE;
    if (rand() >= probability) continue;

    const length = Math.floor(
      (crackle.minLength + rand() * (crackle.maxLength - crackle.minLength)) *
        SAMPLE_RATE
    );
    const hz = crackle.minHz * (crackle.maxHz / crackle.minHz) ** rand();
    const q = crackle.minQ + rand() * (crackle.maxQ - crackle.minQ);
    // Expoente maior deixa poucos estalos fortes e muitos fracos.
    const amplitude =
      (crackle.floor + (1 - crackle.floor) * rand() ** crackle.tailExponent) *
      crackle.scale;
    const resonator = biquad('bandpass', hz, q);

    for (let k = 0; k < length && i + k < total; k++) {
      const decay = Math.exp((-3 * k) / length);
      out[i + k] += resonator(rand() * 2 - 1) * decay * amplitude * envelope(t);
    }
  }

  return finalize(compress(out, CRUMPLE.drive), CRUMPLE.peakDb);
}

function encodeWav(samples) {
  const dataBytes = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataBytes);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataBytes, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataBytes, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }

  return buffer;
}

function describe(name, samples, bytes) {
  let peak = 0;
  let sumSquares = 0;
  for (const v of samples) {
    peak = Math.max(peak, Math.abs(v));
    sumSquares += v * v;
  }
  const db = (x) => (20 * Math.log10(x)).toFixed(1);
  const seconds = (samples.length / SAMPLE_RATE).toFixed(2);
  const rms = Math.sqrt(sumSquares / samples.length);

  console.log(
    `${name}: ${seconds}s, pico ${db(peak)} dBFS, RMS ${db(rms)} dBFS, ${(bytes / 1024).toFixed(0)} KB`
  );
}

const SOUNDS = {
  'add-success.wav': renderAdd,
  'delete-crumple.wav': renderCrumple,
};

mkdirSync(OUT_DIR, { recursive: true });

for (const [file, render] of Object.entries(SOUNDS)) {
  const samples = render();
  const wav = encodeWav(samples);
  writeFileSync(join(OUT_DIR, file), wav);
  describe(file, samples, wav.length);
}
