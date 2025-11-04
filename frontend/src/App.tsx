import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import ProfilePage from "./pages/ProfilePage";
import Beats from "./pages/Beats";
import AuthPage from "./pages/AuthPage";
import SignUp from "./components/authcomponents/SignUp";
import Login from "./components/authcomponents/Login";
import { Toaster } from "sonner";
import AuthSuccess from "./components/authcomponents/AuthSuccess";
import AuthFailure from "./components/authcomponents/AuthFailure";
import ProtectedLayout from "./components/ProtectedLayout";
import Spinner from "./components/Spinner";
import useAuthStore from "./stores/useAuthStore";
import { useEffect } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        element: <ProtectedLayout />,
        children: [
          { path: "/booking", element: <BookingPage /> },
          { path: "/dashboard", element: <ProfilePage /> },
          { path: "/purchase-a-beat", element: <Beats /> },
        ],
      },
      {
        path: "/auth",
        element: <AuthPage />,
        children: [
          { index: true, element: <SignUp /> },
          { path: "/auth/login", element: <Login /> },
          { path: "/auth/success", element: <AuthSuccess /> },
          { path: "/auth/failure", element: <AuthFailure /> },
        ],
      },
    ],
  },
]);

const App = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const loading = useAuthStore((state) => state.loading);
  const refreshToken = localStorage.getItem('refreshToken')

  useEffect(() => {
    if(refreshToken) {
      fetchUser()
    } 
  },[])

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="bg-background min-h-screen">
        <RouterProvider router={router} />
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default App;
