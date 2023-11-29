import { addDoc, collection } from 'firebase/firestore'

import { database } from '../firebase'

type Move = 'o' | 'x' | null

type GameCollectionData = {
  moves: [Move, Move, Move, Move, Move, Move, Move, Move, Move]
  turnTo: 'o' | 'x'
  winner: 'o' | 'x' | null
  createdAt: Date
}

type CreateGameData = {
  roomId: string
  turnTo: 'o' | 'x'
}

export async function createGame({ roomId, turnTo }: CreateGameData) {
  const moves = Array.from({ length: 9 }).map(() => null)

  const docRef = await addDoc(collection(database, 'rooms', roomId, 'games'), {
    moves,
    turnTo,
    winner: null,
    createdAt: new Date(),
  } as GameCollectionData)

  return { id: docRef.id }
}
