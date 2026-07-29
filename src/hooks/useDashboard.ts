import { useEffect, useState } from "react";

import axiosInstance from "../api/axios";


export interface DashboardStats {

    patients:number;

    mri_scans:number;

    completed:number;

    processing:number;

    failed:number;

    accuracy:number;

}



export default function useDashboard(){

    const [stats,setStats] =
        useState<DashboardStats | null>(null);


    const [loading,setLoading] =
        useState<boolean>(true);


    const [error,setError] =
        useState<string | null>(null);



    const fetchDashboard = async()=>{


        try{


            setLoading(true);

            setError(null);


            const response =
                await axiosInstance.get<DashboardStats>(
                    "/mri/dashboard"
                );


            setStats(
                response.data
            );


        }
        catch(error:any){


            console.error(
                "Dashboard fetch error:",
                error.response?.data ||
                error.message
            );


            setError(
                "Unable to load dashboard data"
            );


        }
        finally{


            setLoading(false);


        }


    };



    useEffect(()=>{


        fetchDashboard();


    },[]);



    return {

        stats,

        loading,

        error,

        refreshDashboard:fetchDashboard

    };


}