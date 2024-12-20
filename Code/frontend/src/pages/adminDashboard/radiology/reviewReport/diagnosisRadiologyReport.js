import { Box, FormControl, FormLabel, Grid, OutlinedInput, Button, FormHelperText, Stack } from '@mui/material'
import { useEffect, useRef } from "react";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from 'react-select';
import { getReportRequest, postReportRequest, putReportRequest, resetGetReport, getSeniorRadiologistRequest } from '../../../../redux/modules/report/slice';
import { useDispatch, useSelector } from 'react-redux';
import SelectStaff from '../form/SelectStaff';
import { getRequest as getStaffRequest , getStaffList } from '../../../../redux/modules/staff/slice';

const validationSchema = yup.object().shape({
    diagnosticObjectives: yup.string(),
    findings: yup.string(),
    radiographicImpression: yup.string(),
    dcmFiles: yup.mixed(),
    appointerId: yup.string(),
    appointerSignaturePin: yup.string(),
    reportStatus: yup.string(),
    // seniorRadiologist: yup.string(),
});

export default function DiagnosisRadiologyReport({ itemData, onBack, setSaveType }) {
    const dispatch = useDispatch();
    let { currentBranch } = useSelector(state => state.branch);
    let { loading, getReportRes, getInstancesRes, getSeniorRadiologistRes } = useSelector(state => state.report);
    const formRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            reportStatus : itemData?.reportData?.reportStatus,
        },
    });

    useEffect(() => {
        if (!currentBranch) { return }
        if (itemData?.reportData) { dispatch(getReportRequest(itemData.reportData?._id)); }
        // dispatch(getSeniorRadiologistRequest())
        dispatch(getStaffRequest(""));
        dispatch(getStaffList())
    }, [dispatch, currentBranch, itemData]);
    
    useEffect(() => {
        if (getReportRes ) {
            if (getReportRes?.success) {
                setValue("appointerId", getReportRes?.data?.appointerId);
                setValue("diagnosticObjectives", getReportRes?.data?.diagnosticObjectives);
                setValue("findings", getReportRes?.data?.findings);
                setValue("radiographicImpression", getReportRes?.data?.radiographicImpression);
                // setValue("seniorRadiologist", getReportRes?.data?.seniorRadiologistId);
            }
            dispatch(resetGetReport())
        }

    }, [dispatch, getReportRes, getInstancesRes, setValue, itemData])

    const onSubmit = (data) => {
        data.radiologyId = itemData?.radiologyId;
        if (itemData?.reportData?._id) {
            data.reportId = itemData?.reportData?._id;
            dispatch(putReportRequest(data));
        } else {
            dispatch(postReportRequest(data));
        }
    };

    // const handleRadiologistSelect = (selected) => {
    //     if (selected) {
    //         setValue("seniorRadiologist", selected.value);
    //     }
    // };

    return (
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)} ref={formRef}>
            <Grid container spacing={2}>
                <Grid item lg={12} md={6} sm={6} xs={12} className='girdMarginBottom'>
                    <FormControl fullWidth className='inputfield'>
                        <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} >Diagnostic Objectives</FormLabel>
                        <OutlinedInput fullWidth
                            placeholder='Enter here'
                            sx={{ padding: "0" }}
                            {...register('diagnosticObjectives')}
                            name="diagnosticObjectives"
                            multiline
                            minRows="5" />
                        {errors?.diagnosticObjectives?.message && <FormHelperText>{errors?.diagnosticObjectives?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={12} md={6} sm={6} xs={12} className='girdMarginBottom'>
                    <FormControl fullWidth className='inputfield'>
                        <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} >Findings</FormLabel>
                        <OutlinedInput fullWidth
                            placeholder='Enter here'
                            sx={{ padding: "0" }}
                            {...register('findings')}
                            name="findings"
                            multiline
                            minRows="5" />
                        {errors?.findings?.message && <FormHelperText>{errors?.findings?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={12} md={6} sm={6} xs={12} className='girdMarginBottom'>
                    <FormControl fullWidth className='inputfield'>
                        <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Radiographic Impression</FormLabel>
                        <OutlinedInput fullWidth
                            placeholder='Enter here'
                            sx={{ padding: "0" }}
                            {...register('radiographicImpression')}
                            name="radiographicImpression"
                            multiline
                            minRows="5" />
                        {errors?.radiographicImpression?.message && <FormHelperText>{errors?.radiographicImpression?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth className='selectDropdown' >
                        <FormLabel sx={{ marginBottom: "10px" }} >Appointer</FormLabel>
                        <SelectStaff setUserData={(id) => {
                            setValue("appointerId", id);
                            trigger("appointerId")
                        }} defaultId={getValues()?.appointerId} />
                        {errors?.appointerId?.message && <FormHelperText>{errors?.appointerId?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <FormLabel >Enter Appointer Signature Pin</FormLabel>
                        <OutlinedInput className="inputfield" name="appointerSignaturePin" type="password" size='small' {...register("appointerSignaturePin")} />
                        {errors?.appointerSignaturePin?.message && <FormHelperText>{errors?.appointerSignaturePin?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                {/* <Grid item lg={6} md={6} sm={6} xs={12} >
                    <FormControl fullWidth className='selectDropdown'>
                        <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} >Assigned to Senior Radiologist</FormLabel>
                        <Select
                            {...register("seniorRadiologist")}
                            value={getValues("seniorRadiologist")}
                            autoFocus={false}
                            onChange={handleRadiologistSelect}
                            options={getSeniorRadiologistRes?.data.map((item) => ({ value: item._id, label: item.name }))}
                            getOptionLabel={(option) => `${option?.label}`}
                            isSearchable={true}
                            placeholder="Select an Radiologist" />
                        {errors?.seniorRadiologist?.message && <FormHelperText>{errors?.seniorRadiologist?.message}</FormHelperText>}
                    </FormControl>
                </Grid> */}
            </Grid>
            <Stack direction={"row"} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", justifyContent: "left", paddingTop: "20px", marginTop: "20px" }}>
                    <Button onClick={onBack} type="submit" className='commonBtn' variant="contained" disabled={loading}>{loading ? "loading..." : "Back"}</Button>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", paddingTop: "20px", marginTop: "20px" }}>
                    { itemData?.reportData?.reportStatus === "completed" 
                        ?
                        <Button type="submit" onClick={() => { setSaveType("exit") }} className='commonBtn' variant="contained" disabled={loading}>{loading ? "loading..." : "Update"}</Button>
                        :
                        <>
                            <Button sx={{ right: "20px" }} type="submit" onClick={() => { setSaveType("exit") }} className='commonBtn' variant="contained" disabled={loading}>{loading ? "loading..." : "Save"}</Button>
                            <Button type="submit" onClick={() => { setValue("reportStatus","completed"); setSaveType("exit") }} className='commonBtn' variant="contained" disabled={loading}>{loading ? "loading..." : "Submit"}</Button>
                        </>
                    }
                </Box>
            </Stack>
        </Box>
    )
}
