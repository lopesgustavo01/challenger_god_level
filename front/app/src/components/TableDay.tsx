import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, XCircle } from "lucide-react"
import type { DailyAnalysis } from "@/services/dashboardService"

interface DailyTableProps {
  storeId?: number
  analysis: DailyAnalysis[]
  setSelectedDay: (value: DailyAnalysis) => void
}

export function DailyAnalysisTable({ analysis, setSelectedDay }: DailyTableProps) {

  const handleRowClick = (day: DailyAnalysis) => {
    setSelectedDay(day)
  }

  return (
    <Card className="border-[var(--border)]/50 bg-[var(--card)] text-[var(--foreground)] shadow-none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" style={{ color: "var(--primary)" }} />
          <div>
            <CardTitle className="text-[var(--foreground)]">Análise Diária</CardTitle>
            <CardDescription className="text-[var(--muted-foreground)]">
              Resumo diário de vendas e cancelamentos
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border-none overflow-hidden">
          <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
            <Table>
              <TableHeader className="sticky top-0 bg-[var(--card)] z-10">
                <TableRow className="bg-[var(--accent)]/20">
                  <TableHead className="font-semibold text-[var(--foreground)]">Dia</TableHead>
                  <TableHead className="text-right font-semibold text-[var(--foreground)]">
                    Total de Vendas
                  </TableHead>
                  <TableHead className="text-right font-semibold text-[var(--foreground)]">
                    Canceladas
                  </TableHead>
                  <TableHead className="text-right font-semibold text-[var(--foreground)]">
                    Taxa (%)
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {analysis.map((day) => {
                  const cancelRate =
                    day.totalSales > 0 ? (day.cancelledSales / day.totalSales) * 100 : 0

                  return (
                    <TableRow
                      key={day.id}
                      className="transition-colors cursor-pointer group"
                      style={{ background: "var(--card)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--accent-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "var(--card)")
                      }
                      onClick={() => handleRowClick(day)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-1 h-8 rounded-full transition-colors"
                            style={{ background: "var(--primary)" }}
                          />
                          <span className="group-hover:text-[var(--primary)] transition-colors">
                            {new Date(day.date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right font-semibold">
                        <div className="flex justify-end items-center gap-1 text-[var(--primary)]">
                          <TrendingUp className="h-3 w-3" />
                          {day.totalSales}
                        </div>
                      </TableCell>

                      <TableCell className="text-right font-semibold">
                        <div className="flex justify-end items-center gap-1 text-[var(--destructive)]">
                          <XCircle className="h-3 w-3" />
                          {day.cancelledSales}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <Badge
                          variant={cancelRate > 10 ? "destructive" : "secondary"}
                          className="gap-1 font-semibold"
                        >
                          {cancelRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
