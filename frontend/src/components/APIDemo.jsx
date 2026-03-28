import { useEffect, useState } from "react";

function APIDemo() {
    // let [count, setCount] = useState(100);
    console.log("API Demo Rendered!")
    let [users, setUsers] = useState([])
    let [loading, setLoading] = useState(false)
    let [error, setError] = useState(null)

    useEffect(() => {
        async function getData() {
            setLoading(true)
            try {
                let res = await fetch("https://jsonplaceholder.typicode.com/posts")
                let userList = await res.json();
                setUsers(userList);
            } catch (err) {
                console.log("err is : ", err)
                setError(err.message)
            }finally{
                setLoading(false)
            }

        }
        getData()
    }, [])

    if (loading){
        return <p className="text-center text-4xl">Loading...</p>
    }
    if (error){
        return <p className="text-center text-red-500 text-4xl">{error}</p>
    }
    // const changeCount = () => {
    //     setCount(count + 1);
    // }
    return (
        <div className="text-center mt-10">
            <h1 className="text-5xl text-blue-600">List Of Users!!</h1>
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {
                    users.map(user=>(<div key={user.id}> 
                        <p>Title : {user.title}</p>
                        <p>Body : {user.body}</p>
                    </div>))
                }
            </div>
        </div>
    );
}

export default APIDemo;