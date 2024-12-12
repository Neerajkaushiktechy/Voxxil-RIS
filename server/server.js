const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors')
const dbconnect = require('./database/dbConnect');
const routing = require('./routing');
const patientRemainder = require('./patientRemainderCron')

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/", routing);


app.listen(process.env.PORT, () => {
    patientRemainder;
    dbconnect;
    console.log("server is connected")
})

