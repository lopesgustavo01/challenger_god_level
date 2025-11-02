"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react"
import { MetricsCards } from "../components/MetricsCard"
import { DiscountAnalysis } from "../components/DiscountAnalysis"
import { BestDaysChart } from "../components/BestDaysChat"
import { useTheme } from "../hooks/UseTheme"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type DailyAnalysis, getDailyAnalysis, getTopItemsByMonth, type TopItem } from "@/services/dashboardService"
import { DailyAnalysisTable } from "@/components/TableDay"
import { TopProductsTable } from "@/components/TopPorducts"
import { DailyDataSelect } from "@/components/DailyData"
import { BestChannels } from "@/components/BestChannelsCard"
import { BestDiscountReasons } from "@/components/DiscoutReasons"

interface DashboardProps {
  storeId: number
  onBack: () => void
}

export type MetricType = "totalSales" | "amountSum" | "ticket" | "people"

export function Dashboard({ storeId, onBack }: DashboardProps) {
  const [selectedDay, setSelectedDay] = useState<DailyAnalysis | null>(null)
  // modo page
  const [activeTab, setActiveTab] = useState<"overview" | "details">("overview")
  const [activeSlide, setActiveSlide] = useState(0);

  const { theme, toggleTheme } = useTheme()
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("totalSales")
  const [selectedMonth, setSelectedMonth] = useState("8")
  const [selectedYear, setSelectedYear] = useState("2025")

  // analises
  const [analysis, setAnalysis] = useState<DailyAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [topItems, setTopItems] = useState<TopItem[]>([])

  const months = [
    { value: "0", label: "Janeiro" },
    { value: "1", label: "Fevereiro" },
    { value: "2", label: "Março" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Maio" },
    { value: "5", label: "Junho" },
    { value: "6", label: "Julho" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Setembro" },
    { value: "9", label: "Outubro" },
    { value: "10", label: "Novembro" },
    { value: "11", label: "Dezembro" },
  ]

  const years = ["2023", "2024", "2025"]

  useEffect(() => {
    async function loadData() {
      try {

        const result = await getDailyAnalysis({storeId, month: parseInt(selectedMonth), year: parseInt(selectedYear)})
        setAnalysis(result)

        const items = await getTopItemsByMonth({
          storeId,
          month: parseInt(selectedMonth),
          year: parseInt(selectedYear)
        })
        setTopItems(items)

        setError(null)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: unknown) {
        setError("Erro ao carregar análise diária")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedMonth, selectedYear, storeId])

  const slides = [
  {
    id: "discount",
    component: (
      <DiscountAnalysis storeId={storeId} analysis={analysis} />
    ),
  },
  {
    id: "channels",
    component: (
      <BestChannels
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        storeId={storeId}
      />
    ),
  },
  {
    id: "reasons",
    component: (
      <BestDiscountReasons
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        storeId={storeId}
      />
    ),
  },
]


  if (loading) return <p>Carregando dados...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  if(selectedDay != null) return <DailyDataSelect day={selectedDay} setSelectedDay={setSelectedDay}/>



  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)] transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-[var(--foreground)]"
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)]">Analytics Dashboard</h1>
              <p className="text-sm text-[var(--muted-foreground)]">Loja #{storeId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Month select */}
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger
                className="w-[140px] border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)]/20 transition-colors"
              >
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--card)] border border-[var(--border)]">
                {months.map((month) => (
                  <SelectItem
                    key={month.value}
                    value={month.value}
                    className="hover:bg-[var(--accent)]/20 focus:bg-[var(--accent)]/20 text-[var(--foreground)]"
                  >
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year select */}
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger
                className="w-[100px] border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)]/20 transition-colors"
              >
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--card)] border border-[var(--border)]">
                {years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year}
                    className="hover:bg-[var(--accent)]/20 focus:bg-[var(--accent)]/20 text-[var(--foreground)]"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Theme toggle */}
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-[var(--foreground)]" />
              ) : (
                <Moon className="h-5 w-5 text-[var(--foreground)]" />
              )}
            </Button>
          </div>
        </div>
      </header>
      <div className=" border-border/50 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-medium text-sm transition-all relative ${
                activeTab === "overview" ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Visão Geral
              {activeTab === "overview" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />}
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 font-medium text-sm transition-all relative ${
                activeTab === "details" ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Análises Detalhadas
              {activeTab === "details" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />}
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {activeTab === "overview" ?
        <>
        <MetricsCards selectedMetric={selectedMetric} onMetricClick={setSelectedMetric} analysis={analysis}/>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BestDaysChart analysis={analysis} selectedMetric={selectedMetric} />
          </div>
          <div className="p-2 rounded-lg relative">
            {slides[activeSlide].component}

            {/* Buttons navigation */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer pr-1 py-5 bg-[var(--chart-2)]/10 rounded-full"
              disabled={activeSlide === 0}
              onClick={() => setActiveSlide((prev) => prev - 1)}
            >
              <ChevronLeft />
            </button>

            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer pl-1 py-5 bg-[var(--chart-2)]/10 rounded-full"
              disabled={activeSlide === slides.length - 1}
              onClick={() => setActiveSlide((prev) => prev + 1)}
            >
              <ChevronRight />
            </button>

            {/* dots indicator */}
            <div className="flex justify-center gap-2 mt-3">
              {slides.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 w-2 rounded-full cursor-pointer transition-all ${
                    activeSlide === index
                      ? "bg-[var(--primary)] scale-110"
                      : "bg-[var(--muted-foreground)] opacity-50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        </>
        : 
        <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DailyAnalysisTable analysis={analysis} setSelectedDay={setSelectedDay}/>
          </div>
          <div className="lg:col-span-1">
            <TopProductsTable storeId={storeId} topItems={topItems} />
          </div>
        </div>
        </>      
        }
        
      </main>
    </div>
  )
}


