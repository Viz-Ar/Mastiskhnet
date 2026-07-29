import { motion } from "framer-motion";
import { FaArrowRight, FaBrain } from "react-icons/fa";


export default function CTASection() {


return (

<section className="
relative
overflow-hidden
bg-gradient-to-br
from-slate-950
via-blue-950
to-cyan-950
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
max-w-5xl
px-6
text-center
">



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
duration:0.8
}}

className="
mx-auto
flex
h-24
w-24
items-center
justify-center
rounded-full
bg-gradient-to-br
from-blue-500
to-cyan-400
shadow-[0_0_80px_rgba(34,211,238,0.5)]
"

>


<FaBrain className="
text-5xl
"/>


</motion.div>




<motion.h2


initial={{
opacity:0,
y:30
}}

whileInView={{
opacity:1,
y:0
}}

transition={{
duration:0.8,
delay:0.2
}}


className="
mt-10
text-5xl
font-extrabold
md:text-6xl
"

>


Ready to Transform

<span className="
block
text-cyan-400
">

Brain Tumor Analysis?

</span>


</motion.h2>





<motion.p

initial={{
opacity:0,
y:30
}}

whileInView={{
opacity:1,
y:0
}}

transition={{
duration:0.8,
delay:0.4
}}

className="
mx-auto
mt-6
max-w-2xl
text-lg
leading-8
text-slate-300
"

>


Upload MRI scans and experience
AI-powered brain tumor segmentation
with 3D visualization and intelligent
clinical reporting.


</motion.p>





<motion.div

initial={{
opacity:0,
y:30
}}

whileInView={{
opacity:1,
y:0
}}

transition={{
duration:0.8,
delay:0.6
}}

className="
mt-10
flex
justify-center
gap-5
"

>


<button className="
group
flex
items-center
gap-3
rounded-2xl
bg-white
px-8
py-4
font-bold
text-blue-700
transition
hover:scale-105
">


Upload MRI


<FaArrowRight className="
transition
group-hover:translate-x-2
"/>


</button>



<button className="
rounded-2xl
border
border-white/30
bg-white/10
px-8
py-4
font-bold
backdrop-blur-xl
transition
hover:bg-white/20
">


Watch Demo


</button>



</motion.div>





</div>


</section>

)

}