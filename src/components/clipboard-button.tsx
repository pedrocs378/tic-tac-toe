import { Clipboard } from 'lucide-react'

import { cn } from '@/utils/tailwind'

import { Button, ButtonProps } from './ui/button'
import { useToast } from '@/hooks/use-toast'

type ClipboardButtonProps = ButtonProps & {
  iconClassName?: string
  value?: string
}

export function ClipboardButton({
  iconClassName,
  value,
  ...buttonProps
}: ClipboardButtonProps) {
  const { toast } = useToast()

  async function handleCopyValue() {
    if (!value) return

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(value)

      toast({ title: 'Copiado com sucesso' })
    } else {
      await navigator.share?.({
        title: 'Tic Tac Toe',
        text: 'Jogue o jogo da velha comigo',
        url: window.location.href,
      })
    }
  }

  return (
    <Button
      size="icon"
      variant="outline"
      {...buttonProps}
      onClick={handleCopyValue}
    >
      <Clipboard className={cn('h-4 w-4', iconClassName)} />
    </Button>
  )
}
