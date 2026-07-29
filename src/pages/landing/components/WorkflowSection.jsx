import { motion } from "framer-motion";
import {
  FaUpload,
  FaFilter,
  FaBrain,
  FaCube,
  FaFileMedical,
  FaUserDoctor
} from "react-icons/fa6";


export default function WorkflowSection() {


const steps = [

{
icon:<FaUserDoctor/>,
title:"Doctor Uploads MRI",
description:
"Doctors upload multi-modal MRI scans including FLAIR, T1, T1CE and T2 sequences through the secure platform."
},


{
icon:<FaFilter/>,
title:"MRI Preprocessing",
description:
"Images are normalized, resized and prepared before entering the deep learning pipeline."
},


{
icon:<FaBrain/>,
title:"3D Attention U-Net",
description:
"The AI model analyzes volumetric MRI data and performs voxel-level tumor segmentation."
},


{
icon:<FaCube/>,
title:"3D Visualization",
description:
"Predicted tumor regions are reconstructed into interactive 3D visualization for better understanding."
},


{
icon:<FaFileMedical/>,
title:"AI Clinical Report",
description:
"AI generates structured reports containing tumor statistics and segmentation results."
}

];



return (

<section className="
bg-sky-50
py-32
overflow-hidden
">


<div className="
mx-auto
max-w-6xl
px-6
">


{/* HEADER */}


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
uppercase
tracking-widest
font-semibold
text-blue-600
">

AI Workflow

</p>


<h2 className="
mt-5
text-5xl
font-extrabold
text-slate-900
">


How MastiskhNet

<span className="
text-blue-600
">

&nbsp;Works

</span>


</h2>


<p className="
mx-auto
mt-6
max-w-2xl
text-lg
text-slate-600
">

A complete medical AI pipeline transforming
MRI scans into meaningful clinical insights.

</p>


</motion.div>





{/* TIMELINE */}


<div className="
relative
mt-20
">


{/* Vertical Line */}

<div className="
absolute
left-8
top-0
hidden
h-full
w-1
bg-blue-200
md:block
"></div>



<div className="
space-y-12
">


{
steps.map((step,index)=>(


<motion.div

key={index}


initial={{

opacity:0,
x:index%2===0 ? -80 : 80

}}


whileInView={{

opacity:1,
x:0

}}


transition={{

duration:0.7

}}



className="
relative
flex
items-start
gap-8
"

>



{/* ICON */}

<div className="
z-10
flex
h-16
w-16
shrink-0
items-center
justify-center
rounded-full
bg-gradient-to-br
from-blue-600
to-cyan-400
text-2xl
text-white
shadow-xl
">


{step.icon}


</div>





{/* CARD */}


<motion.div


whileHover={{

scale:1.03

}}


className="
rounded-3xl
bg-white
p-8
shadow-lg
border
border-sky-100
"


>


<div className="
flex
items-center
gap-4
">


<span className="
text-sm
font-bold
text-blue-600
">

STEP {index+1}

</span>


<h3 className="
text-2xl
font-bold
text-slate-900
">

{step.title}

</h3>


</div>



<p className="
mt-4
leading-7
text-slate-600
">


{step.description}


</p>



</motion.div>


</motion.div>


))

}


</div>


</div>


</div>


</section>


)

}