import { Request, Response } from 'express';
// Importe seu pool de conexão
import { pool } from '../config/db'; 

/**
 * Controller para: GET /api/analytics
 * Busca todos os registros de análise diária para uma loja, mês e ano.
 * Isso é ideal para alimentar gráficos de linha no frontend (ex: Vendas por Dia).
 */
const queryAnlysis = `
      SELECT 
        -- Chaves
        id,
        store_id,
        analysis_date,

        -- Contadores Gerais
        total_sales_count,
        completed_sales_count,
        cancelled_sales_count,
        unique_customers_count,

        -- Métricas: total_amount (Receita)
        total_amount_sum,
        total_amount_avg,
        total_amount_stddev,

        -- Métricas: value_paid (Valor Pago)
        value_paid_sum,
        value_paid_avg,
        value_paid_stddev,

        -- Métricas: total_amount_items (Valor dos Itens)
        total_items_value_sum,
        total_items_value_avg,
        total_items_value_stddev,

        -- Métricas: total_discount (Desconto)
        total_discount_sum,
        total_discount_avg,
        total_discount_stddev,

        -- Métricas: total_increase (Acréscimo)
        total_increase_sum,
        total_increase_avg,
        total_increase_stddev,

        -- Métricas: delivery_fee (Taxa de Entrega)
        delivery_fee_sum,
        delivery_fee_avg,
        delivery_fee_stddev,

        -- Métricas: service_tax_fee (Taxa de Serviço)
        service_tax_fee_sum,
        service_tax_fee_avg,
        service_tax_fee_stddev,

        -- Métricas Operacionais: production_seconds
        production_seconds_sum,
        production_seconds_avg,
        production_seconds_stddev,

        -- Métricas Operacionais: delivery_seconds
        delivery_seconds_sum,
        delivery_seconds_avg,
        delivery_seconds_stddev,

        -- Métricas Operacionais: people_quantity
        people_quantity_sum,
        people_quantity_avg,
        people_quantity_stddev

      FROM daily_store_analysis
      WHERE store_id = $1
        AND EXTRACT(MONTH FROM analysis_date) = $2
        AND EXTRACT(YEAR FROM analysis_date) = $3
      ORDER BY analysis_date ASC; 
    `;

export const getDailyAnalysis = async (req: Request, res: Response) => {
  // 1. Extrair e validar os parâmetros
  const { storeId, month, year } = req.query;

  if (!storeId) {
    return res.status(400).json({ message: "O storeId é obrigatório." });
  }
  if (!month) {
    return res.status(400).json({ message: "O mês (month) é obrigatório." });
  }
  if (!year) {
    return res.status(400).json({ message: "O ano (year) é obrigatório." });
  }

  try {

    const values = [storeId, month, year];

    // 3. Executar a consulta
    const result = await pool.query(queryAnlysis, values);

    // 4. Retornar os dados (será um array com ~30 linhas, uma para cada dia)
    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Erro ao buscar análise diária:', error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar análise." });
  }
};


export const getTopItemsByMonth = async (req: Request, res: Response) => {
  // 1. Extrair e validar parâmetros
  const { storeId, month, year } = req.query;

  if (!storeId) {
    return res.status(400).json({ message: "O storeId é obrigatório." });
  }
  if (!month) {
    return res.status(400).json({ message: "O mês (month) é obrigatório." });
  }
  if (!year) {
    return res.status(400).json({ message: "O ano (year) é obrigatório." });
  }

  try {
    // 2. Query que SOMA os dados do mês inteiro e agrupa por item
    const query = `
      SELECT 
        item_id,
        item_name,
        SUM(total_quantity_sold) AS "quantidadeTotalVendida",
        SUM(total_revenue_generated) AS "receitaTotalGerada"
      FROM daily_item_analysis
      WHERE store_id = $1
        AND EXTRACT(MONTH FROM analysis_date) = $2
        AND EXTRACT(YEAR FROM analysis_date) = $3
      GROUP BY item_id, item_name
      ORDER BY "quantidadeTotalVendida" DESC; -- Ordena pelos mais vendidos
    `;

    const values = [storeId, month, year];

    // 3. Executar a consulta
    const result = await pool.query(query, values);

    // 4. Retornar os dados (lista de itens mais vendidos)
    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Erro ao buscar top itens:', error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar top itens." });
  }
};


export const getItemHistoryByMonth = async (req: Request, res: Response) => {
  // 1. Extrair e validar parâmetros (incluindo o novo itemId)
  const { storeId, month, year, itemId } = req.query;

  if (!storeId || !month || !year || !itemId) {
    return res.status(400).json({ 
      message: "storeId, month, year, e itemId são obrigatórios." 
    });
  }

  try {
    // 2. Query que busca os dados diários APENAS para o item_id especificado
    const query = `
      SELECT 
        analysis_date,
        item_name,
        total_quantity_sold,
        total_revenue_generated
      FROM daily_item_analysis
      WHERE store_id = $1
        AND EXTRACT(MONTH FROM analysis_date) = $2
        AND EXTRACT(YEAR FROM analysis_date) = $3
        AND item_id = $4
      ORDER BY analysis_date ASC; -- Ordena por data para ver o comportamento
    `;

    const values = [storeId, month, year, itemId];

    // 3. Executar a consulta
    const result = await pool.query(query, values);

    // 4. Retornar os dados (lista de ~30 dias para aquele item)
    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Erro ao buscar histórico do item:', error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar histórico do item." });
  }
};

export const getChannelsMostMonthUsed = async (req: Request, res: Response) => {
  const { storeId, month, year } = req.query;

  try {
     const query = `
      SELECT 
        c.name AS channel_name,
        SUM(chan.total_used) AS total_used
      FROM (
        SELECT 
          (jsonb_each_text(d.channel_counts)).key::int AS channel_id,
          (jsonb_each_text(d.channel_counts)).value::int AS total_used
        FROM daily_store_analysis d
        WHERE d.store_id = $1
          AND EXTRACT(MONTH FROM d.analysis_date) = $2
          AND EXTRACT(YEAR FROM d.analysis_date) = $3
      ) AS chan
      JOIN channels c ON c.id = chan.channel_id
      GROUP BY c.name
      ORDER BY total_used DESC;
    `;

    const result = await pool.query(query, [storeId, month, year]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar canais:", error);
    res.status(500).json({ message: "Erro interno ao buscar canais" });
  }
};



export const getTopDiscountReasonsMonth = async (req: Request, res: Response) => {
  const { storeId, month, year } = req.query;

  try {
    const query = `
      SELECT 
        reason,
        SUM(count::int) AS total_used
      FROM (
        SELECT 
          (jsonb_each_text(d.discount_reasons_count)).key AS reason,
          (jsonb_each_text(d.discount_reasons_count)).value AS count
        FROM daily_store_analysis d
        WHERE d.store_id = $1
          AND EXTRACT(MONTH FROM d.analysis_date) = $2
          AND EXTRACT(YEAR FROM d.analysis_date) = $3
      ) AS reasons
      GROUP BY reason
      ORDER BY total_used DESC;
    `;

    const values = [storeId, month, year];
    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar motivos de desconto:", error);
    res.status(500).json({ message: "Erro interno ao buscar motivos de desconto" });
  }
};
