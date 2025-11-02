// src/services/dashboardService.ts

// 1. Importe a instância central do Axios
import { api } from "./api";

// 2. [IMPORTANTE] Defina os tipos de dados que você espera do backend
// TODO: Ajuste estas interfaces para bater EXATAMENTE com o que sua API retorna.
// Coloquei exemplos baseados nos nomes das suas rotas.

export interface DailyAnalysis {
  id: number;
  storeId: number;
  date: string;

  // Contadores Gerais
  totalSales: number;
  completedSales: number;
  cancelledSales: number;
  uniqueCustomers: number;

  // Métricas de Receita
  amountSum: number;
  amountAvg: number;
  amountStd: number;

  // Valor Pago
  valuePaidSum: number;
  valuePaidAvg: number;
  valuePaidStd: number;

  // Valor dos Itens
  itemsValueSum: number;
  itemsValueAvg: number;
  itemsValueStd: number;

  // Descontos
  discountSum: number;
  discountAvg: number;
  discountStd: number;

  // Acréscimos
  increaseSum: number;
  increaseAvg: number;
  increaseStd: number;

  // Taxas de entrega
  deliveryFeeSum: number;
  deliveryFeeAvg: number;
  deliveryFeeStd: number;

  // Taxa de serviço
  serviceTaxSum: number;
  serviceTaxAvg: number;
  serviceTaxStd: number;

  // Métricas Operacionais: produção
  productionSecondsSum: number;
  productionSecondsAvg: number;
  productionSecondsStd: number;

  // Métricas Operacionais: entrega
  deliverySecondsSum: number;
  deliverySecondsAvg: number;
  deliverySecondsStd: number;

  // Pessoas
  peopleQtySum: number;
  peopleQtyAvg: number;
  peopleQtyStd: number;
}

export interface ItemHistory {
  date: string; // Ex: "2025-10"
  totalSold: number;
}

export interface StoreSales {
  storeId: string;
  storeName: string;
  totalSales: number;
}

export interface propsDados {
  storeId: number, 
  month: number,
  year: number
}

export const getDailyAnalysis = async ({ storeId, month, year }: propsDados): Promise<DailyAnalysis[]> => {
  try {
    const response = await api.get<DailyAnalysis[]>('/analytics', {
      params: { storeId, month, year },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.map((d: any): DailyAnalysis => ({
      id: d.id,
      storeId: d.store_id,
      date: d.analysis_date,

      totalSales: d.total_sales_count,
      completedSales: d.completed_sales_count,
      cancelledSales: d.cancelled_sales_count,
      uniqueCustomers: d.unique_customers_count,

      amountSum: Number(d.total_amount_sum),
      amountAvg: Number(d.total_amount_avg),
      amountStd: Number(d.total_amount_stddev),

      valuePaidSum: Number(d.value_paid_sum),
      valuePaidAvg: Number(d.value_paid_avg),
      valuePaidStd: Number(d.value_paid_stddev),

      itemsValueSum: Number(d.total_items_value_sum),
      itemsValueAvg: Number(d.total_items_value_avg),
      itemsValueStd: Number(d.total_items_value_stddev),

      discountSum: Number(d.total_discount_sum),
      discountAvg: Number(d.total_discount_avg),
      discountStd: Number(d.total_discount_stddev),

      increaseSum: Number(d.total_increase_sum),
      increaseAvg: Number(d.total_increase_avg),
      increaseStd: Number(d.total_increase_stddev),

      deliveryFeeSum: Number(d.delivery_fee_sum),
      deliveryFeeAvg: Number(d.delivery_fee_avg),
      deliveryFeeStd: Number(d.delivery_fee_stddev),

      serviceTaxSum: Number(d.service_tax_fee_sum),
      serviceTaxAvg: Number(d.service_tax_fee_avg),
      serviceTaxStd: Number(d.service_tax_fee_stddev),

      productionSecondsSum: Number(d.production_seconds_sum),
      productionSecondsAvg: Number(d.production_seconds_avg),
      productionSecondsStd: Number(d.production_seconds_stddev),

      deliverySecondsSum: Number(d.delivery_seconds_sum),
      deliverySecondsAvg: Number(d.delivery_seconds_avg),
      deliverySecondsStd: Number(d.delivery_seconds_stddev),

      peopleQtySum: Number(d.people_quantity_sum),
      peopleQtyAvg: Number(d.people_quantity_avg),
      peopleQtyStd: Number(d.people_quantity_stddev),
    }));
  } catch (error) {
    console.error("Erro ao buscar análise diária:", error);
    throw error;
  }
};

export type TopItem = {
  item_id: number
  item_name: string
  quantidadeTotalVendida: number
  receitaTotalGerada: number
}

export const getTopItemsByMonth = async ({ storeId, month, year }: propsDados): Promise<TopItem[]> => {
  try {
    const response = await api.get<TopItem[]>('/analytics/items', {
      params: { storeId, month, year } 
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar top items:", error);
    throw error;
  }
};

/**
 * Busca o histórico de vendas de um item específico.
 * Rota: GET /analytics/item-history
 * Assumindo query params para 'itemId', 'month', 'year'
 */
export const getItemHistoryByMonth = async (itemId: string, month: number, year: number): Promise<ItemHistory[]> => {
  try {
    const response = await api.get<ItemHistory[]>('/analytics/item-history', {
      params: { itemId, month, year }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar histórico do item:", error);
    throw error;
  }
};



export interface DailyDetail {
  id: number
  customer_name: string | null
  sale_status_desc: string
  total_amount_items: string
  service_tax_fee: string
  total_amount: string
  total_discount: string
  delivery_fee: string
  channel_name: string | null
  value_paid: string
  total_increase: string
  delivery_seconds: number | null
  production_seconds: number | null
}

export async function getDailyDetails(storeId: number, date: string): Promise<DailyDetail[]> {
  try {
    const response = await api.get<DailyDetail[]>('/sales/daily', {
      params: { storeId, date }
    });
    return response.data
  } catch (error) {
    console.error("Erro ao buscar vendas por loja:", error);
    throw error;
  }
}


// NOVOS TIPOS ✅
export interface ChannelAnalytics {
  channel_name: string;
  total_used: number;
}

export interface DiscountReasonAnalytics {
  reason: string;
  total_used: number;
}

// NOVAS FUNÇÕES ✅
export const getChannelsMostMonthUsed = async ({ storeId, month, year }: propsDados): Promise<ChannelAnalytics[]> => {
  try {
    const response = await api.get<ChannelAnalytics[]>('/analytics/bestchannel', {
      params: { storeId, month, year }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar canais mais usados:", error);
    throw error;
  }
};

export const getTopDiscountReasonsMonth = async ({ storeId, month, year }: propsDados): Promise<DiscountReasonAnalytics[]> => {
  try {
    const response = await api.get<DiscountReasonAnalytics[]>('/analytics/discount-reasons', {
      params: { storeId, month, year }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar motivos de desconto:", error);
    throw error;
  }
};
