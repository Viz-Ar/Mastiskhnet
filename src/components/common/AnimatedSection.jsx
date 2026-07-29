import { motion } from "framer-motion";

export default function AnimatedSection({children, className=""}) {

  return (
    <motion.div

      className={className}

      initial={{
        opacity:0,
        y:40
      }}

      whileInView={{
        opacity:1,
        y:0
      }}

      viewport={{
        once:true
      }}

      transition={{
        duration:0.6
      }}

    >
      {children}
    </motion.div>
  );
}