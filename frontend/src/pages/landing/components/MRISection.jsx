import { motion } from "framer-motion";
import {
  FaBrain,
  FaDatabase,
  FaRobot,
  FaChartPie
} from "react-icons/fa";


export default function MRISection() {


const pipeline = [

{
icon:<FaDatabase/>,
title:"MRI Input",
description:
"FLAIR, T1, T1CE and T2 MRI sequences are provided as multi-modal input data."
},

{
icon:<FaRobot/>,
title:"AI Processing",
description:
"3D Attention U-Net performs voxel-level tumor segmentation using deep learning."
},

{
icon:<FaBrain/>,
title:"3D Segmentation",
description:
"Model identifies tumor regions and generates detailed 3D segmentation masks."
},

{
icon:<FaChartPie/>,
title:"Clinical Output",
description:
"Tumor volume statistics and AI-assisted reports are generated."
}

];


return (

<section className="
relative
overflow-hidden
bg-slate-950
py-32
text-white
">


{/* Background Glow */}

<div className="
absolute
left-0
top-20
h-96
w-96
rounded-full
bg-blue-600/20
blur-3xl
"></div>


<div className="
absolute
right-0
bottom-0
h-96
w-96
rounded-full
bg-cyan-400/20
blur-3xl
"></div>



<div className="
mx-auto
max-w-7xl
px-6
">


{/* Heading */}

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
text-blue-400
font-semibold
uppercase
tracking-widest
">

MRI Analysis Engine

</p>


<h2 className="
mt-5
text-5xl
font-extrabold
">

From MRI Scan

<span className="
text-cyan-400
">

&nbsp;to AI Segmentation

</span>

</h2>


<p className="
mx-auto
mt-6
max-w-3xl
text-lg
text-slate-300
">

MastiskhNet processes multi-modal MRI scans
through a 3D Attention U-Net architecture
to accurately identify and visualize brain tumor regions.

</p>


</motion.div>




{/* Main Visualization */}


<div className="
mt-20
grid
items-center
gap-16
lg:grid-cols-2
">



{/* LEFT PIPELINE */}


<div className="
space-y-6
">


{
pipeline.map((item,index)=>(


<motion.div

key={index}

initial={{
opacity:0,
x:-60
}}

whileInView={{
opacity:1,
x:0
}}

transition={{
duration:0.6,
delay:index*0.15
}}


whileHover={{
scale:1.03
}}


className="
flex
gap-5
rounded-3xl
border
border-white/10
bg-white/5
p-6
backdrop-blur-xl
"


>


<div className="
flex
h-14
w-14
items-center
justify-center
rounded-2xl
bg-gradient-to-br
from-blue-500
to-cyan-400
text-2xl
">


{item.icon}


</div>



<div>

<h3 className="
text-xl
font-bold
">

{item.title}

</h3>


<p className="
mt-2
text-slate-300
">

{item.description}

</p>


</div>


</motion.div>


))

}


</div>




{/* RIGHT VISUAL */}

<motion.div

initial={{
opacity:0,
scale:0.8
}}

whileInView={{
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


<motion.div


animate={{

y:[0,-20,0]

}}

transition={{

duration:5,
repeat:Infinity

}}


className="
relative
flex
h-[420px]
w-[420px]
items-center
justify-center
rounded-full
bg-gradient-to-br
from-blue-600
via-cyan-500
to-blue-400
shadow-[0_0_120px_rgba(14,165,233,0.5)]
"


>


<FaBrain className="
text-[200px]
text-white/90
"/>



{/* Floating MRI Cards */}


<div className="
absolute
-left-10
top-10
rounded-2xl
bg-white/10
px-5
py-3
backdrop-blur-lg
">


FLAIR

</div>


<div className="
absolute
right-0
bottom-20
rounded-2xl
bg-white/10
px-5
py-3
backdrop-blur-lg
">


T1CE

</div>


<div className="
absolute
left-10
bottom-10
rounded-2xl
bg-white/10
px-5
py-3
backdrop-blur-lg
">


T2

</div>


</motion.div>


</motion.div>



</div>


</div>


</section>

)

}