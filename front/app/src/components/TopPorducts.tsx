import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, Package } from "lucide-react"
import type { TopItem } from "@/services/dashboardService"

interface TopProductsTableProps {
  storeId?: number
  topItems: TopItem[]
}

export function TopProductsTable({ storeId, topItems }: TopProductsTableProps) {
  return (
    <div className="max-h-[450px]">
      <Card className="border-[var(--accent)]/0 shadow-none text-[var(--foreground)] bg-[var(--card)]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[var(--accent)]" />
            <div>
              <CardTitle>Top Produtos</CardTitle>
              <CardDescription className="text-[var(--muted-foreground)]">
                Itens mais vendidos {storeId ? `— Loja #${storeId}` : ""}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border-none overflow-hidden">
            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader className="sticky top-0 bg-[var(--card)] z-10">
                  <TableRow className="bg-[var(--accent)]/10">
                    <TableHead className="font-semibold">Produto</TableHead>
                    <TableHead className="text-right font-semibold">Vendas</TableHead>
                    <TableHead className="text-right font-semibold">Receita</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {topItems.length > 0 ? (
                    topItems.map((item, idx) => {
                      const rankBar =
                        idx === 0 ? "bg-yellow-500"
                        : idx === 1 ? "bg-gray-300"
                        : idx === 2 ? "bg-amber-600"
                        : "bg-[var(--accent)]/30"

                      return (
                        <TableRow
                          key={item.item_id}
                          className="hover:bg-[var(--accent)]/10 transition-colors cursor-pointer border-b-[var(--accent)]/10"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className={`w-1 h-8 rounded-full ${rankBar}`} />
                              <span>{item.item_name}</span>
                            </div>
                          </TableCell>

                          <TableCell className="text-right font-semibold text-[var(--accent)] flex justify-end gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {item.quantidadeTotalVendida}
                          </TableCell>

                          <TableCell className="text-right font-bold text-[var(--accent)]">
                            {item.receitaTotalGerada.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-4 text-[var(--muted-foreground)]"
                      >
                        Sem dados disponíveis
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
