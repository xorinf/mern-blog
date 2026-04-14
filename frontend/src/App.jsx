import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import AuthorProfile from "./components/AuthorProfile";
import AuthorArticles from "./components/AuthorArticles";
import EditArticle from "./components/EditArticle";
import WriteArticle from "./components/WriteArticle";
import ReadArticleById from "./components/ReadArticleById";
import AdminProfile from "./components/AdminProfile";
import Articles from "./components/Articles";
import AdminArticles from "./components/AdminArticles";
import UsersList from "./components/UsersList";
import AuthorsList from "./components/AuthorsList";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";

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
          path: "articles",
          element: <Articles />,
        },
        {
          path: "user-profile",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserProfile />
            </ProtectedRoute>
          ),
          children: [
            {
              index: true,
              element: <Articles />,
            },
            {
              path: "articles",
              element: <Articles />,
            },
          ],
        },
        {
          path: "author-profile",
          element: (
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <AuthorProfile />
            </ProtectedRoute>
          ),
          children: [
            {
              index: true,
              element: <AuthorArticles />,
            },
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: "write-article",
              element: <WriteArticle />,
            },
          ],
        },
        {
          path: "admin-profile",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminProfile />
            </ProtectedRoute>
          ),
          children: [
            {
              index: true,
              element: <AdminArticles />,
            },
            {
              path: "articles",
              element: <AdminArticles />,
            },
            {
              path: "users",
              element: <UsersList />,
            },
            {
              path: "authors",
              element: <AuthorsList />,
            },
          ],
        },
        {
          path: "article/:id",
          element: <ReadArticleById />,
        },
        {
          path: "edit-article",
          element: <EditArticle />,
        },
        {
          path: "unauthorized",
          element: <Unauthorized />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routerObj} />;
}

export default App;
