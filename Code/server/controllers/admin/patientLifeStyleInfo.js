const PatientLifeStyleInfo = require("../../database/models/admin/patientLifeStyleInfo");

exports.postPatientLifeStyleInfo = async (req, res) => {
    const { branchId, pId,
        formData: { occupation, addictions, dietHabits
        }
    } = req.body;
    const patientLifeStyle = new PatientLifeStyleInfo({
        occupation, addictions, dietHabits, pId,
        createdBy: req.user.id,
        branchId: branchId
    });
    try {
        await patientLifeStyle.validate();
        const data = await patientLifeStyle.save();
        res.status(201).json({
            success: true,
            message: 'Patient life style data is saved',
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

exports.editPatientLifeStyleInfo = async (req, res) => {
    const { _id, formData: { occupation, addictions, dietHabits } } = req.body;
    try {
        const patientLifeStyle = await PatientLifeStyleInfo.findOneAndUpdate({ pId: _id }, { occupation, addictions, dietHabits, updatedBy: req.user.id }, { new: true });
        return res.status(200).json({ success: true, message: `Patient life style data successfully updated`, patientLifeStyleData: patientLifeStyle });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};