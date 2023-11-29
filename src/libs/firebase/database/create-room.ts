import { addDoc, collection } from 'firebase/firestore'

import { database } from '../firebase'

type RoomCollectionData = {
  finished: boolean
  oScore: number
  oNickname: string | null
  xScore: number
  xNickname: string | null
}

type CreateRoomData = {
  nickname: string
  player: 'o' | 'x'
}

export async function createRoom({ nickname, player }: CreateRoomData) {
  const docRef = await addDoc(collection(database, 'rooms'), {
    finished: false,
    oScore: 0,
    oNickname: player === 'o' ? nickname : null,
    xScore: 0,
    xNickname: player === 'x' ? nickname : null,
  } as RoomCollectionData)

  return { id: docRef.id }
}
