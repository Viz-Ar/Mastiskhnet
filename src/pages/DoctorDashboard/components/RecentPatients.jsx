export default function RecentPatients({
  patients
}) {


return (

<div
className="
rounded-2xl
border
border-slate-200
bg-white
p-6
shadow-sm
"
>


<div className="
mb-6
flex
items-center
justify-between
">

<h2
className="
text-xl
font-bold
text-slate-900
"
>
Recent Patients
</h2>


<span
className="
text-sm
text-slate-500
"
>
Latest MRI scans
</span>


</div>





{
patients.length === 0 ?

(

<div
className="
py-10
text-center
text-slate-500
"
>

No patient records found

</div>

)

:

(

<div className="space-y-4">


{
patients
.slice(0,5)
.map((patient)=>(


<div
key={patient.id}
className="
flex
items-center
justify-between
rounded-xl
border
border-slate-100
bg-slate-50
p-4
hover:bg-blue-50
transition
"
>



{/* Patient Information */}

<div
className="
flex
items-center
gap-4
"
>


<div
className="
flex
h-12
w-12
items-center
justify-center
rounded-full
bg-blue-600
font-bold
text-white
"
>

{
patient.patient_name
?.charAt(0)
.toUpperCase()
}


</div>



<div>


<h3
className="
font-semibold
text-slate-900
"
>

{patient.patient_name}

</h3>


<p
className="
text-sm
text-slate-500
"
>

Patient #{patient.patient_id}

</p>


<p
className="
text-xs
text-slate-400
mt-1
"
>

{
new Date(
patient.created_at
)
.toLocaleDateString()
}

</p>


</div>


</div>





{/* Result */}

<div
className="
text-right
"
>


<span
className={`
inline-block
rounded-full
px-3
py-1
text-xs
font-semibold

${
patient.prediction_status === "Completed"

?

"bg-green-100 text-green-700"

:

patient.prediction_status === "Processing"

?

"bg-yellow-100 text-yellow-700"

:

patient.prediction_status === "Failed"

?

"bg-red-100 text-red-700"

:

"bg-slate-100 text-slate-700"

}

`}
>

{patient.prediction_status}

</span>




<p
className="
mt-2
text-sm
font-medium
text-slate-700
"
>

{
patient.tumor_type
||
"Analysis pending"
}

</p>




{
patient.confidence &&

<p
className="
text-xs
text-slate-500
"
>

Confidence:

{" "}

{
patient.confidence.toFixed(2)
}%

</p>

}


</div>



</div>


))

}


</div>

)

}



</div>

)

}