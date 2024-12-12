const PatientAcknowledgement = require("../../database/models/admin/patientAcknowledgement");

exports.postpatientAcknowledgement = async (req, res) => {
    const { branchId, pId, formData
    } = req.body;
    const patientAcknowledgement = new PatientAcknowledgement({
        acknowledgement: formData, pId,
        createdBy: req.user.id,
        branchId: branchId
    });
    try {
        await patientAcknowledgement.validate();
        const data = await patientAcknowledgement.save();
        res.status(201).json({
            success: true,
            message: 'Patient Acknowledgement data is saved',
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

exports.editpatientAcknowledgement = async (req, res) => {
    const { _id, formData: { acknowledgement } } = req.body;
    try {
        const patientAcknowledgement = await PatientAcknowledgement.findOneAndUpdate({ pId: _id }, { acknowledgement, updatedBy: req.user.id }, { new: true });
        return res.status(200).json({ success: true, message: `Patient Acknowledgement data successfully updated`, patientAcknowledgementData: patientAcknowledgement });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};