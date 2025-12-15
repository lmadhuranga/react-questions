import { useState } from "react"

export const LiveParagraph = () => {
  const [para, setPara] = useState<string>("")
  return (<div>
    <h2>3.Live Para</h2>
    <pre>{para}</pre>
    <h2>Reverse</h2>
    {para.split("").reverse().map((e, i)=><span style={{margin:4, padding:8, border:"solid"}} key={i}>{e}</span>)}<br /><br />
    <textarea placeholder="Type Here" onChange={(e)=>setPara(e?.target?.value?.trim())}></textarea>
  </div>)
}