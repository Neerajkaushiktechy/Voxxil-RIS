const PatientMedicalHistory = require("../../database/models/admin/patientMedicalHistory");

exports.postPatientMedicalHistory = async (req, res) => {
    const { branchId, pId,
        formData: { allergies, diagnosis, illness, department, medications, comments, familyHereditaryHealth, familyMemberHealthHistory, imagingStudies
        }
    } = req.body;
    console.log(req.body, "body")
    const patientMedicalHistory = new PatientMedicalHistory({
        allergies, diagnosis, illness, department, medications, comments, familyHereditaryHealth, familyMemberHealthHistory, imagingStudies, pId,
        createdBy: req.user.id,
        branchId: branchId
    });
    try {
        await patientMedicalHistory.validate();
        const data = await patientMedicalHistory.save();
        res.status(201).json({
            success: true,
            message: 'Patient medical history data is saved',
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

exports.uploadPatientFiles = async (req, res) => {
    try {
        let documents = [];
        if (req.files.length > 0) {
            let files = req.files;
            for (let i = 0; i < files.length; i++) {
                documents.push({
                    fileName: files[i].filename,
                });
            }
        }
        const updatedPatient = await PatientMedicalHistory.findOneAndUpdate(
            { pId: req.params.id },
            { $set: { 'imagingStudies': documents } },
            { new: true }
        );

        if (!updatedPatient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Files uploaded successfully',
            data: updatedPatient,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'There is some error, please try again later',
        });
    }
};

exports.uploadPatientMedicalFiles = async (req, res) => {
    try {
        let documents = [];
        if (req.files.length > 0) {
            let files = req.files;
            for (let i = 0; i < files.length; i++) {
                documents.push({
                    fileName: files[i].filename,
                });
            }
        }
        const updatedPatient = await PatientMedicalHistory.create({
            pId: req.params.id,
            createdBy: req.user.id,
            branchId: req.currentBranch,
            imagingStudies: documents,
            isDeleted : false
        });

        if (!updatedPatient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Files uploaded successfully',
            data: updatedPatient,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'There is some error, please try again later',
        });
    }
};

exports.editPatientMedicalHistory = async (req, res) => {
    const { _id, allergies, diagnosis, illness, department, medications, comments, familyHereditaryHealth, familyMemberHealthHistory, imagingStudies } = req.body;
    try {
        await PatientMedicalHistory.findOneAndUpdate({ pId: _id }, { allergies, diagnosis, illness, department, medications, comments, familyHereditaryHealth, familyMemberHealthHistory, imagingStudies, updatedBy: req.user.id });
        let document = [];
        if (req.files.length > 0) {
            let file = req.files;
            for (var i = 0; i < file.length; i++) {
                document.push({
                    fileName: file[i].filename,
                });
            }
        }
        document = [...document, ...JSON.parse(req.body.document.replace(/'/g, '"'))]
        await PatientMedicalHistory.findOneAndUpdate(
            { pId: _id },
            {
                $set: { 'imagingStudies': document },
            },
            { new: true }
        );

        return res.status(200).json({ success: true, message: `Patient medical history data successfully updated` });
    } catch (err) {
        console.log(err, "err")
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};