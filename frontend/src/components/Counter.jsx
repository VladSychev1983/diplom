import React from "react";
import { useSelector, useDispatch } from "react-redux";

function Counter() {
    const count = useSelector((state) => state.counter); //read data.
    const dispatch = useDispatch(); //get dispatch function.

    const handleIncrement = () => {
        dispatch({ type: 'INCREMENT'});
    }
    const handleDecrement  = () => {
        dispatch({ type: 'DECREMENT'})
    }

    return (
    <React.Fragment>
        <div>
            <h2>Counter Component</h2>
            <p>Count: {count}</p>
        <button onClick={handleDecrement}>Decrement</button>
        <button onClick={handleIncrement}>Increment</button>
        </div>
    </React.Fragment>
)
}
export default Counter;
