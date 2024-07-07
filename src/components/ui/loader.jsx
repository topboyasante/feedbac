import { motion } from "framer-motion";

export default function Loader({ variant = "default" }) {
  const bgColorClass = variant === "secondary" ? "bg-black" : "bg-white";

  return (
    <div className="flex items-center justify-center">
      <div className="flex space-x-2">
        <motion.div
          className={`h-2 w-2 rounded-full ${bgColorClass}`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <motion.div
          className={`h-2 w-2 rounded-full ${bgColorClass}`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.2,
          }}
        />
        <motion.div
          className={`h-2 w-2 rounded-full ${bgColorClass}`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.6,
          }}
        />
      </div>
    </div>
  );
}
