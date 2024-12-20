import React, { useEffect, useState } from 'react';
import { FormControl, Button, Grid, FormHelperText, Card, Box, Typography, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import { postPatientAcknowledgementRequest, putPatientAcknowledgementRequest } from '../../../../redux/modules/admin/patientAcknowledgement/slice';
import { getPatientDataRequest } from '../../../../redux/modules/admin/patientProfile/slice';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';
const validationSchema = yup.object().shape({
    acknowledgement: yup.array().transform((value, originalValue) => {
        return originalValue ? originalValue : [];
    }).min(1, 'Select at least one checkbox'),
});



const Acknowledgement = ({ itemData, formData, onNext, onBack, patientId }) => {
    const dispatch = useDispatch();
    const [receivedNotice, setReceivedNotice] = useState('')
    const [haveCopy, setHaveCopy] = useState('')
    const [refusedReceipt, setRefusedReceipt] = useState('')
    let { getPatientDataRes } = useSelector(state => state.patientProfile);
    let { currentBranch } = useSelector(state => state.branch);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: formData,
    });

    useEffect(() => {
        const pId = localStorage.getItem("pId")
        if (itemData?.pId || pId || patientId) {
            dispatch(getPatientDataRequest({ type: "acknowledgement", id: itemData?.pId ?? (pId || patientId) }))
        }

    }, [dispatch, itemData?.pId, patientId])

    useEffect(() => {
        if (getPatientDataRes?.patientData) {
            if (getPatientDataRes?.patientData?.acknowledgement) {
                setReceivedNotice(getPatientDataRes?.patientData?.acknowledgement[0])
                setHaveCopy(getPatientDataRes?.patientData?.acknowledgement[0])
                setRefusedReceipt(getPatientDataRes?.patientData?.acknowledgement[0])
                setValue('acknowledgement', getPatientDataRequest?.patientData?.acknowledgement[0])
            }
        }
    }, [getPatientDataRes, setValue]);



    const onSubmit = (data) => {
        const pId = localStorage.getItem("pId")
        if (getPatientDataRes?.patientData) {
            dispatch(putPatientAcknowledgementRequest({ formData: data, _id: itemData?.pId ?? (pId || patientId) }))
        }
        else {
            dispatch(postPatientAcknowledgementRequest({ formData: data.acknowledgement || [], branchId: currentBranch?.id, pId: patientId || pId }))
        }
        onNext({ acknowledgement: data.acknowledgement || [] });
    };

    const handleChange = (fieldName) => () => {
        switch (fieldName) {
            case "receivedNotice":
                if (receivedNotice === "receivedNotice") {
                    setReceivedNotice("");
                } else {
                    setReceivedNotice("receivedNotice");
                }
                break;
            case "alreadyHaveCopy":
                if (haveCopy === "alreadyHaveCopy") {
                    setHaveCopy("");
                } else {
                    setHaveCopy("alreadyHaveCopy");
                }
                break;
            case "refusedReceipt":
                if (refusedReceipt === "refusedReceipt") {
                    setRefusedReceipt("");
                } else {
                    setRefusedReceipt("refusedReceipt");
                }
                break;
            default:
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
                <Card className='cardStyle' sx={{ marginTop: "40px" }}>
                    <Typography className='title'>Consent & Acknowledgements</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>By checking one of the boxes below, I acknowledge :<span ariaHidden="true" className="MuiFormLabel-asterisk css-wgai2y-MuiFormLabel-asterisk">&thinsp;*</span></Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={Boolean(errors.acknowledgement)}>
                                <FormGroup sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...register('acknowledgement')}
                                                value="receivedNotice"
                                                checked={receivedNotice === "receivedNotice"}
                                                onChange={handleChange("receivedNotice")}
                                            />
                                        }
                                        label="Patient has signed Policy Documents"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...register('acknowledgement')}
                                                value="alreadyHaveCopy"
                                                checked={haveCopy === "alreadyHaveCopy"}
                                                onChange={handleChange("alreadyHaveCopy")}
                                            />
                                        }
                                        label="Patient has refused to sign Policy Documents"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...register('acknowledgement')}
                                                value="refusedReceipt"
                                                checked={refusedReceipt === "refusedReceipt"}
                                                onChange={handleChange("refusedReceipt")}
                                            />
                                        }
                                        label="Patient has not received Policy Documents"
                                    />
                                </FormGroup>
                                {errors?.acknowledgement?.message && <FormHelperText>{errors?.acknowledgement?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} marginTop={'40px'}>
                <Button onClick={onBack} className='commonBtn'>
                    Back
                </Button>
                <Box display={'flex'} flexDirection={'row'} alignItems={'left'} justifyContent={'space-between'} >
                    <Button type='submit' className='commonBtn' >
                        {getPatientDataRes?.patientData ? "Update and Exit" : "Save and Exit"}
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default Acknowledgement;
