import { useState } from 'react'
import './App.css'
import { ColorDropdown } from './components/ColorDropdown'
import { ContextApi } from './components/ContextApi'
import { LiveParagraph } from './components/LiveParagraph'
import { ToggleButton } from './components/ToggleButton'
import { ThemeContext } from './contexts/ThemeContext'
import { Counter } from './components/Counter'
import { TodoApp } from './components/TodoApp'

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
      <TodoApp />
    </>
  )
}

export default App
