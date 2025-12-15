import { useState } from "react"

type Todo = {
  title:string,
  completed:boolean
}

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState<string>("")
  const [completed, setCompleted] = useState<boolean>(false)

  const changeHandler = (value:number) => {
    setCompleted(value===1?true:false)
  }

  const submitData = () => {
    setTodos([...todos, {
      title, completed
    }]);
    reset();
  }

  const reset = () => {
    setTitle("")
    setCompleted(false)
  }

  const removeHandler = (title:string) => {
    setTodos(todos.filter((el)=>el.title!==title))
  }

  return (
    <div>
      <h2>TodoApp</h2>
      {
        todos.map((el, i)=><li key={i}>{el?.title} : {el?.completed?"✅":"❌"} <button onClick={()=>removeHandler(el.title)}>x</button></li>)
      }
      <input type="text" onChange={(e)=>setTitle(e.target.value.trim())}  value={title}/> 
      <select onChange={(e)=>changeHandler(Number(e.target.value))}>
        <option value="0">Not Completed</option>
        <option value="1">Completed</option>
      </select>
      <button onClick={submitData}>Save</button>
    </div>
  )
}