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
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={primaryBtn}>
                Sign In
              </NavLink>
              <NavLink to="/register" className={secondaryBtn}>
                Create Account
              </NavLink>
            </>
          ) : (
            <NavLink to="/articles" className={primaryBtn}>
              Browse Articles
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;