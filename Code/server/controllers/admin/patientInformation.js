const PatientInformation = require("../../database/models/admin/patientInformation");
const { v4: uuidv4 } = require('uuid');
const { sendPatientRegistrationIntemation } = require('../../helper/patientReferralEmailHelper');
const User = require('../../database/models/auth/user');
const { USER_ROLE } = require('../../constant');
const { generatePatientPassword } = require('../../helper/stringHelper');
const Branch = require('../../database/models/admin/branch');

const createPatientLogin = async (patientDetails, createdBy, branchId) => {
    try {
        console.log('patientDetails...', patientDetails)
        const { fName, lName, email, dob, gender } = patientDetails;
        const password = await generatePatientPassword(fName, dob);
        // Create a new user
        const newUser = new User({ firstName:fName, lastName:lName, name: `${fName} ${lName}`, email, password, role: USER_ROLE.patient, dob, gender });
        await newUser.save();
        const branchDetails = await Branch.findById(branchId);
        const adminDetails = await User.findById(createdBy);
        patientData = {
            patientName: `${fName} ${lName}`,
            branchName: branchDetails.name,
            patientEmail: email,
            password: password,
            SignatureOfAdminStrator: `${process.env.SERVER_API}/api/profile/${adminDetails._id}/signatureImage/${adminDetails.signatureImage}`,
            patientLoginPortalUrl: `${process.env.FRONTEND_URL}/login`
        }
        sendPatientRegistrationIntemation(patientData);
        // res.status(201).json({ message: 'User created successfully.' });
      } catch (error) {
        console.error(error);
        // res.status(500).json({ message: 'Server error.' });
      }
}

exports.postPatientInformation = async (req, res) => {
    const { branchId,
        formData: { fName, lName, gender, dob, email, address, region, country, postalCode, methodOfCommunication, contactNumber, acknowledgement
        }
    } = req.body;

    // Generate a unique GUID
    const orthancPatientId = uuidv4();
    console.log(orthancPatientId, "uniqueid")
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    const newPatientProfile = new PatientInformation({
        fName, lName, gender, dob, email, address, region, country, postalCode, methodOfCommunication, contactNumber, acknowledgement,
        createdBy: req.user.id,
        branchId: branchId, orthancPatientId: orthancPatientId
    });
    try {
        await newPatientProfile.validate();
        const savedProfile = await newPatientProfile.save();
        await createPatientLogin({ fName, lName, gender, dob, email}, req.user.id, branchId);
        res.status(201).json({
            success: true,
            message: 'Patient is registered',
            pId: savedProfile._id,
            patientdata: savedProfile,

        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'There is some problem, please try again later',
        });
    }
};

exports.editPatientInformation = async (req, res) => {
    const { _id, formData: { fName, lName, gender, dob, email, address, region, country, postalCode, methodOfCommunication, contactNumber, acknowledgement } } = req.body;
    try {
        const updatedProfileData = await PatientInformation.findByIdAndUpdate(_id, { fName, lName, gender, dob, email, address, region, country, postalCode, methodOfCommunication, contactNumber, acknowledgement, updatedBy: req.user.id }, { new: true });
        return res.status(200).json({ success: true, message: `Patient successfully updated`, patientdata: updatedProfileData });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};