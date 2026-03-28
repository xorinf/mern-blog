import { useState } from "react";

function Counter(){
    const [count, setCount] = useState(0);
    const increment = () => {
        setCount(count + 1)
    }
    const decrement  = () => {
        setCount(count - 1)
    }
    const reset = () => {
        setCount(0)
    }
    return (
        <div className="text-center p-10 border">
            <div className="text-6xl">
                <h1>COUNT {count}</h1>
                <button className="text-center border p-3 bg-green-400" onClick={increment}>Increase</button>
                <button className="text-center border p-3 bg-red-800" onClick={decrement}>Decrease</button>
                <button className="text-center border p-3 bg-orange-500" onClick={()=> reset(0)}>Reset</button>
            </div>
        </div>
    )
}

export default Counter;