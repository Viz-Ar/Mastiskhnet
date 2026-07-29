import {
  useParams
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";


import axiosInstance from "../../../api/axios";



export default function PatientDetails(){


const {
id
}=useParams();



const [patient,setPatient]=
useState(null);


const [loading,setLoading]=
useState(true);



useEffect(()=>{


async function fetchPatient(){


try{


const response =
await axiosInstance.get(
 `/mri/${id}`
);


setPatient(
 response.data
);



}
catch(error){

console.error(
 "Patient details error",
 error
);


}
finally{

setLoading(false);

}


}



fetchPatient();



},[id]);





if(loading){

return (

<div className="
p-6
text-slate-600
">

Loading patient details...

</div>

)

}





if(!patient){

return (

<div className="
p-6
text-red-500
">

Patient not found

</div>

)

}




return (

<div className="space-y-6">



{/* Header */}

<div>

<h1
className="
text-3xl
font-bold
text-slate-900
"
>

Patient Details

</h1>


<p
className="
text-slate-500
mt-2
"
>

MRI analysis information

</p>


</div>






{/* Patient Card */}

<div
className="
rounded-2xl
bg-white
border
border-slate-200
p-6
shadow-sm
"
>


<h2
className="
text-xl
font-bold
text-slate-900
mb-4
"
>

Patient Information

</h2>



<div
className="
grid
md:grid-cols-2
gap-4
"
>


<div>

<p className="text-slate-500">
Name
</p>

<p className="font-semibold">
{patient.patient_name}
</p>

</div>



<div>

<p className="text-slate-500">
Patient ID
</p>

<p className="font-semibold">
#{patient.patient_id}
</p>

</div>



<div>

<p className="text-slate-500">
Doctor
</p>

<p className="font-semibold">
{patient.doctor_name}
</p>

</div>



<div>

<p className="text-slate-500">
Date
</p>

<p className="font-semibold">

{
new Date(
patient.created_at
).toLocaleDateString()

}

</p>

</div>



</div>


</div>







{/* AI Result */}

<div
className="
rounded-2xl
bg-white
border
border-slate-200
p-6
shadow-sm
"
>


<h2
className="
text-xl
font-bold
mb-5
text-slate-900
"
>

AI Prediction Result

</h2>



<div
className="
grid
md:grid-cols-3
gap-5
"
>


<Card
title="Status"
value={
patient.prediction_status
}
/>



<Card
title="Tumor Type"
value={
patient.tumor_type ||
"Not detected"
}
/>



<Card
title="Confidence"
value={
patient.confidence
?
`${patient.confidence.toFixed(2)}%`
:
"0%"
}
/>



<Card
title="Tumor Volume"
value={
patient.tumor_volume
?
`${patient.tumor_volume.toFixed(2)} mm³`
:
"0"
}
/>



<Card
title="Processing Time"
value={
patient.processing_time
?
`${patient.processing_time}s`
:
"-"
}
/>



<Card
title="Model"
value={
patient.model_name
}
/>



</div>



</div>






{/* Actions */}

<div
className="
flex
gap-4
"
>


<a
href={
`http://localhost:8000${patient.report_url}`
}
target="_blank"
className="
rounded-xl
bg-blue-600
px-5
py-3
text-white
font-medium
"
>

View Report

</a>




<a
href={
`http://localhost:8000${patient.mesh_url}`
}
target="_blank"
className="
rounded-xl
bg-purple-600
px-5
py-3
text-white
font-medium
"
>

Open 3D Model

</a>



</div>



</div>

)

}






function Card({
title,
value
}){


return (

<div
className="
rounded-xl
bg-slate-50
p-4
"
>


<p
className="
text-sm
text-slate-500
"
>

{title}

</p>


<p
className="
mt-2
font-bold
text-slate-900
"
>

{value}

</p>


</div>


)

}