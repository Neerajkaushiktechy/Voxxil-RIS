
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, FormLabel, OutlinedInput, Button, Grid, FormHelperText, Select, MenuItem, Chip, Box, Typography } from "@mui/material";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import { postPatientInformationRequest, resetPostPatientInformation } from "../../../../redux/modules/admin/patientInformation/slice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { GENDER } from "../../../../constants/Constant";

const validationSchema = yup.object().shape({
    fName: yup.string().required('First Name is required'),
    lName: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    dob: yup.string().required('Date of Birth is required'),
    gender: yup.string().required('Gender is required'),
});

const AddPatient = ({ openAddPatientModal, setOpenAddPatientModal, setPatient }) => {
    const dispatch = useDispatch();
    const [selectedFiles, setSelectedFiles] = useState([]);
    let { postRes } = useSelector(state => state.patientInformation);
    let { currentBranch } = useSelector(state => state.branch);
    const { register, handleSubmit, formState: { errors }, getValues, setValue,trigger } = useForm({
        defaultValues: {
            dob: moment(new Date()).format('YYYY-MM-DD')
        },
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (!postRes) { return }
        toast(postRes?.message);
        if (postRes) { setOpenAddPatientModal(false); }
        if (postRes?.success) {
            setPatient({ ...postRes.patientdata, imagingStudies: postRes?.imagingStudies || [] })
        }
        dispatch(resetPostPatientInformation());
    }, [dispatch, postRes, setPatient, setOpenAddPatientModal]);

    const handleFileInputChange = (e) => {
        setSelectedFiles([...e.target.files]);
    };

    const handleFileDelete = (chipToDelete) => () => {
        setSelectedFiles((chips) => chips.filter((chip) => chip.name !== chipToDelete.name));
    };

    const onSubmit = (data) => {
        let fileFormData = new FormData();
        for (const file of selectedFiles) {
            fileFormData.append("imagingStudies", file);
        }
        dispatch(postPatientInformationRequest({ fileFormData, formData: data, branchId: currentBranch?.id }))
    };

    return (
        <Dialog
            fullWidth={true}
            maxWidth={"lg"}
            open={openAddPatientModal}
            onClose={() => { setOpenAddPatientModal(!openAddPatientModal) }}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">
                Add New Patient
            </DialogTitle>
            <DialogContent >
                <Grid container spacing={2}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.fName)} >
                            <FormLabel>First Name</FormLabel>
                            <OutlinedInput className="inputfield" size='small' placeholder="First Name"  {...register('fName')} />
                            {errors?.fName?.message && <FormHelperText>{errors?.fName?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.lName)} >
                            <FormLabel>Last Name</FormLabel>
                            <OutlinedInput className="inputfield" size='small' placeholder="Last Name"  {...register('lName')} />
                            {errors?.lName?.message && <FormHelperText>{errors?.lName?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.email)} >
                            <FormLabel>Email</FormLabel>
                            <OutlinedInput className="inputfield" size='small' placeholder="Email"  {...register('email')} />
                            {errors?.email?.message && <FormHelperText>{errors?.email?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.dob)} >
                            <FormLabel>Dob</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker className="inputfield" disableFuture={true} format="DD-MM-YYYY" value={moment(getValues().dob)} onChange={(date) => { setValue("dob", moment(date).format('YYYY-MM-DD')); trigger("dob") }} />
                            </LocalizationProvider>
                            {errors?.dob?.message && <FormHelperText>{errors?.dob?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.gender)} >
                            <FormLabel>Gender</FormLabel>
                            <Select {...register('gender')} size='small' defaultValue={GENDER.MALE} className="inputfield">
                                <MenuItem value={GENDER.MALE}>Male</MenuItem>
                                <MenuItem value={GENDER.FEMALE}>Female</MenuItem>
                                <MenuItem value={GENDER.OTHER}>Other</MenuItem>
                            </Select>
                            {errors?.gender?.message && <FormHelperText>{errors?.gender?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <FormLabel sx={{ marginBottom: "14px" }}>Previous X-Rays or Scans</FormLabel>
                            {selectedFiles.length > 0 && (
                                <div style={{ marginBottom: "10px" }}>
                                    {selectedFiles.map((item, index) => (
                                        <Chip key={index} label={item.name} sx={{ fontSize: "18px", marginBottom: "10px", marginRight: "10px" }}
                                            onDelete={handleFileDelete(item)}
                                        />
                                    ))}
                                </div>
                            )}
                            <Box sx={{ borderRadius: "6px", border: "1px dashed #797878", height: "160px", textAlign: "center", position: "relative" }} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Box>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "12px" }}>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M19.4286 0C20.0598 0 20.5714 0.511675 20.5714 1.14286V3.42857H22.8571C23.4883 3.42857 24 3.94025 24 4.57143C24 5.20261 23.4883 5.71429 22.8571 5.71429H20.5714V8C20.5714 8.63118 20.0598 9.14286 19.4286 9.14286C18.7974 9.14286 18.2857 8.63118 18.2857 8V5.71429H16C15.3688 5.71429 14.8571 5.20261 14.8571 4.57143C14.8571 3.94025 15.3688 3.42857 16 3.42857H18.2857V1.14286C18.2857 0.511675 18.7974 0 19.4286 0Z" fill="#BABABA" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12.5714 1.14286H3.42857C2.51926 1.14286 1.64719 1.50408 1.00421 2.14706C0.361224 2.79004 0 3.66212 0 4.57143V16.5714C0 16.6697 0.0125715 16.7657 0.0365715 16.8571C0.0123799 16.9505 9.17666e-05 17.0465 0 17.1429V20.5714C0 21.4807 0.361224 22.3528 1.00421 22.9958C1.64719 23.6388 2.51926 24 3.42857 24H19.4286C20.3379 24 21.21 23.6388 21.8529 22.9958C22.4959 22.3528 22.8571 21.4807 22.8571 20.5714V12.5714C22.8571 12.475 22.8448 12.379 22.8206 12.2857C22.8448 12.1924 22.8571 12.0964 22.8571 12V11.4286H20.5714V11.4469C15.6606 11.6057 12.1143 12.7886 9.62286 14.4446C10.5669 14.7794 11.6229 15.256 12.6583 15.88C14.2571 16.84 15.8823 18.1886 16.976 19.9749C17.0543 20.1029 17.1067 20.2451 17.1301 20.3933C17.1535 20.5416 17.1474 20.693 17.1123 20.8389C17.0772 20.9848 17.0137 21.1224 16.9254 21.2438C16.8371 21.3652 16.7257 21.4679 16.5977 21.5463C16.4697 21.6246 16.3275 21.677 16.1792 21.7004C16.031 21.7238 15.8796 21.7177 15.7337 21.6826C15.5877 21.6475 15.4502 21.5839 15.3288 21.4957C15.2074 21.4074 15.1046 21.296 15.0263 21.168C14.1851 19.7931 12.88 18.6789 11.4811 17.8389C10.0846 17 8.664 16.4766 7.67886 16.248C6.2911 15.9311 4.87014 15.783 3.44686 15.8069H3.42171C3.024 15.8126 2.64457 15.8297 2.28571 15.8583V4.57143C2.28571 4.26832 2.40612 3.97763 2.62045 3.76331C2.83478 3.54898 3.12547 3.42857 3.42857 3.42857H12.5714V1.14286ZM7.42857 5.71429C6.80553 5.71894 6.19873 5.9135 5.68914 6.272C5.03771 6.74057 4.57143 7.51314 4.57143 8.57143C4.57143 9.62971 5.03771 10.4011 5.68914 10.8697C6.1984 11.229 6.80534 11.424 7.42857 11.4286C7.89714 11.4286 8.57486 11.2971 9.168 10.8697C9.81943 10.4011 10.2857 9.62971 10.2857 8.57143C10.2857 7.51314 9.81943 6.74171 9.168 6.272C8.65861 5.91311 8.05168 5.71851 7.42857 5.71429Z" fill="#BABABA" />
                                    </svg>
                                    <Typography>Upload File</Typography>
                                </Box>
                                <input type="file" multiple accept=".doc,.docx,.pdf" onChange={handleFileInputChange} style={{ position: "absolute", height: "100%", width: "100%", opacity: "0" }} />
                            </Box>

                            {errors?.imagingStudies && (<FormHelperText error>{errors?.imagingStudies.message}</FormHelperText>)}
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button className="commonBtn" onClick={() => { setOpenAddPatientModal(!openAddPatientModal) }}>Cancel</Button>
                <Button className="commonBtn" type="submit" onClick={handleSubmit(onSubmit)}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddPatient;