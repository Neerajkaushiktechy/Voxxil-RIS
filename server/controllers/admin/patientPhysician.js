const PatientPhysician = require("../../database/models/admin/patientPhysician");

exports.postPatientPhysician = async (req, res) => {
    const { branchId, pId,
        formData: { physicianName, phone, email, address, methodOfCommunication
        }
    } = req.body;
    console.log(req.body, "body")
    const patientPhysician = new PatientPhysician({
        physicianName, phone, email, address, methodOfCommunication, pId,
        createdBy: req.user.id,
        branchId: branchId
    });
    try {
        await patientPhysician.validate();
        const data = await patientPhysician.save();
        res.status(201).json({
            success: true,
            message: 'Patient physician data is saved',
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

exports.editPatientPhysician = async (req, res) => {
    const { _id, formData: { physicianName, phone, email, address, methodOfCommunication } } = req.body;
    console.log(req.body, "body")
    try {
        const patientPhysician = await PatientPhysician.findOneAndUpdate({ pId: _id }, { physicianName, phone, email, address, methodOfCommunication, updatedBy: req.user.id }, { new: true });
        return res.status(200).json({ success: true, message: `Patient physician data successfully updated`, patientPhysicianData: patientPhysician });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};