import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";
import {
  pageBackground,
  pageWrapper,
  pageTitleClass,
  bodyText,
  primaryBtn,
  secondaryBtn,
} from "../styles/common";

function Home() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  return (
    <div className={pageBackground}>
      <div className={`${pageWrapper} flex flex-col items-center text-center`}>
        {/* Hero */}
        <h1 className={`${pageTitleClass} mt-8 md:mt-16`}>
          Welcome to My Blog
        </h1>
        <p className={`${bodyText} max-w-xl mt-4 text-base md:text-lg`}>
          A place to read, write.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 mt-10 w-full sm:w-auto px-4 sm:px-0">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={`${primaryBtn} w-full sm:w-40`}>
                Sign In
              </NavLink>
              <NavLink to="/register" className={`${secondaryBtn} w-full sm:w-40`}>
                Create Account
              </NavLink>
            </>
          ) : (
            <NavLink to="/articles" className={`${primaryBtn} w-full sm:w-48`}>
              Browse Articles
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;