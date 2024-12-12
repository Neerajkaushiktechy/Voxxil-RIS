const PatientEmergencyContactInfo = require("../../database/models/admin/patientEmergencyContactInfo");

exports.postPatientEmergencyContact = async (req, res) => {
    const { branchId, pId,
        formData: {
            formData: { emergencyContactName, relationShipToPatient, emergencyContactNumber,
            } }
    } = req.body;
    const patientEmergencyContact = new PatientEmergencyContactInfo({
        emergencyContactName, relationShipToPatient, emergencyContactNumber, pId,
        createdBy: req.user.id,
        branchId: branchId
    });
    try {
        await patientEmergencyContact.validate();
        const data = await patientEmergencyContact.save();
        res.status(201).json({
            success: true,
            message: 'Patient Emergency contact is saved',
            patientdata: data
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'There is some problem, please try again later',
        });
    }
};

exports.editPatientEmergencyContact = async (req, res) => {
    const { _id, formData: { emergencyContactName, relationShipToPatient, emergencyContactNumber } } = req.body;
    try {
        const updatedEmergencyContact = await PatientEmergencyContactInfo.findOneAndUpdate({ pId: _id }, { emergencyContactName, relationShipToPatient, emergencyContactNumber,updatedBy: req.user.id }, { new: true,upsert: true });
        return res.status(200).json({ success: true, message: `Patient Emergency contact successfully updated`, emergencyConact: updatedEmergencyContact });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};