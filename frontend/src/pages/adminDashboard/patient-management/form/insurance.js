import { FormControl, Button, Grid, FormHelperText, Card, Box, Typography, FormLabel, OutlinedInput } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { postPatientInsuranceRequest, putPatientInsuranceRequest } from '../../../../redux/modules/admin/patientInsurance/slice';
import { getPatientDataRequest } from '../../../../redux/modules/admin/patientProfile/slice';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';

const validationSchema = yup.object().shape({
    insuranceNameProvider: yup.string('Insurance provider name is required'),
    insuranceId: yup.string('Insurance Id is required'),
    policyHolderName: yup.string('Policy holder name is required'),
    groupNumber: yup.string().notRequired('Group Number (If Applicable)'),
});

const Insurance = ({ itemData, formData, onNext, onBack, patientId }) => {
    const dispatch = useDispatch();
    let { getPatientDataRes } = useSelector(state => state.patientProfile);
    let { currentBranch } = useSelector(state => state.branch);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(validationSchema),

        defaultValues: formData,

    });

    useEffect(() => {
        const pId = localStorage.getItem("pId")
        if (itemData?.pId || pId || patientId) {
            dispatch(getPatientDataRequest({ type: "insurance", id: itemData?.pId ?? (pId || patientId) }));
        }

    }, [dispatch, itemData?.pId, patientId])

    useEffect(() => {
        if (getPatientDataRes?.patientData) {
            setValue('insuranceNameProvider', getPatientDataRes?.patientData?.insuranceNameProvider);
            setValue('insuranceId', getPatientDataRes?.patientData?.insuranceId);
            setValue('groupNumber', getPatientDataRes?.patientData?.groupNumber);
            setValue('policyHolderName', getPatientDataRes?.patientData?.policyHolderName);
        }
    }, [getPatientDataRes, setValue]);

    const onSubmit = (data) => {
        const pId = localStorage.getItem("pId")
        if (getPatientDataRes?.patientData) {
            dispatch(putPatientInsuranceRequest({ formData: data, _id: itemData?.pId ?? (pId || patientId) }))
        }
        else {
            dispatch(postPatientInsuranceRequest({ formData: data, branchId: currentBranch?.id, pId: patientId || pId }))
        }
        onNext({ insurance: data });
    };
    const nextStep = () => {
        onNext();
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
                <Card className='cardStyle' sx={{ marginTop: "40px" }}>
                    <Typography className='title'>Insurance Information</Typography>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Insurance Provider Name</FormLabel>
                            <FormControl fullWidth error={(errors.insuranceNameProvider)} className='inputfield'>
                                <OutlinedInput placeholder="Insurance Provider Name" fullWidth {...register('insuranceNameProvider')} />
                                {errors?.insuranceNameProvider?.message && <FormHelperText>{errors?.insuranceNameProvider?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Insurance ID</FormLabel>
                            <FormControl fullWidth error={(errors.insuranceId)} className='inputfield'>
                                <OutlinedInput placeholder="Insurance ID" fullWidth {...register('insuranceId')} />
                                {errors?.insuranceId?.message && <FormHelperText>{errors?.insuranceId?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Group Number (If Applicable)</FormLabel>
                            <FormControl fullWidth className='inputfield'>
                                <OutlinedInput placeholder="Group Number" fullWidth {...register('groupNumber')} />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Policy Holder's Name</FormLabel>
                            <FormControl fullWidth error={(errors.policyHolderName)} className='inputfield'>
                                <OutlinedInput placeholder="Policy Holder's Name" fullWidth {...register('policyHolderName')} />
                                {errors?.policyHolderName?.message && <FormHelperText>{errors?.policyHolderName?.message}</FormHelperText>}
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

export default Insurance;
