const { v4: uuidv4 } = require('uuid');
const Radiology = require("../../database/models/admin/radiology");
const Appoinment = require("../../database/models/admin/appoinment");
const Order = require("../../database/models/admin/order");
const User = require("../../database/models/auth/user");
const moment = require('moment');
const PatientInformation = require("../../database/models/admin/patientInformation");
const mongoose = require("mongoose");
const dateTimeHelper = require('../../helper/dateTimeHelper');
const { json } = require("express");
const { USER_ROLE } = require('../../constant');
const { sendPatientReferIntemationEmail } = require('../../helper/patientReferralEmailHelper');
const { getDayName, getMonthName, getYear, calculateAge } = require('../../helper/dateTimeHelper');
const { convertToTitleCase, generateExamList } = require('../../helper/stringHelper');
const mysqlconnection = require('../../helper/mysqlconn')

const generateFullDate = (date) => {
    const day = getDayName(date);
    const month = getMonthName(date);
    const year = getYear(date);
    return `${day}-${month}-${year}`
}

const updateOrCreateModalityRecords = async (radiologyId) => {
    const data = await Radiology.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(radiologyId) } },
        {
            "$lookup": {
                from: "patientInformation",
                localField: "patientId",
                foreignField: "_id",
                as: "patientInformation"
            }
        },
        {
            "$lookup": {
                from: "appoinments",
                localField: "appoinmentId",
                foreignField: "_id",
                as: "appoinments"
            }
        },
        {
            "$lookup": {
                from: "branches",
                localField: "branchId",
                foreignField: "_id",
                as: "branches"
            }
        },
        {
            "$lookup": {
                from: "users",
                localField: "operatorId",
                foreignField: "_id",
                as: "operator"
            }
        },
        { $unwind: { path: "$examList", preserveNullAndEmptyArrays: true } },
        {
            $unwind: {
                path: "$examList.examListModality",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$patientInformation",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$operator",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$appoinments",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$branches",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            "$project": {
                _id: 1,
                orderId: 1,
                patientId: 1,
                orthancPatientId:1,
                "examList.examListModality": {
                    modalityName: 1,
                    examName: 1,
                    examId: 1
                },
                patientInformation: {
                    fName: 1,
                    lName: 1,
                    gender: 1,
                    dob: 1,
                    email: 1,
                },
                appoinments: {
                    startTime: 1,
                    endTime: 1,
                    appoinmentDuration: 1,
                    referringConsultant: 1
                },
                operator: {
                    name: 1,
                    email: 1,
                },
                "branches.branchCode": 1
            }
        }
    ]);
    /** Checking the new Modality on update order */
    let orderId = '';
    let postModality = [];
    for (let i = 0; i < data.length; i++) {
        orderId = data[i].orderId.toString();
        postModality.push({ modalityName: data[i].examList?.examListModality?.modalityName, examId: data[i].examList?.examListModality?.examId.toString() });
    }
    const [results, fields] = await mysqlconnection.promise().query(`SELECT PATIENTID, MODALITY AS "modalityName", EXAM_ID AS "examId" FROM  WORKLIST WHERE ORDER_OBJECT_ID=?`, [orderId]);
    const odbcDBResponse = results;
    const delteRecords = results.filter(data => postModality.findIndex(postData => data.modalityName == postData.modalityName && data.examId == postData.examId) == -1);
    delteRecordsId = delteRecords.map(data => data.PATIENTID)
    /**Code for deleting the not existing records after updation */
    if (delteRecordsId.length > 0) {
        await mysqlconnection.promise().query(`DELETE FROM WORKLIST WHERE PATIENTID IN (${delteRecordsId.map(() => '?').join(',')})`, [...delteRecordsId])
    }

    /** Insert and Update the Records Inside the database */
    for (let i = 0; i < data.length; i++) {
        let referringConsultant = ''
        if (data[i].appoinments.referringConsultant.length > 0) {
            referringConsultant = data[i].appoinments.referringConsultant.split(" ").reverse().join("^");
        }
        let requestedPhysician = '';
        if (data[i].operator?.name.length > 0) {
            requestedPhysician = data[i].operator?.name.split(" ").reverse().join("^");
        }
        const appointmentDate = data[i].appoinments.startTime
        const ORDER_OBJECT_ID = data[i].orderId;
        const BRANCH_CODE = data[i].branches.branchCode;
        const PATIENTID = data[i].orthancPatientId;
        const PATIENTNAME = `${data[i].patientInformation?.lName}^${data[i].patientInformation?.fName}`;
        const PATIENTBIRTHDATE = data[i].patientInformation?.dob.split("-").join("");
        const PATIENTSEX = data[i].patientInformation?.gender[0].toUpperCase();
        const AETITLE = data[i].examList.examListModality.modalityName;
        const MODALITY = data[i].examList.examListModality.modalityName;
        const PROCSTEP_STARTDATE = `${dateTimeHelper.getYear(appointmentDate)}${dateTimeHelper.getMonthName(appointmentDate)}${dateTimeHelper.getDayName(appointmentDate)}`;
        const PROCSTEP_STARTTIME = `${dateTimeHelper.getHours(appointmentDate)}${dateTimeHelper.getMinutes(appointmentDate)}`;
        const PERFPHYSNAME = requestedPhysician;
        const EXAM_ID = data[i].examList.examListModality.examId.toString();
        const PROCSTEP_DESCR = data[i].examList.examListModality.examName;

        const PROCSTEP_ID = Math.floor(10000000 + Math.random() * 9000000);
        const REQPROCID = Math.floor(10000000 + Math.random() * 9000000);
        const REQPROCDESCR = data[i].examList.examListModality.examName;
        const STUDYINSTUID = `${Math.floor(Math.random() * 10)}.3.0.2.1.23.${Math.floor(Math.random() * 100)}`;
        const ACCNUMBER = Math.floor(10000000 + Math.random() * 9000000);
        const REQPHYSICIAN = requestedPhysician;

        const REFPHYSNAME = referringConsultant;
        const createdAt = new Date();
        const allResponse = odbcDBResponse.findIndex(odbcData => odbcData.modalityName == MODALITY && odbcData.examId == EXAM_ID);
        console.log('allResponse', allResponse)
        if (allResponse !== -1) {
            await mysqlconnection.promise().query(`UPDATE  WORKLIST SET 
            BRANCH_CODE=?,
            PATIENTNAME=?,
            PATIENTBIRTHDATE=?,
            PATIENTSEX=?,
            AETITLE=?,
            PROCSTEP_STARTDATE=?,
            PROCSTEP_STARTTIME=?,
            REQPHYSICIAN=?,
            PERFPHYSNAME=?
            WHERE ORDER_OBJECT_ID='${ORDER_OBJECT_ID}' and MODALITY='${MODALITY}' and EXAM_ID='${EXAM_ID}'
            `, [
                BRANCH_CODE,
                PATIENTNAME,
                PATIENTBIRTHDATE,
                PATIENTSEX,
                AETITLE,
                PROCSTEP_STARTDATE,
                PROCSTEP_STARTTIME,
                REQPHYSICIAN,
                PERFPHYSNAME,
            ]).then(resp => {
                console.log('Insert response', resp)
            });
        } else {
            await mysqlconnection.promise().query(`INSERT INTO  WORKLIST (ORDER_OBJECT_ID,
                PATIENTID,
                BRANCH_CODE,
                PATIENTNAME,
                PATIENTBIRTHDATE,
                PATIENTSEX,
                AETITLE,
                MODALITY,
                EXAM_ID,
                PROCSTEP_STARTDATE,
                PROCSTEP_STARTTIME,
                PERFPHYSNAME,
                PROCSTEP_DESCR,
                PROCSTEP_ID,
                REQPROCID,
                REQPROCDESCR,
                STUDYINSTUID,
                ACCNUMBER,
                REQPHYSICIAN,
                REFPHYSNAME,
                createdAt
                ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                ORDER_OBJECT_ID.toString(),
                PATIENTID,
                BRANCH_CODE,
                PATIENTNAME,
                PATIENTBIRTHDATE,
                PATIENTSEX,
                AETITLE,
                MODALITY,
                EXAM_ID,
                PROCSTEP_STARTDATE,
                PROCSTEP_STARTTIME,
                PERFPHYSNAME,
                PROCSTEP_DESCR,
                PROCSTEP_ID,
                REQPROCID,
                REQPROCDESCR,
                STUDYINSTUID,
                ACCNUMBER,
                REQPHYSICIAN,
                REFPHYSNAME,
                createdAt
            ]).then(resp => {
                console.log('Insert response', resp)
            });
        }
    }

}

exports.searchPatient = async (req, res) => {
    const { name, page, limit } = req.query;

    try {
        const query = {
            $and: [
                {
                    $or: [
                        { branchId: req.currentBranch },
                        {
                            belongsTo: {
                                $elemMatch: { refferedToBranch: req.currentBranch }
                            }
                        }
                    ]
                }

            ],
            isDeleted: false,
            // createdBy: req.user.id,
            $or: [
                { fName: { $regex: new RegExp(name, 'i') } },
            ],
        };
        const data = await PatientInformation.find(query).select("fName lName gender email dob medicalHistory")
            .sort({ createdAt: -1 })
            .skip((page - 1) * 10)
            .limit(limit);
        const dataCount = await PatientInformation.find(query).count();
        res.status(200).json({ success: true, message: "Data found", data, dataCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};


exports.post = async (req, res) => {
    const {
        appoinmentCategory,
        startTime,
        appoinmentDuration,
        referId,
        examReason,
        isPregnant,
        lmp,
        examList,
        patientId,
        isCorrectPatient,
        correctPatientValue,
        isCorrectSide,
        correctSideValue,
        isCorrectProcedure,
        correctProcedureValue,
        contrastValue,
        allergiesDetails,
        referringId,
        referringSignaturePin,
        referringDate,
        authorisedId,
        authorisedDate,
        operatorId,
        operatorDate,
        appointerId,
        appointerSignaturePin,
        referringConsultant
    } = req.body;
    try {

        const createdBy = req.user.id;
        const branchId = req.currentBranch;

        const endTime = moment.utc(startTime).add(appoinmentDuration, 'minutes');

        const checkAppoinment = await Appoinment.find({
            createdBy,
            branchId,
            $or: [
                { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: startTime } }] },
                { $and: [{ startTime: { $lte: endTime } }, { endTime: { $gte: endTime } }] },
            ],
        });

        if (checkAppoinment.length > 0) { return res.status(400).json({ success: false, message: "Appoinment is already booked" }); }

        // create appoinment
        const appoinment = await Appoinment.create({
            appoinmentCategory,
            startTime,
            endTime,
            appoinmentDuration,
            referId,
            examReason,
            isPregnant,
            lmp: isPregnant ? lmp : 0,
            isDeleted: false,
            patientId,
            createdBy,
            updatedBy: createdBy,
            branchId,
            referringConsultant
        });


        const date = new Date();
        const timestamp = Math.floor(date / 1000); // Unix timestamp in seconds
        const uniqueKey = `${timestamp}-${Math.floor(Math.random() * 1000)}`;

        // create order
        const order = await Order.create({
            orderId: uniqueKey,
            patientId,
            createdBy,
            updatedBy: createdBy,
            branchId,
            isDeleted: false
        });

        let isAppointerSignatureVerified = false;
        if (appointerId && appointerSignaturePin) {
            const data = await User.findById(appointerId);
            isAppointerSignatureVerified = appointerSignaturePin === data?.signaturePin;
        }

        let isReferringSignatureVerified = false;
        let referringSignatureId = referringId || null;

        if (referringSignatureId && referringSignaturePin) {
            const data = await User.findById(referringSignatureId);
            isReferringSignatureVerified = referringSignaturePin === data?.signaturePin;
        }

        const orthancPatientId = uuidv4();
        let radiology = await Radiology.create({
            appoinmentId: appoinment._id,
            orthancPatientId: orthancPatientId,
            orderId: order._id,
            examList,
            patientId,
            isCorrectPatient,
            correctPatientValue: isCorrectPatient ? correctPatientValue : "",
            isCorrectSide,
            correctSideValue: isCorrectSide ? correctSideValue : "",
            isCorrectProcedure,
            correctProcedureValue: isCorrectProcedure ? correctProcedureValue : "",
            contrastValue,
            allergiesDetails,
            // referringSignatureId: isReferringSignatureVerified ? referringSignatureId : null,
            referringSignatureId: referringSignatureId,
            referringSignaturePin: isReferringSignatureVerified ? referringSignaturePin : "",
            isReferringSignatureVerified,
            referringDate,
            authorisedId,
            authorisedDate,
            operatorId,
            operatorDate,
            isDeleted: false,
            appointerId: isAppointerSignatureVerified ? appointerId : null,
            appointerSignaturePin: isAppointerSignatureVerified ? appointerSignaturePin : "",
            isAppointerSignatureVerified,
            branchId,
            createdBy,
            updatedBy: createdBy,
            orderAcceptStatus: true
        });
        await Order.findOneAndUpdate(order._id, {
            radiologyId: radiology._id,
            createdBy: req.user.id,
            updatedBy: req.user.id,
            branchId: req.currentBranch,
        });
        await updateOrCreateModalityRecords(radiology._id);
        return res.status(201).json({ success: true, message: "Radiology successfully Added" });
    } catch (err) {
        console.log("err", err)
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};

exports.get = async (req, res) => {
    try {

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const searchQuery = req.query.searchQuery || "";
        let data = [];
        let dataCountList = []
        let queryData = ''
        if (req.user.role === USER_ROLE.patient) {
            const user = await User.findById(req.user.id);
            const patient = await PatientInformation.findOne({ email: user.email });
            queryData = await Radiology.find({ patientId: patient._id, isDeleted: false })
                .populate({ path: "appoinmentId", select: "startTime appoinmentCategory lmp examReason startTime" })
                .populate({
                    path: "examList",
                    populate: [{
                        path: "group",
                        select: "name",
                    },
                    {
                        path: "list",
                        select: "name",
                    }
                    ],
                })
                .populate({ path: "orderId", select: "status orderId orthancStudyID orthancStudyDescription orthancStudyInstanceUID appoinmentCompleteDescription" })
                .populate({ path: "reportId", select: "reportStatus" })
                .populate({
                    path: "patientId", select: "fName lName dob email gender orthancParentPatientId orthancPatientId _id",
                    match: {
                        $or: [
                            { fName: { $regex: searchQuery, $options: 'i' } },
                            { lName: { $regex: searchQuery, $options: 'i' } },
                        ],
                    },
                }).select("appoinmentId examList patientId status orderId isReffered reportId").populate({
                    path: "referringSignatureId", select: "firstName lastName"
                })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
            dataCountList = await Radiology.find({ patientId: patient._id, isDeleted: false })
                .populate({
                    path: "patientId", select: "fName lName",
                    match: {
                        $or: [
                            { fName: { $regex: searchQuery, $options: 'i' } },
                            { lName: { $regex: searchQuery, $options: 'i' } },
                        ],
                    },
                }).select("appoinmentId examList patientId status orderId,reportId")
        } else {
            queryData = await Radiology.find({ branchId: req.currentBranch, isDeleted: false })
                .populate({ path: "appoinmentId", select: "startTime appoinmentCategory lmp examReason startTime" })
                .populate({
                    path: "examList",
                    populate: [{
                        path: "group",
                        select: "name",
                    },
                    {
                        path: "list",
                        select: "name",
                    }
                    ],
                })
                .populate({ path: "orderId", select: "status orderId orthancStudyID orthancStudyDescription orthancStudyInstanceUID" })
                .populate({ path: "reportId", select: "reportStatus" })
                .populate({
                    path: "patientId", select: "fName lName dob email gender orthancPatientId _id",
                    match: {
                        $or: [
                            { fName: { $regex: searchQuery, $options: 'i' } },
                            { lName: { $regex: searchQuery, $options: 'i' } },
                        ],
                    },
                }).select("orthancPatientId orthancParentPatientId appoinmentId examList patientId status orderId isReffered reportId").populate({
                    path: "referringSignatureId", select: "firstName lastName"
                })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
            dataCountList = await Radiology.find({ branchId: req.currentBranch, isDeleted: false })
                .populate({
                    path: "patientId", select: "fName lName",
                    match: {
                        $or: [
                            { fName: { $regex: searchQuery, $options: 'i' } },
                            { lName: { $regex: searchQuery, $options: 'i' } },
                        ],
                    },
                }).select("appoinmentId examList patientId status orderId,reportId")
        }


        data = queryData.filter((item) => item.patientId);

        const dataCountFilter = dataCountList.filter((item) => item.patientId);
        const dataCount = dataCountFilter.length;

        if (!data) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }
        return res.status(200).json({ success: true, data, dataCount });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getById = async (req, res) => {
    try {
        let data = {}
        if (req.user.role === USER_ROLE.patient) {
            const user = await User.findById(req.user.id);
            const patient = await PatientInformation.findOne({ email: user.email });
            data = await Radiology.findOne({ _id: req.params.id, patientId: patient._id, isDeleted: false })
                .populate({
                    path: "appoinmentId"
                })
                .populate({
                    path: "examList",
                    populate: [{
                        path: "group",
                        select: "name",
                    },
                    {
                        path: "list",
                        select: "no name",
                    }
                    ],
                })
                .populate({ path: "patientId", select: "fName lName email dob gender medicalHistory" })
                .populate({ path: "authorisedId", select: "firstName lastName email dob gender" })
                .populate({ path: "operatorId", select: "firstName lastName email dob gender" })
                .populate({ path: "appointerId", select: "firstName lastName email dob gender signatureImage" })
                .populate({ path: "referringSignatureId", select: "firstName lastName signatureImage" });
        } else {
            data = await Radiology.findOne({ _id: req.params.id, branchId: req.currentBranch, isDeleted: false })
                .populate({
                    path: "appoinmentId"
                })
                .populate({
                    path: "examList",
                    populate: [{
                        path: "group",
                        select: "name",
                    },
                    {
                        path: "list",
                        select: "no name",
                    }
                    ],
                })
                .populate({ path: "patientId", select: "fName lName email dob gender medicalHistory" })
                .populate({ path: "authorisedId", select: "firstName lastName email dob gender" })
                .populate({ path: "operatorId", select: "firstName lastName email dob gender" })
                .populate({ path: "appointerId", select: "firstName lastName email dob gender signatureImage" })
                .populate({ path: "referringSignatureId", select: "firstName lastName signatureImage" });
        }

        if (!data) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getRadiologyByAppointmentId = async (req, res) => {

    try {
        const data = await Radiology.findOne({ appoinmentId: req.params.id, branchId: req.currentBranch, isDeleted: false })
            .populate({
                path: "appoinmentId"
            })
            .populate({
                path: "examList",
                populate: [{
                    path: "group",
                    select: "name",
                },
                {
                    path: "list",
                    select: "no name",
                }]
            })
            .populate({ path: "patientId", select: "fName lName email dob gender medicalHistory" })
            .populate({ path: "authorisedId", select: "firstName lastName email dob gender" })
            .populate({ path: "operatorId", select: "firstName lastName email dob gender" })
            .populate({ path: "appointerId", select: "firstName lastName email dob gender signatureImage" })
            .populate({ path: "referringSignatureId", select: "signatureImage" });

        if (!data) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.put = async (req, res) => {
    const {
        _id,
        appoinmentId,
        appoinmentCategory,
        startTime,
        appoinmentDuration,
        referId,
        examReason,
        isPregnant,
        lmp,
        examList,
        patientId,
        isCorrectPatient,
        correctPatientValue,
        isCorrectSide,
        correctSideValue,
        isCorrectProcedure,
        correctProcedureValue,
        contrastValue,
        allergiesDetails,
        referringId,
        referringSignaturePin,
        referringDate,
        authorisedId,
        authorisedDate,
        operatorId,
        operatorDate,
        appointerId,
        appointerSignaturePin,
        orderId,
        createdByBranch,
        refferedToBranch,
        referringConsultant
    } = req.body;


    try {
        const createdBy = req.user.id;
        const branchId = req.currentBranch;
        const endTime = moment.utc(startTime).add(appoinmentDuration, 'minutes');
        const checkAppoinment = await Appoinment.find({
            createdBy,
            branchId,
            $or: [
                { $and: [{ _id: { $ne: appoinmentId } }, { startTime: { $lte: startTime } }, { endTime: { $gte: startTime } }] },
                { $and: [{ _id: { $ne: appoinmentId } }, { startTime: { $lte: endTime } }, { endTime: { $gte: endTime } }] },
            ],
        });

        if (checkAppoinment.length > 0) { return res.status(400).json({ success: false, message: "Appoinment is already booked" }); }

        // create appoinment
        await Appoinment.findByIdAndUpdate(appoinmentId, {
            appoinmentCategory,
            startTime,
            appoinmentDuration,
            endTime,
            referId,
            examReason,
            isPregnant,
            lmp: isPregnant ? lmp : 0,
            patientId,
            updatedBy: createdBy,
            referringConsultant
        });

        let isAppointerSignatureVerified = false;
        if (appointerId && appointerSignaturePin) {
            const data = await User.findById(appointerId);
            isAppointerSignatureVerified = appointerSignaturePin === data?.signaturePin
        }


        let isReferringSignatureVerified = false;
        let referringSignatureId = referringId || null;

        if (referringSignatureId && referringSignaturePin) {
            const data = await User.findById(referringSignatureId);
            isReferringSignatureVerified = referringSignaturePin === data?.signaturePin
        }
        let orderIdentifier = orderId;
        let flagmailValue = false
        if (orderId === null) {
            const date = new Date();
            const timestamp = Math.floor(date / 1000); // Unix timestamp in seconds
            const uniqueKey = `${timestamp}-${Math.floor(Math.random() * 1000)}`;
            const order = await Order.create({
                orderId: uniqueKey,
                patientId,
                createdBy,
                updatedBy: createdBy,
                branchId,
                isDeleted: false,
                createdByBranch,
                refferedToBranch,
                radiologyId: _id
            });
            orderIdentifier = order._id
            flagmailValue = true
        } else {
            await Order.findByIdAndUpdate(orderIdentifier, { radiologyId: _id })
        }

        await PatientInformation.updateOne(
            {
                _id: patientId,
                'belongsTo.radiologyId': { $ne: _id }
            },
            {
                $addToSet: {
                    belongsTo: {
                        createdByBranch,
                        refferedToBranch,
                        radiologyId: _id,
                        appoinmentId: appoinmentId,
                        orderId: orderIdentifier
                    }
                }
            }
        )


        await Radiology.findByIdAndUpdate(_id, {
            examList,
            patientId,
            isCorrectPatient,
            correctPatientValue: isCorrectPatient ? correctPatientValue : "",
            isCorrectSide,
            correctSideValue: isCorrectSide ? correctSideValue : "",
            isCorrectProcedure,
            correctProcedureValue: isCorrectProcedure ? correctProcedureValue : "",
            contrastValue,
            allergiesDetails,

            // referringSignatureId: isReferringSignatureVerified ? referringSignatureId : null,
            referringSignatureId: referringSignatureId,
            referringSignaturePin: isReferringSignatureVerified ? referringSignaturePin : "",
            isReferringSignatureVerified,

            referringDate,
            authorisedId,
            authorisedDate,
            operatorId,
            operatorDate,
            appointerId: isAppointerSignatureVerified ? appointerId : null,
            appointerSignaturePin: isAppointerSignatureVerified ? appointerSignaturePin : "",
            isAppointerSignatureVerified,
            updatedBy: createdBy,
            orderId: orderIdentifier,
            orderAcceptStatus: true
        });
        await updateOrCreateModalityRecords(_id);
        if (flagmailValue === true) {
            const appoinments = await Radiology.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(_id) } },
                {
                    "$lookup": {
                        from: "patientInformation",
                        localField: "patientId",
                        foreignField: "_id",
                        as: "patientInformation"
                    }
                },
                {
                    "$lookup": {
                        from: "patientMedicalHistory",
                        localField: "patientId",
                        foreignField: "pId",
                        as: "patientMedicalHistory"
                    }
                },
                {
                    "$lookup": {
                        from: "branches",
                        localField: "createdByBranch",
                        foreignField: "_id",
                        as: "referringBranch"
                    }
                },
                {
                    "$lookup": {
                        from: "branches",
                        localField: "refferedToBranch",
                        foreignField: "_id",
                        as: "referreredBranch"
                    }
                },
                {
                    "$lookup": {
                        from: "users",
                        localField: "createdBy",
                        foreignField: "_id",
                        as: "referringDoctor"
                    }
                },
                {
                    "$lookup": {
                        from: "appoinments",
                        localField: "appoinmentId",
                        foreignField: "_id",
                        as: "appoinments"
                    }
                },
                {
                    $unwind: {
                        path: "$patientInformation",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: "$referringBranch",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: "$referreredBranch",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: "$patientMedicalHistory",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: "$referringDoctor",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: "$appoinments",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        _id: 1,
                        examList: 1,
                        patientInformation: {
                            fName: 1,
                            lName: 1,
                            gender: 1,
                            dob: 1,
                            contactNumber: 1,
                            email: 1
                        },
                        patientMedicalHistory: 1,
                        appoinments: {
                            examReason: 1
                        },
                        referringDoctor: {
                            name: 1,
                            email: 1,
                            _id: 1,
                            signatureImage: 1,
                            role: 1
                        },
                        referringBranch: {
                            name: 1,
                            email: 1,
                            phone: 1,
                            address: 1
                        },
                        referreredBranch: {
                            name: 1,
                            email: 1,
                            phone: 1,
                            address: 1
                        }
                    }
                }
            ]);
            // Write the code to send mail
            data = {
                todayDate: generateFullDate(new Date()),
                referredBranchName: appoinments[0].referreredBranch.name,
                referredBranchAddress: appoinments[0].referreredBranch.address,
                referredBranchPhone: appoinments[0].referreredBranch.phone,
                referredBranchEmail: appoinments[0].referreredBranch.email,
                patientName: `${appoinments[0].patientInformation.fName} ${appoinments[0].patientInformation.lName}`,
                patientAge: calculateAge(appoinments[0].patientInformation.dob),
                patientGender: convertToTitleCase(appoinments[0].patientInformation.gender),
                patientPhone: appoinments[0].patientInformation.contactNumber,
                patientEmail: appoinments[0].patientInformation.email,
                patientDOB: appoinments[0].patientInformation.dob,
                referringBranchName: appoinments[0].referringBranch.name,
                referringBranchEmail: appoinments[0].referringBranch.email,
                referringBranchPhone: appoinments[0].referringBranch.phone,
                referringBranchAddress: appoinments[0].referringBranch.address,
                referredBranchName: appoinments[0].referreredBranch.name,
                examList: generateExamList(appoinments[0].examList),
                referringPersonName: appoinments[0].referringDoctor.name,
                referringPersonDesignation: USER_ROLE[appoinments[0].referringDoctor.role],
                referringPersonSignature: `${process.env.SERVER_API}/api/profile/${appoinments[0].referringDoctor._id}/signatureImage/${appoinments[0].referringDoctor.signatureImage}`,
                allergies: appoinments[0]?.patientMedicalHistory?.allergies,
                illness: appoinments[0]?.patientMedicalHistory?.illness,
                diagnosis: appoinments[0]?.patientMedicalHistory?.diagnosis,
                medications: appoinments[0]?.patientMedicalHistory?.medications,
            }
            sendPatientReferIntemationEmail(data)
        }
        return res.status(201).json({ success: true, message: "Radiology successfully Updated" });
    } catch (err) {
        console.log(err)
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};

exports.delete = async (req, res) => {
    try {
        let radiologyData = await Radiology.findById(req.params.id);
        await Radiology.findByIdAndUpdate(req.params.id, { isDeleted: true });
        await Appoinment.findByIdAndUpdate(radiologyData.appoinmentId, { isDeleted: true });
        await Order.findByIdAndUpdate(radiologyData.orderId, { isDeleted: true });
        await mysqlconnection.promise().query(`DELETE FROM WORKLIST WHERE ORDER_OBJECT_ID=?`, [radiologyData.orderId.toString()])
        return res.status(200).json({ success: true, message: `Radiology successfully Deleted` });
    } catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};