import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { InstagramIcon, FacebookIcon, TwitterIcon } from "lucide-react";

const socialLinks = [
  { id: 1, icon: <FacebookIcon size={22} /> },
  { id: 2, icon: <InstagramIcon size={22} /> },
  { id: 3, icon: <TwitterIcon size={22} /> },
];

const HeroSection = () => {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-text-primary min-h-screen bg-cover bg-center overflow-hidden px-2 sm:px-10 pt-20"
      style={{ backgroundImage: "url('/hero-bg3.jpeg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center gap-6"
      >
        {/* Heading */}
        <h1 className="w-full text-transparent bg-gradient-to-t from-text-primary to-text-surface bg-clip-text text-4xl sm:text-6xl md:text-6xl xl:text-[6rem] font-audio font-bold">
          Meet The Baddest Producer!
        </h1>

        {/* Subtext */}
        <p className="text-text-muted text-xs sm:text-base md:text-sm max-w-lg font-audio leading-relaxed">
          Where creativity meets raw talent — every beat crafted to perfection,
          bringing your sound to life like never before.
        </p>

        {/* CTA Button */}
        <Button
          variant={"outline"}
          className="mt-2 px-6 py-3 text-lg  bg-color-accent text-color-text-primary hover:bg-color-highlight transition-all duration-300 shadow-lg"
        >
          <span className="font-audio">Book Session</span>
        </Button>
      </motion.div>

      {/* Social Icons */}
      <div className="absolute bottom-10 sm:bottom-10 right-4 sm:right-8 z-10">
        <ul className="flex flex-col gap-4 sm:gap-3">
          {socialLinks.map((link) => (
            <li
              key={link.id}
              className="text-color-accent hover:text-color-highlight transition-transform duration-300 hover:scale-110"
            >
              {link.icon}
            </li>
          ))}
        </ul>
      </div>

      {/* Subtle glowing accent border at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-color-accent via-color-highlight to-color-accent opacity-60 animate-pulse"></div>
    </section>
  );
};

export default HeroSection;
