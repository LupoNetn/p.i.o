import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import ProfilePage from "./pages/ProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/booking",
        element: <BookingPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <div className="bg-background min-h-screen">
        <RouterProvider router={router} />
      </div>
    </>
  );
};

export default App;
