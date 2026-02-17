import { createContext, useState } from "react"

export const createdContext =  createContext();



export default function CounterContext({children}) {
    const [counter, setCounter] = useState(0)
  return (
    <createdContext.Provider value={{counter,  setCounter}}>{children}</createdContext.Provider>
  )
}
