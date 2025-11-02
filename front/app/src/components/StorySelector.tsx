"use client"

import { Store } from "lucide-react"

interface StoreSelectorProps {
  onSelectStore: (storeId: number) => void
}

const stores = [
  { id: 25, name: "Loja Centro", location: "Centro - São Paulo" },
  { id: 26, name: "Loja Shopping", location: "Shopping Iguatemi" },
  { id: 27, name: "Loja Zona Sul", location: "Morumbi - São Paulo" },
  { id: 28, name: "Loja Zona Norte", location: "Santana - São Paulo" },
]

export function StoreSelector({ onSelectStore }: StoreSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl border border-gray-200 rounded-lg bg-white shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2 p-6">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-blue-100">
              <Store className="h-12 w-12 text-blue-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-base text-gray-600">
            Selecione uma loja para visualizar os dados analíticos
          </p>
        </div>

        {/* Loja Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="cursor-pointer h-auto p-6 flex flex-col items-start gap-2 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-all"
              onClick={() => onSelectStore(store.id)}
            >
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-lg">{store.name}</span>
              </div>
              <span className="text-sm text-gray-500">{store.location}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
