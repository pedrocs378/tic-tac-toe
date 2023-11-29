import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'

import { Home } from '@/pages/home/home'
import { GameRoom } from '@/pages/game-room/game-room'

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<Home />} />
    <Route path="/:roomId" element={<GameRoom />} />
  </>,
)

export const router = createBrowserRouter(routes)
