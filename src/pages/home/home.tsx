import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { User2 } from 'lucide-react'

import { createRoom } from '@/libs/firebase/database/create-room'
import { createGame } from '@/libs/firebase/database/create-game'

import { useToast } from '@/hooks/use-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Player } from '@/components/player'

import { PlayerSelect } from './components/player-select'

export function Home() {
  const nicknameRef = useRef<HTMLInputElement>(null)

  const [selectedPlayer, setSelectedPlayer] = useState<'o' | 'x'>('o')
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  const { isPending: isCreateRoomPending, mutateAsync: createRoomMutateAsync } =
    useMutation({
      mutationFn: createRoom,
    })

  const { isPending: isCreateGamePending, mutateAsync: createGameMutateAsync } =
    useMutation({
      mutationFn: createGame,
    })

  useEffect(() => {
    if (location.state?.error) {
      toast({ title: location.state.error })
    }
  }, [location.state, toast])

  async function handleCreateRoom() {
    const nickname = nicknameRef.current?.value

    if (!nickname) {
      return setError('Informe um nickname')
    }

    const room = await createRoomMutateAsync({
      nickname,
      player: selectedPlayer,
    })

    await createGameMutateAsync({
      roomId: room.id,
      turnTo: 'o',
    })

    localStorage.setItem('@tictactoe:nickname', nickname)

    navigate(`/${room.id}`)
  }

  function handleGoToExistingRoom() {
    const nickname = nicknameRef.current?.value

    if (!nickname) {
      return setError('Informe um nickname')
    }

    localStorage.setItem('@tictactoe:nickname', nickname)

    navigate('/search-room')
  }

  const isPending = isCreateRoomPending || isCreateGamePending

  return (
    <div className="flex items-start md:items-center justify-center h-screen px-2 pt-10">
      <div className="w-full max-w-lg mx-auto border rounded-lg px-4 py-8">
        <h1 className="font-title text-center text-5xl select-none">
          Tic Tac Toe
        </h1>

        <div className="mt-10 space-y-6">
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <User2 className="w-5 h-5" />
                <Input
                  ref={nicknameRef}
                  name="nickname"
                  placeholder="Nickname"
                />
              </div>
              {error && (
                <span className="text-sm text-destructive">{error}</span>
              )}
            </div>

            <div>
              <PlayerSelect
                value={selectedPlayer}
                onChange={setSelectedPlayer}
              />
              <span className="block mt-2 text-xs text-muted-foreground">
                <Player className="inline h-3 w-3" name="o" /> começa a jogar
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button isLoading={isPending} onClick={handleCreateRoom}>
              Criar uma sala
            </Button>
            <Button variant="outline" onClick={handleGoToExistingRoom}>
              Entrar em uma sala existente
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
