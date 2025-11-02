import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import type { DailyAnalysis } from "@/services/dashboardService"
import { Percent, TrendingDown, ShoppingBag } from "lucide-react"

interface DiscountAnalysisProps {
  storeId?: number
  analysis: DailyAnalysis[]
}

export function DiscountAnalysis({ analysis }: DiscountAnalysisProps) {

  const totalDiscount = analysis.reduce((sum, d) => sum + (d.discountSum), 0)
  const totalTaxes = analysis.reduce((sum, d) => sum + (d.serviceTaxSum), 0)
  const totalRevenue = analysis.reduce((sum, d) => sum + Number(d.amountSum), 0)
  const totalVendas = analysis.reduce((sum, d) => sum + d.totalSales, 0)
  const totalVendascanceladas = analysis.reduce((sum, d) => sum + d.cancelledSales, 0)

  const discountPercentage = (totalDiscount / totalRevenue) * 100
  const taxPercentage = (totalTaxes / totalRevenue) * 100
  const salesPorcentagem = (totalVendascanceladas / totalVendas) * 100
  const netRevenue = totalRevenue - totalDiscount + totalTaxes

  return (
    <Card className="border-[var(--border)]/50 bg-[var(--card)] h-full">
      <CardHeader>
        <CardTitle className="text-[var(--foreground)]">Análise Financeira</CardTitle>
        <CardDescription className="text-[var(--muted-foreground)]">
          Descontos e taxas do período
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-sm font-medium text-[var(--foreground)]">Total de vendas</span>
            </div>
            <span className="text-sm font-bold text-[var(--primary)]">
              {totalVendas}
            </span>
          </div>
          <Progress value={salesPorcentagem} className="h-2 bg-[var(--muted)] [&>div]:bg-[var(--accent)]" />
          <p className="text-xs text-[var(--primary)]">{salesPorcentagem.toFixed(1)}% das vendas totais</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-[var(--destructive)]" />
              <span className="text-sm font-medium text-[var(--foreground)]">Total em Descontos</span>
            </div>
            <span className="text-sm font-bold text-[var(--destructive)]">
              R$ {totalDiscount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <Progress value={discountPercentage} className="h-2 bg-[var(--muted)] [&>div]:bg-[var(--destructive)]" />
          <p className="text-xs text-[var(--muted-foreground)]">{discountPercentage.toFixed(1)}% da receita total</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-sm font-medium text-[var(--foreground)]">Total em Taxas</span>
            </div>
            <span className="text-sm font-bold text-[var(--primary)]">
              R$ {totalTaxes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <Progress value={taxPercentage} className="h-2 bg-[var(--muted)] [&>div]:bg-[var(--accent)]" />
          <p className="text-xs text-[var(--muted-foreground)]">{taxPercentage.toFixed(1)}% da receita total</p>
        </div>

        <div className="pt-4 border-t border-[var(--border)]">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[var(--foreground)]">Receita Líquida</span>
            <span className="text-lg font-bold text-[var(--primary)]">
              R$ {netRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
