import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './modules/auth/authSlice';
import branchReducer from './modules/branch/slice';
import patientRegistrationReducer from './modules/admin/patientRegistartion/slice'
import patientInformationReducer from './modules/admin/patientInformation/slice'
import patientEmergencyContactReducer from './modules/admin/patientEmergencyContactInfo/slice'
import patientInsuranceReducer from './modules/admin/patientInsurance/slice'
import patientPhysicianReducer from './modules/admin/patientPhysician/slice'
import patientMedicalHistoryReducer from './modules/admin/patientMedicalHistory/slice'
import patientLifeStyleReducer from './modules/admin/patientLifeStyle/slice'
import patientAcknowledgementReducer from './modules/admin/patientAcknowledgement/slice'
import patientProfileReducer from './modules/admin/patientProfile/slice'
import profileReducer from './modules/profile/slice';
import radiologyReducer from './modules/radiology/slice';
import staffReducer from './modules/staff/slice';
import examReducer from './modules/exam/slice';
import mainHeadingReducer from './modules/mainHeading/slice';
import verifySignatureReducer from './modules/verifySignature/slice';
import appointmentReducer from './modules/appoinment/slice';
import setShowListReducer from './modules/showList/slice';
import ordersReducer from './modules/orders/slice';
import reportReducer from './modules/report/slice';
import dashboardReducer from "./modules/dashboard/slice";
import invoiceReducer from "./modules/invoice/slice"
import analyticsReducer from "./modules/analytics/slice"
import referralReducer from "./modules/referral/slice"
import modalitiesReducer from './modules/modality/slice'
import enquiryReducer from "./modules/home/slice";


const rootReducer = combineReducers({
  auth: authReducer,
  branch: branchReducer,
  patientRegistration: patientRegistrationReducer,
  patientInformation: patientInformationReducer,
  patientEmergencyContact: patientEmergencyContactReducer,
  patientInsurance: patientInsuranceReducer,
  patientPhysician: patientPhysicianReducer,
  patientMedicalHistory: patientMedicalHistoryReducer,
  patientLifeStyle: patientLifeStyleReducer,
  patientAcknowledgement: patientAcknowledgementReducer,
  patientProfile: patientProfileReducer,
  profile: profileReducer,
  radiology: radiologyReducer,
  staff: staffReducer,
  exam: examReducer,
  mainHeading: mainHeadingReducer,
  verifySignature: verifySignatureReducer,
  appointment: appointmentReducer,
  reduxShowList: setShowListReducer,
  orders: ordersReducer,
  report: reportReducer,
  dashboard: dashboardReducer,
  invoice: invoiceReducer,
  analytics: analyticsReducer,
  referral: referralReducer,
  modalities: modalitiesReducer,
  enquiry: enquiryReducer,
});

export default rootReducer;