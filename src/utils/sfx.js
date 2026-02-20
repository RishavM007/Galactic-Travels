import clickUrl from "../assets/click.mp3";
import spaceUrl from "../assets/space.mp3";

const clickBase = new Audio(clickUrl);
clickBase.preload = "auto";
const CLICK_VOLUME = 0.4;
clickBase.volume = CLICK_VOLUME;

const hoverBase = new Audio(clickUrl);
hoverBase.preload = "auto";
const HOVER_VOLUME = 0.18;
hoverBase.volume = HOVER_VOLUME;
hoverBase.playbackRate = 1.2;

const spaceAmbience = new Audio(spaceUrl);
spaceAmbience.preload = "auto";
spaceAmbience.loop = true;
const SPACE_VOLUME = 0.3;
spaceAmbience.volume = SPACE_VOLUME;

let hoverLockUntil = 0;
let retryHandler = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function toggleMuted() {
  muted = !muted;
  clickBase.volume = muted ? 0 : CLICK_VOLUME;
  hoverBase.volume = muted ? 0 : HOVER_VOLUME;
  spaceAmbience.volume = muted ? 0 : SPACE_VOLUME;

  if (muted) {
    spaceAmbience.pause();
  } else {
    startSpaceAmbience();
  }

  return muted;
}

function playOneShot(baseAudio) {
  const oneShot = baseAudio.cloneNode();
  oneShot.volume = baseAudio.volume;
  oneShot.playbackRate = baseAudio.playbackRate;
  oneShot.play().catch(() => {});
}

export function playClickSfx() {
  if (muted) return;
  playOneShot(clickBase);
}

export function playHoverSfx() {
  if (muted) return;
  const now = performance.now();
  if (now < hoverLockUntil) return;
  hoverLockUntil = now + 120;
  playOneShot(hoverBase);
}

export function startSpaceAmbience() {
  if (muted) return;
  spaceAmbience.play().catch(() => {
    if (retryHandler) return;
    retryHandler = () => {
      spaceAmbience.play().catch(() => {});
      window.removeEventListener("pointerdown", retryHandler);
      retryHandler = null;
    };
    window.addEventListener("pointerdown", retryHandler, { once: true });
  });
}

export function stopSpaceAmbience() {
  if (retryHandler) {
    window.removeEventListener("pointerdown", retryHandler);
    retryHandler = null;
  }
  spaceAmbience.pause();
  spaceAmbience.currentTime = 0;
}
