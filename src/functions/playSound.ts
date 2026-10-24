// O nome de cada variante descreve o evento que dispara o som, e não o
// arquivo, para que novos sons entrem sem ambiguidade.
const SOUND_FILES = {
  add: '/sounds/add-success.wav',
  remove: '/sounds/delete-crumple.wav',
  complete_list: '/sounds/tada_fanfare.flac',
  mark_item: '/sounds/pencil.wav',
} as const;

export type SoundName = keyof typeof SOUND_FILES;

const DEFAULT_VOLUME = 0.6;

const audioCache: Partial<Record<SoundName, HTMLAudioElement>> = {};

function getAudio(name: SoundName) {
  let audio = audioCache[name];

  if (!audio) {
    audio = new Audio(SOUND_FILES[name]);
    audio.preload = 'auto';
    audioCache[name] = audio;
  }

  return audio;
}

/** Baixa os sons com antecedência para o primeiro play não atrasar. */
export function preloadSounds() {
  if (typeof window === 'undefined') return;

  (Object.keys(SOUND_FILES) as SoundName[]).forEach((name) => {
    getAudio(name);
  });
}

/**
 * Toca um efeito sonoro. Nunca lança erro: se o navegador bloquear o autoplay
 * ou o arquivo falhar, o fluxo que disparou o som segue normalmente.
 */
export function playSound(name: SoundName, volume = DEFAULT_VOLUME) {
  if (typeof window === 'undefined') return;

  try {
    const audio = getAudio(name);
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {
    // Som é apenas um reforço de feedback, falhas são ignoradas.
  }
}
