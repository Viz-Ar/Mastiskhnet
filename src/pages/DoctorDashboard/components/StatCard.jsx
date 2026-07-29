import { motion } from "framer-motion";


export default function StatCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition
        hover:shadow-lg
      "
    >

      <div className="flex items-center justify-between">


        {/* Text */}

        <div>

          <p
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            {title}
          </p>


          <h2
            className="
              mt-2
              text-3xl
              font-bold
              text-slate-900
            "
          >
            {value}
          </h2>

        </div>



        {/* Icon */}

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-xl
            text-2xl
            text-white
            shadow-md
          "
          style={{
            backgroundColor: color,
          }}
        >
          {icon}

        </div>


      </div>


    </motion.div>
  );
}