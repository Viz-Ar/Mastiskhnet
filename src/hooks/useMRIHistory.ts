import { useEffect, useState } from "react";

import { getDoctorMRIHistory } from "../api/mriApi";


export interface MRIHistory {

    id:number;

    patient_id:number;

    patient_name:string;

    patient_email:string;

    doctor_id:number;

    prediction_status:string;

    tumor_type:string | null;

    confidence:number | null;

    tumor_volume:number | null;

    created_at:string;

}



export default function useMRIHistory(
    doctorId:number | undefined
){

    const [history,setHistory] =
        useState<MRIHistory[]>([]);


    const [loading,setLoading] =
        useState<boolean>(true);



    useEffect(()=>{


        if(!doctorId){

            setLoading(false);

            return;

        }



        const fetchHistory = async()=>{


            try{


                const data =
                    await getDoctorMRIHistory(
                        doctorId
                    );


                setHistory(data);


            }
            catch(error:any){


                console.error(
                    "Patient history error:",
                    error.response?.data ||
                    error.message
                );


            }
            finally{


                setLoading(false);


            }


        };



        fetchHistory();



    },[doctorId]);



    return {

        history,

        loading

    };


}