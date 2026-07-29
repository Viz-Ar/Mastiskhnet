import { motion } from "framer-motion";
import {
  FaDatabase,
  FaBrain,
  FaServer,
  FaMobileAlt,
  FaRobot,
  FaChartLine
} from "react-icons/fa";


export default function ResearchSection() {


const research = [

{
icon:<FaDatabase/>,
title:"BraTS Dataset",
description:
"Developed using publicly available brain tumor MRI datasets for deep learning research and evaluation."
},

{
icon:<FaBrain/>,
title:"3D Attention U-Net",
description:
"Custom deep learning architecture designed for volumetric brain tumor segmentation."
},

{
icon:<FaChartLine/>,
title:"Medical Image Analysis",
description:
"Voxel-level segmentation with tumor region identification and quantitative analysis."
},

{
icon:<FaServer/>,
title:"FastAPI Backend",
description:
"High-performance API infrastructure connecting AI models with healthcare applications."
},

{
icon:<FaMobileAlt/>,
title:"React + Flutter Ecosystem",
description:
"Cross-platform applications designed for doctors and patients."
},

{
icon:<FaRobot/>,
title:"AI Report Generation",
description:
"LLM-assisted clinical report generation for structured medical insights."
}

];


return (

<section className="
bg-white
py-32
">


<div className="
mx-auto
max-w-7xl
px-6
">



<motion.div

initial={{
opacity:0,
y:40
}}

whileInView={{
opacity:1,
y:0
}}

transition={{
duration:0.8
}}

className="
text-center
"

>


<p className="
font-semibold
uppercase
tracking-[0.3em]
text-blue-600
">

Research & Technology

</p>



<h2 className="
mt-5
text-5xl
font-extrabold
text-slate-900
">


Built on

<span className="
text-blue-600
">

&nbsp;Deep Learning Research

</span>


</h2>



<p className="
mx-auto
mt-6
max-w-3xl
text-lg
text-slate-600
">

MastiskhNet combines medical imaging,
deep learning, backend engineering and
modern application development into a
complete healthcare AI ecosystem.

</p>


</motion.div>





<div className="
mt-20
grid
gap-8
md:grid-cols-2
lg:grid-cols-3
">


{
research.map((item,index)=>(


<motion.div

key={index}


initial={{
opacity:0,
scale:0.8
}}


whileInView={{
opacity:1,
scale:1
}}


transition={{
duration:0.6,
delay:index*0.1
}}


whileHover={{
y:-12
}}



className="
group
rounded-3xl
border
border-slate-200
bg-sky-50
p-8
shadow-lg
transition
"

>


<div className="
flex
h-16
w-16
items-center
justify-center
rounded-2xl
bg-gradient-to-br
from-blue-600
to-cyan-400
text-3xl
text-white
transition
group-hover:rotate-6
">


{item.icon}


</div>




<h3 className="
mt-6
text-xl
font-bold
text-slate-900
">


{item.title}


</h3>




<p className="
mt-4
leading-7
text-slate-600
">

{item.description}

</p>



</motion.div>


))

}


</div>


</div>


</section>


)

}