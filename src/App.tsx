import { useState } from 'react'
import './App.css'
import { ColorDropdown } from './components/ColorDropdown'
import { ContextApi } from './components/ContextApi'
import { LiveParagraph } from './components/LiveParagraph'
import { ToggleButton } from './components/ToggleButton'
import { ThemeContext } from './contexts/ThemeContext'
import { Counter } from './components/Counter'

function App() {
  const [theme, setTheme] = useState('light')
  return (
    <>
      <ToggleButton />
      <ColorDropdown />
      <LiveParagraph />
      <ThemeContext value={{theme, setTheme}}>
        <ContextApi />
      </ThemeContext>
      <Counter />
    </>
  )
}

export default App
