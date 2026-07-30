import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBrain,
  FaBars,
  FaTimes
} from "react-icons/fa";


export default function Navbar() {


const [scrolled,setScrolled] = useState(false);

const [menuOpen,setMenuOpen] = useState(false);



useEffect(()=>{

const handleScroll=()=>{

setScrolled(window.scrollY > 20);

};


window.addEventListener(
"scroll",
handleScroll
);


return()=>{

window.removeEventListener(
"scroll",
handleScroll
);

};


},[]);



const navLinks=[

{
name:"Home",
path:"/"
},

{
name:"Features",
path:"#features"
},

{
name:"Workflow",
path:"#workflow"
},

{
name:"Research",
path:"#research"
}

];



return (

<motion.header

initial={{
y:-100
}}

animate={{
y:0
}}

transition={{
duration:0.6
}}


className="
fixed
top-5
left-0
right-0
z-50
px-6
"


>


<div

className={`
mx-auto
flex
h-20
max-w-7xl
items-center
justify-between
rounded-3xl
border
px-6
transition-all
duration-300


${
scrolled

?

"border-white/20 bg-slate-950/90 backdrop-blur-xl shadow-2xl"

:

"border-white/10 bg-slate-950/60 backdrop-blur-md"

}

`}

>


{/* LOGO */}


<Link

to="/"

className="
flex
items-center
gap-3
"

>


<motion.div

animate={{

rotate:[0,8,-8,0]

}}

transition={{

duration:5,
repeat:Infinity

}}


className="
flex
h-12
w-12
items-center
justify-center
rounded-2xl
bg-gradient-to-br
from-cyan-400
to-blue-600
text-2xl
text-white
shadow-lg
shadow-cyan-500/30
"

>


<FaBrain/>


</motion.div>



<div>


<h1 className="
text-xl
font-bold
text-white
">

MastiskhNet

</h1>


<p className="
text-xs
text-slate-400
">

AI Brain Tumor Platform

</p>


</div>


</Link>





{/* DESKTOP NAV */}


<nav className="
hidden
items-center
gap-8
md:flex
">


{

navLinks.map((item,index)=>(


<motion.a

key={index}

href={item.path}

whileHover={{

y:-3

}}

className="
text-slate-300
transition
hover:text-cyan-400
"

>

{item.name}


</motion.a>


))


}



<Link

to="/doctor/login"

className="
rounded-xl
bg-gradient-to-r
from-cyan-500
to-blue-600
px-6
py-3
font-semibold
text-white
shadow-lg
shadow-blue-500/30
transition
hover:scale-105
"

>

Doctor Login

</Link>


</nav>





{/* MOBILE BUTTON */}


<button

onClick={()=>setMenuOpen(!menuOpen)}

className="
text-2xl
text-white
md:hidden
"

>


{

menuOpen

?

<FaTimes/>

:

<FaBars/>

}


</button>



</div>





{/* MOBILE MENU */}


{

menuOpen && (


<motion.div

initial={{

opacity:0,
y:-20

}}

animate={{

opacity:1,
y:0

}}

className="
mt-3
rounded-3xl
border
border-white/10
bg-slate-950/95
p-6
backdrop-blur-xl
md:hidden
"

>


<div className="
flex
flex-col
gap-5
">


{

navLinks.map((item,index)=>(


<a

key={index}

href={item.path}

onClick={()=>setMenuOpen(false)}

className="
text-slate-300
hover:text-cyan-400
"

>

{item.name}

</a>


))


}



<Link

to="/doctor/login"

className="
rounded-xl
bg-gradient-to-r
from-cyan-500
to-blue-600
px-5
py-3
text-center
font-semibold
text-white
"

>

Doctor Login

</Link>


</div>


</motion.div>


)


}



</motion.header>


);

}