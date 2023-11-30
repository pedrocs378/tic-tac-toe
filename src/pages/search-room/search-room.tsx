import { FormEvent, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ChevronLeft, Hash, User2 } from 'lucide-react'

import { getRoom } from '@/libs/firebase/database/get-room'
import { createSecondPlayer } from '@/libs/firebase/database/create-second-player'

import { useToast } from '@/hooks/use-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function SearchRoom() {
  const roomIdRef = useRef<HTMLInputElement>(null)

  const [isSubmiting, setIsSubmiting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { toast } = useToast()

  const nickname = useMemo(() => {
    const storagedNickname = localStorage.getItem('@tictactoe:nickname')

    return storagedNickname
  }, [])

  if (!nickname) {
    return <Navigate to="/" replace />
  }

  async function handlePlay(event: FormEvent) {
    event.preventDefault()

    if (!nickname) return

    const roomId = roomIdRef.current?.value

    if (!roomId) {
      return setError('Informe o código da sala')
    }

    try {
      setIsSubmiting(true)

      const result = await getRoom({ id: roomId })

      if (result.room) {
        const fullRoom = !!result.room.oNickname && !!result.room.xNickname

        if (fullRoom) {
          toast({ title: 'A sala já esta cheia' })
        } else {
          await createSecondPlayer({
            roomId: result.room.id,
            nickname,
            player: result.room.oNickname ? 'x' : 'o',
          })

          navigate(`/${result.room.id}`)
        }
      } else {
        toast({ title: 'Sala não encontrada' })
      }
    } catch {
      toast({ title: 'Sala não encontrada' })
    } finally {
      setIsSubmiting(false)
    }
  }

  return (
    <div className="flex items-start md:items-center justify-center h-screen px-2 pt-10">
      <div className="w-full max-w-lg mx-auto space-y-2">
        <div className="flex items-center justify-between">
          <Button
            asChild
            size="xs"
            variant="outline"
            className="text-muted-foreground"
          >
            <Link to="/">
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>

          <div className="flex items-center gap-2 text-muted-foreground">
            <User2 className="h-4 w-4" />
            <span className="text-sm">{nickname}</span>
          </div>
        </div>

        <form className="border rounded-lg px-4 py-8" onSubmit={handlePlay}>
          <h1 className="font-title text-center text-5xl select-none">
            Tic Tac Toe
          </h1>

          <div className="mt-10 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                <Input
                  ref={roomIdRef}
                  name="code"
                  placeholder="Código da sala"
                  disabled={isSubmiting}
                />
              </div>
              {error && (
                <span className="text-sm text-destructive">{error}</span>
              )}
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmiting}>
              Jogar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
