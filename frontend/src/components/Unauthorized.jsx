import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

const Unauthorized = ({ delay = 5000 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirectTo from state, default to /login
  const redirectTo = location.state?.redirectTo || "/login";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo, { replace: true });
    }, delay);

    return () => clearTimeout(timer);
  }, [navigate, redirectTo, delay]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#ff3b30] mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-2">Unauthorized</h2>
        <p className="text-[#6e6e73] mb-2">You don't have permission to access this page.</p>
        <p className="text-sm text-[#a1a1a6]">Redirecting in a few seconds...</p>
      </div>
    </div>
  );
};

export default Unauthorized;
