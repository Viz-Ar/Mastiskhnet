import { motion } from "framer-motion";

export default function AuthBackground() {
  return (
    <>
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute left-0 top-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
      />
    </>
  );
}