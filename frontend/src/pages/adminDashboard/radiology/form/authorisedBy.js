import { FormControl, FormLabel, Grid, Paper, FormHelperText } from '@mui/material'
import React from 'react'
import SelectStaff from './SelectStaff';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

const AuthorisedBy = ({ register, setValue, getValues, trigger, errors }) => {

    const setAuthor = (id) => {
        setValue("authorisedId", id);
    }
    const setOperator = (id) => {
        setValue("operatorId", id)
    }
    return (
        <>
            <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
                <Grid container spacing={2}>
                    <Grid item xs={6} sx={{ display: "flex", flexDirection: "column" }} className='selectDropdown'>
                        <FormLabel sx={{ marginBottom: "10px" }}>Authorised By</FormLabel>
                        <SelectStaff setUserData={setAuthor} defaultId={getValues()?.authorisedId} />
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <FormControl fullWidth >
                            <FormLabel>Date</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker className="inputfield" value={moment(getValues().authorisedDate)} onChange={(date) => { setValue("authorisedDate", moment(date).format('YYYY-MM-DD')); trigger("authorisedDate") }} />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} sx={{ display: "flex", flexDirection: "column" }} className='selectDropdown'>
                        <FormLabel sx={{ marginBottom: "10px" }}>Operator/(MIT)</FormLabel>
                        <SelectStaff setUserData={setOperator} defaultId={getValues()?.operatorId} />
                        {errors?.operatorId?.message && <FormHelperText>{errors?.operatorId?.message}</FormHelperText>}
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <FormControl fullWidth >
                            <FormLabel>Date</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker className="inputfield" value={moment(getValues().operatorDate)} onChange={(date) => { setValue("operatorDate", moment(date).format('YYYY-MM-DD')); trigger("operatorDate") }} />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}

export default AuthorisedBy