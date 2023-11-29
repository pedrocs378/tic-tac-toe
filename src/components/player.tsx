import { Circle, X } from 'lucide-react'

import { cn } from '@/utils/tailwind'

const playerIcons = {
  x: X,
  o: Circle,
}

type PlayerProps = {
  name: 'x' | 'o'
  highlight?: boolean
  className?: string
}

export function Player({ name, highlight = false, className }: PlayerProps) {
  const Icon = playerIcons[name]

  return (
    <Icon
      data-highlight={highlight}
      className={cn('h-4 w-4 data-[highlight=true]:text-primary', className)}
      strokeWidth={4}
    />
  )
}
