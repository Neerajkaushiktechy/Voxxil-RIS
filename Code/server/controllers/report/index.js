const axios = require('axios');
const PatientInformation = require('../../database/models/admin/patientInformation');
const User = require('../../database/models/auth/user');
const PatientReport = require('../../database/models/admin/patientReport');
const Radiology = require('../../database/models/admin/radiology');
const Order = require('../../database/models/admin/order');
const pdfGenerator = require('../../helper/reportPdfGenerator');
const { calculateAge } = require('../../helper/dateTimeHelper');

exports.getPatients = async (req, res) => {
    try {
        const patients = await PatientInformation.find({ createdBy: req.user.id, branchId: req.currentBranch }).select('fName orthancPatientId orthancParentPatientId lName gender dob email');
        return res.status(200).json({ success: true, data: patients });
    } catch (error) {
        console.error('Error fetching instances:', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// exports.getPatientAppointments = async (req, res) => {
//     try {
//         const { pId } = req.params;
//         const { patientId } = req.query;
//         let orthancParentPatientId = null;
//         if (!pId) { return res.status(500).json({ success: false, error: "there is some issue please try again later" }); }
//         if (patientId) {
//             const response = await axios.get(`${process.env.ORTHANC_SERVER_URL}/patients/?expand`);
//             if (response.data) {
//                 let parentPatientID = response.data.find((elem) => {
//                     return elem.MainDicomTags.PatientID === patientId;
//                 });
//                 if (parentPatientID) {
//                     orthancParentPatientId = parentPatientID.ID
//                     await PatientInformation.findByIdAndUpdate(pId, {
//                         orthancParentPatientId: parentPatientID.ID
//                     });
//                 }
//             }
//         }

//         const radiologyData = await Radiology.find({ patientId: pId, isDeleted: false }).select("orderId examList reportId").populate({
//             path: "examList",
//             select: 'list',
//             populate: [
//                 {
//                     path: "list",
//                     select: "name",
//                 }
//             ],
//         }).populate({
//             path: "orderId",
//             select: "status orderId"
//         }).populate({
//             path: "appoinmentId",
//             select: "appoinmentCategory appoinmentDate appoinmentTime appoinmentDuration startTime endTime lmp"
//         }).sort({ createdAt: -1 });
//         return res.status(200).json({ success: true, data: radiologyData, orthancParentPatientId });
//     } catch (error) {
//         console.error('Error fetching instances:', error.message);
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };


exports.getParentPatient = async (req, res) => {
    try {
        const { radiologyId } = req.params;
        const { patientID, orderId } = req.query;
        let orthancParentPatientId = null;
        let studiesData = null;
        if (!radiologyId && !patientID) { return res.status(500).json({ success: false, message: "There is some issue please try again later" }); }

        const response = await axios.get(`${process.env.ORTHANC_SERVER_URL}/patients/?expand`);
        if (!response.data) { return res.status(500).json({ success: false, message: "There is some issue please try again later" }); }

        let parentPatientID = response.data.find((elem) => {
            return elem.MainDicomTags.PatientID === patientID;
        });

        if (parentPatientID) {
            orthancParentPatientId = parentPatientID.ID
            // await PatientInformation.findByIdAndUpdate(pId, { orthancParentPatientId });
            await Radiology.findByIdAndUpdate(radiologyId, { orthancParentPatientId: orthancParentPatientId });
        }

        const studiesRes = await axios.get(`${process.env.ORTHANC_SERVER_URL}/patients/${orthancParentPatientId}/studies`);
        // const studiesRes = response.data.filter(element => element.MainDicomTags.AccessionNumber === orderId);
        studiesData = studiesRes.data[0];
        studiesData = {
            orthancStudyID: studiesData.ID,
            orthancStudyDescription: studiesData.MainDicomTags.StudyDescription,
            orthancStudyInstanceUID: studiesData.MainDicomTags.StudyInstanceUID
        };
        if (studiesData.orthancStudyID) {
            await Order.findOneAndUpdate({ orderId: orderId }, {
                orthancStudyID: studiesData.orthancStudyID,
                orthancStudyDescription: studiesData.orthancStudyDescription,
                orthancStudyInstanceUID: studiesData.orthancStudyInstanceUID
            }).select('orderId');
        }

        return res.status(200).json({ success: true, data: studiesData });
    } catch (error) {
        console.error('Error fetching instances:', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getInstance = async (req, res) => {
    try {
        const { orthancStudyID } = req.params;
        if (!orthancStudyID) { return res.status(500).json({ success: false, error: "There is some issue please try again later" }); }
        let response = await axios.get(`${process.env.ORTHANC_SERVER_URL}/studies/${orthancStudyID}/series`);
        if (!response.data) { return res.status(500).json({ success: false, error: "there is some issue please try again later" }); }
        const instances = response.data.map(item => {
            return item.Instances
        });
        return res.status(200).json({ success: true, data: instances.flat() });
    } catch (error) {
        console.error('Error fetching instances:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.postReport = async (req, res) => {
    try {
        let {
            radiologyId,
            completedExam,
            clinicalInfo,
            diagnosticObjectives,
            findings,
            radiographicImpression,
            appointerId,
            appointerSignaturePin,
            reportStatus = "pending",
            // seniorRadiologist
            imageComments
        } = req.body
        if (!radiologyId) { return res.status(500).json({ success: false, message: "There is some problem try again later" }); }

        if (appointerId && appointerSignaturePin) {
            const data = await User.findById(appointerId);
            let isAppointerSignatureVerified = appointerSignaturePin === data?.signaturePin;
            if (!isAppointerSignatureVerified) {
                return res.status(500).json({ success: false, message: "Signature Pin is Incorrect" });
            }
        }
        let patientReport = await PatientReport.create({
            appointerId: appointerId,
            completedExam,
            clinicalInfo,
            diagnosticObjectives,
            findings,
            radiographicImpression,
            reportStatus,
            // seniorRadiologistId: seniorRadiologist,
            imageComments,
            branchId: req.currentBranch, createdBy: req.user.id, isDeleted: false
        });
        await Radiology.findByIdAndUpdate(radiologyId, { reportId: patientReport._id })
        return res.status(200).json({ success: true, message: "Report is Created", data: { _id: patientReport._id, reportStatus } });
    } catch (error) {
        console.error('Error fetching instances:', error);
        return res.status(500).json({ success: false, message: "There is some problem try again later" });
    }
};

exports.putReport = async (req, res) => {
    try {
        let {
            appointerId,
            appointerSignaturePin,
            reportId,
            completedExam,
            clinicalInfo,
            diagnosticObjectives,
            findings,
            radiographicImpression,
            reportStatus = "pending",
            // seniorRadiologist
            imageComments
        } = req.body
        if (appointerId && appointerSignaturePin) {
            const data = await User.findById(appointerId);
            let isAppointerSignatureVerified = appointerSignaturePin === data?.signaturePin;
            if (!isAppointerSignatureVerified) {
                return res.status(500).json({ success: false, message: "Signature Pin is Incorrect" });
            }
        }

        // seniorRadiologist = seniorRadiologist && seniorRadiologist.length > 0 ? seniorRadiologist[1] : null;
        await PatientReport.findByIdAndUpdate(reportId, {
            appointerId,
            completedExam,
            clinicalInfo,
            diagnosticObjectives,
            findings,
            radiographicImpression,
            reportStatus,
            // seniorRadiologistId: seniorRadiologist,
            updatedBy: req.user.id,
            imageComments
        });
        return res.status(200).json({ success: true, message: "Report is Updated", data: { _id: reportId, reportStatus } });
    } catch (error) {
        return res.status(500).json({ success: false, message: "There is some problem try again later" });
    }
};

exports.getReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        let patientReport = await PatientReport.findById(reportId).populate({ path: "appointerId", select: "firstName lastName signatureImage" });
        return res.status(200).json({ success: true, data: patientReport });
    } catch (error) {
        console.error('Error fetching instances:', error.message);
        return res.status(500).json({ success: false, message: "There is some error please try again later" });
    }
};


exports.getStudies = async (req, res) => {
    try {
        const { orthancParentID } = req.params;
        const { orderId } = req.query;

        const response = await axios.get(`${process.env.ORTHANC_SERVER_URL}/patients/${orthancParentID}/studies`);
        // const studiesRes = response.data.filter(element => element.MainDicomTags.AccessionNumber === orderId);
        let studiesData = response.data[0];
        studiesData = {
            orthancStudyID: studiesData.ID,
            orthancStudyDescription: studiesData.MainDicomTags.StudyDescription,
            orthancStudyInstanceUID: studiesData.MainDicomTags.StudyInstanceUID
        };
        if (studiesData.orthancStudyID) {
            await Order.findOneAndUpdate({ orderId: orderId }, {
                orthancStudyID: studiesData.orthancStudyID,
                orthancStudyDescription: studiesData.orthancStudyDescription,
                orthancStudyInstanceUID: studiesData.orthancStudyInstanceUID
            }).select('orderId');
        }

        return res.status(200).json({ success: true, data: studiesData });

    } catch (error) {
        console.error('Error fetching instances:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getImages = async (req, res) => {
    try {
        const { orthancStudyID } = req.params;
        if (!orthancStudyID) { return res.status(500).json({ success: false, error: "There is some issue please try again later" }); }
        let response = await axios.get(`${process.env.ORTHANC_SERVER_URL}/studies/${orthancStudyID}/series`);
        if (!response.data) { return res.status(500).json({ success: false, error: "there is some issue please try again later" }); }
        const instances = response.data.map(item => {
            return item.Instances
        });
        return res.status(200).json({ success: true, data: instances.flat() });
    } catch (error) {
        console.error('Error fetching instances:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSeniorRadiologist = async (req, res) => {
    try {
        const seniorRadiologist = await User.find({ role: "seniorRadiologist" }).select('_id name email');
        return res.status(200).json({ success: true, data: seniorRadiologist });
    } catch (error) {
        console.error('Error fetching senior radiologist:', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.generateReportPDF = async (req, res) => {
    const { patientId, reportId,studyImages } = req.body;
    try {
        const patient = await PatientInformation.findById(patientId).select('fName lName gender dob email orthancPatientId');
        const patientReport = await PatientReport.findById(reportId).populate({ path: "appointerId", select: "firstName lastName signatureImage" });
        const radiologyDetails = await Radiology.findOne({ patientId: patientId, reportId: reportId ,isDeleted: false})
        .select('appoinmentId referringSignatureId')
        .populate({
            path: "appoinmentId",
            select: "startTime appoinmentCategory lmp examReason",
        })
        .populate({
            path: "referringSignatureId",
            select: "firstName lastName",
        });

        if (!patient || !patientReport || !radiologyDetails) {
            return res.status(404).json({ success: false, message: 'Patient or report not found' });
        }
        const radiologistName = patientReport?.appointerId?._id ? `${patientReport.appointerId.firstName} ${patientReport.appointerId.lastName}` : null;
        const radiologistSignature = patientReport?.appointerId?._id ? `${process.env.SERVER_API}/api/profile/${patientReport.appointerId._id}/signatureImage/${patientReport.appointerId.signatureImage}` : null;  

        const data = {
                patientName: `${patient.fName} ${patient.lName}`,
                radiologistFName: patientReport?.appointerId?.firstName,
                dob: patient.dob,
                gender: patient.gender,
                age: calculateAge(patient.dob),
                referringDoctor: `${radiologyDetails?.referringSignatureId?.firstName} ${radiologyDetails?.referringSignatureId?.lastName}`,
                appointmentDate: radiologyDetails?.appoinmentId?.startTime?.toISOString().split('T')[0],
                examReason: radiologyDetails?.appoinmentId?.examReason,
                clinicalInfo: patientReport.clinicalInfo,
                diagnosticObjectives: patientReport.diagnosticObjectives,
                findings: patientReport.findings,
                radiographicImpression: patientReport.radiographicImpression,
                radiologistName: radiologistName,
                radiologistSignature: radiologistSignature,
                studyImages: studyImages,
                imageComments: patientReport.imageComments
            };

            await pdfGenerator(data, res);
       

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ success: false, message: 'Error generating PDF' });
    }
};