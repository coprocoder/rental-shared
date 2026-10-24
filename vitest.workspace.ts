import vue from '@vitejs/plugin-vue'
import { defineWorkspace } from 'vitest/config'

// Два проекта: чистым функциям common DOM не нужен, компонентам ui нужен.
// happy-dom подменяет глобалы, и тест чистой функции начал бы проверять
// подмену, а не функцию.
export default defineWorkspace([
  {
    test: { name: 'common', environment: 'node', include: ['common/test/**/*.test.ts'] },
  },
  {
    plugins: [vue()],
    test: { name: 'ui', environment: 'happy-dom', include: ['ui/test/**/*.test.ts'] },
  },
])
