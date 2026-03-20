function Navbar() {
    return (
        <nav className="flex items-center justify-between bg-white border-b border-gray-100 p-4 shadow-sm font-mono sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <img className="h-10 w-auto rounded" src="https://media.beehiiv.com/cdn-cgi/image/format=auto,width=800,height=421,fit=scale-down,onerror=redirect/uploads/asset/file/0d3dca11-c7ae-44bf-947f-f1d823d6d812/TIGC_Banner.png" alt="Logo" />
                <span className="text-xl font-bold text-blue-600 hidden sm:inline">MERN Blog</span>
            </div>
            <ul className="hidden md:flex gap-8 text-gray-600 font-medium">
                <li><a href="<Navbar />" className="hover:text-blue-500 transition-colors">Home</a></li>
                <li><a href="" className="hover:text-blue-500 transition-colors">About Author</a></li>
                <li><a href="" className="hover:text-blue-500 transition-colors">About this Project</a></li>
            </ul>
            <div className="flex gap-4">
                <button className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600">Login</button>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Sign Up</button>
            </div>
        </nav>
    )
}
export default Navbar;
