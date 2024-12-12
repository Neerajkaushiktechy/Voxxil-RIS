import { FormControl, Grid, FormHelperText, Paper, Typography, RadioGroup, FormControlLabel, FormLabel, Radio, OutlinedInput, TextField, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker, LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getRequest as getBranchRequest, getReferralBranch } from "../../../../redux/modules/branch/slice";
import { APPOINTMENT_CATEGORIES, GENDER } from '../../../../constants/Constant';

const Appoinment = ({ register, setValue, errors, getValues, trigger, patientGender }) => {
    const dispatch = useDispatch();
    let { getRes, currentBranch, referralBranch } = useSelector(state => state.branch);
    const [isScheduled, setIsScheduled] = useState(true);
    // const [branchsList, setBranchesList] = useState([]);
    const handleAppoinmentCategoryChange = (e) => {
        setValue('appoinmentCategory', e.target.value);
        setIsScheduled(!isScheduled);
    };

    useEffect(() => {
        if(patientGender === 'Male' || patientGender === GENDER.MALE) {
            setValue("isPregnant", false); setValue("lmp", 0);
        } else {
            setValue("isPregnant", false);
        }
    }, [patientGender])

    useEffect (()=> {
        setValue('refferToBranch', null);
        if(currentBranch?.id){
            dispatch(getReferralBranch(currentBranch?.id))
        }
    }, [currentBranch?.id])

    return (
        <>
            <Paper sx={{ padding: 2 }} className='cardStyle'>
                <Typography variant="h5" className='title'>Appointment</Typography>
                <Grid container spacing={2}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.appoinmentCategory)}>
                            <FormLabel sx={{ color: "primary.dark", marginBottom: "20px" }} required>Category</FormLabel>
                            <RadioGroup row onChange={handleAppoinmentCategoryChange} value={getValues()?.appoinmentCategory || APPOINTMENT_CATEGORIES.SCHEDULED}>
                                <FormControlLabel value={APPOINTMENT_CATEGORIES.SCHEDULED} control={<Radio />} label={APPOINTMENT_CATEGORIES.SCHEDULED} />
                                <FormControlLabel value={APPOINTMENT_CATEGORIES.WALKIN} control={<Radio />} label={APPOINTMENT_CATEGORIES.WALKIN} />
                            </RadioGroup>
                            {errors?.appoinmentCategory?.message && <FormHelperText>{errors?.appoinmentCategory?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.startTime)}  >
                            <FormLabel>Appointment Start Date and Time</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <MobileDateTimePicker className="inputfield" 
                                    disablePast
                                    slotProps={{
                                        // pass props `actions={['clear']}` to the actionBar slot
                                        actionBar: { actions: ['clear',  'accept', 'cancel'] },
                                      }}
                                    // onChange={(date) => { }} 
                                    onAccept={(date) => {
                                        const newDate = moment(date);
                                        if(newDate.isValid()){
                                            setValue("startTime", newDate.format('YYYY-MM-DD HH:mm')); trigger("startTime"); trigger("endTime") ;
                                        }else {
                                            setValue("startTime", null);
                                        }
                                        
                                    }}
                                />
                            </LocalizationProvider>
                            {errors?.startTime?.message && <FormHelperText>{errors?.startTime?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.appoinmentDuration)}  >
                            <FormLabel>Duration Time in minutes</FormLabel>
                            <OutlinedInput className="inputfield" size='small' placeholder="Duration Time in minutes"  {...register('appoinmentDuration')} />
                            {errors?.appoinmentDuration?.message && <FormHelperText>{errors?.appoinmentDuration?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.referringConsultant)}>
                            <FormLabel>Referring Consultant / GP</FormLabel>
                            <OutlinedInput className="inputfield" size='small' {...register("referId")} />
                            {errors?.referringConsultant?.message && <FormHelperText>{errors?.referringConsultant?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    {patientGender === 'female' ? (
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.isPregnant)}  >
                            <FormLabel sx={{ color: "primary.dark", marginBottom: "20px" }} required>Pregnant</FormLabel>
                            <RadioGroup row >
                                <FormControlLabel value={true} control={<Radio checked={getValues("isPregnant")} onChange={() => { setValue("isPregnant", true); trigger("isPregnant") }} />} label="Yes" />
                                <FormControlLabel value={false} control={<Radio checked={(!getValues("isPregnant") || getValues("isPregnant") === null)} />} onChange={() => { setValue("isPregnant", false); setValue("lmp", 0); trigger("isPregnant") }} label="No" />
                            </RadioGroup>
                            {errors?.isPregnant?.message && <FormHelperText>{errors?.isPregnant?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    ):null}

                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.lmp)} disabled={(!getValues("isPregnant") || getValues("isPregnant") === null)}>
                            <FormLabel>LMP week ago</FormLabel>
                            <OutlinedInput className="inputfield" size='small' {...register('lmp')} />
                            {errors?.lmp?.message && <FormHelperText>{errors?.lmp?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.referringConsultant)} >
                            <FormLabel>Exam Indication</FormLabel>
                            <TextField multiline rows={3} className="inputfield" size='small' {...register("examReason")} 
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                      paddingLeft: "0px !important",
                                    },
                                  }}
                            />
                            {errors?.examReason?.message && <FormHelperText>{errors?.examReason?.message}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth error={Boolean(errors.refferToBranch)}>
                            <FormLabel>Refer To (Branch) <span style={{color:'red'}}>*</span></FormLabel>
                            <Select {...register('refferToBranch')} size='small' defaultValue={""} className="inputfield">
                                {referralBranch?.map((item) => (
                                    currentBranch.id !== item._id? (<MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>): null
                                ))}
                            </Select>
                            {errors?.refferToBranch?.message && <FormHelperText>{errors?.refferToBranch?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}

export default Appoinment