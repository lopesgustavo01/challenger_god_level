import { Request, Response } from "express";
import { pool } from "../config/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY não configurada!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getStoreAIInsights = async (req: Request, res: Response) => {
  const storeId = req.query.storeId as string;
  const month = Number(req.query.month);
  const year = Number(req.query.year);

  if (!storeId || !month || !year) {
    return res.status(400).json({
      message: "storeId, month e year são obrigatórios."
    });
  }

  try {
    // --- 1️⃣ Buscar dados do mês atual ---
    const dailyCurrent = await pool.query(`
      SELECT * FROM daily_store_analysis
      WHERE store_id = $1 AND EXTRACT(MONTH FROM analysis_date) = $2
      AND EXTRACT(YEAR FROM analysis_date) = $3
      ORDER BY analysis_date ASC;
    `, [storeId, month, year]);

    // --- 2️⃣ Calcular mês anterior ---
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }

    // --- 3️⃣ Buscar dados do mês anterior ---
    const dailyPrev = await pool.query(`
      SELECT * FROM daily_store_analysis
      WHERE store_id = $1 AND EXTRACT(MONTH FROM analysis_date) = $2
      AND EXTRACT(YEAR FROM analysis_date) = $3
      ORDER BY analysis_date ASC;
    `, [storeId, prevMonth, prevYear]);

    const hasPreviousData = (dailyPrev.rowCount ?? 0) > 0;

    // --- 4️⃣ Buscar itens mais vendidos do mês atual ---
    const topItemsCurrent = await pool.query(`
      SELECT item_name, SUM(total_quantity_sold) AS qtd
      FROM daily_item_analysis
      WHERE store_id = $1
        AND EXTRACT(MONTH FROM analysis_date) = $2
        AND EXTRACT(YEAR FROM analysis_date) = $3
      GROUP BY item_name
      ORDER BY qtd DESC
      LIMIT 10;
    `, [storeId, month, year]);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // --- 5️⃣ Prompt dinâmico conforme dados disponíveis ---
    const comparisonBlock = hasPreviousData ? `
🆚 Dados do mês anterior (${prevMonth}/${prevYear}):
${JSON.stringify(dailyPrev.rows)}

Comparar:
- Crescimento de vendas e clientes
- Diferenças nos top itens
- Melhoras e pioras operacionais
- Dias com maiores diferenças
` : `
⚠️ Nenhum dado encontrado no mês anterior (${prevMonth}/${prevYear}). 
Faça apenas análise do mês atual.
`;

    const prompt = `
Você é uma IA especialista em BI e vendas.

🟦 Dados do mês atual (${month}/${year}):
${JSON.stringify(dailyCurrent.rows)}

🔝 Top 10 itens do mês atual:
${JSON.stringify(topItemsCurrent.rows)}

${comparisonBlock}

🎯 Gere um relatório com:
- Resumo da performance do mês
- Pontos fortes e pontos críticos
- Oportunidades de crescimento
- Se houver dados anteriores: comparação clara do que melhorou ou piorou
- Projeção para o próximo mês

Responda em texto organizado com títulos.
    `;

    const result = await model.generateContent(prompt);
    const insights = result.response.text();

    res.status(200).json({
      existsPreviousData: hasPreviousData,
      insights,
    });

  } catch (error) {
    console.error("Erro IA:", error);
    return res.status(500).json({
      message: "Erro ao gerar análise com IA"
    });
  }
};
