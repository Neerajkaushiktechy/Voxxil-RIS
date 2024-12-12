const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require
    },
    list : [
        {
            type: mongoose.Types.ObjectId,
            ref: "examList"
        }
    ],
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
    }
});


const ExamGroup = mongoose.model('examGroup', schema);
module.exports = ExamGroup;