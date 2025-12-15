import { useContext } from "react"
import { ThemeContext } from "../contexts/ThemeContext"

export const ContextApi = () => {
  const {theme, setTheme} = useContext(ThemeContext);

  return(<>
    <h2>4.Context Api : {theme}</h2>
    <button onClick={()=>setTheme(theme=='light'?"dark":"light")}>Change the theme</button>
  </>)
}