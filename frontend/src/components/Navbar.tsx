import { useState } from "react";
import { NAV_ITEMS } from "../constants/constants";
import { LogIn, Menu, X } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleLogin = () => {
    // TODO: Implement login logic
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] md:w-[85%] z-50">
      <div
        className="flex justify-between items-center px-6 py-4 
                   bg-black/40 border border-white/10 rounded-2xl 
                   backdrop-blur-xl shadow-lg shadow-black/20"
      >
        {/* Logo */}
        <h1 className="text-white font-bold font-heading text-2xl tracking-wide">
          P.I.O<span className="text-purple-400">.</span>
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

          <Button
            onClick={handleLogin}
            className="flex items-center gap-2 px-6 py-2 rounded-full 
                       bg-purple-600 text-white font-semibold 
                       hover:bg-purple-500 transition-all duration-200 shadow-md"
          >
            <LogIn size={18} />
            Login
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="block sm:hidden">
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
              <DropdownMenuItem
                onSelect={handleLogin}
                className="flex items-center gap-2 text-white hover:text-purple-400 cursor-pointer py-2"
              >
                <LogIn size={18} />
                Login
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
