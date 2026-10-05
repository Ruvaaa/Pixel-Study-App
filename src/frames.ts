// src/frames.ts
//
// Static night scenes (no frame animation). Each screen shows one image.
// Set: pink sweater, desk lamp, cat on the bed.
// Files live in  public/frames/f<N>.webp  (N = original frame number).
//
// To swap a scene, change the number. When you have better animation
// frames later, we can bring the frame-by-frame version back.

const scene = (n: number): string => `/frames/f${n}.webp`;

export const scenes = {
  dashboard: scene(2), //  twilight window, lamp on (also used on duration page)
  opening: scene(3), //    dark window, faint trees
  studying: scene(4), //   darkest room, deep focus
  paused: scene(13), //    rain on the window
  closing: scene(5), //    dark window
  complete: scene(6), //   cloudy night sky
} as const;

// How long the full-screen opening / closing scene is shown (ms).
export const openingMs = 2000;
export const closingMs = 2000;

// Preloaded on startup so screens never flash empty.
export const allSceneSources: string[] = Object.values(scenes);