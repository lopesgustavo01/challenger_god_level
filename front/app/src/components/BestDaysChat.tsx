"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
} from "recharts"
import type { DailyAnalysis } from "@/services/dashboardService"
import type { MetricType } from "@/pages/dashboard"

interface SalesChartProps {
  analysis: DailyAnalysis[]
  selectedMetric: MetricType
}

export function BestDaysChart({ analysis, selectedMetric }: SalesChartProps) {
  if (!analysis?.length) return <p>Sem dados</p>

  const format2 = (v: number) => Number(v.toFixed(2))

  const chartData = analysis
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((d) => {
      let value = 0
      switch (selectedMetric) {
        case "amountSum":
          value = Number(d.amountSum)
          break
        case "totalSales":
          value = d.totalSales
          break
        case "people":
          value = d.uniqueCustomers
          break
        case "ticket":
          value = d.totalSales > 0 ? Number(d.amountSum) / d.totalSales : 0
          break
      }

      return {
        date: new Date(d.date).getDate(),
        value: format2(value),
      }
    })

  // Média e desvio padrão do mês
  const values = chartData.map((d) => d.value)
  const average = format2(values.reduce((s, v) => s + v, 0) / values.length)
  const stdDev = format2(Math.sqrt(values.reduce((s, v) => s + Math.pow(v - average, 2), 0) / values.length))
  const upperSD = average + stdDev
  const lowerSD = average - stdDev

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const labelMetric: any = {
    totalSales: "Vendas Diárias",
    amountSum: "Receita Diária (R$)",
    uniqueCustomers: "Clientes Únicos",
    ticket: "Ticket Médio (R$)",
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0]?.value || 0
      return (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-foreground mb-2">Dia {label}</p>
          <div className="space-y-1 text-xs">
            <p>
              <span className="font-medium">Valor: </span>
              {selectedMetric === "amountSum" || selectedMetric === "ticket"
                ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                : value.toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Média mês: </span>
              {selectedMetric === "amountSum" || selectedMetric === "ticket"
                ? `R$ ${average.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                : average.toLocaleString()}
            </p>
            <p>
              <span className="font-medium">SD mês: </span>
              {selectedMetric === "amountSum" || selectedMetric === "ticket"
                ? `R$ ${stdDev.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                : stdDev.toLocaleString()}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-[var(--border)]/50 bg-[var(--card)]">
      <CardHeader>
        <CardTitle>{labelMetric[selectedMetric]}</CardTitle>
        <CardDescription className="flex items-center gap-4 text-xs">
          <span>Análise diária com média e desvio padrão</span>
          <span className="text-muted-foreground">
            Média:{" "}
            {selectedMetric === "amountSum" || selectedMetric === "ticket"
              ? `R$ ${average.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
              : average.toLocaleString()}
          </span>
          <span className="text-muted-foreground">
            SD:{" "}
            {selectedMetric === "amountSum" || selectedMetric === "ticket"
              ? `R$ ${stdDev.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
              : stdDev.toLocaleString()}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl-(var(--border))" opacity={0.3} />
            <XAxis dataKey="date" stroke="hsl-(var(--foreground))" fontSize={12} />
            <YAxis yAxisId="left" stroke="hsl-(var(--foreground))" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />

            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl-(var(--primary))" stopOpacity={0.9} />
                <stop offset="100%" stopColor="hsl-(var(--primary))" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <Bar
              yAxisId="left"
              dataKey="value"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey={() => average}
              stroke="var(--chart-5)"
              strokeWidth={2.5}
              dot={false}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey={() => upperSD}
              stroke="var(--chart-5)"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
              opacity={0.6}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey={() => lowerSD}
              stroke="var(--chart-5)"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
              opacity={0.6}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
