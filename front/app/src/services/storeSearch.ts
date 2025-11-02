import { api } from "./api";

export interface StoreResult {
  id: number;
  name: string;
  state: string;
  city: string;
  address_street: string;
  district: string;
}


export const getSearchStore = async ( q: string ): Promise<StoreResult[]> => {
  try {
    const response = await api.get<StoreResult[]>('/store/search', {
      params: { q } 
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar top items:", error);
    throw error;
  }
};