const express = require('express');
const router = express.Router();
const patientProfile = require("../../controllers/admin/patientProfile");
const verifyToken = require('../../middleware/tokenVerify');
const roleChecker = require('../../middleware/roleChecker');
const { USER_ROLE } = require('../../constant');

allRoles = ["admin", "juniorRadiologist", "seniorRadiologist", "cardiothoracicRadiology", "sonographer", "radiologist", "mriTechnologist", "nuclearRadiology", "ctTechnologist", "mammographer", "cardiovascularTechnologist", "pediatricRadiology", "cardiothoracicRadiology", "interventionalRadiology", "neuroradiology", "radiographicAssistant", "gastrointestinalRadiology", "genitourinaryRadiology", "medicalImagingProfessions", "medicalPhysicist", "musculoskeletalRadiology"];
const rolesWithPatient = [...allRoles, USER_ROLE.patient];

router.get('/api/get-patient-profile-masterData', verifyToken, roleChecker(rolesWithPatient), patientProfile.getPatientRegistrationMasterData);
router.get('/api/get-patient-profile/:currentBranch', verifyToken, roleChecker([...allRoles]), patientProfile.getPatientProfileData);
router.delete('/api/delete-patient-Profile/:id', verifyToken, roleChecker([...allRoles]), patientProfile.deletePatientData);
router.get('/api/get-patient-data/:type/:id', verifyToken, roleChecker(rolesWithPatient), patientProfile.getPatientData);
module.exports = router;