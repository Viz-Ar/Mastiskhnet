import { Route } from "react-router-dom";

import DoctorDashboard from "../pages/DoctorDashboard/DoctorDashboard";

import DashboardHome from "../pages/DoctorDashboard/pages/DashboardHome";
import Patients from "../pages/DoctorDashboard/pages/Patients";
import PatientDetails from "../pages/DoctorDashboard/pages/PatientDetails";
import MRIUpload from "../pages/DoctorDashboard/pages/MRIUpload";
import PredictionViewer from "../pages/DoctorDashboard/pages/PredictionViewer";
import Reports from "../pages/DoctorDashboard/pages/Reports";
import Chat from "../pages/DoctorDashboard/pages/Chat";
import Profile from "../pages/DoctorDashboard/pages/Profile";
import Settings from "../pages/DoctorDashboard/pages/Settings";


export default function DoctorRoutes(){

    return (

        <Route
            path="/doctor/dashboard"
            element={<DoctorDashboard />}
        >

            <Route
                index
                element={<DashboardHome />}
            />


            <Route
                path="patients"
                element={<Patients />}
            />


            <Route
                path="patients/:id"
                element={<PatientDetails />}
            />


            <Route
                path="upload"
                element={<MRIUpload />}
            />


            <Route
                path="predictions"
                element={<PredictionViewer />}
            />


            <Route
                path="predictions/:id"
                element={<PredictionViewer />}
            />


            <Route
                path="reports"
                element={<Reports />}
            />


            <Route
                path="chat"
                element={<Chat />}
            />


            <Route
                path="profile"
                element={<Profile />}
            />


            <Route
                path="settings"
                element={<Settings />}
            />

        </Route>

    );
}