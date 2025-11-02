import { Request, Response } from 'express';
// Importamos nosso pool de conexão
import { pool } from '../config/db';

/**
 * Controller para: GET /api/v1/stores
 * Busca todas as lojas ativas, ordenadas por nome.
 */
export const getAllStores = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT id, name 
      FROM stores 
      WHERE is_active = true 
      ORDER BY name ASC
    `;
    
    // Executa a query no pool
    const result = await pool.query(query);

    // Retorna as linhas (stores) encontradas
    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Erro ao buscar lojas:', error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar lojas", error });
  }
};

/**
 * Controller para: GET /api/v1/stores/search?q=...
 * Busca lojas ativas cujo nome corresponde ao termo de busca (q),
 * ideal para um autocomplete.
 */
export const searchStores = async (req: Request, res: Response) => {
  // Pegamos o termo de busca da query string
  const { q } = req.query;
  console.log(q)

  if (typeof q !== 'string' || q.length < 1) {
    return res.status(400).json({ message: "Termo de busca (q) é obrigatório." });
  }

  try {
    // Usamos ILIKE para busca case-insensitive (ignora maiúsculas/minúsculas)
    // Usamos $1 como "placeholder" para o valor -> Prevenção de SQL Injection
    // Limitamos a 10 resultados, o que é bom para autocomplete
    const searchQuery = `
      SELECT id, name 
      FROM stores 
      WHERE name ILIKE $1 
      ORDER BY name ASC 
      LIMIT 10
    `;
    
    // O valor para $1. Os '%' são wildcards (coringas).
    const values = [`%${q}%`]; 

    // Executa a query passando os valores com segurança
    const result = await pool.query(searchQuery, values);

    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Erro ao pesquisar lojas:', error);
    res.status(500).json({ message: "Erro interno do servidor ao pesquisar lojas", error });
  }
};