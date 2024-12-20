const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');
const Radiology = require("../../database/models/admin/radiology");
const Appoinment = require("../../database/models/admin/appoinment");
const Order = require("../../database/models/admin/order");
const User = require("../../database/models/auth/user");
const moment = require('moment');
const PatientInformation = require("../../database/models/admin/patientInformation");
const CONSTANT = require('../../constant');
const { sendPatientReferIntemationEmail, sendReferralNotification } = require('../../helper/patientReferralEmailHelper'); 
const { search } = require("../../routing/referral");
const { getDayName, getMonthName, getYear, calculateAge } = require('../../helper/dateTimeHelper')
const { convertToTitleCase, generateExamList } = require('../../helper/stringHelper');
const { USER_ROLE } = require('../../constant')

const generateFullDate = (date) => {
    const day = getDayName(date);
    const month = getMonthName(date);
    const year = getYear(date);
    return `${day}-${month}-${year}`
}

const informPatientRegardingReferral = async (radiologyId) => {
    // const radiologyId = req.body.radiologyId;
    const appoinments = await Radiology.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(radiologyId)} },
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
                _id:1,
                examList:1,
                patientInformation:{
                    fName: 1,
                    lName: 1,
                    gender: 1,
                    dob:1,
                    contactNumber:1,
                    email:1
                },
                patientMedicalHistory: 1,
                appoinments:{
                    examReason:1
                },
                referringDoctor:{
                    name: 1,
                    email: 1,
                    _id: 1,
                    signatureImage: 1,
                    role:1
                },
                referringBranch: {
                    name: 1,
                    email: 1,
                    phone:1,
                    address:1
                },
                referreredBranch: {
                    name: 1,
                    email: 1,
                    phone:1,
                    address:1
                }
            }
        }
    ]);
    data = {
        todayDate: generateFullDate(new Date()),
        referredBranchName: appoinments[0].referreredBranch.name,
        referredBranchAddress:appoinments[0].referreredBranch.address,
        referredBranchPhone:appoinments[0].referreredBranch.phone,
        referredBranchEmail:appoinments[0].referreredBranch.email,
        patientName: `${appoinments[0].patientInformation.fName} ${appoinments[0].patientInformation.lName}`,
        patientAge: calculateAge(appoinments[0].patientInformation.dob),
        patientGender: convertToTitleCase(appoinments[0].patientInformation.gender),
        patientPhone: appoinments[0].patientInformation.contactNumber,
        patientEmail:appoinments[0].patientInformation.email,
        patientDOB:appoinments[0].patientInformation.dob,
        referringBranchName: appoinments[0].referringBranch.name, 
        referringBranchEmail: appoinments[0].referringBranch.email,
        referringBranchPhone: appoinments[0].referringBranch.phone,
        referringBranchAddress: appoinments[0].referringBranch.address,
        referredBranchName:appoinments[0].referreredBranch.name,
        examList:generateExamList(appoinments[0].examList),
        referringPersonName: appoinments[0].referringDoctor.name,
        referringPersonDesignation:  USER_ROLE[appoinments[0].referringDoctor.role],
        referringPersonSignature: `${process.env.SERVER_API}/api/profile/${appoinments[0].referringDoctor._id}/signatureImage/${appoinments[0].referringDoctor.signatureImage}`,
        allergies: appoinments[0]?.patientMedicalHistory?.allergies,
        illness: appoinments[0]?.patientMedicalHistory?.illness,
        diagnosis: appoinments[0]?.patientMedicalHistory?.diagnosis,
        medications: appoinments[0]?.patientMedicalHistory?.medications,
    }
    // sendPatientReferIntemationEmail(data)
    sendReferralNotification(data);
    // return res.status(201).json({ success: true, data: data });
}

exports.post = async (req, res) => {
    const {
        appoinmentCategory,
        startTime,
        appoinmentDuration,
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
        refferToBranch,
        createdByBranch,
        referId,
        examListModality,
    } = req.body;
    try {

        const createdBy = req.user.id;
        const branchId = refferToBranch;
        let endTime = null;
        if(startTime){
            endTime = moment.utc(startTime).add(appoinmentDuration, 'minutes');

            const checkAppoinment = await Appoinment.find({
                createdBy,
                branchId,
                $or: [
                    { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: startTime } }] },
                    { $and: [{ startTime: { $lte: endTime } }, { endTime: { $gte: endTime } }] },
                ],
            });

            if (checkAppoinment.length > 0) { return res.status(400).json({ success: false, message: "Appoinment is already booked" }); }
        }
        

        // create appoinment
        const appoinment = await Appoinment.create({
            appoinmentCategory,
            startTime,
            endTime,
            appoinmentDuration,
            examReason,
            isPregnant,
            lmp: isPregnant ? lmp : 0,
            isDeleted: false,
            patientId,
            createdBy,
            updatedBy: createdBy,
            branchId,
            createdByBranch,
            refferedToBranch:refferToBranch,
            referringConsultant: referId
        });

        const orthancPatientId = uuidv4();
        let radiology = await Radiology.create({
            appoinmentId: appoinment._id,
            // orderId: order._id,
            orthancPatientId: orthancPatientId,
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
            isDeleted: false,
            branchId,
            createdBy,
            updatedBy: createdBy,
            isReffered: true,
            referralStatus: "pending",
            createdByBranch,
            refferedToBranch:refferToBranch,
            examListModality,
            refferingDateAndTime: new Date()
        });
        informPatientRegardingReferral(radiology._id);
        return res.status(201).json({ success: true, message: "Radiology successfully Added" });
    } catch (err) {
        console.log("err", err)
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};

exports.getReferralList = async (req, res) => {
    const searchBy = req.query.searchBy;
    const currentBranch = req.currentBranch;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const searchQuery = req.query.searchQuery || "";
    try {
        let referralList;
        let dataCount;
        if(searchBy === CONSTANT.DECLINED_ORDER){
            referralList =  Radiology.find({ isDeleted: false, isReffered: true, orderAcceptStatus: false,  $or: [ { createdByBranch: currentBranch }, { refferedToBranch: currentBranch } ] })
                        .populate({ 
                            path: 'patientId', select: "fName lName gender dob email",
                            match: {
                                $or: [
                                    { fName: { $regex: searchQuery, $options: 'i' } },
                                    { lName: { $regex: searchQuery, $options: 'i' } },
                                ],
                            },
                         })
                         .populate({ 
                            path: 'denialBy', select: "name firstName lastName gender dob email",
                         })
                        .populate({ path: 'createdByBranch', select: "name city" })
                        .populate({ path: 'refferedToBranch', select: "name city" })
                        .populate({
                            path: 'examList',
                            populate: {
                                path: 'list',
                                select: 'name'
                            }
                        })
                        .sort({createdAt: 'desc' });        
            
            // dataCount = await Radiology.countDocuments({  isDeleted: false, isReffered: true, refferedToBranch: currentBranch });
            const dataCountList = await Radiology.find({   isDeleted: false, isReffered: true, orderAcceptStatus: false,  $or: [ { createdByBranch: currentBranch }, { refferedToBranch: currentBranch } ] })
                .populate({
                    path: "patientId", select: "fName lName",
                    match: {
                        $or: [
                            { fName: { $regex: searchQuery, $options: 'i' } },
                            { lName: { $regex: searchQuery, $options: 'i' } },
                        ],
                    },
                }).select("appoinmentId examList patientId status orderId,reportId")
            const dataCountFilter = dataCountList.filter((item) => item.patientId);
            dataCount = dataCountFilter.length;
        }
        if(searchBy === CONSTANT.REFERRED_BY){
            referralList =  Radiology.find({ isDeleted: false, isReffered: true, refferedToBranch: currentBranch, 
                orderAcceptStatus:  { $ne: false } })
                        .populate({ 
                            path: 'patientId', select: "fName lName gender dob email",
                            match: {
                                $or: [
                                    { fName: { $regex: searchQuery, $options: 'i' } },
                                    { lName: { $regex: searchQuery, $options: 'i' } },
                                ],
                            },
                         })
                        .populate({ path: 'createdByBranch', select: "name city" })
                        .populate({ path: 'refferedToBranch', select: "name city" })
                        .populate({
                            path: 'examList',
                            populate: {
                                path: 'list',
                                select: 'name'
                            }
                        })
                        .sort({createdAt: 'desc' });        
            
            // dataCount = await Radiology.countDocuments({  isDeleted: false, isReffered: true, refferedToBranch: currentBranch });
            const dataCountList = await Radiology.find({  isDeleted: false, isReffered: true, refferedToBranch: currentBranch })
                .populate({
                    path: "patientId", select: "fName lName",
                    match: {
                        $or: [
                            { fName: { $regex: searchQuery, $options: 'i' } },
                            { lName: { $regex: searchQuery, $options: 'i' } },
                        ],
                    },
                }).select("appoinmentId examList patientId status orderId,reportId")
            const dataCountFilter = dataCountList.filter((item) => item.patientId);
            dataCount = dataCountFilter.length;
        }
        if(searchBy === CONSTANT.REFERRED_TO) {
            referralList = Radiology.find({ isDeleted: false, isReffered: true, createdByBranch: currentBranch})
                        .populate({ 
                            path: 'patientId', select: "fName lName gender dob email",
                            match: {
                                $or: [
                                    { fName: { $regex: searchQuery, $options: 'i' } },
                                    { lName: { $regex: searchQuery, $options: 'i' } },
                                ],
                            },
                        })
                        .populate({ path: 'createdByBranch', select: "name city" })
                        .populate({ path: 'refferedToBranch', select: "name city" })
                        .populate({
                            path: 'examList',
                            populate: {
                                path: 'list',
                                select: 'name'
                            }
                        }).sort({createdAt: 'desc' });
            const dataCountList = await Radiology.find({ isDeleted: false, isReffered: true, createdByBranch: currentBranch })
                .populate({
                    path: "patientId", select: "fName lName",
                    match: {
                        $or: [
                            { fName: { $regex: searchQuery, $options: 'i' } },
                            { lName: { $regex: searchQuery, $options: 'i' } },
                        ],
                    },
                }).select("appoinmentId examList patientId status orderId,reportId")
            const dataCountFilter = dataCountList.filter((item) => item.patientId);
            dataCount = dataCountFilter.length;
            // dataCount = await Radiology.countDocuments({  isDeleted: false, isReffered: true, createdByBranch: currentBranch });
        }
        if(searchQuery === ''){
            referralList = await referralList.skip((page - 1) * limit)
                            .limit(limit)
                            .exec();
        } else {
            referralList = await referralList.exec();
            // console.log('referralList...', referralList);
            referralList = referralList.filter((item) => item.patientId);
            referralList = referralList.slice((page-1)*limit, page*limit);
        } 
        
        const data = referralList.filter((item) => item.patientId);
        
        return res.status(200).json({ success: true, data, dataCount:dataCount?dataCount:0 });
    } catch(err) {
        // console.log('error at this', err);
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
}

exports.approveReferral = async (req, res) => {
    const { radiologyId } = req.body;
    try {
        const date = new Date();
        const timestamp = Math.floor(date / 1000); // Unix timestamp in seconds
        const uniqueKey = `${timestamp}-${Math.floor(Math.random() * 1000)}`;
        let radiologyData = await Radiology.findById(radiologyId).exec();
        const createdBy = req.user.id;
        const branchId = req.currentBranch;
        const order = await Order.create({
            orderId: uniqueKey,
            patientId: radiologyData.patientId,
            createdBy,
            updatedBy: createdBy,
            branchId,
            isDeleted: false,
            createdByBranch: radiologyData.createdByBranch,
            refferedToBranch:radiologyData.refferedToBranch,
            radiologyId: radiologyId,
        });
        radiologyData = await Radiology.findOneAndUpdate({_id: radiologyId}, {
            orderId: order._id,
            updatedBy: req.user.id,
        }, {new: true});
        return res.status(200).json({ success: true, data:radiologyData, message: "Order Created Successfully" });
    } catch(err) {
        console.log('error at this', err);
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
}

exports.declineReferral = async (req, res) => {
    const { 
        radiologyId,
        denialReasonText,
        denialTimeString
     } = req.body;
    try {
        radiologyData = await Radiology.findOneAndUpdate({_id: radiologyId}, {
            orderAcceptStatus:false,
            updatedBy: req.user.id,
            denialBy:req.user.id,
            denialReasonText,
            denialTimeString:denialTimeString.toString(),
            denialTimeUtc: new Date()
        }, {new: true});
        // return getReferralDate();
        return res.status(200).json({ success: true, data:radiologyData, message: "Order Declined Successfully" });
    }catch(error) {
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
}

exports.declineReferralList = async (req, res) => {
    // const { radiologyId } = req.body;
    const currentBranch = req.currentBranch;
    try {
        const radiologyData =  await Radiology.find({ isDeleted: false, isReffered: true, createdByBranch: currentBranch, 
            orderAcceptStatus: false })
                    .populate({ 
                        path: 'patientId', select: "fName lName gender dob email",
                     })
                     .populate({ 
                        path: 'appoinmentId', select: "startTime endTime appoinmentDuration",
                     })
                    .populate({ path: 'createdByBranch', select: "name city" })
                    .populate({ path: 'refferedToBranch', select: "name city" })
                    .populate({
                        path: 'examList',
                        populate: {
                            path: 'list',
                            select: 'name'
                        }
                    })
                    .populate({
                        path: 'denialBy',
                       select: 'name role'
                    })
                    .sort({createdAt: 'desc' }).exec();
        console.log('radiologyData...', radiologyData);
        return res.status(200).json({ success: true, data:radiologyData, message: "Data successful" });
    }catch(error) {
        return res.status(400).json({ success: false, data:[], message: "There is some error please try again later" });
    }
}