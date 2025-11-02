import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BadgePercent } from "lucide-react"
import { useEffect, useState } from "react"
import { getTopDiscountReasonsMonth, type DiscountReasonAnalytics } from "@/services/dashboardService"

interface BestDiscountReasonsProps {
  selectedMonth?: string
  selectedYear?: string
  storeId: number
}

export function BestDiscountReasons({ storeId, selectedMonth, selectedYear }: BestDiscountReasonsProps) {
  const [discountReasons, setDiscountReasons] = useState<DiscountReasonAnalytics[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        if (selectedMonth && selectedYear) {
          const result = await getTopDiscountReasonsMonth({
            storeId: storeId,
            month: parseInt(selectedMonth),
            year: parseInt(selectedYear),
          })
          setDiscountReasons(result)
        }
      } catch (err) {
        console.error(err)
      }
    }

    loadData()
  }, [selectedMonth, selectedYear, storeId])

  return (
    <div className="h-full">
      <Card className="border-[var(--border)]/50 bg-[var(--card)] shadow-none text-[var(--foreground)] bg-[var(--card)] h-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BadgePercent className="h-5 w-5 text-[var(--accent)]" />
            <div>
              <CardTitle>Motivos de Desconto</CardTitle>
              <CardDescription className="text-[var(--muted-foreground)]">
                Principais motivos aplicados no mês
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
                    <TableHead className="font-semibold">Motivo</TableHead>
                    <TableHead className="text-right font-semibold">Total Usado</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {discountReasons.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell className="text-right font-bold">{item.total_used}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
