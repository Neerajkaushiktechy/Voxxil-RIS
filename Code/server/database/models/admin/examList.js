const mongoose = require('mongoose');
// Define the User schema

const modalitySchema = new mongoose.Schema({ decription: 'string', term: 'string', _id:mongoose.Schema.Types.ObjectId });

const schema = new mongoose.Schema({
    no : {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
        require
    },
    group: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "examGroup",
    },
    isDeleted : {
        type: Boolean,
        trim: true,
        default: false
    },
    branchId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "branch"
    },
    updatedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    modality:  [modalitySchema],
});


const ExamList = mongoose.model('examList', schema);
module.exports = ExamList;