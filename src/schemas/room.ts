type RoomData = {
  finished: boolean
  oScore: number
  oNickname: string | null
  xScore: number
  xNickname: string | null
}

export class Room {
  private _id: string
  private data: RoomData

  constructor(data: RoomData, id: string) {
    this._id = id
    this.data = data
  }

  get id() {
    return this._id
  }

  get finished() {
    return this.data.finished
  }

  get oScore() {
    return this.data.oScore
  }

  get xScore() {
    return this.data.xScore
  }

  get oNickname() {
    return this.data.oNickname
  }

  get xNickname() {
    return this.data.xNickname
  }
}
