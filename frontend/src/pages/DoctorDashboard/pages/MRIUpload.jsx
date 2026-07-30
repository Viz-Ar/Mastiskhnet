import {
  useState,
  useEffect,
  useMemo,
} from "react";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../../../api/axios";



export default function MRIUpload(){


const navigate = useNavigate();


const [patients, setPatients] = useState([]);

const [patientsLoading, setPatientsLoading] = useState(true);

const [searchTerm, setSearchTerm] = useState("");

const [selectedPatient, setSelectedPatient] = useState(null);

const [showDropdown, setShowDropdown] = useState(false);


const [patientId,setPatientId]=
useState("");


// ==========================================
// New Patient Registration
// ==========================================

const [showRegisterForm, setShowRegisterForm] = useState(false);

const [newPatientName, setNewPatientName] = useState("");

const [newPatientEmail, setNewPatientEmail] = useState("");

const [registering, setRegistering] = useState(false);

const [registeredCredentials, setRegisteredCredentials] = useState(null);


const [files,setFiles]=
useState({
    flair:null,
    t1:null,
    t1ce:null,
    t2:null
});


const [loading,setLoading]=
useState(false);


useEffect(() => {

    loadPatients();

}, []);


async function loadPatients() {

    try {

        setPatientsLoading(true);

        const response = await axiosInstance.get(
            "/users/patients"
        );

        setPatients(response.data || []);

    } catch (error) {

        console.error(
            "Failed to load patients",
            error
        );

    } finally {

        setPatientsLoading(false);

    }

}


const filteredPatients = useMemo(() => {

    if (!searchTerm.trim()) return patients;

    const term = searchTerm.toLowerCase();

    return patients.filter((patient) =>

        patient.full_name?.toLowerCase().includes(term) ||

        patient.email?.toLowerCase().includes(term) ||

        String(patient.id).includes(term)

    );

}, [patients, searchTerm]);


function handleSelectPatient(patient) {

    setSelectedPatient(patient);

    setPatientId(String(patient.id));

    setSearchTerm(
        `${patient.full_name} (ID #${patient.id})`
    );

    setShowDropdown(false);

}


function handleManualIdChange(value) {

    setPatientId(value);

    setSelectedPatient(null);

    setSearchTerm("");

}


async function handleRegisterPatient() {

    if (!newPatientName.trim() || !newPatientEmail.trim()) {

        alert("Please enter both name and email");

        return;

    }

    try {

        setRegistering(true);

        const response = await axiosInstance.post(
            "/users/register-patient",
            {
                full_name: newPatientName,
                email: newPatientEmail,
            }
        );

        setRegisteredCredentials(response.data);

        // Auto-select the newly created patient
        handleSelectPatient(response.data.patient);

        // Refresh patient list so they appear in search too
        await loadPatients();

        setNewPatientName("");

        setNewPatientEmail("");

    } catch (error) {

        console.error(
            "Patient registration failed",
            error.response?.data || error.message
        );

        alert(
            error.response?.data?.detail ||
            "Failed to register patient"
        );

    } finally {

        setRegistering(false);

    }

}


async function handleDownloadCredentialsReport(patientId) {

    try {

        const response = await axiosInstance.get(
            `/users/${patientId}/credentials-report`,
            { responseType: "blob" }
        );

        const url = URL.createObjectURL(response.data);

        const link = document.createElement("a");

        link.href = url;

        link.download = `patient_${patientId}_credentials.pdf`;

        link.click();

        URL.revokeObjectURL(url);

    } catch (error) {

        console.error("Failed to download report", error);

        alert("Failed to download credentials report");

    }

}



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
"Please select a patient and provide all MRI files"
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



navigate(
`/doctor/dashboard/predictions/${response.data.id}`
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



{/* Register New Patient Toggle */}

<div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

    <div className="flex items-center justify-between">

        <div>

            <p className="font-semibold text-blue-900">

                New patient without a mobile account?

            </p>

            <p className="text-sm text-blue-700">

                Register them here and get their login credentials instantly.

            </p>

        </div>

        <button

            type="button"

            onClick={() => setShowRegisterForm((v) => !v)}

            className="rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"

        >

            {showRegisterForm ? "Cancel" : "Register Patient"}

        </button>

    </div>


    {showRegisterForm && (

        <div className="mt-4 space-y-3 border-t border-blue-200 pt-4">

            <input

                type="text"

                value={newPatientName}

                onChange={(e) => setNewPatientName(e.target.value)}

                placeholder="Patient full name"

                disabled={registering}

                className="w-full rounded-xl border p-3 disabled:opacity-50"

            />

            <input

                type="email"

                value={newPatientEmail}

                onChange={(e) => setNewPatientEmail(e.target.value)}

                placeholder="Patient email"

                disabled={registering}

                className="w-full rounded-xl border p-3 disabled:opacity-50"

            />

            <button

                type="button"

                onClick={handleRegisterPatient}

                disabled={registering}

                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"

            >

                {registering ? "Registering..." : "Create Patient Account"}

            </button>

        </div>

    )}


    {registeredCredentials && (

        <div className="mt-4 rounded-xl border border-green-300 bg-green-50 p-4">

            <p className="font-semibold text-green-800">

                Patient account created successfully!

            </p>

            <p className="mt-1 text-sm text-green-700">

                Login ID: <strong>{registeredCredentials.patient.email}</strong><br/>

                Temporary Password: <strong>{registeredCredentials.temp_password}</strong>

            </p>

            <button

                type="button"

                onClick={() =>
                    handleDownloadCredentialsReport(registeredCredentials.patient.id)
                }

                className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"

            >

                Download Credentials Report (PDF)

            </button>

        </div>

    )}

</div>



{/* Patient Search / Select */}

<div className="relative">


<label
className="
block
mb-2
font-medium
text-slate-700
"
>

Patient

</label>


<input

type="text"

value={searchTerm}

onChange={(e) => {

    setSearchTerm(e.target.value);

    setSelectedPatient(null);

    setShowDropdown(true);

}}

onFocus={() => setShowDropdown(true)}

disabled={loading}

placeholder={
    patientsLoading
        ? "Loading patients..."
        : "Search patient by name, email, or ID"
}

className="
w-full
rounded-xl
border
p-3
disabled:opacity-50
"
/>


{selectedPatient && (

    <p className="mt-1.5 text-sm text-green-600">

        Selected: {selectedPatient.full_name} ({selectedPatient.email}) — ID #{selectedPatient.id}

    </p>

)}


{showDropdown && searchTerm && !selectedPatient && (

    <div
        className="
            absolute
            z-10
            mt-1
            max-h-64
            w-full
            overflow-y-auto
            rounded-xl
            border
            bg-white
            shadow-lg
        "
    >

        {filteredPatients.length === 0 ? (

            <div className="p-4 text-sm text-slate-500">

                No matching patients. You can also type the patient ID directly below.

            </div>

        ) : (

            filteredPatients.map((patient) => (

                <button

                    key={patient.id}

                    type="button"

                    onClick={() => handleSelectPatient(patient)}

                    className="
                        block
                        w-full
                        border-b
                        p-3
                        text-left
                        last:border-b-0
                        hover:bg-blue-50
                    "

                >

                    <p className="font-medium text-slate-900">

                        {patient.full_name}

                    </p>

                    <p className="text-sm text-slate-500">

                        {patient.email} — ID #{patient.id}

                    </p>

                </button>

            ))

        )}

    </div>

)}


</div>



{/* Manual ID fallback */}

<div>


<label
className="
block
mb-2
text-sm
font-medium
text-slate-500
"
>

Or enter Patient ID manually

</label>


<input

type="number"

min="1"

value={patientId}

onChange={
e=>handleManualIdChange(e.target.value)
}

disabled={loading}

placeholder="Enter patient id"

className="
w-full
rounded-xl
border
p-3
disabled:opacity-50
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

disabled={loading}

className="
w-full
rounded-xl
border
p-3
disabled:opacity-50
"

/>


{
files[key] && (
<p className="mt-1 text-sm text-green-600">
    {files[key].name}
</p>
)
}


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
"Analyze MRI Scan"
}


</button>



</div>


</div>



</div>


)

}