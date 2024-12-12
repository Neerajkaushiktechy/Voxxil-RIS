const Order = require("../../database/models/admin/order");
const Appointments = require("../../database/models/admin/appoinment")
const RadioLogy = require("../../database/models/admin/radiology")
const moment = require('moment');
const mongoose = require('mongoose')
const PatientInformation = require("../../database/models/admin/patientInformation");
const User = require("../../database/models/auth/user");
const { APPOINTMENT_CATEGORIES } = require("../../constant");

exports.get = async (req, res) => {
    const today = moment().startOf('day');
    const currentBranch = req.currentBranch;
    try {
      const totalAppointmentsCount = await Appointments.countDocuments({
         branchId: currentBranch,
        //  appoinmentCategory: APPOINTMENT_CATEGORIES.SCHEDULED
       });
      const totalPatientsCount = await PatientInformation.countDocuments({
        $or: [
            { branchId: currentBranch },
            {
              belongsTo: {
                  $elemMatch: { refferedToBranch: currentBranch }
              }
          }
        ]
    });
        const data = await Order.aggregate([
          { 
            $match: { 
                isDeleted: false,
                branchId: new mongoose.Types.ObjectId(currentBranch)
            } 
        },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        const todayAppointments = await Appointments.find({
            branchId: currentBranch,
            startTime: {
                $gte: today.toDate(),
                $lt: today.endOf('day').toDate()
            }
        }).populate({ path: 'patientId', select: "fName lName gender dob email" });
        // const radiologyDataPromises = todayAppointments.map(async (appointment) => {
        //     const radiologyData = await RadioLogy.findOne({ appoinmentId: appointment._id });
        //     return { radiologyData };
        // });
        // const radiologyDataResults = await Promise.all(radiologyDataPromises);
        // console.log(radiologyDataResults, "today");
        var dayStartTime = new Date();
        dayStartTime.setHours(0,0,0,0);

        var dayEndTime = new Date();
        dayEndTime.setHours(23,59,59,999);
        const appoinments = await RadioLogy.aggregate([
            { $match: { appoinmentId: { $ne: null } } },
            {
                "$lookup": {
                    from: "appoinments",
                    localField: "appoinmentId",
                    foreignField: "_id",
                    as: "appoinments",
                }
            },
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
                    from: "users",
                    localField: "operatorId",
                    foreignField: "_id",
                    as: "operator"
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
                $match: {
                    'appoinments.branchId': new mongoose.Types.ObjectId(currentBranch),
                    'appoinments.startTime': {
                        $gte: dayStartTime,
                        $lt: dayEndTime
                    }
                }
            },            
            {
                "$project": {
                  _id: 1,
                  orderId: 1,
                  patientId:1,
                  "examList.examListModality": {
                    modalityName:1,
                    examName:1,
                    examId:1
                  },
                  patientInformation: {
                    fName: 1,
                    lName: 1,
                    gender:1,
                    dob:1,
                    email:1,
                  },
                  appoinments:{
                    startTime:1,
                    endTime:1,
                    appoinmentDuration:1,
                    referringConsultant: 1,
                    branchId:1
                  },
                  operator: {
                    name:1,
                    email:1,
                  },
                }
              }
        ]);

        const missedAppointments = data.find(item => item._id === 'Appointment Miss')?.count || 0;
        const completedAppointments = data.find(item => item._id === 'Appointment Complete')?.count || 0;
        return res.status(200).json({ success: true, data, appoinments, completedAppointments: completedAppointments, missedAppointments: missedAppointments, todayAppointments: todayAppointments,totalAppointmentsCount:totalAppointmentsCount,totalPatientsCount:totalPatientsCount });
    } catch (error) {
        console.log(error, "error");
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getPatientDashboardData = async (req, res) => {
    const user = await User.findById(req.user.id);
    const patient = await PatientInformation.findOne({email: user.email});
    const currentBranch = req.currentBranch;
    const now = new Date();
    var dayStartTime = new Date();
    dayStartTime.setHours(0,0,0,0);

    var dayEndTime = new Date();
    dayEndTime.setHours(23,59,59,999);      
    const todayAppointments = await RadioLogy.aggregate([
            { $match: { appoinmentId: { $ne: null }, patientId: patient._id, orderAcceptStatus: { $ne: false } } },
            {
                "$lookup": {
                    from: "appoinments",
                    localField: "appoinmentId",
                    foreignField: "_id",
                    as: "appoinments",
                }
            },
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
                    from: "users",
                    localField: "operatorId",
                    foreignField: "_id",
                    as: "operator"
                }
            },
            {
              "$lookup": {
                  from: "branches",
                  localField: "branchId",
                  foreignField: "_id",
                  as: "branch",
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
                path: "$branch",
                preserveNullAndEmptyArrays: true
              }
            },
            {
                $match: {
                    // 'appoinments.branchId': new mongoose.Types.ObjectId(currentBranch),
                    'appoinments.startTime': {
                        $gte: dayStartTime,
                        $lt: dayEndTime
                    }
                }
            },            
            {
                "$project": {
                  _id: 1,
                  orderId: 1,
                  patientId:1,
                  "examList.examListModality": {
                    modalityName:1,
                    examName:1,
                    examId:1
                  },
                  patientInformation: {
                    fName: 1,
                    lName: 1,
                    gender:1,
                    dob:1,
                    email:1,
                  },
                  appoinments:{
                    startTime:1,
                    endTime:1,
                    appoinmentDuration:1,
                    referringConsultant: 1,
                    branchId:1
                  },
                  operator: {
                    name:1,
                    email:1,
                  },
                  branch: {
                    name:1,
                    email:1,
                    phone:1,
                    address:1
                  }
                }
              }
        ]);
        const declinedAppointments = await RadioLogy.find({ isDeleted: false, isReffered: true, patientId: patient._id, orderAcceptStatus: false })
                    .populate({ 
                        path: 'patientId', select: "fName lName gender dob email",
                     })
                     .populate({ 
                        path: 'appoinmentId', select: "startTime endTime appoinmentDuration",
                     })
                    .populate({ path: 'createdByBranch', select: "name city address" })
                    .populate({ path: 'refferedToBranch', select: "name city address" })
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

    // Upcoming Appointments
    const upcomingAppointments = await RadioLogy.aggregate([
      {
        $match: {
          appoinmentId: { $ne: null },
          patientId: patient._id,
          orderAcceptStatus: { $ne: false },
        },
      },
      {
        $lookup: {
          from: "appoinments",
          localField: "appoinmentId",
          foreignField: "_id",
          as: "appoinments",
        },
      },
      {
        $lookup: {
          from: "patientInformation",
          localField: "patientId",
          foreignField: "_id",
          as: "patientInformation",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "operatorId",
          foreignField: "_id",
          as: "operator",
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "branchId",
          foreignField: "_id",
          as: "branch",
        },
      },
      { $unwind: { path: "$appoinments", preserveNullAndEmptyArrays: true } },
      {
        $unwind: {
          path: "$patientInformation",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unwind: { path: "$operator", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$branch", preserveNullAndEmptyArrays: true } },
      { $match: { "appoinments.startTime": { $gt: now } } },
      {
        $project: {
          _id: 1,
          orderId: 1,
          patientId: 1,
          "examList.examListModality": {
            modalityName: 1,
            examName: 1,
            examId: 1,
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
            referringConsultant: 1,
            branchId: 1,
          },
          operator: { name: 1, email: 1 },
          branch: { name: 1, email: 1, phone: 1, address: 1 },
        },
        
      },
      
    ]);

    

    // Past Appointments
    const pastAppointments = await RadioLogy.aggregate([
      {
        $match: {
          appoinmentId: { $ne: null },
          patientId: patient._id,
          orderAcceptStatus: { $ne: false },
        },
      },
      {
        $lookup: {
          from: "appoinments",
          localField: "appoinmentId",
          foreignField: "_id",
          as: "appoinments",
        },
      },
      {
        $lookup: {
          from: "patientInformation",
          localField: "patientId",
          foreignField: "_id",
          as: "patientInformation",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "operatorId",
          foreignField: "_id",
          as: "operator",
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "branchId",
          foreignField: "_id",
          as: "branch",
        },
      },
      { $unwind: { path: "$appoinments", preserveNullAndEmptyArrays: true } },
      {
        $unwind: {
          path: "$patientInformation",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unwind: { path: "$operator", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$branch", preserveNullAndEmptyArrays: true } },
      { $match: { "appoinments.startTime": { $lt: now } } },
      {
        $project: {
          _id: 1,
          orderId: 1,
          patientId: 1,
          "examList.examListModality": {
            modalityName: 1,
            examName: 1,
            examId: 1,
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
            referringConsultant: 1,
            branchId: 1,
          },
          operator: { name: 1, email: 1 },
          branch: { name: 1, email: 1, phone: 1, address: 1 },
        },
      },
   
    ]);


    return res.status(200).json({ success: true, data: {todayAppointments, declinedAppointments,upcomingAppointments,pastAppointments} });
}


