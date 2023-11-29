import { Player } from '@/components/player'
import { Button } from '@/components/ui/button'

type PlayerSelectProps = {
  value?: 'o' | 'x'
  onChange?: (value: 'o' | 'x') => void
}

export function PlayerSelect({ value, onChange }: PlayerSelectProps) {
  return (
    <div className="group grid grid-cols-2 gap-2 border rounded p-2">
      <Button
        variant={value === 'o' ? 'subtle' : 'ghost'}
        onClick={() => onChange?.('o')}
      >
        <Player name="o" />
      </Button>
      <Button
        variant={value === 'x' ? 'subtle' : 'ghost'}
        onClick={() => onChange?.('x')}
      >
        <Player name="x" />
      </Button>
    </div>
  )
}
