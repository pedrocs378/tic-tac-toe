import { FormEvent, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type CreateNicknameDialogProps = {
  open: boolean
  isSubmitting?: boolean
  onSubmit?: (nickname: string) => void
}

export function CreateNicknameDialog({
  open,
  isSubmitting = false,
  onSubmit,
}: CreateNicknameDialogProps) {
  const nicknameRef = useRef<HTMLInputElement>(null)

  const [error, setError] = useState<string | null>(null)

  const { roomId } = useParams()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const nickname = nicknameRef.current?.value

    if (!nickname) {
      return setError('Informe um nickname')
    } else {
      setError(null)
    }

    onSubmit?.(nickname)
  }

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Entrar na sala</DialogTitle>
          <DialogDescription>#{roomId}</DialogDescription>
        </DialogHeader>

        <form
          id="create-nickname"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div>
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              ref={nicknameRef}
              id="nickname"
              name="nickname"
              disabled={isSubmitting}
            />
            {error && <span className="text-sm text-destructive">{error}</span>}
          </div>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="create-nickname"
            className="w-full"
            isLoading={isSubmitting}
          >
            Jogar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
