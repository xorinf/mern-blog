import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import AuthorProfile from "./components/AuthorProfile";
import AdminProfile from "./components/AdminProfile";
function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "user-profile",
          element: <UserProfile />,
        },
        {
          path: "author-profile",
          element: <AuthorProfile />,
        },
        {
          path: "admin-profile",
          element: <AdminProfile />,
        },
      ],
    },
  ]);
  return <RouterProvider router={routerObj} />;
}

export default App;
