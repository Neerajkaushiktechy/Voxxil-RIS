const PatientInsurance = require("../../database/models/admin/patientInsurance");

exports.postPatientInsurance = async (req, res) => {
    const { branchId, pId,
        formData: { insuranceNameProvider, insuranceId, policyHolderName, groupNumber
        }
    } = req.body;
    const patientInsurance = new PatientInsurance({
        insuranceNameProvider, insuranceId, policyHolderName, groupNumber, pId,
        createdBy: req.user.id,
        branchId: branchId
    });
    try {
        await patientInsurance.validate();
        const data = await patientInsurance.save();
        res.status(201).json({
            success: true,
            message: 'Patient insurance data is saved',
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

exports.editPatientInsurance = async (req, res) => {
    const { _id, formData: { insuranceNameProvider, insuranceId, policyHolderName, groupNumber } } = req.body;
    try {
        const patientInsurance = await PatientInsurance.findOneAndUpdate({ pId: _id }, { insuranceNameProvider, insuranceId, policyHolderName, groupNumber, updatedBy: req.user.id }, { new: true });
        return res.status(200).json({ success: true, message: `Patient insurance data successfully updated`, patientInsurance: patientInsurance });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};