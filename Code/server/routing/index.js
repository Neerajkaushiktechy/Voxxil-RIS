const express = require('express');
const router = express.Router();
const auth = require('./auth');
const branch = require('./branch');
const profile = require('./profile');
const radiology = require('./radiology');
const staff = require('./staff');
const exam = require('./exam');
const appoinment = require('./appoinment');
const patientRegistration = require('./admin/patientRegistration')
const patientInformation = require('./admin/patientInformation')
const patientEmergencyContact = require('./admin/patientEmergencyContactInfo')
const patientInsurance = require('./admin/patientInsurance')
const patientPhysician = require('./admin/patientPhysician')
const patientLifeStyleInfo = require('./admin/patientLifeStyleInfo')
const patientMedicalHistory = require('./admin/patientMedicalHistory')
const patientAcknowledgement = require('./admin/patientAcknowledgement')
const patientProfile = require('./admin/patientProfile')
const verifySignature = require('./verifySignature')
const orders = require('./orders');
const report = require('./report');
const dashboard = require('./dashboard')
const invoice = require('./invoice')
const analytics = require('./analytics')
const referral = require('./referral')
const modality = require('./modality')
const enquiry = require('./generalPublicApis')

router.use(auth);
router.use(branch);
router.use(profile);
router.use(patientRegistration);
router.use(patientInformation);
router.use(patientEmergencyContact);
router.use(patientInsurance);
router.use(patientPhysician);
router.use(patientLifeStyleInfo);
router.use(patientMedicalHistory);
router.use(patientAcknowledgement);
router.use(patientProfile);
router.use(radiology);
router.use(staff);
router.use(exam);
router.use(verifySignature);
router.use(appoinment);
router.use(orders);
router.use(report);
router.use(dashboard);
router.use(invoice);
router.use(analytics);
router.use(referral);
router.use(modality);
router.use(enquiry);

module.exports = router;