import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

import { Game } from '@/schemas/game'

export class FirestoreGameMapper {
  static toFirestore(game: Game) {
    return {
      moves: game.moves,
      turnTo: game.turnTo,
      winner: game.winner,
    }
  }

  static fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ) {
    const data = snapshot.data(options)

    const game = new Game(
      {
        moves: data.moves,
        turnTo: data.turnTo,
        winner: data.winner,
        draw: data.draw,
      },
      snapshot.id,
    )

    return game
  }
}
