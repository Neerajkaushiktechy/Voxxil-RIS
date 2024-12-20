var cron = require('node-cron');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const EventEmitter = require('node:events');
const RadioLogy  = require('./database/models/admin/radiology');
const hbs = require('nodemailer-express-handlebars')
const path = require('path');
const User  = require('./database/models/auth/user');
const {getTime} = require('./helper/dateTimeHelper')
const { USER_ROLE } = require('./constant')
const emalEmitter = new EventEmitter();

emalEmitter.on('patientRemaindreEmail', async (patientData) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, //'email-smtp.us-west-2.amazonaws.comsmtp.gmail.com', // Amazon SES SMTP endpoint
        port: process.env.SMTP_PORT, // Port for secure SMTP
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USERNAME, // Your SMTP username
            pass: process.env.SMTP_PASSWORD // Your SMTP password
        }
    });


    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/patients/'),
    };
    transporter.use('compile', hbs(handlebarOptions))
    // Define email data
	console.log(patientData)
    const mailOptions = {
        from:  process.env.SMTP_FROM_EMAIL,
        template: "radiologyRemainder",
        to: patientData.patientEmail,
        subject: 'Email for day of Appointment',
        context: {...patientData},
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error.message);
            return;
        }
        console.log('Email cron1 sent successfully!');
    });
})

// const sendPatientRemainderMail = 


const groupBy = (items, key) => items.reduce(
	(result, item) => ({
	  ...result,
	  [item[key]]: [
		...(result[item[key]] || []),
		item,
	  ],
	}), 
	{},
  )

const todaysOrder =  async () => {
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
                "$lookup": {
                    from: "branches",
                    localField: "branchId",
                    foreignField: "_id",
                    as: "branch"
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
				  branchId:1,
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
					role:1,
                  },
				  branch: {
					name: 1,
					branch:1,
					phone:1,
					address:1
				  }
                }
              },
			  
        ]);
	
	const result = groupBy(appoinments, 'branchId')
	for(key in result) {
		const adminDetails = await User.findOne({branchId: key, role: 'admin'})
		for (let record of result[key]) {
			data = {
				branchName: record.branch?.name,
				patientName:`${record.patientInformation?.fName} ${record.patientInformation?.lName}`,
				branchAddress:record.branch?.address,
				doctorName:record.operator?.name,
				Time:getTime(record.appoinments?.startTime),
				branchPhone:record.branch?.phone,
				designation:USER_ROLE[record.operator?.role],
				// SignatureOfAdminStrator: `${process.env.SERVER_API}/api/profile/${adminDetails._id}/signature.png`,
				SignatureOfAdminStrator: `${process.env.SERVER_API}/api/profile/${adminDetails._id}/signatureImage/${adminDetails.signatureImage}`,
        patientEmail: record.patientInformation?.email
			}
			emalEmitter.emit('patientRemaindreEmail', data)
		}
	}
}

const patientRemainderJob = cron.schedule('1 6 * * *', todaysOrder);


exports.patientRemainder = () => {
  
	patientRemainderJob.start()
	// job2.start()
}
// task.start();

// new CronJob(
// 	'1 41 7 * * *', // cronTime
// 	todaysOrder, // onTick
// 	null, // onComplete
// 	true, // start
// 	'America/Los_Angeles' // timeZone
// );