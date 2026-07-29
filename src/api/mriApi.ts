import axiosInstance from "./axios";


export const getDoctorMRIHistory = async (
    doctorId:number
) => {

    const response =
        await axiosInstance.get(
            `/mri/history/doctor/${doctorId}`
        );


    return response.data;

};