import { z } from 'genkit';
import { ai } from '@/lib/genkit';

export const monthlyStatisticsFlow = ai.defineFlow(
  { 
    name: 'monthlyStatisticsFlow',
    inputSchema: z.object({
      userId: z.string(),
      purchases: z.array(z.any())
    }),
  },
  async ({ userId, purchases }) => {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // Serializa os dados das compras para o prompt
    const purchasesData = JSON.stringify(purchases, null, 2);

    const prompt = `Gere um resumo estatístico mensal para o usuário com ID ${userId} com base nos seguintes dados de compras:
        
        Inclua as seguintes informações:
        1. Total gasto no mês (${month + 1}/${year}).
        2. Comparação em porcentagem de gastos com o mês anterior (se houve redução ou aumento).
        3. Quantidade total de listas geradas do mês. Também traga a quantidade de listas ativas
        4. Quantidade total de itens comprados no mês.
        5. Comparação em porcentagem de itens comprados com o mês anterior (se houve redução ou aumento).
        6. Mostre a economia total do mês em comparação ao mês anterior. O número deve ser negativo se houve aumento de gastos.`;

    const { output } = await ai.generate({
      prompt,
      output: {
        schema: z.object({
            total_gasto_mes: z.string(),
            comparacao_gastos_mes_anterior: z.string(),
            quantidade_listas_geradas: z.number(),
            quantidade_listas_ativas: z.number(),
            itens_comprados_mes: z.number(),
            comparacao_itens_mes_anterior: z.string(),
            economia_total_mes: z.string(),
        }),
      },
    });

    return output;
  }
);
