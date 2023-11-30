import { doc, getDoc } from 'firebase/firestore'

import { Room } from '@/schemas/room'

import { FirestoreRoomMapper } from '../mappers/firestore-room-mapper'

import { database } from '../firebase'

type GetRoomData = {
  id: string
}

type GetRoomResponse = {
  room: Room | null
}

export async function getRoom({ id }: GetRoomData): Promise<GetRoomResponse> {
  const docRef = doc(database, 'rooms', id).withConverter(FirestoreRoomMapper)

  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const data = docSnap.data()

    return { room: data }
  } else {
    return { room: null }
  }
}
