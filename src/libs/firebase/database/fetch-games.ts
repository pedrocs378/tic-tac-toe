import { collection, getDocs, orderBy, query } from 'firebase/firestore'

import { Game } from '@/schemas/game'

import { FirestoreGameMapper } from '../mappers/firestore-game-mapper'

import { database } from '../firebase'

type FetchRoomData = {
  roomId: string
}

type FetchRoomResponse = {
  games: Game[]
}

export async function fetchGames({
  roomId,
}: FetchRoomData): Promise<FetchRoomResponse> {
  const docRef = collection(database, 'rooms', roomId, 'games').withConverter(
    FirestoreGameMapper,
  )
  const q = query(docRef, orderBy('createdAt', 'desc'))

  const snapshot = await getDocs(q)

  const games = snapshot.docs.map((doc) => doc.data())

  return { games }
}
