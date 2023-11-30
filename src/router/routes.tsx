import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'

import { Home } from '@/pages/home/home'
import { GameRoom } from '@/pages/game-room/game-room'
import { SearchRoom } from '@/pages/search-room/search-room'

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<Home />} />
    <Route path="/search-room" element={<SearchRoom />} />
    <Route path="/:roomId" element={<GameRoom />} />
    <Route path="*" element={<span>404</span>} />
  </>,
)

export const router = createBrowserRouter(routes)
