import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { InstagramIcon, FacebookIcon, TwitterIcon } from "lucide-react";
import { Link } from "react-router";

const socialLinks = [
  { id: 1, icon: <FacebookIcon size={22} /> },
  { id: 2, icon: <InstagramIcon size={22} /> },
  { id: 3, icon: <TwitterIcon size={22} /> },
];

const HeroSection = () => {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-text-primary min-h-screen bg-cover bg-center overflow-hidden px-4 sm:px-10 pt-20"
      style={{ backgroundImage: "url('/hero-bg3.jpeg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 backdrop-blur-[2px]" />

      {/* Animated glow behind headline */}
      <div className="absolute top-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full bg-color-accent/20 blur-3xl animate-pulse" />

      {/* Hero content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center gap-6"
      >
        {/* Headline */}
        <motion.h1
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full text-transparent bg-gradient-to-b from-color-accent via-color-highlight to-white bg-clip-text 
          text-4xl sm:text-6xl md:text-6xl xl:text-[6rem] font-audio font-extrabold drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]"
        >
          Meet The Baddest Producer!
        </motion.h1>

        {/* Subtext */}
        <p className="text-text-muted text-xs sm:text-base md:text-sm max-w-xl font-audio leading-relaxed opacity-90">
          Where creativity meets raw talent — every beat crafted to perfection,
          bringing your sound to life like never before.
        </p>

        {/* CTA */}
       <div className="flex flex-col sm:flex-row gap-2">
       <Link to='/booking'>
          <Button
          variant="outline"
          className="mt-2 px-6 py-3 text-lg font-audio 
          bg-color-accent text-color-text-primary 
          hover:bg-color-highlight hover:text-white 
          transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.25)] rounded-xl"
        >
          Book Session
        </Button>
       </Link>
        <Link to='/purchase-a-beat'>
          <Button
          variant="outline"
          className="mt-2 px-6 py-3 text-lg font-audio 
          bg-color-accent text-color-text-primary 
          hover:bg-color-highlight hover:text-white 
          transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.25)] rounded-xl"
        >
          Purchase a Beat
        </Button>
        </Link>
       </div>
      </motion.div>

      {/* Socials */}
      <div className="absolute bottom-10 right-5 sm:right-8 z-10">
        <ul className="flex flex-col gap-4 sm:gap-3">
          {socialLinks.map((link) => (
            <motion.li
              key={link.id}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-color-accent hover:text-color-highlight transition-all"
            >
              {link.icon}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Animated bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-color-accent via-color-highlight to-color-accent opacity-70 animate-pulse" />
    </section>
  );
};

export default HeroSection;
