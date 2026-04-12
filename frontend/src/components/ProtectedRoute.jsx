import { useAuth } from "../store/authStore";
import { Navigate } from "react-router";

function ProtectedRoute({ children, allowedRoles }) {
  const { loading, currentUser, isAuthenticated } = useAuth();

  // While checking auth, show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#0066cc]/60 text-sm animate-pulse">Loading...</p>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user's role is not in allowed roles, redirect to unauthorized
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/unauthorized" replace state={{ redirectTo: "/" }} />;
  }

  return children;
}

export default ProtectedRoute;
