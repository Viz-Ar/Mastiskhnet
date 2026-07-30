import { useEffect,useState } from "react";

import {
    getDoctorPatients
} from "../api/patientApi";



export default function usePatients(
    doctorId:number | undefined
){


const [patients,setPatients]=
useState<any[]>([]);


const [loading,setLoading]=
useState(true);



useEffect(()=>{


if(!doctorId)
return;



async function load(){


try{


const data =
await getDoctorPatients(
    doctorId
);


setPatients(data);


}
catch(error){

console.error(
"Patient loading error",
error
);

}
finally{

setLoading(false);

}


}


load();


},[doctorId]);



return {

patients,

loading

};


}