const PatientInformation = require("../../database/models/admin/patientInformation");
const PatientEmergencyContactInfo = require("../../database/models/admin/patientEmergencyContactInfo");
const PatientInsurance = require("../../database/models/admin/patientInsurance");
const PatientLifeStyleInfo = require("../../database/models/admin/patientLifeStyleInfo");
const PatientMedicalHistory = require("../../database/models/admin/patientMedicalHistory");
const PatientPhysician = require("../../database/models/admin/patientPhysician");
const PatientAcknowledgement = require("../../database/models/admin/patientAcknowledgement");
const MasterAllergies = require("../../database/models/admin/masterAllergies");
const MasterCountries = require("../../database/models/admin/masterCountry");
const MasterOccupation = require("../../database/models/admin/masterOccupation");
const MasterRegion = require("../../database/models/admin/masterRegion");
const MasterRelation = require("../../database/models/admin/masterRelation");
const MasterDepartment = require("../../database/models/admin/masterPatientDepartment");
const MasterDaignosis = require("../../database/models/admin/masterDaignosis");
const mongoose = require('mongoose');

exports.getPatientRegistrationMasterData = async (req, res) => {
    try {
        const allergieList = await MasterAllergies.find({}).collation({ locale: "en" }).sort({ allergie: 1 });
        const occupationList = await MasterOccupation.find({}).collation({ locale: "en" }).sort({ occupation: 1 });
        const regionList = await MasterRegion.find({}).collation({ locale: "en" }).sort({ region: 1 });
        const relationList = await MasterRelation.find({}).collation({ locale: "en" }).sort({ relation: 1 });
        const countriesList = await MasterCountries.find({}).collation({ locale: "en" }).sort({ countryList: 1 });
        const patientDepartmnetList = await MasterDepartment.find({}).collation({ locale: "en" }).sort({ department: 1 });
        const daignosisList = await MasterDaignosis.find({}).collation({ locale: "en" }).sort({ daignosis: 1 });
        return res.status(200).json({
            success: true,
            message: "Data found",
            allergieList,
            occupationList,
            regionList,
            relationList,
            countriesList,
            patientDepartmnetList,
            daignosisList
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "There was an internal server error.",
        });
    }
};
exports.getPatientProfileData = async (req, res) => {
    try {
        let data;
        let dataCount;

        let pipeline = [];
        // console.log('skip', req.query.skip);
        const search = req.query.search.trim();
        const searchType = req.query.searchType.trim();
        // console.log('==========');
        // console.log(req.query.search, req.query.searchType, search.length);
        // console.log('==========');
        if (search !=='' && searchType !== '') {
            if(searchType==='fName'){
                pipeline.push({ $match: {
                    fName: { "$regex": `${req.query.search}`, "$options": "i" },
                    isDeleted: false,
                    $and:[
                    {$or:[
                        {branchId: new mongoose.Types.ObjectId(req.params.currentBranch)},
                        {
                            belongsTo: { 
                                $elemMatch: { refferedToBranch: new mongoose.Types.ObjectId(req.params.currentBranch) } 
                            }
                        }
                    ]}
                ],
                
                } });
            }
            if(searchType==='lName'){
                pipeline.push({ $match: {
                    lName: { "$regex": `${req.query.search}`, "$options": "i" },
                    isDeleted: false,
                    $and:[
                    {$or:[
                        {branchId: new mongoose.Types.ObjectId(req.params.currentBranch)},
                        {
                            belongsTo: { 
                                $elemMatch: { refferedToBranch: new mongoose.Types.ObjectId(req.params.currentBranch) } 
                            }
                        }
                    ]}
                ],
                
                } });
            }
        }
        pipeline.push({ $sort: { createdAt: -1 } });
        
        if (!search) {
            // console.log('req.params.currentBranch...', req.params.currentBranch)
            // pipeline.push({ $match: { isDeleted: false, branchId: new mongoose.Types.ObjectId(req.params.currentBranch),  } });
            pipeline.push({ $match: {$and:[
                {$or:[
                    {branchId: new mongoose.Types.ObjectId(req.params.currentBranch)},
                    {
                        belongsTo: { 
                            $elemMatch: { refferedToBranch: new mongoose.Types.ObjectId(req.params.currentBranch) } 
                        }
                    }
                ]}
            ],
            isDeleted: false
            } });
        }

        const relatedModels = [
            "patientEmergencyContactInfo",
            "patientInsurance",
            "patientLifeStyleInfo",
            "patientMedicalHistory",
            "patientPhysician",
            "patientAcknowledgement"
        ];

        relatedModels.forEach(modelName => {
            const lookupStage = {
                $lookup: {
                    from: modelName,
                    localField: "_id", // Change this if your field name is different
                    foreignField: "pId", // Change this if your field name is different
                    as: modelName
                }
            };
            pipeline.push(lookupStage);
        });
        if (Number(req.query.limit) !== 0) {
            pipeline.push({ $skip: Number(req.query.skip) })
            pipeline.push({ $limit: Number(req.query.limit) });
            
        }
        data = await PatientInformation.aggregate(pipeline);

        if (!search) {
            dataCount = await PatientInformation.find({
                $and:[
                    {$or:[
                        {branchId: new mongoose.Types.ObjectId(req.params.currentBranch)},
                        {
                            belongsTo: { 
                                $elemMatch: { refferedToBranch: new mongoose.Types.ObjectId(req.params.currentBranch) } 
                            }
                        }
                    ]}
                ],
                isDeleted: false}
            ).count();
        } else {
            console.log('hiii seach is present not')
            dataCount = await PatientInformation.find({
                $or: [
                    { fName: { $regex: `${req.query.search}`, $options: "i" } },
                    { lName: { $regex: `${req.query.search}`, $options: "i" } }
                ]
            }).count();
        }

        if (!data) {
            return res.status(404).json({ success: false, message: "Patient list not found" });
        }
        return res.status(200).json({ success: true, data, dataCount });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};



exports.deletePatientData = async (req, res) => {
    try {
        // Example: Delete data from PatientInformation model
        await PatientInformation.findByIdAndUpdate(req.params.id, { isDeleted: true });

        // Check if data exists in each related model and then delete it
        const deletePromises = [
            PatientEmergencyContactInfo.findOne({ pId: req.params.id }),
            PatientInsurance.findOne({ pId: req.params.id }),
            PatientLifeStyleInfo.findOne({ pId: req.params.id }),
            PatientMedicalHistory.findOne({ pId: req.params.id }),
            PatientPhysician.findOne({ pId: req.params.id }),
            PatientAcknowledgement.findOne({ pId: req.params.id })
        ].map(async (model) => {
            if (model) {
                await model.updateOne({ isDeleted: true });
            }
        });

        await Promise.all(deletePromises);

        return res.status(200).json({ success: true, message: `Patient data successfully deleted` });
    } catch (err) {
        return res.status(400).json({ success: false, message: "There is some error. Please try again later." });
    }
};


exports.getPatientData = async (req, res) => {
    let data = {};
    try {
        if (req.params.type === "basicInformation") {
            const patientInfoData = await PatientInformation.findOne({ _id: req.params.id, isDeleted: false });
            const contactData = await PatientEmergencyContactInfo.findOne({ pId: req.params.id, isDeleted: false });
            data = {
                ...patientInfoData._doc,
                ...contactData?._doc
            };
        } else if (req.params.type === "insurance") {
            data = await PatientInsurance.findOne({ pId: req.params.id, isDeleted: false });
        } else if (req.params.type === "physician") {
            data = await PatientPhysician.findOne({ pId: req.params.id, isDeleted: false });
        } else if (req.params.type === "medicalHistory") {
            data = await PatientMedicalHistory.findOne({ pId: req.params.id, isDeleted: false });
        } else if (req.params.type === "lifestyle") {
            data = await PatientLifeStyleInfo.findOne({ pId: req.params.id, isDeleted: false });
        } else if (req.params.type === "acknowledgement") {
            data = await PatientAcknowledgement.findOne({ pId: req.params.id, isDeleted: false });
        }
        return res.status(200).json({ success: true, message: `Patient data successfully fetched`, patientData: data });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, message: "There is some error. Please try again later." });
    }
};



