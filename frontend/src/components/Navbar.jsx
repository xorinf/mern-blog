function Navbar() {
    return (
        <div className="flex justify-between bg-green-100 p-1.5 align-middle">
            <img className="w-30" src="https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/0d3dca11-c7ae-44bf-947f-f1d823d6d812/TIGC_Banner.png" alt="dunno" />
            <ul className="flex gap-10">
                <li><a href="#">Home</a></li>
                <li><a href="#">About Author</a></li>
                <li><a href="#">About this Project</a></li>
            </ul>
            <div className="">
                <button>Login</button>
                <button>Sign Up</button>
            </div>
        </div>
    )
}
export default Navbar;
