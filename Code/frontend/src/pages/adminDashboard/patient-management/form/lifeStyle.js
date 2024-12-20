import React, { useEffect, useState } from 'react';
import { FormControl, Button, Grid, FormHelperText, Card, Box, Typography, Input, FormLabel, OutlinedInput, Checkbox, FormControlLabel } from '@mui/material';
import { postPatientLifeStyleRequest, putPatientLifeStyleRequest } from '../../../../redux/modules/admin/patientLifeStyle/slice';
import { getPatientDataRequest } from '../../../../redux/modules/admin/patientProfile/slice';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const validationSchema = yup.object().shape({
    occupation: yup.string().required('Occupation is required'),
    addictions: yup.boolean().notRequired('Any Smoking/Alcohol/Substanc use (Information Required)'),
    dietHabits: yup.string().notRequired(("Not required"))
});

const LifeStyleInfo = ({ itemData, formData, onNext, onBack, patientId }) => {
    const [yes, setYes] = useState('')
    const [no, setNo] = useState('')
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

            dispatch(getPatientDataRequest({ type: "lifestyle", id: itemData?.pId ?? (pId || patientId) }))
        }

    }, [dispatch, itemData?.pId, patientId])

    useEffect(() => {
        if (getPatientDataRes?.patientData) {
            const addictionsValue = getPatientDataRes?.patientData?.addictions;
            setYes(addictionsValue === true || addictionsValue === 'true');
            setNo(addictionsValue === false || addictionsValue === 'false');
            setValue('occupation', getPatientDataRes?.patientData?.occupation);
            setValue('addictions', getPatientDataRes?.patientData?.addictions);
            setValue('dietHabits', getPatientDataRes?.patientData?.dietHabits);
        }
    }, [getPatientDataRes, setValue]);


    const onSubmit = (data) => {
        const pId = localStorage.getItem("pId")
        if (getPatientDataRes?.patientData) {
            dispatch(putPatientLifeStyleRequest({ formData: data, _id: itemData?.pId ?? (pId || patientId) }))
        }
        else {
            dispatch(postPatientLifeStyleRequest({ formData: data, branchId: currentBranch?.id, pId: patientId || pId }))
        }
        onNext({ lifeStyleInfo: data });
    };

    const nextStep = () => {
        onNext();
    }
    const handleYesChange = (event) => {
        setYes(event.target.checked);
        setNo(!event.target.checked);
    };

    const handleNoChange = (event) => {
        setNo(event.target.checked);
        setYes(!event.target.checked);
    };
    console.log(no, "noooo")
    console.log(yes, "yesisss")
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
                <Card className='cardStyle' sx={{ marginTop: "40px" }}>
                    <Typography className='title'>Lifestyle</Typography>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={6} sm={12} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} required>Occupation</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.occupation)} className='inputfield'>
                                <OutlinedInput placeholder="Occupation" fullWidth  {...register('occupation')} />
                                {errors?.occupation?.message && <FormHelperText>{errors?.occupation?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={8}>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} required>Smoking/Alcohol/Substance Use</FormLabel>
                            <Box sx={{ marginTop: "15px" }}>
                                <FormControl fullWidth error={Boolean(errors.addictions)} className='inputfield'>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...register('addictions')}
                                                value="true"
                                                checked={yes}
                                                onChange={handleYesChange}
                                            />
                                        }
                                        label="Yes"
                                    />

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...register('addictions')}
                                                value="false"
                                                checked={no}
                                                onChange={handleNoChange}
                                            />
                                        }
                                        label="No"
                                    />

                                    {errors?.addictions?.message && <FormHelperText>{errors?.addictions?.message}</FormHelperText>}
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} >Exercise And Diet Habits (Optional But Can Be Useful)</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.state)} className='inputfield'>
                                <Input fullWidth
                                    placeholder='Enter here'
                                    {...register('dietHabits')}
                                    sx={{ padding: "14px", paddingLeft: "0" }}
                                    disableUnderline
                                    multiline
                                    minRows="2" />
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

export default LifeStyleInfo;
