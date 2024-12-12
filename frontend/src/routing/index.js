import { Routes, Route } from "react-router-dom";
import Layout from "../layout";
import Login from "../pages/auth/login";
import AdminDashboard from "../pages/adminDashboard";
import Branches from "../pages/adminDashboard/settings/branches";
import BranchForm from "../pages/adminDashboard/settings/branches/form";
import { useSelector } from "react-redux";
import Settings from "../pages/adminDashboard/settings";
import Home from "../pages/home";
import ContactPage from "../pages/contact";
import PatientManagement from "../pages/adminDashboard/patient-management/index";
import EditProfile from "../pages/adminDashboard/editProfile";
import Forgotpassword from "../pages/auth/forgotpassword";
import Newpassword from "../pages/auth/newpassword";
import Radiology from "../pages/adminDashboard/radiology";
import ProcedureTracking from "../pages/adminDashboard/procedure-tracking";
import ExamList from "../pages/adminDashboard/settings/examList";
import ExamGroup from "../pages/adminDashboard/settings/examGroup";
import Appointment from "../pages/adminDashboard/appoinment";
import ImageReport from "../pages/adminDashboard/image-report";
import BillingInvoice from "../pages/adminDashboard/billing-invoice"
import Analytics from "../pages/adminDashboard/analytics-reporting";
import ReferredPatients from "../pages/adminDashboard/referral";
import ModalityList from "../pages/adminDashboard/settings/modality";
import UserManagement from "../pages/adminDashboard/users";
import PatientDashboard from "../pages/patientDashboard";

function Routing() {
    const { isLoggedIn } = useSelector((state) => state.auth);
    return (
        <Routes>
            <Route element={<Layout layoutName="admin" proctedRoute={true} />}>
                <Route path="admin">
                    <Route index element={<AdminDashboard />} />
                    <Route path="edit-profile" element={<EditProfile />} />
                    <Route path="patient-management" element={<PatientManagement />} />
                    <Route path="radiology" element={<Radiology />} />
                    <Route path="procedure-tracking" element={<ProcedureTracking />} />
                    <Route path="appointment" element={<Appointment />} />
                    <Route path="image-report" element={<ImageReport />} />
                    <Route path="billing-invoice" element={<BillingInvoice />} />
                    <Route path="anlytics-reporting" element={<Analytics />} />
                    <Route path="referred-list" element={<ReferredPatients />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="settings">
                        <Route index element={<Settings />} />
                        <Route path="branches" element={<Branches />} />
                        <Route path="exam-list" element={<ExamList />} />
                        <Route path="exam-group" element={<ExamGroup />} />
                        <Route path="modality-list" element={<ModalityList />} />
                    </Route>
                </Route>
            </Route>

            <Route element={<Layout layoutName="patient" proctedRoute={true} />}>
                <Route path="Patient">
                    <Route index element={<PatientDashboard />} />
                    <Route path="edit-profile" element={<EditProfile />} />
                    <Route path="patient-management" element={<PatientManagement />} />
                    <Route path="radiology" element={<Radiology />} />
                    <Route path="procedure-tracking" element={<ProcedureTracking />} />
                    {/* <Route path="appointment" element={<Appointment />} /> */}
                    <Route path="image-report" element={<ImageReport />} />
                    <Route path="billing-invoice" element={<BillingInvoice />} />
                </Route>
            </Route>

            <Route element={<Layout layoutName="admin" proctedRoute={true} />}>
                {["staff", "radiologist", "juniorRadiologist","seniorRadiologist", "cardiothoracicRadiology"].map(path => (<Route path={path}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="edit-profile" element={<EditProfile />} />
                    <Route path="patient-management" element={<PatientManagement />} />
                    <Route path="radiology" element={<Radiology />} />
                    <Route path="procedure-tracking" element={<ProcedureTracking />} />
                    <Route path="appointment" element={<Appointment />} />
                    <Route path="image-report" element={<ImageReport />} />
                    <Route path="billing-invoice" element={<BillingInvoice />} />
                    <Route path="anlytics-reporting" element={<Analytics />} />
                    <Route path="settings">
                        <Route index element={<Settings />} />
                        <Route path="exam-list" element={<ExamList />} />
                        <Route path="exam-group" element={<ExamGroup />} />
                        <Route path="modality-list" element={<ModalityList />} />
                    </Route>
                </Route>))}
            </Route>

            <Route element={<Layout layoutName="auth" />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<Forgotpassword />} />
                <Route path="/new-password/:token" element={<Newpassword />} />
            </Route>

            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<Home />} />
            </Route>

            {isLoggedIn && <Route path="add/branch" element={<BranchForm onlyForm={true} />} />}
        </Routes>
    )
}

export default Routing;