import { NavLink } from "react-router";
import { useState } from "react";
import { useAuth } from "../store/authStore";
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navMobileLinksClass,
  navLinkClass,
  navLinkActiveClass,
} from "../styles/common";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // decide profile route based on role
  const getProfilePath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "AUTHOR":
        return "/author-profile";
      case "ADMIN":
        return "/admin-profile";
      default:
        return "/user-profile";
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Shared links logic
  const renderLinks = () => (
    <>
      <li>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
          onClick={closeMenu}
        >
          Home
        </NavLink>
      </li>

      {/* NOT LOGGED IN */}
      {!isAuthenticated && (
        <>
          <li>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? navLinkActiveClass : navLinkClass
              }
              onClick={closeMenu}
            >
              Register
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? navLinkActiveClass : navLinkClass
              }
              onClick={closeMenu}
            >
              Login
            </NavLink>
          </li>
        </>
      )}

      {/* LOGGED IN */}
      {isAuthenticated && (
        <li>
          <NavLink
            to={getProfilePath()}
            className={({ isActive }) =>
              isActive ? navLinkActiveClass : navLinkClass
            }
            onClick={closeMenu}
          >
            Profile
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>
        {/* LOGO */}
        <NavLink to="/" className={navBrandClass} onClick={closeMenu}>
          MyBlog
        </NavLink>

        {/* Desktop Links */}
        <ul className={navLinksClass}>{renderLinks()}</ul>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-[#1d1d1f] focus:outline-none z-50"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Mobile Links */}
        {isMenuOpen && <ul className={navMobileLinksClass}>{renderLinks()}</ul>}
      </div>
    </nav>
  );
}

export default Header;