import '@testing-library/jest-dom'
import { server } from '@/__mocks__/server'

// Configuração do MSW (Mock Service Worker)
// Inicia o servidor antes de todos os testes
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))

// Reseta os handlers após cada teste (para evitar efeitos colaterais)
afterEach(() => server.resetHandlers())

// Fecha o servidor após todos os testes
afterAll(() => server.close())

// Mock do Next.js Router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}))

// Mock do Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
})

