import { motion } from "framer-motion";
import {
  FaBrain,
  FaMicroscope,
  FaChartLine,
  FaRobot
} from "react-icons/fa";


export default function FeaturesSection(){

const features=[
{
icon:<FaBrain/>,
title:"3D Tumor Segmentation",
description:
"Advanced 3D Attention U-Net architecture performs voxel-level brain tumor segmentation from MRI scans."
},

{
icon:<FaMicroscope/>,
title:"Multi-Modal MRI Analysis",
description:
"Supports FLAIR, T1, T1CE and T2 MRI sequences for comprehensive tumor analysis."
},

{
icon:<FaChartLine/>,
title:"Clinical Visualization",
description:
"Generates tumor statistics, volume measurements and segmentation visualization."
},

{
icon:<FaRobot/>,
title:"AI Clinical Report",
description:
"Large Language Models assist doctors by generating structured medical reports."
}

];


return (

<section 
id="features"
className="bg-sky-50 py-28"
>


<div className="mx-auto max-w-7xl px-6">


<motion.div

initial={{opacity:0,y:40}}

whileInView={{opacity:1,y:0}}

transition={{duration:0.8}}

className="text-center"

>


<h2 className="
text-5xl 
font-extrabold
text-slate-900
">

Advanced AI Capabilities

</h2>


<p className="
mx-auto
mt-6
max-w-2xl
text-lg
text-slate-600
">

MastiskhNet combines deep learning,
medical imaging and artificial intelligence
to provide accurate brain tumor analysis.

</p>


</motion.div>



<div className="
mt-16
grid
gap-8
md:grid-cols-2
lg:grid-cols-4
">


{
features.map((item,index)=>(


<motion.div

key={index}

initial={{
opacity:0,
y:60
}}

whileInView={{
opacity:1,
y:0
}}

transition={{
duration:0.6,
delay:index*0.15
}}

whileHover={{
y:-12,
scale:1.03
}}


className="
rounded-3xl
bg-white
p-8
shadow-lg
border
border-sky-100
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
from-blue-500
to-sky-400
text-3xl
text-white
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


<button className="
mt-6
font-semibold
text-blue-600
">

Learn More →

</button>


</motion.div>


))

}


</div>


</div>


</section>

)

}