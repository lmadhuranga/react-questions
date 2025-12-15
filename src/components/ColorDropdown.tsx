import { useState } from "react"

export const ColorDropdown = () => {
  const [theme, setTheme] = useState<'dark' | 'light' | 'default'>('light');

  return (<div>
    <h2>2.Color Drop down</h2>
    <select className="dropdown" value={theme} onChange={(e) => setTheme(e.target.value as 'dark' | 'light' | 'default')}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="default">Default</option>
    </select>
  </div>)
}