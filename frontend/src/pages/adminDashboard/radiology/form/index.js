import React, { useEffect, useState } from 'react';
import { FormControl, Button, Grid, Paper, Typography, RadioGroup, FormControlLabel, Radio, OutlinedInput, Box, Stack, Checkbox, DialogContent, DialogTitle, Dialog } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { getIdRequest, getRadiologyAppointmentData, postRequest, putRequest, resetIdGet, resetPost, resetPut, setRadiologyAppoinmentId } from '../../../../redux/modules/radiology/slice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Appoinment from './appoinment';
import Patient from './patient';
import AuthorisedBy from './authorisedBy';
import Appointer from './appointer';
import Referring from './referring';
import ExamData from './examData';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import moment from 'moment';
import { getRequest as getStaffRequest, getStaffList } from '../../../../redux/modules/staff/slice';
import InvalidModalityModal from './InvalidModalityModal';

const validationSchema = yup.object().shape({
    appoinmentCategory: yup.string().required("Category is required"),
    
    referringConsultant: yup.string(),
    startTime: yup.date()
    // .transform(parseDateString)
    .typeError("Appoinment Date is required")
    .required("Appoinment Date is required"),
    appoinmentDuration: yup.number().typeError('Duration must be a number').min(0, 'Duration must be a positive number').required('Duration is required'),
    referId: yup.string().nullable(),
    isPregnant: yup.boolean().required("pregnant is required"),
    lmp: yup.number().typeError('Lmp must be a number').min(0, 'Lmp must be a positive number').required("Lmp is required"),
    examReason: yup.string(),

    examList: yup.array().test('atLeastOneSelected', 'At least one value must be selected in the exam list', function (value) {
        return value && value.length > 0;
    }),

    patientId: yup.string().required("Patient is required"),

    isCorrectPatient: yup.boolean(),
    correctPatientValue: yup.string(),

    isCorrectSide: yup.boolean(),
    correctSideValue: yup.string(),

    isCorrectProcedure: yup.boolean(),
    correctProcedureValue: yup.string(),

    contrastValue: yup.string().nullable(),
    allergiesDetails: yup.string(),

    referringId: yup.string(),
    referringDate: yup.string(),

    authorisedId: yup.string().nullable(),
    authorisedDate: yup.string(),
    operatorId: yup.string().required("Operator field is required"),   //.nullable(),
    operatorDate: yup.string(),

    appointerId: yup.string().nullable(),
    appointerSignaturePin: yup.string(),

});



const RadiologyForm = ({ itemData, toggleList, appoinmentDate = false,setItemData }) => {
    const dispatch = useDispatch();

    let navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [unselectedModalityExams, setUnselectedModalityExams] = useState([]);
    const [displayErrorExamModal, setDisplayErrorExamModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState({});
    let { loading, postRes, putRes, getIdRes, radiologyAppoinmentId } = useSelector(state => state.radiology);
    const { register, handleSubmit, formState: { errors }, setValue, getValues, trigger,clearErrors } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues:
        {
            startTime: appoinmentDate ? moment(appoinmentDate) : moment().format('YYYY-MM-DD HH:mm'),
            appoinmentCategory: "Scheduled", isPregnant: true,
            lmp: 0,
            referringDate: moment().format('YYYY-MM-DD'),
            authorisedDate: moment().format('YYYY-MM-DD'),
            operatorDate: moment().format('YYYY-MM-DD'),
            contrastValue: "true",
        }
    });

    useEffect(() => {
        if (!getIdRes) { return }
        if(getIdRes && getIdRes?.status === 404) {
            toggleList();
            return;
        }
        if (!getIdRes?.success) {
            toast(getIdRes?.message)
        }

        if (getIdRes?.data?._id) {
            const { data } = getIdRes;

            for (let i in data) {
                setValue(i, data[i]);
            }
            for (let i in data.appoinmentId) {
                if (i === "lmp" && data.appoinmentId[i] === null) {
                    setValue(i, 0);
                } else {
                    setValue(i, data.appoinmentId[i]);
                }
            }

            setValue('_id', data?._id);
            setValue('examList', data?.examList);
            setValue('appoinmentId', data?.appoinmentId?._id);
            setValue('referringId', data?.referringSignatureId?._id);

            // setValue('appoinmentDate', moment.utc(data.appoinmentId?.appoinmentDate).format('YYYY-MM-DD'));

            setValue('startTime', moment(data.appoinmentId?.startTime).format('YYYY-MM-DD HH:mm'));
            setValue('endTime', moment(data.appoinmentId?.endTime).format('YYYY-MM-DD HH:mm'));

            setValue('referringDate', moment.utc(data?.referringDate).format('YYYY-MM-DD'));
            setValue('authorisedDate', moment.utc(data?.authorisedDate).format('YYYY-MM-DD'));
            setValue('operatorDate', moment.utc(data?.operatorDate).format('YYYY-MM-DD'));

            setValue('patientId', data?.patientId?._id);

            data?.appoinmentId?.referId?._id && setValue('referId', data?.appoinmentId?.referId?._id);
            data?.authorisedId?._id && setValue('authorisedId', data?.authorisedId?._id);
            data?.operatorId?._id && setValue('operatorId', data?.operatorId?._id);
            data?.appointerId?._id && setValue('appointerId', data?.appointerId?._id);

            setSpecialInstructions({
                isCorrectPatient: data.isCorrectPatient,
                isCorrectSide: data.isCorrectSide,
                isCorrectProcedure: data.isCorrectProcedure,
            })
            dispatch(resetIdGet());
            dispatch(setRadiologyAppoinmentId(false));
        }
    }, [dispatch, getIdRes, setValue, toggleList]);

    const [specialInstructions, setSpecialInstructions] = useState({
        isCorrectPatient: false,
        isCorrectSide: false,
        isCorrectProcedure: false
    });

    const updateSpecialInstructions = (key) => {
        setSpecialInstructions(prevalue => {
            return { ...prevalue, [key]: !prevalue[key] }
        })
    }

    useEffect(() => {
        if (itemData?.id) {
            dispatch(getIdRequest(itemData.id));
        }
        dispatch(getStaffRequest(""));
        dispatch(getStaffList())
    }, [dispatch, itemData])



    useEffect(() => {
        if (radiologyAppoinmentId) {
            dispatch(getRadiologyAppointmentData(radiologyAppoinmentId))
        }
    }, [dispatch, radiologyAppoinmentId])

    useEffect(() => {
        if (postRes) {
            if (postRes?.success) {
                toggleList()
            }
            toast(postRes?.message)
            dispatch(resetPost());
        }
        if (putRes) {
            if (putRes?.success) {
                toggleList();
            }
            toast(putRes?.message);
            dispatch(resetPut());
        }
    }, [postRes, putRes, toggleList, navigate, dispatch]);

    const validateExamList = async (data) => {
        let examList = data?.examList;
        let flag = true;
        let invalidExamList = [];
        for (let exam of examList){
            const list = exam.examListModality.map(elm => elm.examId);
            exam.list.map(el => {
                if(!list.includes(el._id)){
                    flag = false;
                    invalidExamList.push(el.name)
                }
            })
        }
        setUnselectedModalityExams(invalidExamList);
        setDisplayErrorExamModal(!flag)
        return flag
    }

    const onSubmit = async (data) => {
        const isValid = await validateExamList(data)
        if(isValid){
            if (itemData?.id || getValues()?._id) {
                dispatch(putRequest(data));
            } else {
                dispatch(postRequest(data));
            }
        }
    };

    return (
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
            {displayErrorExamModal && unselectedModalityExams.length > 0 ? (<InvalidModalityModal 
                unselectedModalityExams={unselectedModalityExams}
                setDisplayErrorExamModal = {setDisplayErrorExamModal}
                open={displayErrorExamModal}
            />):null}
            <Box sx={{ mt: 3 }} >
            <Patient errors={errors} setValue={setValue} trigger={trigger} defaultPatient={getIdRes?.data?.patientId} setSelectedPatient={setSelectedPatient} clearErrors={clearErrors} setItemData={setItemData}/>
            </Box>
            <Appoinment register={register} errors={errors} setValue={setValue} getValues={getValues} trigger={trigger} patientGender={ selectedPatient.gender}/>
            <Box sx={{ mt: 3 }} >
                <ExamData errors={errors} setValue={setValue} trigger={trigger} defaultExam={getIdRes?.data?.examList} />
            </Box>
            <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
                <Typography variant="h5" className='title'>Special Instructions</Typography>
                <Grid container spacing={2}>
                    <Grid item lg={8} md={8} sm={12} sx={{ width: "100%" }}>
                        <Stack sx={{ flexDirection: { sm: "row", xs: "column" } }} >
                            <FormControlLabel className='customLableWidth' control={<Checkbox {...register('isCorrectPatient')} checked={specialInstructions.isCorrectPatient} onChange={() => { updateSpecialInstructions("isCorrectPatient") }} />} label="Correct Patient" />
                            <FormControl fullWidth >
                                <OutlinedInput className="inputfield"
                                    {...register('correctPatientValue')}
                                    size='small'
                                    placeholder="Enter Description"
                                    disabled={!specialInstructions.isCorrectPatient} // Disable input when checkbox is unchecked
                                />
                            </FormControl>
                        </Stack>

                        <Stack sx={{ flexDirection: { sm: "row", xs: "column" } }} >
                            <FormControlLabel className='customLableWidth' control={<Checkbox {...register('isCorrectSide')} checked={specialInstructions.isCorrectSide} onChange={() => { updateSpecialInstructions("isCorrectSide") }} />} label="Correct Side" />
                            <FormControl fullWidth >
                                <OutlinedInput className="inputfield"
                                    {...register('correctSideValue')}
                                    size='small'
                                    placeholder="Enter Description"
                                    disabled={!specialInstructions.isCorrectSide} // Disable input when checkbox is unchecked
                                />
                            </FormControl>
                        </Stack>

                        <Stack sx={{ flexDirection: { sm: "row", xs: "column" } }} >
                            <FormControlLabel className='customLableWidth' control={<Checkbox {...register('isCorrectProcedure')} checked={specialInstructions.isCorrectProcedure} onChange={() => { updateSpecialInstructions("isCorrectProcedure") }} />} label="Correct Procedure" />
                            <FormControl fullWidth >
                                <OutlinedInput className="inputfield"
                                    {...register('correctProcedureValue')}
                                    size='small'
                                    placeholder="Enter Description"
                                    disabled={!specialInstructions.isCorrectProcedure} // Disable input when checkbox is unchecked
                                />
                            </FormControl>
                        </Stack>

                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body2" sx={{ fontSize: "20px", marginBottom: "20px" }}>Please Select</Typography>
                        <Stack sx={{ flexDirection: { sm: "row", xs: "column", alignItems: "center" } }} >
                            <Typography variant="body2" sx={{ fontSize: "20px", marginRight: "25px" }}>Contrast</Typography>
                            <FormControl fullWidth>
                                <RadioGroup row sx={{ flexWrap: "nowrap" }}>
                                    <FormControlLabel value={"true"} control={<Radio checked={getValues("contrastValue") === "true"} onChange={() => { setValue("contrastValue", "true"); trigger("contrastValue") }} />} label="Yes" />
                                    <FormControlLabel value={"false"} control={<Radio checked={(getValues("contrastValue") === "false" || getValues("contrastValue") === null)} />} onChange={() => { setValue("contrastValue", "false"); trigger("contrastValue") }} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontSize: "20px", marginBottom: "6px" }}>Allergies/Infection Status?</Typography>
                        <FormControl fullWidth >
                            <OutlinedInput {...register('allergiesDetails')} sx={{ padding: "0", marginTop: "0" }} className='inputfield' size='small' multiline rows={4} placeholder="Enter Description" />
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ mt: 3 }} >
                <Referring register={register} setValue={setValue} getValues={getValues} trigger={trigger} />
            </Box>

            <Box sx={{ mt: 3 }} >
                <Appointer register={register} setValue={setValue} getValues={getValues} trigger={trigger} />
            </Box>

            <Box sx={{ mt: 3, marginBottom: "40px" }} >
                <AuthorisedBy errors={errors} register={register} setValue={setValue} getValues={getValues} trigger={trigger} />
            </Box>


            <Stack direction={"row"} justifyContent="space-between" sx={{ display: { sm: "flex", xs: "block" } }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: { sm: "space-between", xs: "center" } }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.0701 2C11.6761 2 11.286 2.0776 10.922 2.22837C10.558 2.37914 10.2273 2.60012 9.94871 2.87871L8.53471 4.29271C8.14419 4.68323 7.51102 4.68323 7.1205 4.29271C6.72997 3.90219 6.72997 3.26902 7.1205 2.8785L8.5345 1.4645C8.9988 1.00019 9.55 0.631889 10.1566 0.38061C10.7633 0.129331 11.4135 0 12.0701 0C12.7267 0 13.3769 0.129331 13.9836 0.38061C14.5902 0.631889 15.1414 1.00019 15.6057 1.4645C16.07 1.9288 16.4383 2.48001 16.6896 3.08665C16.9409 3.69329 17.0702 4.34348 17.0702 5.0001C17.0702 5.65673 16.9409 6.30692 16.6896 6.91356C16.4383 7.5202 16.07 8.07141 15.6057 8.53571L14.1917 9.94971C13.8012 10.3402 13.168 10.3402 12.7775 9.94971C12.387 9.55919 12.387 8.92602 12.7775 8.5355L14.1915 7.1215C14.4701 6.84291 14.6911 6.51218 14.8418 6.14819C14.9926 5.7842 15.0702 5.39408 15.0702 5.0001C15.0702 4.60612 14.9926 4.216 14.8418 3.85201C14.6911 3.48802 14.4701 3.1573 14.1915 2.87871C13.9129 2.60012 13.5822 2.37914 13.2182 2.22837C12.8542 2.0776 12.4641 2 12.0701 2ZM12.0717 5.0005C12.4622 5.39102 12.4622 6.02419 12.0717 6.41471L6.41471 12.0717C6.02419 12.4622 5.39102 12.4622 5.0005 12.0717C4.60997 11.6812 4.60997 11.048 5.0005 10.6575L10.6575 5.0005C11.048 4.60997 11.6812 4.60997 12.0717 5.0005ZM4.29271 7.1215C4.68323 7.51202 4.68323 8.14519 4.29271 8.53571L2.87871 9.94971C2.60012 10.2283 2.37914 10.559 2.22837 10.923C2.0776 11.287 2 11.6771 2 12.0711C2 12.4651 2.0776 12.8552 2.22837 13.2192C2.37914 13.5832 2.60012 13.9139 2.87871 14.1925C3.1573 14.4711 3.48802 14.6921 3.85201 14.8428C4.216 14.9936 4.60612 15.0712 5.0001 15.0712C5.39408 15.0712 5.7842 14.9936 6.14819 14.8428C6.51196 14.6922 6.84251 14.4713 7.121 14.193L8.533 12.779C8.92324 12.3882 9.55641 12.3877 9.94721 12.778C10.338 13.1682 10.3385 13.8014 9.94821 14.1922L8.53621 15.6062C8.07191 16.0705 7.5202 16.4393 6.91356 16.6906C6.30692 16.9419 5.65673 17.0712 5.0001 17.0712C4.34348 17.0712 3.69329 16.9419 3.08665 16.6906C2.48001 16.4393 1.9288 16.071 1.4645 15.6067C1.00019 15.1424 0.631889 14.5912 0.38061 13.9846C0.129331 13.3779 0 12.7277 0 12.0711C0 11.4145 0.129331 10.7643 0.38061 10.1576C0.631889 9.551 1.00019 8.9998 1.4645 8.5355L2.8785 7.1215C3.26902 6.73097 3.90219 6.73097 4.29271 7.1215Z" fill="#FF2626" />
                    </svg>
                    <Button onClick={() => { setOpenModal(!openModal) }} sx={{ color: "#FF2626", fontSize: "20px", textTransform: "unset" }}>Guidance Note For Referrers </Button>
                </Box>
                <Box sx={{ textAlign: { sm: "end", xs: "center" } }}>
                    <Button className="commonBtn" type='submit' variant='contained' disabled={loading} sx={{ marginRight: "16px" }}>{(itemData?.id || getValues()?._id) ? "Update" : "Save"} </Button>
                    <Button variant='outlined' className='btn cancelBtn' onClick={() => { toggleList() }}>Cancel</Button>
                </Box>
            </Stack>

            <Dialog
                fullWidth={true}
                maxWidth={"lg"}
                open={openModal}
                onClose={() => { setOpenModal(!openModal) }}
            >
                <DialogTitle>
                    <Typography sx={{ color: "primary.dark", fontSize: "30px", fontWeight: "600", textAlign: "center" }}> Guidance Notes for Referrers</Typography>
                    <Button onClick={() => { setOpenModal(!openModal) }} sx={{ position: "absolute", right: "0", top: "10px", color: "#797878" }} >
                        <HighlightOffIcon />
                    </Button>
                </DialogTitle>
                <DialogContent >

                    <Typography component={"p"} sx={{ textAlign: { sm: "center", xs: "left" }, color: "#797878", fontSize: "18px", marginBottom: { sm: "0", xs: "20px" } }}>
                        In accordance with the Ionising Radiation (Medical Exposures) Regulation 2000, the Bupa Cromwell Hospital Radiology Department would like to make all Referrers aware of the following Guidelines:
                    </Typography>
                    <Typography component={"h5"} variant='h5' className="guidance-title">
                        Referrals:
                    </Typography>
                    <ul className="guidance-text">
                        <li>
                            <Typography component={"p"}>
                                In accordance with the Ionising Radiation (Medical Exposures) Regulation 2000, the Bupa Cromwell Hospital Radiology Department would like to make all Referrers aware of the following Guidelines:
                            </Typography>
                        </li>
                        <li>
                            <Typography component={"p"}>
                                In accordance with the Ionising Radiation (Medical Exposures) Regulation 2000, the Bupa Cromwell Hospital Radiology Department would like to make all Referrers aware of the following Guidelines:
                            </Typography>
                        </li>
                        <li>
                            <Typography component={"p"}>
                                In accordance with the Ionising Radiation (Medical Exposures) Regulation 2000, the Bupa Cromwell Hospital Radiology Department would like to make all Referrers aware of the following Guidelines:
                            </Typography>
                        </li>
                        <li>
                            <Typography component={"p"}>
                                In accordance with the Ionising Radiation (Medical Exposures) Regulation 2000, the Bupa Cromwell Hospital Radiology Department would like to make all Referrers aware of the following Guidelines:
                            </Typography>
                        </li>
                    </ul>
                    <Typography component={"h5"} variant='h5' className="guidance-title">
                        Females of Childbearing Age (12-55 years)
                    </Typography>
                    <ul className="guidance-text">
                        <li>
                            <Typography component={"p"}>
                                All requests for X-ray examinations (between the diaphragm and the knees) for females of childbearing age (12-55 years) must state the date of the first day of the patient’s menstrual period.
                            </Typography>
                        </li>
                    </ul>
                    <Typography component={"h5"} variant='h5' className="guidance-title">
                        Clinical Justification of Requests:
                    </Typography>
                    <ul className="guidance-text">
                        <li>
                            <Typography component={"p"}>
                                All requests for imaging will be assessed prior to exposure by the appropriate Practitioner for the examination to ensure that they meet with The Royal College of Radiologists’ Guidelines and any local Guidelines and that, in their professional judgement, they are clinically justified (Royal College of Radiologists Publication: BCFR(00)5).
                            </Typography>
                        </li>
                    </ul>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default RadiologyForm;
