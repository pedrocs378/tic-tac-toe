import { doc, updateDoc } from 'firebase/firestore'

import { database } from '../firebase'

type CreateRoomData = {
  roomId: string
  nickname: string
  player: 'o' | 'x'
}

export async function createSecondPlayer({
  roomId,
  nickname,
  player,
}: CreateRoomData) {
  const docRef = doc(database, 'rooms', roomId)

  const data =
    player === 'o'
      ? {
          oNickname: nickname,
        }
      : {
          xNickname: nickname,
        }

  await updateDoc(docRef, data)
}
