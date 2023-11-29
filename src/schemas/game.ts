export type Move = 'o' | 'x'

export type NullableMove = Move | null

type Winner = {
  move: Move
  orientation: 'horizontal' | 'vertical' | 'diagonal'
  position:
    | 'top'
    | 'middle'
    | 'bottom'
    | 'left'
    | 'right'
    | 'tl-to-br'
    | 'tr-to-bl'
}

type GameData = {
  moves: NullableMove[]
  turnTo: Move | null
  draw: boolean
  winner: Winner | null
}

export class Game {
  private _id: string
  private data: GameData

  constructor(data: GameData, id: string) {
    this._id = id
    this.data = data
  }

  get id() {
    return this._id
  }

  get moves() {
    return this.data.moves
  }

  get turnTo() {
    return this.data.turnTo
  }

  get winner() {
    return this.data.winner
  }

  get draw() {
    return this.data.draw
  }
}
