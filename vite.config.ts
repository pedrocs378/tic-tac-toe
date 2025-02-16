import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('pages/')) return 'pages'
          if (id.includes('components/')) return 'components'
        }
      }
    }
  }
})
