import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import BrainViewer from "../../../components/three/BrainViewer";


export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-100">

      {/* Background Blur */}
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl"></div>

      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl"></div>


      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6">

        <div className="grid items-center gap-16 md:grid-cols-2">


          {/* LEFT CONTENT */}

          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              AI Powered Healthcare Platform
            </span>


            <h1 className="mt-8 text-6xl font-extrabold leading-tight text-slate-900">

              Brain Tumor

              <span className="block text-blue-600">
                Segmentation
              </span>

              Using AI

            </h1>


            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">

              MastiskhNet is an intelligent MRI analysis platform powered by
              a 3D Attention U-Net for accurate brain tumor segmentation,
              visualization, and AI-assisted clinical report generation.

            </p>


            <div className="mt-10 flex gap-5">


              <button className="
              rounded-xl
              bg-blue-600
              px-7
              py-4
              font-semibold
              text-white
              transition
              hover:scale-105
              hover:bg-blue-700
              ">

                Upload MRI

              </button>



              <button className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-blue-600
              px-7
              py-4
              font-semibold
              text-blue-600
              transition
              hover:bg-blue-50
              ">

                Learn More

                <FaArrowRight />

              </button>


            </div>


          </motion.div>





          {/* RIGHT 3D BRAIN VIEWER */}


          <motion.div

            initial={{
              opacity:0,
              scale:0.8
            }}

            animate={{
              opacity:1,
              scale:1
            }}

            transition={{
              duration:1
            }}

            className="
            flex
            justify-center
            "

          >

            <BrainViewer />

          </motion.div>



        </div>

      </div>


    </section>
  );
}