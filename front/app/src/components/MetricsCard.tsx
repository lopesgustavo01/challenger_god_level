import { TrendingUp, DollarSign, Users, ShoppingCart } from "lucide-react"
import { type MetricType } from "../pages/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import type { DailyAnalysis } from "@/services/dashboardService"

interface MetricsCardsProps {
  selectedMetric: MetricType
  onMetricClick: (metric: MetricType) => void
  analysis: DailyAnalysis[]
}

export function MetricsCards({selectedMetric, onMetricClick, analysis }: MetricsCardsProps) {

  const totalSales = analysis?.reduce((sum, d) => sum + d.totalSales, 0) ?? 0
  const totalRevenue = analysis.reduce((sum, d) => sum + Number(d.amountSum), 0)
  const totalCustomers = analysis.reduce((sum, d) => sum + d.uniqueCustomers, 0)
  const avgTicket = totalRevenue / totalSales
  if(analysis.length>0) console.log(analysis[0].id)

  const metrics = [
    {
      type: "amountSum" as MetricType,
      title: "Receita Total",
      value: `R$ ${totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
    },
    {
      type: "totalSales" as MetricType,
      title: "Total de Vendas",
      value: totalSales.toLocaleString(),
      icon: ShoppingCart,
    },
    {
      type: "people" as MetricType,
      title: "Clientes Únicos",
      value: totalCustomers.toLocaleString(),
      icon: Users,
    },
    {
      type: "ticket" as MetricType,
      title: "Ticket Médio",
      value: `R$ ${avgTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const isActive = selectedMetric === metric.type
        return (
          <Card
            key={metric.type}
            className={`border-[var(--border)]/50 bg-[var(--card)] cursor-pointer transition-all hover:scale-105 ${
              isActive ? "ring-2 ring-[var(--primary)] shadow-lg" : ""
            }`}
            onClick={() => onMetricClick(metric.type)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${isActive ? "text-[var(--primary)]" : "text-[var(--primary)]/70"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--foreground)]">{metric.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
