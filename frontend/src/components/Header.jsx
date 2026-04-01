import { NavLink } from "react-router"

function Header() {
  return (
    <div className="flex justify-between bg-gray-200">
      <img src="https://github.com/xorinf/mern-blog/blob/main/frontend/src/assets/edss.jpg" alt="" className="w-30 p-2 rounded-2xl"/>
      <nav className="flex justify-end gap-9 p-3 text-2xl items-center">
        <NavLink to="">Home</NavLink>
        <NavLink to="register">Register</NavLink>
        <NavLink to="login">Login</NavLink>
      </nav>
    </div>
  )
}

export default Header

//flex flex-col items-center justify-center gap-4 mt-4">