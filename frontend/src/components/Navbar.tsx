import React, { useState } from "react";
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
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleLogin = () => {
    // TODO: Implement login logic
  };

  return (
    <nav className="bg-surface app-container w-full shadow-2xl rounded-md backdrop-blur-2xl">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-text-primary font-bold font-heading text-lg md:text-xl">
          P.I.O
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden sm:block">
          <ul className="flex items-center gap-3 lg:gap-5 text-text-muted font-semibold">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="hover:text-highlight transition-colors duration-200"
                >
                  {item.text}
                </Link>
              </li>
            ))}
            <li>
              <Button
                onClick={handleLogin}
                className="flex items-center gap-2 px-6 py-2 text-base font-semibold 
                bg-color-accent text-color-text-primary 
                hover:bg-color-highlight hover:text-surface
                transition cursor-pointer"
              >
                <LogIn size={20} />
                Login
              </Button>
            </li>
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div className="block sm:hidden">
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className="p-2 rounded-md text-text-primary border border-border hover:bg-surface transition">
              {open ? <X size={24} /> : <Menu size={24} />}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-surface border border-border shadow-lg sm:hidden"
            >
              {NAV_ITEMS.map((item) => (
                <DropdownMenuItem key={item.path} asChild>
                  <Link
                    to={item.path}
                    className="text-text-muted hover:text-highlight font-body"
                  >
                    {item.text}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleLogin}
                className="flex items-center gap-2 text-text-primary hover:text-highlight cursor-pointer"
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
