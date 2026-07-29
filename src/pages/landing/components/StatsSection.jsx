import { motion } from "framer-motion";
import {
  FaUsers,
  FaBrain,
  FaChartLine,
  FaDatabase
} from "react-icons/fa";


export default function StatsSection() {


const stats = [

{
icon:<FaUsers/>,
number:"367+",
title:"MRI Patients",
description:
"BraTS dataset cases used for model development and evaluation."
},


{
icon:<FaBrain/>,
number:"4",
title:"MRI Modalities",
description:
"FLAIR, T1, T1CE and T2 sequences processed by the AI model."
},


{
icon:<FaChartLine/>,
number:"0.756",
title:"Dice Score",
description:
"Target segmentation performance for tumor region accuracy."
},


{
icon:<FaDatabase/>,
number:"98%",
title:"Accuracy",
description:
"High precision segmentation performance from deep learning."
}

];



return (

<section className="
relative
overflow-hidden
bg-gradient-to-br
from-blue-950
via-slate-900
to-cyan-950
py-32
text-white
">


{/* Glow Background */}

<div className="
absolute
left-0
top-0
h-96
w-96
rounded-full
bg-blue-500/20
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
relative
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
text-cyan-400
font-semibold
uppercase
tracking-[0.3em]
">

Research Metrics

</p>



<h2 className="
mt-5
text-5xl
font-extrabold
">


MastiskhNet

<span className="
text-cyan-400
">

&nbsp;Performance

</span>


</h2>


<p className="
mx-auto
mt-6
max-w-3xl
text-lg
text-slate-300
">

Built using deep learning techniques,
medical imaging research and a 3D Attention
U-Net architecture.

</p>


</motion.div>






<div className="
mt-20
grid
gap-8
md:grid-cols-2
lg:grid-cols-4
">



{
stats.map((item,index)=>(


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
y:-10,
scale:1.03
}}



className="
rounded-3xl
border
border-white/10
bg-white/10
p-8
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
from-cyan-400
to-blue-600
text-2xl
">


{item.icon}


</div>



<h3 className="
mt-8
text-5xl
font-extrabold
text-white
">


{item.number}


</h3>



<h4 className="
mt-3
text-xl
font-bold
">


{item.title}


</h4>



<p className="
mt-3
leading-7
text-slate-300
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