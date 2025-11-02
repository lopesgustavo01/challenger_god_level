import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const root = window.document.documentElement
    const initialTheme = root.classList.contains("dark") ? "dark" : "light"
    setTheme(initialTheme)
  }, [])

  const toggleTheme = () => {
    const root = window.document.documentElement
    const newTheme = theme === "light" ? "dark" : "light"

    root.classList.remove(theme)
    root.classList.add(newTheme)
    setTheme(newTheme)
  }

  return { theme, toggleTheme }
}
