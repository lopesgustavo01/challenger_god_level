import { Dashboard } from "./pages/dashboard"
import './globals.css'
import { useState } from "react"

function App() {
    const [dashMode, setDashMode] = useState<boolean>(true)
    const onBack = () => {
      setDashMode(!dashMode)
    }

  return (
    <div className=" bg-[var(--background)]  text-[var(--foreground)] text-xl font-bold">
      <Dashboard storeId={25}  onBack={onBack}/>
    </div>
  )
}

export default App
