import { motion } from "framer-motion";

const Spinner = () => {
return ( <div className="flex justify-center items-center min-h-screen bg-black">
<motion.div
className="relative flex justify-center items-center"
animate={{ rotate: 360 }}
transition={{
repeat: Infinity,
ease: "linear",
duration: 2.5,
}}
>
{/* Outer ring */} <div className="w-20 h-20 border-4 border-transparent border-t-purple-500 border-b-purple-500 rounded-full shadow-[0_0_25px_#a855f7]" />

    {/* Inner glow orb */}
    <motion.div
      className="absolute w-8 h-8 bg-purple-600 rounded-full blur-sm"
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut",
      }}
    />

    {/* Glow ring pulse */}
    <motion.div
      className="absolute w-14 h-14 rounded-full border border-purple-400/30"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.4, 0.8, 0.4],
      }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut",
      }}
    />
  </motion.div>
</div>


);
};

export default Spinner;
