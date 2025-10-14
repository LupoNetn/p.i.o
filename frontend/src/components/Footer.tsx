import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-black/60 backdrop-blur-2xl border-t border-white/10 py-10 font-audio">
      <div className="app-container flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        {/* Left side — Brand */}
        <div>
          <h2 className="text-3xl font-bold text-white tracking-wide">P.I.O</h2>
          <p className="text-gray-400 text-sm mt-1">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Socials */}
        <ul className="flex items-center gap-6 text-gray-300">
          <li className="hover:text-color-accent transition-colors duration-300 cursor-pointer">
            <Instagram size={20} />
          </li>
          <li className="hover:text-color-accent transition-colors duration-300 cursor-pointer">
            <Facebook size={20} />
          </li>
          <li className="hover:text-color-accent transition-colors duration-300 cursor-pointer">
            <Twitter size={20} />
          </li>
        </ul>

        {/* Subtle tagline */}
        <p className="text-gray-500 text-xs">
          Crafted with 🎧 and code by <span className="text-color-accent">Lupo!</span>
        </p>
      </div>

      {/* Glow accent line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-color-accent via-color-highlight to-color-accent opacity-50"></div>
    </footer>
  );
};

export default Footer;
