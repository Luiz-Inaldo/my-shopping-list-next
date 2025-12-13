import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Configura o servidor de mock para os testes
export const server = setupServer(...handlers)

