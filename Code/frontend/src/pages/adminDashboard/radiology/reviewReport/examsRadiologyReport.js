import { Box, FormControl, FormLabel, Grid, OutlinedInput, Button, FormHelperText, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from "react";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from 'react-select';
import { getReportRequest, postReportRequest, putReportRequest, resetGetReport } from '../../../../redux/modules/report/slice';
import { useDispatch, useSelector } from 'react-redux';
import { USER_ROLE_DEFAULT } from '../../../../constants/Constant';

const validationSchema = yup.object().shape({
    completedExam: yup.array(),
    clinicalInfo: yup.string(),
    lmp: yup.number(),
    reportStatus: yup.string(),

});

export default function ExamsRadiologyReport({ itemData, setSaveType }) {
    const dispatch = useDispatch();
    let { currentBranch } = useSelector(state => state.branch);
    let { userData } = useSelector(state => state.auth);
    let { loading, getReportRes } = useSelector(state => state.report);
    const formRef = useRef(null);
    const [completedExam, setCompletedExam] = useState(itemData.examList ? itemData.examList.map((item) => item.list).flat() : null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            // lmp: itemData?.lmp || "N/A",
            lmp: itemData?.lmp,
            completedExam: completedExam.map(item => item._id),
            reportStatus : itemData?.reportData?.reportStatus,
        },
    });

    useEffect(() => {
        if (!currentBranch) { return }
        if (itemData.reportData) { dispatch(getReportRequest(itemData.reportData?._id)); }
    }, [dispatch, currentBranch, itemData]);

    useEffect(() => {
        if (getReportRes) {
            if (getReportRes?.success) {
                const completedExam = getReportRes?.data?.completedExam
                let examData = itemData.examList.map((item) => item.list).flat();
                let completedExamObj =  examData.filter(item=> completedExam.includes(item._id))
                setCompletedExam(completedExamObj);
                setValue("completedExam", completedExam);
                setValue("clinicalInfo", getReportRes?.data?.clinicalInfo);
            }
            dispatch(resetGetReport())
        }
    }, [dispatch, getReportRes, setValue, itemData])

    const handlepatientSelect = (selected) => {
        if (selected) {
            setCompletedExam(selected)
            setValue("completedExam", selected.map(item => item._id));
        }
    };

    const onSubmit = (data) => {
        data.radiologyId = itemData?.radiologyId;
        if (itemData?.reportData?._id) {
            data.reportId = itemData?.reportData?._id;
            dispatch(putReportRequest(data));
        } else {
            dispatch(postReportRequest(data));
        }
    };
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            height: state.isDisabled ? '56px' : 'auto',
            minHeight: '56px'
        }),
    };
    return (
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)} ref={formRef}>
            <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={6} xs={12} >
                    <FormControl fullWidth className='selectDropdown'>
                        <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Exams Completed</FormLabel>
                        <Select
                            isDisabled={userData.role === USER_ROLE_DEFAULT.PATIENT ? true :false}
                            value={completedExam}
                            autoFocus={false}
                            isMulti={true}
                            onChange={handlepatientSelect}
                            options={itemData.examList.map((item) => item.list).flat() || []}
                            getOptionValue={(option) => option._id}
                            getOptionLabel={(option) => `${option?.name}`}
                            isSearchable={true}
                            placeholder="Select a Exam" 
                            styles={selectStyles}
                            />
                        {errors?.completedExam?.message && <FormHelperText>{errors?.completedExam?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12} className='girdMarginBottom'>
                    <FormControl fullWidth className='inputfield' sx={{ marginTop: "0!important" }}>
                        <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>LMP</FormLabel>
                        {itemData?.lmp===0 ? <Typography sx={{border: '0.5px solid #c1c1c1', padding: '10px 5px', borderRadius: '5px'}}>N/A</Typography>:<OutlinedInput readOnly placeholder='Enter here' name="lmp" fullWidth {...register('lmp')} />}
                        {errors?.lmp?.message && <FormHelperText>{errors?.lmp?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={12} md={6} sm={6} xs={12} className='girdMarginBottom'>
                    <FormControl fullWidth className='inputfield' sx={{ marginTop: "0!important" }}>
                        <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Clinical Details</FormLabel>
                        <TextField multiline rows={4} placeholder='Enter here' name="clinicalInfo" fullWidth {...register('clinicalInfo')}  disabled={userData.role === USER_ROLE_DEFAULT.PATIENT ? true :false}/>
                        {errors?.clinicalInfo?.message && <FormHelperText>{errors?.clinicalInfo?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
            </Grid>
            {userData.role !== USER_ROLE_DEFAULT.PATIENT &&
            <Box sx={{ display: "flex", justifyContent: "space-between", paddingTop: "20px", marginTop: "20px" }}>
                <Button type="submit" onClick={() => { setSaveType("exit") }} className='commonBtn' variant="contained" disabled={loading}>
                    {loading ? "loading..." : 
                    itemData?.reportData?.reportStatus === "completed" ? "Update And Exit" : "Save And Exit"}
                    </Button>
                <Button type="submit" onClick={() => { setSaveType("next") }} className='commonBtn' variant="contained" disabled={loading}>
                    {loading ? "loading..." : 
                     itemData?.reportData?.reportStatus === "completed" ? "Update And Next" :"Save and Next"}
                </Button>
            </Box>
            }
        </Box>
    )
}
