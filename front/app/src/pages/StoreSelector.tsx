import { useState, useEffect } from "react"
import { Store } from "lucide-react"
import { getSearchStore, type StoreResult } from "@/services/storeSearch"

interface StoreSelectorProps {
  setStore: (storeId: StoreResult) => void
}

export function StoreSelector({ setStore }: StoreSelectorProps) {
  const [search, setSearch] = useState("")
  const [stores, setStores] = useState<StoreResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStores = async () => {
      if (search.length < 1) return setStores([])

      try {
        setLoading(true)
        const data = await getSearchStore(search)
        setStores(data)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchStores, 500)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-4xl border border-[var(--border)] rounded-xl bg-[var(--card)] shadow-md">

        {/* Header */}
        <div className="text-center space-y-3 p-6">
          <div className="flex justify-center mb-4">
            <div className="p-5 rounded-full bg-[var(--accent)]/20">
              <Store className="h-12 w-12 text-[var(--accent)]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Analytics Dashboard</h1>
          <p className="text-base text-[var(--muted-foreground)]">
            Selecione uma loja para visualizar os dados analíticos
          </p>
        </div>

        {/* Input */}
        <div className="px-6 pb-4">
          <input
            type="text"
            placeholder="Buscar loja por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:ring focus:ring-[var(--accent)] bg-[var(--card)] placeholder-[var(--muted-foreground)]"
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {loading && (
            <p className="text-center text-[var(--muted-foreground)] col-span-full">Carregando...</p>
          )}

          {!loading && stores.map(store => (
            <div
              key={store.id}
              className="cursor-pointer p-5 flex flex-col gap-2 border border-[var(--border)] rounded-xl hover:bg-[var(--accent)]/10 transition-all"
              onClick={() => setStore(store)}
            >
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-[var(--accent)]" />
                <span className="font-semibold text-lg text-[var(--foreground)]">{store.name}</span>
              </div>
            </div>
          ))}

          {!loading && search.length >= 2 && stores.length === 0 && (
            <p className="text-center text-[var(--muted-foreground)] col-span-full">
              Nenhuma loja encontrada
            </p>
          )}
        </div>
      </div>
    </div>
  )
}