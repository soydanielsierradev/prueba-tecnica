import { cn } from '@/lib/utils'

const TILES = [
  { x: 0, y: 0, label: '01', tile: 'fill-tile-1', ink: 'fill-tile-ink' },
  { x: 54, y: 0, label: '02', tile: 'fill-tile-2', ink: 'fill-tile-ink' },
  { x: 0, y: 54, label: '03', tile: 'fill-tile-3', ink: 'fill-tile-ink' },
  { x: 54, y: 54, label: '04', tile: 'fill-primary', ink: 'fill-primary-foreground' },
] as const

interface AppLogoProps {
  className?: string
}

// The brand mark: the promo-calendar tile grid. Decorative, the app name is always nearby in text.
export function AppLogo({ className }: AppLogoProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn('shrink-0', className)}>
      {TILES.map(({ x, y, label, tile, ink }) => (
        <g key={label}>
          <rect x={x} y={y} width="46" height="46" rx="12" className={tile} />
          <text
            x={x + 8}
            y={y + 23}
            className={cn('font-sans font-light', ink)}
            fontSize="18"
            letterSpacing="-0.5"
          >
            {label}
          </text>
        </g>
      ))}
    </svg>
  )
}
