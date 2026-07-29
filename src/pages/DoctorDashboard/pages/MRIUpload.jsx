import {
  useState
} from "react";

import axiosInstance from "../../../api/axios";

import useAuthStore from "../../../store/authStore";



export default function MRIUpload(){


const {user}=useAuthStore();



const [patientId,setPatientId]=
useState("");



const [files,setFiles]=
useState({
    flair:null,
    t1:null,
    t1ce:null,
    t2:null
});


const [loading,setLoading]=
useState(false);



const [result,setResult]=
useState(null);



function handleFileChange(
    e,
    type
){

setFiles({

...files,

[type]:e.target.files[0]

});


}



async function uploadMRI(){


if(
!patientId ||
!files.flair ||
!files.t1 ||
!files.t1ce ||
!files.t2
){

alert(
"Please provide patient ID and all MRI files"
);

return;

}



const formData =
new FormData();



formData.append(
"patient_id",
patientId
);


formData.append(
"flair",
files.flair
);


formData.append(
"t1",
files.t1
);


formData.append(
"t1ce",
files.t1ce
);


formData.append(
"t2",
files.t2
);



try{


setLoading(true);



const response =
await axiosInstance.post(
"/mri/upload",
formData,
{
headers:{
"Content-Type":
"multipart/form-data"
}
}
);



setResult(
response.data
);



}
catch(error){


console.error(
"MRI upload error",
error.response?.data ||
error.message
);


alert(
"MRI upload failed"
);


}
finally{

setLoading(false);

}


}




return (

<div className="space-y-6">



<h1
className="
text-3xl
font-bold
text-slate-900
"
>

Upload MRI Scan

</h1>



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



<div
className="
space-y-5
"
>



{/* Patient ID */}

<div>


<label
className="
block
mb-2
font-medium
text-slate-700
"
>

Patient ID

</label>


<input

value={patientId}

onChange={
e=>setPatientId(e.target.value)
}

placeholder="Enter patient id"

className="
w-full
rounded-xl
border
p-3
"
/>


</div>





{
[
["flair","FLAIR MRI"],
["t1","T1 MRI"],
["t1ce","T1CE MRI"],
["t2","T2 MRI"]

].map(
([key,label])=>(


<div key={key}>


<label
className="
block
mb-2
font-medium
text-slate-700
"
>

{label}

</label>


<input

type="file"

accept=".nii,.nii.gz"

onChange={
e=>
handleFileChange(
e,
key
)
}

className="
w-full
rounded-xl
border
p-3
"

/>


</div>


)

)

}




<button

onClick={uploadMRI}

disabled={loading}

className="
rounded-xl
bg-blue-600
px-6
py-3
font-semibold
text-white
hover:bg-blue-700
disabled:opacity-50
"

>


{
loading
?
"Processing MRI..."
:
"Analyze MRI"
}


</button>



</div>


</div>






{
result &&

<div
className="
rounded-2xl
bg-green-50
border
border-green-200
p-6
"
>


<h2
className="
text-xl
font-bold
text-green-800
"
>

Analysis Completed

</h2>


<p className="mt-3">

Status:
{" "}
{result.prediction_status}

</p>


<p>

Tumor:
{" "}
{result.tumor_type || "Unknown"}

</p>


<p>

Confidence:
{" "}
{result.confidence}%

</p>


<a

href={
`http://localhost:8000${result.report_url}`
}

target="_blank"

className="
inline-block
mt-4
rounded-lg
bg-blue-600
px-4
py-2
text-white
"

>

View Report

</a>



</div>


}




</div>


)

}