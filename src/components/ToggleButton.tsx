import { useState } from "react"

export const ToggleButton = () => {
  const [isOn,  setIsOn] = useState<boolean>(false);
  return(<div>
    <h2>Toggle Button Typescript</h2>
    <button onClick={()=>setIsOn(!isOn)}>Click to change {isOn?"No":"Off"}</button>
  </div>)
}