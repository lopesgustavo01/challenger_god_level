"use client"
import { useState, useEffect, useMemo } from "react"
import type { DailyAnalysis, DailyDetail } from "@/services/dashboardService"
import { getDailyDetails } from "@/services/dashboardService"
import {
  ArrowLeft,
  X,
  TrendingDown,
  Percent,
  Check,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Progress } from "@/components/ui/progress"

interface DailyDataSelectProps {
  day: DailyAnalysis
  setSelectedDay: (value: DailyAnalysis | null) => void
}

export function DailyDataSelect({ day, setSelectedDay }: DailyDataSelectProps) {
  const [daySales, setDaySales] = useState<DailyDetail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDaily() {
      setLoading(true)
      try {
        const result = await getDailyDetails(day.storeId, day.date)
        setDaySales(Array.isArray(result) ? result : [])
      } catch (err) {
        console.error(err)
        setDaySales([])
      } finally {
        setLoading(false)
      }
    }
    fetchDaily()
  }, [day])

  const channelSummary = useMemo(() => {
    if (loading || daySales.length === 0) {
      return []
    }

    const counts = daySales.reduce(
      (acc, sale) => {
        const channel = sale.channel_name || "Indefinido"
        acc[channel] = (acc[channel] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [daySales, loading])

  // --- Funções e Cálculos ---
  const currency = (v: string | number): string => {
    const num = typeof v === "string" ? parseFloat(v) : v
    return `R$ ${num?.toFixed(2) ?? "0.00"}`
  }

  const totalSales = day.totalSales || 1 // Evita divisão por zero
  const discountPercentage = (day.discountSum / day.amountSum) * 100
  const taxPercentage = (day.serviceTaxSum / day.amountSum) * 100
  // Percentual de vendas canceladas
  const salesPorcentagem = (day.cancelledSales / totalSales) * 100

  return (
    <div className="space-y-2 p-2 bg-[var(--background)] rounded-xl min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[var(--border)]/40">
        <button
          onClick={() => setSelectedDay(null)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-colors duration-200 font-medium"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
        <div>
          <h2 className="text-3xl font-bold text-[var(--foreground)] text-center">
            Vendas do dia
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1 text-center">
            {new Date(day.date).toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="w-24"></div>{" "}
        {/* Espaçador para manter o título centralizado */}
      </div>

      {/* Loading / Sem Vendas */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[var(--primary)] border-t-transparent"></div>
          <p className="ml-3 text-sm text-[var(--muted-foreground)] mt-4">
            Carregando vendas...
          </p>
        </div>
      )}

      {!loading && daySales.length === 0 && (
        <div className="flex items-center justify-center py-24 rounded-lg border-2 border-dashed border-[var(--border)]/40 bg-[var(--card)]/50">
          <p className="text-lg font-medium text-[var(--muted-foreground)]">
            Nenhuma venda registrada neste dia
          </p>
        </div>
      )}

      {/* Layout Principal (Grid) */}
      {!loading && daySales.length > 0 && (
        // O gap-6 aqui é importante
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* =================================================================== */}
          {/* MUDANÇA AQUI: Coluna Principal (Tabela) */}
          {/* =================================================================== */}
          <div className="lg:col-span-3 border-[var(--border)]/50 bg-[var(--card)] rounded-lg overflow-hidden flex flex-col">
            
            {/* Cabeçalho do Card da Tabela */}
            <div className="p-4 border-b border-[var(--border)]/40">
              <h3 className="text-[var(--foreground)] font-semibold">
                Detalhes das Vendas ({daySales.length})
              </h3>
            </div>

            {/* Contêiner de Scroll da Tabela */}
            <div className="overflow-auto max-h-[75vh]">
              <table className="w-full text-sm">
                <thead className="bg-[var(--chart-4)] sticky top-0 z-10 border-b border-[var(--border)]/40">
                  <tr>
                    {[
                      "Cliente",
                      "Status",
                      "Canal",
                      "Total",
                      "Pago",
                      "Desconto",
                      "Acréscimo",
                      "Serviço",
                      "Entrega",
                      "Produção (s)",
                      "Entrega (s)",
                    ].map((th, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 font-semibold text-[var(--foreground)] text-left"
                      >
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/40 border-t border-[var(--border)]/40">
                  {daySales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="hover:bg-[var(--primary)]/10 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 font-medium">
                        {sale.customer_name || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`flex items-center gap-1.5 font-semibold text-sm ${
                            sale.sale_status_desc === "COMPLETED"
                              ? "text-[var(--green)]"
                              : sale.sale_status_desc === "CANCELLED"
                                ? "text-[var(--destructive)]"
                                : "text-[var(--foreground)]"
                          }`}
                        >
                          {sale.sale_status_desc === "COMPLETED" && (
                            <Check size={14} />
                          )}
                          {sale.sale_status_desc === "CANCELLED" && (
                            <X size={14} />
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">{sale.channel_name || "-"}</td>
                      <td className="px-4 py-3 text-right font-semibold text-[var(--primary)]">
                        {currency(sale.total_amount)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-[var(--green)]">
                        {currency(sale.value_paid)}
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--destructive)]">
                        {currency(sale.total_discount)}
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--green)]">
                        {currency(sale.total_increase)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {currency(sale.service_tax_fee)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {currency(sale.delivery_fee)}
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--muted-foreground)]">
                        {sale.production_seconds ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--muted-foreground)]">
                        {sale.delivery_seconds ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* =================================================================== */}
          
          
          {/* =================================================================== */}
          {/* MUDANÇA AQUI: Coluna Lateral (Resumos) */}
          {/* =================================================================== */}
          {/* 'flex flex-col' -> empilha os cards
            'gap-6' -> espaçamento consistente (igual ao grid)
            'lg:self-start' -> ALINHA AO TOPO. É a chave para a harmonia.
          */}
          <div className="lg:col-span-1 flex flex-col gap-6 lg:self-start">
            {/* Card: Top Canais (AGORA EM UM CARD) */}
            <Card className="border-[var(--border)]/50 bg-[var(--card)]">
              <CardHeader>
                <CardTitle className="text-[var(--foreground)]">
                  Top Canais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 lg:space-y-2">
                {channelSummary.map((channel, index) => (
                  <div
                    key={channel.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center">
                      <span
                        className={`font-bold w-6 text-left ${
                          index === 0 ? "text-[var(--primary)]" : ""
                        }`}
                      >
                        {index + 1}.
                      </span>
                      <span className="font-medium text-[var(--foreground)]">
                        {channel.name}
                      </span>
                    </div>
                    <span className="font-bold text-[var(--muted-foreground)] bg-[var(--background)] px-2 py-0.5 rounded">
                      {channel.count} {channel.count > 1 ? "vendas" : "venda"}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Card: Análise Financeira (ATUALIZADO) */}
            <Card className="border-[var(--border)]/50 bg-[var(--card)]">
              <CardHeader>
                <h4 className="p-0 m-0 font-semibold text-[var(--foreground)]">
                  Análise Financeira
                </h4>
              </CardHeader>

              <CardContent className="space-y-1 lg:space-y-6">
                <div className="space-y-1 lg:space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <X className="h-4 w-4 text-[var(--destructive)]" />
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        Vendas Canceladas
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[var(--destructive)]">
                      {day.cancelledSales}
                    </span>
                  </div>
                  <Progress
                    value={salesPorcentagem}
                    className="h-2 bg-[var(--muted)] [&>div]:bg-[var(--destructive)]"
                  />
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {salesPorcentagem.toFixed(1)}% das vendas totais
                  </p>
                </div>

                {/* --- Bloco Descontos (Atualizado com currency) --- */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-[var(--destructive)]" />
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        Total em Descontos
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[var(--destructive)]">
                      {currency(day.discountSum)}
                    </span>
                  </div>
                  <Progress
                    value={discountPercentage}
                    className="h-2 bg-[var(--muted)] [&>div]:bg-[var(--destructive)]"
                  />
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {discountPercentage.toFixed(1)}% da receita total
                  </p>
                </div>

                {/* --- Bloco Taxas (Atualizado com currency) --- */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-[var(--primary)]" />
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        Total em Taxas
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[var(--primary)]">
                      {currency(day.serviceTaxSum)}
                    </span>
                  </div>
                  <Progress
                    value={taxPercentage}
                    className="h-2 bg-[var(--muted)] [&>div]:bg-[var(--accent)]"
                  />
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {taxPercentage.toFixed(1)}% da receita total
                  </p>
                </div>

                {/* --- Rodapé (Atualizado com currency) --- */}
                <div className="pt-1 border-t border-[var(--border)]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      Receita Líquida
                    </span>
                    <span className="text-lg font-bold text-[var(--primary)]">
                      {currency(day.amountSum)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* =================================================================== */}

        </div>
      )}
    </div>
  )
}