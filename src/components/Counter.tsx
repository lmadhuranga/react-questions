import { useState } from "react"

export const Counter = () => {
  const [count, setCount] = useState(0)
  return (<>
    <h2>5.Counter example</h2>
    <button onClick={() => setCount(count + 1)}>+</button> {count}
    <button onClick={() => setCount(count > 0?count - 1:count)}>-</button > <br />
  </>)
}