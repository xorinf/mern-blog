import { useState } from "react";

function TestRefTypes() {

    const [user, setUser] = useState({ username: "ravi", age: 21, city: "Hyd" })
    const [marks, setMarks] = useState([10, 20, 30])

    const updateUser = () => {
        setUser({ ...user, username: "bhanu", age: 67 })
    }
    const updateMarks = () => {
        setMarks([40, ...marks])
    }
    return (
        <div className="align-center">
            <div className="text-center">
                <h2 className="text-3xl">Username : {user.username}</h2>
                <h2 className="text-3xl">Age      : {user.age}</h2>
                <h2 className="text-3xl">City     : {user.city}</h2>
            </div>
            <button onClick={updateUser}>Update User</button>
            <div className="text-center">
                {
                    marks.map(mark => <p className="text-3xl" key={mark}>{mark}</p>)
                }
            </div>
            <button onClick={updateMarks}>Update Marks</button>
        </div>
    );
}

export default TestRefTypes;