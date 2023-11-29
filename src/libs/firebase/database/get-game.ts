import { doc, getDoc } from 'firebase/firestore'

import { Game } from '@/schemas/game'

import { FirestoreGameMapper } from '../mappers/firestore-game-mapper'

import { database } from '../firebase'

type GetRoomData = {
  id: string
  roomId: string
}

type GetRoomResponse = {
  game: Game | null
}

export async function getGame({
  id,
  roomId,
}: GetRoomData): Promise<GetRoomResponse> {
  const docRef = doc(database, 'rooms', roomId, 'games', id).withConverter(
    FirestoreGameMapper,
  )

  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const data = docSnap.data()

    return { game: data }
  } else {
    return { game: null }
  }
}
