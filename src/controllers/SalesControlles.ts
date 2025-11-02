import { Request, Response } from 'express';
// Assumindo que seu pool está em '../config/db' como no seu outro arquivo
import { pool } from '../config/db'; 

export const getSalesByStore = async (req: Request, res: Response) => {
 const { storeId, date } = req.query;

  if (!storeId || !date) {
    return res.status(400).json({ message: "storeId e date são obrigatórios." });
  }

  try {
    const selectedDate = new Date(date as string);
    const startDate = selectedDate.toISOString().split("T")[0]; // pega YYYY-MM-DD
    const endDate = `${startDate}T23:59:59`;

    const result = await pool.query(
      `
          SELECT 
        s.id,
        s.customer_name,
        s.sale_status_desc,
        s.total_amount_items,
        s.service_tax_fee,
        s.total_amount,
        s.total_discount,
        s.delivery_fee,
        c.name AS channel_name, -- aqui pegamos o nome
        s.value_paid,
        s.total_increase,
        s.delivery_seconds,
        s.production_seconds
    FROM sales s
    LEFT JOIN channels c ON s.channel_id = c.id
    WHERE s.store_id = $1
      AND s.created_at >= $2
      AND s.created_at <= $3
    ORDER BY s.created_at DESC;

      `,
      [storeId, `${startDate}T00:00:00`, endDate]
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Erro ao buscar vendas do dia:", error);
    res.status(500).json({ message: "Erro interno", error });
  }
};
