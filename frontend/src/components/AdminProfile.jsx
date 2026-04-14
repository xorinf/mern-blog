import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { pageWrapper, navLinkClass, divider } from "../styles/common";

function AdminProfile() {
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={pageWrapper}>
      {/* PROFILE HEADER */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 shadow-sm flex flex-col sm:flex-row items-center sm:justify-between gap-6 sm:gap-4">
        {/* LEFT */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-[#ff3b30]/10 text-[#ff3b30] flex items-center justify-center text-xl font-semibold shrink-0">
            {currentUser?.firstName?.charAt(0).toUpperCase() || "A"}
          </div>

          <div>
            <p className="text-sm text-[#6e6e73]">Admin Panel</p>
            <h2 className="text-xl font-semibold text-[#1d1d1f]">{currentUser?.firstName}</h2>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          className="bg-[#ff3b30] text-white text-sm px-6 py-2.5 rounded-full hover:bg-[#d62c23] transition w-full sm:w-auto"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {/* NAVIGATION */}
      <div className="overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex gap-2 sm:gap-3 mb-4 bg-[#f5f5f7] p-1.5 sm:p-2 rounded-full w-fit whitespace-nowrap">
        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive
              ? "bg-white px-5 py-2 rounded-full text-[#0066cc] text-sm font-medium shadow-sm"
              : `${navLinkClass} px-5 py-2`
          }
        >
          Articles
        </NavLink>
        <NavLink
          to="users"
          className={({ isActive }) =>
            isActive
              ? "bg-white px-5 py-2 rounded-full text-[#0066cc] text-sm font-medium shadow-sm"
              : `${navLinkClass} px-5 py-2`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="authors"
          className={({ isActive }) =>
            isActive
              ? "bg-white px-5 py-2 rounded-full text-[#0066cc] text-sm font-medium shadow-sm"
              : `${navLinkClass} px-5 py-2`
          }
        >
          Authors
        </NavLink>
      </div>
      </div>

      <div className={divider}></div>

      {/* CONTENT */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminProfile;