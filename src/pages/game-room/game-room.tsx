import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'

import { createSecondPlayer } from '@/libs/firebase/database/create-second-player'
import { createGame } from '@/libs/firebase/database/create-game'

import { useRoom } from '@/hooks/use-room'

import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Player } from '@/components/player'
import { ClipboardButton } from '@/components/clipboard-button'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import { WinnerLine } from '@/components/winner-line'

import { CreateNicknameDialog } from './components/create-nickname-dialog'

export function GameRoom() {
  const [resultDialogOpen, setResultDialogOpen] = useState(false)
  const [createNicknameDialogOpen, setCreateNicknameDialogOpen] =
    useState(false)

  const { roomId } = useParams()

  const { room, currentGame, isRoomLoading, isCurrentGameLoading, addMove } =
    useRoom(roomId ?? '')

  const navigate = useNavigate()

  const {
    mutateAsync: createSecondPlayerMutateAsync,
    isPending: isCreateSecondPlayerPending,
  } = useMutation({
    mutationFn: createSecondPlayer,
  })

  const { mutateAsync: createGameMutateAsync, isPending: isCreateGamePending } =
    useMutation({
      mutationFn: createGame,
    })

  const currentPlayer = useMemo(() => {
    const storagedNickname = localStorage.getItem('@tictactoe:nickname')

    if (!storagedNickname) return null

    if (storagedNickname === room?.oNickname) {
      return 'o'
    } else {
      return 'x'
    }
  }, [room])

  useEffect(() => {
    if (!room) return

    const storagedNickname = localStorage.getItem('@tictactoe:nickname')

    function isPlayerInRoom() {
      return [room?.oNickname, room?.xNickname].includes(storagedNickname)
    }

    if (!storagedNickname || (storagedNickname && !isPlayerInRoom())) {
      const fullRoom = !!room?.oNickname && !!room?.xNickname

      if (fullRoom) {
        return navigate('/', {
          replace: true,
          state: { error: 'A sala já está cheia' },
        })
      } else {
        setCreateNicknameDialogOpen(true)
      }
    }
  }, [room, navigate])

  useEffect(() => {
    if (currentGame && currentGame.draw) {
      setResultDialogOpen(true)
    }
  }, [currentGame])

  useEffect(() => {
    if (currentGame && !currentGame.draw && !currentGame.winner) {
      setResultDialogOpen(false)
    }
  }, [currentGame])

  async function handleCreateSecondPlayer(nickname: string) {
    if (!roomId) return

    const secondPlayer = room?.oNickname ? 'x' : 'o'

    localStorage.setItem('@tictactoe:nickname', nickname)

    await createSecondPlayerMutateAsync({
      roomId,
      nickname,
      player: secondPlayer,
    })

    setCreateNicknameDialogOpen(false)
  }

  async function handlePlayAgain() {
    if (!roomId) return

    setResultDialogOpen(false)

    await createGameMutateAsync({
      roomId,
      turnTo: 'o',
    })
  }

  if (!isRoomLoading && !room) {
    return <Navigate to="/" replace state={{ error: 'Sala não encontrada' }} />
  }

  const hasTwoPlayers = !!room?.oNickname && !!room.xNickname
  const hasFinished = !!currentGame && !!currentGame.winner

  return isRoomLoading ? (
    <div className="h-screen flex items-center justify-center">
      <Spinner className="h-10 w-10" />
    </div>
  ) : (
    <>
      <Dialog open={resultDialogOpen}>
        <DialogContent showCloseButton={false}>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex gap-1 items-center">
              {currentGame?.draw && (
                <>
                  <Player
                    className="h-11 w-11"
                    name="x"
                    highlight={currentPlayer === 'x'}
                  />
                  <Player
                    className="h-11 w-11 p-1"
                    name="o"
                    highlight={currentPlayer === 'o'}
                  />
                </>
              )}

              {currentGame?.winner && (
                <Player
                  className="h-11 w-11"
                  name={currentGame.winner.move}
                  highlight={currentGame.winner.move === currentPlayer}
                />
              )}
            </div>

            <strong className="text-2xl text-primary uppercase">
              {!!currentGame?.draw && 'Empate!'}
              {!!currentGame?.winner && 'Vencedor!'}
            </strong>
          </div>

          <DialogFooter>
            <Button
              className="w-full"
              isLoading={isCreateGamePending}
              onClick={handlePlayAgain}
            >
              Jogar novamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateNicknameDialog
        open={createNicknameDialogOpen}
        isSubmitting={isCreateSecondPlayerPending}
        onSubmit={handleCreateSecondPlayer}
      />

      <div className="flex justify-center h-screen px-2 py-10">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-10 md:gap-20">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-1">
              <span className="text-xs text-muted-foreground">
                Sala #{roomId}
              </span>

              <ClipboardButton
                className="h-6 w-6"
                iconClassName="h-3 w-3"
                value={roomId}
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {room?.oNickname ?? 'Aguardando jogador'}
                </span>

                <span className="text-xs text-muted-foreground self-end">
                  {room?.xNickname ?? 'Aguardando jogador'}
                </span>
              </div>

              <div
                data-current={currentPlayer}
                className="group flex items-center gap-2"
              >
                <div className="flex-1 border py-1 px-2 rounded border-b-2 flex items-center justify-between group-data-[current=o]:border-b-primary">
                  <Player name="o" />
                  <span className="font-semibold">{room?.oScore}</span>
                </div>

                <span className="text-xs text-muted-foreground">vs</span>

                <div className="flex-1 border py-1 px-2 rounded flex items-center justify-between group-data-[current=x]:border-b-primary">
                  <span className="font-semibold">{room?.xScore}</span>
                  <Player name="x" />
                </div>
              </div>
            </div>
          </div>

          {isCurrentGameLoading && (
            <Skeleton className="w-full aspect-square" />
          )}

          {!isCurrentGameLoading && (
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                {!currentGame?.turnTo ? (
                  <span className="text-xs text-muted-foreground">
                    Fim de jogo
                  </span>
                ) : (
                  <>
                    <span className="text-xs text-muted-foreground">
                      Vez de
                    </span>
                    <Player name={currentGame.turnTo} className="w-3 h-3" />
                  </>
                )}
              </div>

              <div className="relative">
                {currentGame?.winner && (
                  <WinnerLine
                    orientation={currentGame.winner.orientation}
                    position={currentGame.winner.position}
                    highlight={currentGame.winner.move === currentPlayer}
                    onAnimationEnd={() => setResultDialogOpen(true)}
                  />
                )}

                <div
                  data-disabled={!hasTwoPlayers}
                  className="grid grid-cols-3 grid-rows-3 border rounded-lg p-4 md:p-8 data-[disabled=true]:opacity-50 data-[disabled=true]:bg-white/5"
                >
                  {currentGame?.moves.map((move, index) => {
                    const isCurrentPlayerTurn =
                      currentGame.turnTo === currentPlayer

                    return (
                      <button
                        key={index}
                        type="button"
                        disabled={
                          !isCurrentPlayerTurn || !hasTwoPlayers || hasFinished
                        }
                        className="flex items-center justify-center aspect-square [&:nth-child(3n+1)]:border-r [&:nth-child(3n+2)]:border-r [&:nth-child(-n+6)]:border-b"
                        onClick={() => {
                          if (currentPlayer) {
                            addMove(currentPlayer, index)
                          }
                        }}
                      >
                        {!!move && (
                          <Player
                            name={move}
                            highlight={move === currentPlayer}
                            className="w-10 h-10 animate-fade-in duration-300"
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            className="self-start"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </>
  )
}
