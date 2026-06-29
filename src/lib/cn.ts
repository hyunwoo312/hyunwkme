import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Register the custom @theme font-size tokens so tailwind-merge classifies
// `text-tag`/`text-chip`/... as font sizes rather than text colors (otherwise
// `text-chip text-ink` would be treated as conflicting and the size dropped).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['tag', 'chip', 'action', 'nav'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
