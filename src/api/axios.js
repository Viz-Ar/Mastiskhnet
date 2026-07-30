import axios from "axios";

export const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

const axiosInstance = axios.create({

  baseURL: API_BASE_URL,

  timeout: 30000,

});



axiosInstance.interceptors.request.use(

  (config)=>{

    const token =
      localStorage.getItem(
        "accessToken"
      );


    if(token){

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;

  },

  (error)=>{

    return Promise.reject(error);

  }

);



export default axiosInstance;