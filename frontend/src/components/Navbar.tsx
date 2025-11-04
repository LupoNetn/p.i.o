import { useState } from "react";
import { NAV_ITEMS } from "../constants/constants";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useAuthStore from "../stores/useAuthStore";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state: any) => state.user);
  const logout = useAuthStore((state: any) => state.logout);
  const userPic = user?.username ? user.username.charAt(0).toUpperCase() : null;

  const handleLogout = async () => {
    await logout();
    // ✅ smooth client-side redirect
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-full z-50 app-container">
      <div
        className="flex justify-between items-center px-6 py-4 
                   bg-black/40 border border-white/10 rounded-2xl 
                   backdrop-blur-xl shadow-lg shadow-black/20"
      >
        {/* Logo */}
        <h1 className="text-white font-bold font-heading text-2xl tracking-wide">
          P.I.O<span className="text-purple-400 text-sm"> official</span>
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-gray-300 font-medium">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="hover:text-white transition-colors duration-200"
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>

          {user ? (
            <div className="flex items-center gap-4">
              {/* User Circle */}
              <div className="border-2 border-purple-500 rounded-full h-9 w-9 flex items-center justify-center bg-purple-600 text-white font-semibold">
                {userPic}
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 border border-purple-500 text-white hover:bg-purple-600 transition-all duration-200 px-4 py-2 rounded-full"
              >
                <LogOut size={18} />
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button
                className="flex items-center gap-2 px-6 py-2 rounded-full 
                         bg-purple-600 text-white font-semibold 
                         hover:bg-purple-500 transition-all duration-200 shadow-md"
              >
                <LogIn size={18} />
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex sm:hidden items-center gap-3">
          {user && (
            <div className="border-2 border-purple-500 rounded-full h-8 w-8 flex items-center justify-center bg-purple-600 text-white font-semibold shadow-md">
              {userPic}
            </div>
          )}

          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className="p-2 rounded-md text-white border border-white/20 hover:bg-white/10 transition">
              {open ? <X size={24} /> : <Menu size={24} />}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-black/70 border border-white/10 backdrop-blur-xl 
                         shadow-lg shadow-black/30 rounded-2xl mt-2 w-48"
            >
              {NAV_ITEMS.map((item) => (
                <DropdownMenuItem key={item.path} asChild>
                  <Link
                    to={item.path}
                    className="text-gray-300 hover:text-white w-full py-2 font-medium"
                  >
                    {item.text}
                  </Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator className="bg-white/10" />

              {user ? (
                <DropdownMenuItem
                  className="flex items-center gap-2 text-white hover:text-purple-400 cursor-pointer py-2"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Logout
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="flex items-center gap-2 text-white hover:text-purple-400 cursor-pointer py-2">
                  <Link to="/auth">
                    <LogIn size={18} />
                    Login
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
