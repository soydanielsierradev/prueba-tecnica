// Pastel tile family from the theme (index.css); classes are listed in full so Tailwind can see them.
const TILE_CLASSES = ['bg-tile-1', 'bg-tile-2', 'bg-tile-3', 'bg-tile-4'] as const

export function tileClass(index: number): (typeof TILE_CLASSES)[number] {
  return TILE_CLASSES[((index % TILE_CLASSES.length) + TILE_CLASSES.length) % TILE_CLASSES.length]
}
