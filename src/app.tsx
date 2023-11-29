import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { router } from './router/routes'

import { queryClient } from './libs/react-query'

import { Toaster } from './components/ui/toaster'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />

      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  )
}
