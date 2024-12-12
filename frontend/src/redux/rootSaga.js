import { all } from 'redux-saga/effects';
import authSaga from './modules/auth/authSaga';
import branchSaga from './modules/branch/saga';
import patientRegistrationSaga from './modules/admin/patientRegistartion/saga';
import patientInformationSaga from './modules/admin/patientInformation/saga';
import patientEmergencyContactSaga from './modules/admin/patientEmergencyContactInfo/saga';
import patientInsuranceSaga from './modules/admin/patientInsurance/saga';
import patientPhysicianSaga from './modules/admin/patientPhysician/saga';
import patientMedicalHistorySaga from './modules/admin/patientMedicalHistory/saga';
import patientLifeStyleSaga from './modules/admin/patientLifeStyle/saga';
import patientAcknowledgementSaga from './modules/admin/patientAcknowledgement/saga';
import patientProfileSaga from './modules/admin/patientProfile/saga';
import profileSaga from './modules/profile/saga';
import radiologySaga from './modules/radiology/saga';
import staffSaga from './modules/staff/saga';
import examSaga from './modules/exam/saga';
import verifySignatureSaga from './modules/verifySignature/saga';
import appointmentSaga from './modules/appoinment/saga';
import ordersSaga from './modules/orders/saga';
import reportSaga from './modules/report/saga';
import dashboardSaga from './modules/dashboard/saga';
import invoiceSaga from './modules/invoice/saga';
import analyticsSaga from './modules/analytics/saga';
import referralSaga from './modules/referral/saga';
import modalitySaga from './modules/modality/saga';
import homeSaga from './modules/home/saga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    branchSaga(),
    patientRegistrationSaga(),
    patientInformationSaga(),
    patientEmergencyContactSaga(),
    patientInsuranceSaga(),
    patientPhysicianSaga(),
    patientMedicalHistorySaga(),
    patientLifeStyleSaga(),
    patientAcknowledgementSaga(),
    patientProfileSaga(),
    profileSaga(),
    radiologySaga(),
    staffSaga(),
    examSaga(),
    verifySignatureSaga(),
    appointmentSaga(),
    ordersSaga(),
    reportSaga(),
    dashboardSaga(),
    invoiceSaga(),
    analyticsSaga(),
    referralSaga(),
    modalitySaga(),
    homeSaga(),
  ]);
}