import { rest } from 'msw'

// Define os handlers para interceptar requisições durante os testes
// Adicione aqui os endpoints que deseja mockar
export const handlers = [
  // Exemplo de handler GET
  // rest.get('/api/example', (req, res, ctx) => {
  //   return res(
  //     ctx.status(200),
  //     ctx.json({ message: 'Mocked response' })
  //   )
  // }),

  // Exemplo de handler POST
  // rest.post('/api/example', (req, res, ctx) => {
  //   return res(
  //     ctx.status(201),
  //     ctx.json({ success: true })
  //   )
  // }),
]

