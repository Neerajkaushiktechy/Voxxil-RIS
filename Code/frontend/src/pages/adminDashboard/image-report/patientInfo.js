import { Card, Grid, Typography } from '@mui/material'
import React from 'react'

const PatientInfo = ({patient}) => {
  return (
    <Card className='cardStyle' sx={{ marginTop: "40px" }}>
      <Typography className='title'>Patient Information</Typography>
      <Grid container spacing={2}>
        <Grid item sm={2} xs={6} >
          <Typography color="text.secondary">First Name</Typography>
          <Typography>{patient?.fName}</Typography>
        </Grid>
        <Grid item sm={2} xs={6} >
          <Typography color="text.secondary">Last Name</Typography>
          <Typography>{patient?.lName}</Typography>
        </Grid>

        <Grid item sm={4} xs={6} className='girdMarginBottom'>
          <Typography color="text.secondary">Email Address</Typography>
          <Typography>{patient?.email}</Typography>
        </Grid>
        <Grid item sm={2} xs={6}>
          <Typography color="text.secondary">Gender</Typography>
          <Typography>{patient?.gender}</Typography>
        </Grid>
        <Grid item sm={2} xs={6} >
          <Typography color="text.secondary">D.O.B</Typography>
          <Typography>{patient?.dob}</Typography>
        </Grid>
        <Grid item xs={6} >
          <Typography color="text.secondary">Patient ID</Typography>
          <Typography>{patient?.orthancPatientId}</Typography>
        </Grid>
      </Grid>
    </Card>
  )
}

export default PatientInfo