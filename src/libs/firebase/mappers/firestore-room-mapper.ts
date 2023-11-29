import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

import { Room } from '@/schemas/room'

export class FirestoreRoomMapper {
  static toFirestore(room: Room) {
    return {
      finished: room.finished,
      oScore: room.oScore,
      oNickname: room.oNickname,
      xScore: room.xScore,
      xNickname: room.xNickname,
    }
  }

  static fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ) {
    const data = snapshot.data(options)
    return new Room(
      {
        finished: data.finished,
        oScore: data.oScore,
        oNickname: data.oNickname,
        xScore: data.xScore,
        xNickname: data.xNickname,
      },
      snapshot.id,
    )
  }
}
