import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


import MainLayout from "../layouts/MainLayout";

import LandingPage from "../pages/landing/LandingPage";
import DoctorLogin from "../pages/DoctorLogin/DoctorLogin";
import NotFound from "../pages/NotFound/NotFound";


import DoctorRoutes from "./doctorRoutes";


function AppRouter(){

    return (

        <BrowserRouter>

            <Routes>


                {/* Public Website */}

                <Route element={<MainLayout />}>

                    <Route
                        path="/"
                        element={<LandingPage />}
                    />

                </Route>



                {/* Doctor Authentication */}

                <Route
                    path="/doctor/login"
                    element={<DoctorLogin />}
                />



                {/* Doctor Portal */}

                {DoctorRoutes()}



                {/* 404 */}

                <Route
                    path="*"
                    element={<NotFound />}
                />


            </Routes>


        </BrowserRouter>

    );

}


export default AppRouter;