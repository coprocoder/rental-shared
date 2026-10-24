import vue from '@vitejs/plugin-vue'
import { defineWorkspace } from 'vitest/config'

// ⚠️ Пояс тестов закреплён: UTC, а не пояс машины разработчика. Машина
// стояла в Красноярске — в том же поясе, что филиал в фикстурах, — и тест,
// разбиравший местное время в поясе машины, был зелёным локально и красным в
// CI. Пояс машины обязан отличаться от пояса филиала везде одинаково.
process.env.TZ = 'UTC'

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
