import { FormControl, FormLabel, Grid, Paper, Typography } from "@mui/material"
import SelectStaff from "./SelectStaff";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

const Referring = ({ setValue, getValues,trigger }) => {
    const setReferringId = (id) => {
        setValue("referringId", id);
        trigger("referringId");
    }
    return (
        <>
            <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
                <Typography variant="h5" className='title'>Referring Clinical Signature and Others</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6} sx={{ display: "flex", flexDirection: "column" }} className='selectDropdown'>
                        <FormLabel sx={{ marginBottom: "10px" }}>Referring By</FormLabel>
                        <SelectStaff setUserData={setReferringId} defaultId={getValues()?.referringId}/>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <FormControl fullWidth >
                            <FormLabel>Date</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker className="inputfield" value={moment(getValues().referringDate)}  onChange={(date) => {setValue("referringDate",moment(date).format('YYYY-MM-DD'));trigger("referringDate")}} />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>

                </Grid>
            </Paper>

        </>
    )
}

export default Referring;