const MasterAllergies = require("../../database/models/admin/masterAllergies");
const MasterCountries = require("../../database/models/admin/masterCountry");
const MasterOccupation = require("../../database/models/admin/masterOccupation");
const MasterRegion = require("../../database/models/admin/masterRegion");
const MasterRelation = require("../../database/models/admin/masterRelation");
const MasterDepartment = require("../../database/models/admin/masterPatientDepartment");
const MasterDaignosis = require("../../database/models/admin/masterDaignosis");
const PatientRegistration = require("../../database/models/admin/patientRegistration");
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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

exports.registerPatientProfile = async (req, res) => {
    const { branchId,
        formData: {
            basicInfo,
            insurance,
            physician,
            medicalHistory,
            lifeStyleInfo,
            acknowledgement,
        }

    } = req.body;
    const newPatientProfile = new PatientRegistration({
        ...basicInfo,
        insurance,
        physician,
        medicalHistory,
        lifeStyleInfo,
        acknowledgement,
        createdBy: req.user.id,
        branchId: branchId
    });

    try {
        await newPatientProfile.validate();
        const savedProfile = await newPatientProfile.save();
        res.status(201).json({
            success: true,
            message: 'Patient is registered',
            pId: savedProfile._id,
            patientdata : savedProfile
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

        const updatedPatient = await PatientRegistration.findByIdAndUpdate(
            req.params.id,
            { $set: { 'medicalHistory.imagingStudies': documents } },
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


exports.getPatientData = async (req, res) => {
    try {
        let data;
        let dataCount;

        let pipeline = [{ $skip: Number(req.query.skip) },];

        if (req.query.search && req.query.searchType) {
            if (req.query.searchType === "fName") {
                pipeline.push({
                    $match: {
                        isDeleted: false,
                        $and: [
                            { fName: { "$regex": `${req.query.search}`, "$options": "i" } },
                            { $or: [{ branchId: new mongoose.Types.ObjectId(req.params.currentBranch) }] }
                        ]
                    }
                });
            } else if (req.query.searchType === "lName") {
                pipeline.push({
                    $match: {
                        isDeleted: false,
                        $and: [
                            { lName: { "$regex": `${req.query.search}`, "$options": "i" } },
                            { $or: [{ branchId: new mongoose.Types.ObjectId(req.params.currentBranch) }] }
                        ]
                    }
                });
            }
        }

        if (Number(req.query.limit) !== 0) {
            pipeline.push({ $limit: Number(req.query.limit) });
        }
        if (!req.query.search && !req.query.searchType) {
            pipeline.push({ $match: { isDeleted: false, branchId: new mongoose.Types.ObjectId(req.params.currentBranch) } });
        }

        data = await PatientRegistration.aggregate(pipeline);

        if (!req.query.search && !req.query.searchType) {
            dataCount = await PatientRegistration.find({ isDeleted: false, branchId: new mongoose.Types.ObjectId(req.params.currentBranch) }).count();
        } else {
            dataCount = await PatientRegistration.find({
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

exports.editPatient = async (req, res) => {
    const { _id, basicInfo, insurance, physician, medicalHistory, lifeStyleInfo, acknowledgement } = req.body;
    const insuranceParse = JSON.parse(insurance)
    const physicianParse = JSON.parse(physician)
    const medicalHistoryParse = JSON.parse(medicalHistory)
    const lifeStyleInfoParse = JSON.parse(lifeStyleInfo)
    const acknowledgementInfoParse = JSON.parse(acknowledgement)
    try {
        // First, update the fields you need
        const updatedProfile = await PatientRegistration.findByIdAndUpdate(
            _id,
            {
                ...basicInfo,
                insurance: insuranceParse,
                physician: physicianParse,
                medicalHistory: medicalHistoryParse,
                lifeStyleInfo: lifeStyleInfoParse,
                acknowledgement: acknowledgementInfoParse,
                updatedBy: req.user.id
            },
        );

        if (!updatedProfile) {
            return res.status(404).json({ success: false, message: 'Patient profile not found' });
        }
        // Next, update the specific subfield using $set
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
        await PatientRegistration.findByIdAndUpdate(
            _id,
            {
                $set: { 'medicalHistory.imagingStudies': document },
            },
            { new: true }
        );

        res.status(200).json({ success: true, message: 'Patient profile successfully updated' });
    } catch (err) {
        console.log(err, "err");
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "All fields are required", error: err.message });
        }
        return res.status(500).json({ success: false, message: 'There is some error, please try again later' });
    }
};


exports.deletePatient = async (req, res) => {
    try {
        await PatientRegistration.findByIdAndUpdate(req.params.id, { isDeleted: true });
        return res.status(200).json({ success: true, message: `Patient successfully Deleted` });
    } catch (err) {
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};


