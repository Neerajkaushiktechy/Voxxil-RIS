import { useEffect } from "react";
import { logoutRequest } from "../redux/modules/auth/authSlice";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { Stack } from "@mui/material";
import AdminLayout from "./adminLayout";
import Header from "../component/header";
import Footer from "../component/footer";
import JuniorRadiologistLayout from "./juniorRadiologistLayout";
import SeniorRadiologistLayout from "./seniorRadiologistLayout";
import PatientLayout from "./patientLayout";


export default function Layout({ layoutName, proctedRoute = false }) {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { isLoggedIn, userData } = useSelector((state) => state.auth);

    useEffect(() => {
        if (proctedRoute) {
            if (isLoggedIn) {
                const currentTime = new Date().getTime() / 1000;
                const timeUntilExpiration = Math.floor(userData.exp - currentTime);
                if (timeUntilExpiration <= 0) {
                    dispatch(logoutRequest());
                } else {
                    let tokenExpiryTimer = setTimeout(() => {
                        toast("Session time expired please login again");
                        dispatch(logoutRequest());
                    }, timeUntilExpiration * 1000);
                    return () => {
                        clearTimeout(tokenExpiryTimer);
                    };
                }
            } else {
                navigate("/login");
            }
        }
    }, [dispatch, navigate, proctedRoute, isLoggedIn, userData]);

    if (proctedRoute && !isLoggedIn) {
        return <Navigate to="login" />
    }

    if (layoutName === "admin") {
        // if (layoutName !== userData.role) { return <Navigate to={userData.role} /> }
        return (<AdminLayout><Outlet /></AdminLayout>)
    }

    if (layoutName === "juniorRadiologist") {
        return (<JuniorRadiologistLayout><Outlet /></JuniorRadiologistLayout>)
    }

    if (layoutName === "seniorRadiologist") {
        return (<SeniorRadiologistLayout><Outlet /></SeniorRadiologistLayout>)
    }

    if (layoutName === "patient") {
        return (<PatientLayout><Outlet /></PatientLayout>)
    }

    if (layoutName === "auth") {
        return (
            <>
                <Stack sx={{ height: "100vh" }} justifyContent="center">
                    <Outlet />
                </Stack>
            </>
        )
    }
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
}