import React, { useEffect, useState } from 'react';
import { FormControl, Button, Grid, FormHelperText, Card, Select, MenuItem, Box, Typography, FormLabel, OutlinedInput } from '@mui/material';
import { useForm } from 'react-hook-form';
import { postPatientPhysicianRequest, putPatientPhysicianRequest } from '../../../../redux/modules/admin/patientPhysician/slice';
import { getPatientDataRequest } from '../../../../redux/modules/admin/patientProfile/slice';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';

const validationSchema = yup.object().shape({
    physicianName: yup.string().required('Referring physician name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.number().typeError('Valid Phone Number is required').test('len', '* Min 7 to 15 numbers', (val) => val.toString().length >= 7 && val.toString().length <= 15).required('Phone number is required'),
    address: yup.string().required('Referring physician address is required'),
    methodOfCommunication: yup.string().required('Preferred method of communication is required')
});

const Physician = ({ itemData, formData, onNext, onBack, patientId }) => {
    const dispatch = useDispatch();
    const [communicationMethod, setommunicationMethod] = useState('')
    let { currentBranch } = useSelector(state => state.branch);
    let { getPatientDataRes } = useSelector(state => state.patientProfile);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: formData,
    });

    useEffect(() => {
        const pId = localStorage.getItem("pId")
        if (itemData?.pId || pId || patientId) {
            dispatch(getPatientDataRequest({ type: "physician", id: itemData?.pId ?? (pId || patientId) }))
        }

    }, [dispatch, itemData?.pId, patientId])

    useEffect(() => {
        if (getPatientDataRes?.patientData) {
            setValue('physicianName', getPatientDataRes?.patientData?.physicianName);
            setValue('phone', getPatientDataRes?.patientData?.phone);
            setValue('email', getPatientDataRes?.patientData?.email);
            setValue('address', getPatientDataRes?.patientData?.address);
            setValue('methodOfCommunication', getPatientDataRes?.patientData?.methodOfCommunication);
            setommunicationMethod(getPatientDataRes?.patientData?.methodOfCommunication)
        }
    }, [getPatientDataRes, setValue]);

    const onSubmit = (data) => {
        const pId = localStorage.getItem("pId")
        if (getPatientDataRes?.patientData) {
            data.methodOfCommunication = communicationMethod
            dispatch(putPatientPhysicianRequest({ formData: data, _id: itemData?.pId ?? (pId || patientId) }))
        }
        else {
            dispatch(postPatientPhysicianRequest({ formData: data, branchId: currentBranch?.id, pId: patientId || pId }))
        }
        onNext({ physician: data });
    };

    const nextStep = () => {
        onNext();
    }
    const handleChange = (event) => {
        setommunicationMethod(event.target.value);
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
                <Card className='cardStyle' sx={{ marginTop: "40px" }}>
                    <Typography className='title'>Referring Physician Information (If Applicable)</Typography>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} required>Referring Physician's Name</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.physicianName)} className='inputfield'>
                                <OutlinedInput placeholder="Referring Physician's Name" fullWidth {...register('physicianName')} />
                                {errors?.physicianName?.message && <FormHelperText>{errors?.physicianName?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} required>Phone Number</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.phone)} className='inputfield'>
                                <OutlinedInput placeholder="Phone Number" fullWidth {...register('phone')} />
                                {errors?.phone?.message && <FormHelperText>{errors?.phone?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} required>Email Address</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.email)} className='inputfield'>
                                <OutlinedInput placeholder="Email Address" fullWidth {...register('email')} />
                                {errors?.email?.message && <FormHelperText>{errors?.email?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} required>Referring Physician's Address</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.address)} className='inputfield'>
                                <OutlinedInput placeholder="Referring Physician's Address" fullWidth {...register('address')} />
                                {errors?.address?.message && <FormHelperText>{errors?.address?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} required>Preferred Method of Communication</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.methodOfCommunication)} className='inputfield'>
                                <Select fullWidth {...register('methodOfCommunication')} value={communicationMethod}
                                    onChange={handleChange} >
                                    <MenuItem value="Video call">Video call</MenuItem>
                                    <MenuItem value="Voice call">Voice call</MenuItem>
                                </Select>
                                {errors?.methodOfCommunication?.message && <FormHelperText>{errors?.methodOfCommunication?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} marginTop={'40px'}>
                <Button onClick={onBack} className='commonBtn'>
                    Back
                </Button>
                <Box display={'flex'} flexDirection={'row'} alignItems={'left'} justifyContent={'space-between'}>
                    <Button type='submit' className='commonBtn' >
                        {getPatientDataRes?.patientData ? "Update and Next" : "Save and Next"}
                    </Button>
                    <Button className='commonBtn' sx={{ ml: 2 }} onClick={nextStep}>
                        Next
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default Physician;
