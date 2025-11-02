import { Dashboard } from "./pages/dashboard"
import './globals.css'
import { useState } from "react"
import { StoreSelector } from "./pages/StoreSelector"
import { ConfirmState } from "./pages/ConfirmState"
import type { StoreResult } from "./services/storeSearch"

function App() {
  const [selectedStore, setSelectedStore] = useState<StoreResult | null>(null)
  const [stateConfirmed, setStateConfirmed] = useState(false)

  if (!selectedStore) {
    return <StoreSelector setStore={setSelectedStore} />
  }

  if (!stateConfirmed) {
    return (
      <ConfirmState
        store={selectedStore}
        onConfirm={() => setStateConfirmed(true)}
        onCancel={() => setSelectedStore(null)}
      />
    )
  }

  return (
    <Dashboard 
      store={selectedStore}
      onBack={() => {
        setSelectedStore(null)
        setStateConfirmed(false)
      }}
    />
  )
}

export default App
