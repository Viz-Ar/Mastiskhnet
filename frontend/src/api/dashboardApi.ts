import axiosInstance from "./axios";


export const getDoctorDashboard = async () => {

    const response = await axiosInstance.get(
        "/mri/dashboard"
    );

    return response.data;

};