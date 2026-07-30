import {
  FaBrain,
  FaGithub,
  FaBookMedical,
  FaEnvelope
} from "react-icons/fa";


export default function Footer() {


return (

<footer className="
bg-slate-950
text-white
">


<div className="
mx-auto
max-w-7xl
px-6
py-20
">


<div className="
grid
gap-12
md:grid-cols-2
lg:grid-cols-4
">


{/* BRAND */}


<div className="
lg:col-span-2
">


<div className="
flex
items-center
gap-3
">


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
text-3xl
shadow-lg
">


<FaBrain/>


</div>


<div>


<h2 className="
text-2xl
font-extrabold
">

MastiskhNet

</h2>


<p className="
text-sm
text-cyan-400
">

AI Brain Tumor Platform

</p>


</div>


</div>



<p className="
mt-6
max-w-md
leading-7
text-slate-400
">

An intelligent healthcare AI platform
combining 3D Attention U-Net,
medical imaging and modern software
engineering for brain tumor analysis.

</p>


</div>





{/* PLATFORM */}


<div>


<h3 className="
text-lg
font-bold
">

Platform

</h3>


<ul className="
mt-5
space-y-3
text-slate-400
">


<li className="hover:text-cyan-400 transition">
Doctor Portal
</li>


<li className="hover:text-cyan-400 transition">
Patient Dashboard
</li>


<li className="hover:text-cyan-400 transition">
MRI Analysis
</li>


<li className="hover:text-cyan-400 transition">
3D Visualization
</li>


</ul>


</div>





{/* RESEARCH */}


<div>


<h3 className="
text-lg
font-bold
">

Research

</h3>


<ul className="
mt-5
space-y-3
text-slate-400
">


<li className="hover:text-cyan-400 transition">
BraTS Dataset
</li>


<li className="hover:text-cyan-400 transition">
3D Attention U-Net
</li>


<li className="hover:text-cyan-400 transition">
Deep Learning
</li>


<li className="hover:text-cyan-400 transition">
Medical AI
</li>


</ul>


</div>


</div>





{/* BOTTOM */}


<div className="
mt-16
flex
flex-col
items-center
justify-between
gap-6
border-t
border-white/10
pt-8
md:flex-row
">


<p className="
text-sm
text-slate-500
">

© 2026 MastiskhNet. All rights reserved.

</p>




<div className="
flex
gap-5
">


<a
className="
flex
h-10
w-10
items-center
justify-center
rounded-xl
bg-white/5
text-slate-300
transition
hover:bg-cyan-500
hover:text-white
"
>

<FaGithub/>

</a>


<a
className="
flex
h-10
w-10
items-center
justify-center
rounded-xl
bg-white/5
text-slate-300
transition
hover:bg-cyan-500
hover:text-white
"
>

<FaBookMedical/>

</a>


<a
className="
flex
h-10
w-10
items-center
justify-center
rounded-xl
bg-white/5
text-slate-300
transition
hover:bg-cyan-500
hover:text-white
"
>

<FaEnvelope/>

</a>


</div>


</div>


</div>


</footer>


)

}