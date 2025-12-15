import { createContext } from "react"

type ThemeContextValues = {
  theme: string,
  setTheme: (theme:string) => void
}

export const ThemeContext = createContext<ThemeContextValues>({
  theme: 'dark',
  setTheme: () => { }
})