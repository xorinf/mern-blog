
import User from "./Users";

function UserList() {

    const users = [
        {
            name: "Aarav Sharma",
            email: "aarav.sharma@example.com",
            image: "https://randomuser.me/api/portraits/men/11.jpg"
        },
        {
            name: "Vivaan Patel",
            email: "vivaan.patel@example.com",
            image: "https://randomuser.me/api/portraits/men/12.jpg"
        },
        {
            name: "Aditya Singh",
            email: "aditya.singh@example.com",
            image: "https://randomuser.me/api/portraits/men/13.jpg"
        },
        {
            name: "Sai Kumar",
            email: "sai.kumar@example.com",
            image: "https://randomuser.me/api/portraits/men/14.jpg"
        },
        {
            name: "Rohan Reddy",
            email: "rohan.reddy@example.com",
            image: "https://randomuser.me/api/portraits/men/15.jpg"
        },
        {
            name: "Ananya Gupta",
            email: "ananya.gupta@example.com",
            image: "https://randomuser.me/api/portraits/women/11.jpg"
        },
        {
            name: "Isha Verma",
            email: "isha.verma@example.com",
            image: "https://randomuser.me/api/portraits/women/12.jpg"
        },
        {
            name: "Priya Nair",
            email: "priya.nair@example.com",
            image: "https://randomuser.me/api/portraits/women/13.jpg"
        },
        {
            name: "Sneha Das",
            email: "sneha.das@example.com",
            image: "https://randomuser.me/api/portraits/women/14.jpg"
        },
        {
            name: "Kavya Iyer",
            email: "kavya.iyer@example.com",
            image: "https://randomuser.me/api/portraits/women/15.jpg"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {
                users.map(userObj => <User key={userObj.email} userObj={userObj} /> )
            }
        </div>
    )
}

export default UserList;