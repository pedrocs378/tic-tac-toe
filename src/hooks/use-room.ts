import { useCallback, useEffect, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'

import { Room } from '@/schemas/room'
import { Game, Move, NullableMove } from '@/schemas/game'

import { database } from '@/libs/firebase/firebase'
import { FirestoreRoomMapper } from '@/libs/firebase/mappers/firestore-room-mapper'
import { FirestoreGameMapper } from '@/libs/firebase/mappers/firestore-game-mapper'

function movesPositionsToWin(moves: NullableMove[]) {
  const horizontal = [
    [moves[0], moves[1], moves[2]],
    [moves[3], moves[4], moves[5]],
    [moves[6], moves[7], moves[8]],
  ]

  const vertical = [
    [moves[0], moves[3], moves[6]],
    [moves[1], moves[4], moves[7]],
    [moves[2], moves[5], moves[8]],
  ]

  const diagonal = [
    [moves[0], moves[4], moves[8]],
    [moves[2], moves[4], moves[6]],
  ]

  return { horizontal, vertical, diagonal }
}

type WonResult = {
  move: Move
  orientation: 'vertical' | 'horizontal' | 'diagonal'
  position:
    | 'left'
    | 'middle'
    | 'right'
    | 'top'
    | 'bottom'
    | 'tl-to-br'
    | 'tr-to-bl'
}

function hasWon(move: Move, moves: NullableMove[]): WonResult | false {
  const { horizontal, vertical, diagonal } = movesPositionsToWin(moves)

  const horizontalWinnerIndex = horizontal.findIndex((row) => {
    return row.every((rowMove) => rowMove === move)
  })

  if (horizontalWinnerIndex > -1) {
    const positions = ['top', 'middle', 'bottom'] as WonResult['position'][]

    return {
      move,
      orientation: 'horizontal',
      position: positions[horizontalWinnerIndex],
    }
  }

  const verticalWinnerIndex = vertical.findIndex((column) => {
    return column.every((columnMove) => columnMove === move)
  })

  if (verticalWinnerIndex > -1) {
    const positions = ['left', 'middle', 'right'] as WonResult['position'][]

    return {
      move,
      orientation: 'vertical',
      position: positions[verticalWinnerIndex],
    }
  }

  const diagonalWinnerIndex = diagonal.findIndex((diagonal) => {
    return diagonal.every((diagonalMove) => diagonalMove === move)
  })

  if (diagonalWinnerIndex > -1) {
    const positions = ['tl-to-br', 'tr-to-bl'] as WonResult['position'][]

    return {
      move,
      orientation: 'diagonal',
      position: positions[diagonalWinnerIndex],
    }
  }

  return false
}

function allFilled(moves: NullableMove[]): boolean {
  return moves.every((move) => move !== null)
}

export function useRoom(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null)
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [error, setError] = useState<FirebaseError | null>(null)

  const [isRoomLoading, setIsRoomLoading] = useState(true)
  const [isCurrentGameLoading, setIsCurrentGameLoading] = useState(true)

  const addMove = useCallback(
    async (move: Move, index: number) => {
      if (!currentGame?.id) return

      const gameRef = doc(database, 'rooms', roomId, 'games', currentGame.id)

      const updatedMoves = [...currentGame.moves]

      if (updatedMoves[index] === null) {
        updatedMoves[index] = move

        const wonResult = hasWon(move, updatedMoves)
        const hasDraw = wonResult === false && allFilled(updatedMoves)
        const turnTo = move === 'x' ? 'o' : 'x'

        await updateDoc(gameRef, {
          moves: updatedMoves,
          turnTo: wonResult === false && !hasDraw ? turnTo : null,
          draw: hasDraw,
          winner: wonResult === false ? null : wonResult,
        })

        if (wonResult && room) {
          const roomRef = doc(database, 'rooms', roomId)

          await updateDoc(roomRef, {
            oScore: move === 'o' ? room.oScore + 1 : room.oScore,
            xScore: move === 'x' ? room.xScore + 1 : room.xScore,
          })
        }
      }
    },
    [currentGame?.id, currentGame?.moves, roomId, room],
  )

  useEffect(() => {
    if (!roomId) return

    const roomsRef = doc(database, 'rooms', roomId).withConverter(
      FirestoreRoomMapper,
    )

    const unsubscribe = onSnapshot(
      roomsRef,
      (snapshot) => {
        setIsRoomLoading(false)

        const data = snapshot.data()

        if (data) {
          setRoom(data)
        }
      },
      (error) => {
        setIsRoomLoading(false)
        setError(error)
      },
    )

    return () => unsubscribe()
  }, [roomId])

  useEffect(() => {
    if (!roomId || !room) return

    const gamesRef = collection(
      database,
      'rooms',
      roomId,
      'games',
    ).withConverter(FirestoreGameMapper)

    const q = query(gamesRef, orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setIsCurrentGameLoading(false)

        const games = snapshot.docs.map((doc) => doc.data())

        const game = games[0]

        setCurrentGame(game)
      },
      (error) => {
        setIsCurrentGameLoading(false)
        setError(error)
      },
    )

    return () => unsubscribe()
  }, [room, roomId])

  return {
    room,
    currentGame,
    error,
    isRoomLoading,
    isCurrentGameLoading,
    addMove,
  }
}
