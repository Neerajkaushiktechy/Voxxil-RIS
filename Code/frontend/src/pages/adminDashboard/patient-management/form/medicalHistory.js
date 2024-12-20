import React, { useState, useEffect } from 'react';
import { FormControl, Button, Grid, FormHelperText, Card, Select, MenuItem, Box, Typography, Input, FormLabel, OutlinedInput, IconButton, Autocomplete, TextField} from '@mui/material';
import { postPatientMedicalHistoryRequest, putPatientMedicalHistoryRequest } from '../../../../redux/modules/admin/patientMedicalHistory/slice';
import { getPatientDataRequest } from '../../../../redux/modules/admin/patientProfile/slice';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';
import ClearIcon from '@mui/icons-material/Clear';
const validationSchema = yup.object().shape({
    diagnosis: yup.string().default(''),
    illness: yup.string().default(''),
    department: yup.string().default(''),
    allergies: yup.string().default(''),
    medications: yup.string().default(''),
    comments: yup.string().default(''),
    familyHereditaryHealth: yup.string().default(''),
    familyMemberHealthHistory: yup.string().default(''),
    imagingStudies: yup.array().test('file-type', 'Invalid file type', function (value) {
        if (!value || value.length === 0) return true; // If no files are provided, consider it valid
        const allowedFileTypes = ['.docx', '.pdf']; // Adjust the allowed file types as needed
        return value.every(file => {
            if (!file || !file.name) return true; // Handle undefined or objects without 'name' property
            return allowedFileTypes.some(allowedType => file.name.endsWith(allowedType));
        });

    }),
});

const MedicalHistory = ({ itemData, formData, onNext, onBack, itemDataId, patientId }) => {
    const dispatch = useDispatch();
    const [daignosis, setDaignosis] = useState('')
    const [department, setDepartment] = useState('')
    const [allergies, setAllergies] = useState('')
    let { currentBranch } = useSelector(state => state.branch);
    const [selectedFiles, setSelectedFiles] = useState([]);
    let { getMasterRes, getPatientDataRes } = useSelector(state => state.patientProfile);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: formData,
    });


    useEffect(() => {
        const pId = localStorage.getItem("pId")
        if (itemData?.pId || pId || patientId) {
            dispatch(getPatientDataRequest({ type: "medicalHistory", id: itemData?.pId ?? (pId || patientId) }))
        }

    }, [dispatch, itemData?.pId, patientId])

    useEffect(() => {
        if (getPatientDataRes?.patientData) {
            setValue('illness', getPatientDataRes?.patientData?.illness);
            setValue('medications', getPatientDataRes?.patientData?.medications);
            setValue('familyHereditaryHealth', getPatientDataRes?.patientData?.familyHereditaryHealth);
            setValue('familyMemberHealthHistory', getPatientDataRes?.patientData?.familyMemberHealthHistory);
            setValue('comments', getPatientDataRes?.patientData?.comments);
            setValue('diagnosis', getPatientDataRes?.patientData?.diagnosis);
            setValue('department', getPatientDataRes?.patientData?.department);
            setValue('allergies', getPatientDataRes?.patientData?.allergies);
            setDaignosis(getPatientDataRes?.patientData?.diagnosis);
            setDepartment(getPatientDataRes?.patientData?.department);
            setAllergies(getPatientDataRes?.patientData?.allergies);
        }
    }, [getPatientDataRes, setValue]);



    useEffect(() => {
        if (getPatientDataRes?.patientData?.imagingStudies) {
            setSelectedFiles((prev) => {
                let array = [...getPatientDataRes?.patientData?.imagingStudies]
                return array?.map((item) => ({ name: item.fileName }))
            })
        }
    }, [getPatientDataRes])


    const onSubmit = async (data) => {
        const pId = localStorage.getItem("pId")
        let fileFormData = new FormData();
        let files = [...selectedFiles];
        let existFile = [];
        for (let i = 0; i < files.length; i++) {
            if (files[i].type) {
                // If it has a type, it's a file
                fileFormData.append('imagingStudies', files[i]);
            } else {
                // If it doesn't have a type, it's an existing file
                existFile.push({
                    fileName: files[i].name,
                });
            }
        }

        fileFormData.append('branchId', currentBranch?.id)
        if (getPatientDataRes?.patientData) {
            data.daignosis = daignosis
            data.department = department
            data.allergies = allergies
            fileFormData.append('illness', data?.illness);
            fileFormData.append('medications', data?.medications);
            fileFormData.append('familyHereditaryHealth', data?.familyHereditaryHealth);
            fileFormData.append('familyMemberHealthHistory', data?.familyMemberHealthHistory);
            fileFormData.append('comments', data?.comments);
            fileFormData.append('diagnosis', data?.diagnosis);
            fileFormData.append('department', data?.department);
            fileFormData.append('allergies', data?.allergies);
            fileFormData.append('document', JSON.stringify(existFile))
            fileFormData.append('_id', itemData?.pId ?? (pId || patientId))
            dispatch(putPatientMedicalHistoryRequest({ formData: fileFormData, _id: itemData?.pId ?? (pId || patientId) }))
        }
        else {
            dispatch(postPatientMedicalHistoryRequest({ fileFormData, formData: data, branchId: currentBranch?.id, pId: patientId || pId }))
        }

        onNext()
    };

    const nextStep = () => {
        onNext();
    }

    const handleFileInputChange = (e) => {
        const filedata = e.target.files[0]; // Convert FileList to an array
        setSelectedFiles([...selectedFiles, filedata]); // Append the new files to the existing ones
    };

    const handleChange = (fieldName) => (event) => {
        switch (fieldName) {
            case 'diagnosis':
                setDaignosis(event.target.value);
                break;
            case 'department':
                setDepartment(event.target.value);
                break;
            case 'allergies':
                setAllergies(event.target.value);
                break;
            default:

        }
    };
    const removeFile = (index) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
                <Card className='cardStyle' sx={{ marginTop: "40px" }}>
                    <Typography className='title'>Personal Medical History</Typography>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} >Patient Diagnosis</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.diagnosis)} className='inputfield'>
                                <Select
                                    {...register('diagnosis')}
                                    value={daignosis}
                                    onChange={handleChange('diagnosis')}
                                >
                                    {getMasterRes?.daignosisList
                                        .map((elm) => (
                                            <MenuItem key={elm._id} value={elm.daignosis}>
                                                {elm.daignosis}
                                            </MenuItem>
                                        ))}
                                </Select>
                                {errors?.diagnosis?.message && <FormHelperText>{errors?.diagnosis?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={8} md={6} sm={6} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} >Previous or Current Illness</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.illness)} className='inputfield'>
                                <OutlinedInput placeholder="Previous or Current Illness" fullWidth {...register('illness')} />
                                {errors?.illness?.message && <FormHelperText>{errors?.illness?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} >Patient Departments</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.department)} className='inputfield'>
                                <Select

                                    {...register('department')}
                                    value={department}
                                    onChange={handleChange('department')}>
                                    {getMasterRes?.patientDepartmnetList
                                        .map((elm) => (
                                            <MenuItem key={elm._id} value={elm.department}>
                                                {elm.department}
                                            </MenuItem>
                                        ))}
                                </Select>
                                {errors?.department?.message && <FormHelperText>{errors?.department?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} >Allergies</FormLabel>
                            <Autocomplete
                                // freeSolo
                                // id="free-solo-2-demo"
                                disableClearable={false}
                                sx={{
                                    marginTop: '10px',
                                    height: '57px',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                    backgroundColor: '#F5F7F9',
                                    '& .MuiAutocomplete-endAdornment': {
                                        display:'none'
                                    },
                                }}
                                
                                options={getMasterRes?.allergieList.map((option) => option.allergies)}
                                closeIcon={null}
                                value={allergies}
                                onInputChange={(_, v) => setAllergies(v)}
                                {...register('allergies')}
                                // className='inputfield'
                                renderInput={(params) => (
                                <TextField
                                    {...params}
                                    
                                />
                                )}
                            />
                            {errors?.allergies?.message && <FormHelperText>{errors?.allergies?.message}</FormHelperText>}
                            {/* <FormControl fullWidth error={Boolean(errors.allergies)} className='inputfield'>
                                <Select

                                    {...register('allergies')}
                                    value={allergies}
                                    onChange={handleChange('allergies')}
                                >
                                    {getMasterRes?.allergieList.map((elm) => (
                                        <MenuItem key={elm._id} value={elm.allergies}>
                                            {elm.allergies}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors?.allergies?.message && <FormHelperText>{errors?.allergies?.message}</FormHelperText>}
                            </FormControl> */}
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} >Current Medications</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.medications)} className='inputfield'>
                                <OutlinedInput placeholder="Current Medications" fullWidth {...register('medications')} />
                                {errors?.medications?.message && <FormHelperText>{errors?.medications?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={6} md={12} sm={12} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Previous Imaging Studies</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.imagingStudies)} className='inputfield'>
                                <Box
                                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                >
                                    <Box className="file_list_wrraper">
                                        {selectedFiles.map((file, index) => (
                                            <div className='file_list' key={index}>
                                                <div style={{ display: 'flex', alignItems: "center" }}>
                                                    <Typography>{file?.name}</Typography>
                                                    <IconButton onClick={() => removeFile(index)}>
                                                        <ClearIcon />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        ))}
                                    </Box>
                                    <Box
                                        sx={{ position: "relative" }}
                                    >
                                        <Button
                                            sx={{
                                                marginLeft: "10px",
                                                width: "120px",
                                                padding: "5px 5px"
                                            }}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Add File
                                        </Button>
                                        <Input
                                            sx={{
                                                position: "absolute",
                                                width: "100%",
                                                height: "100%",
                                                marginTop: "0px !important",
                                                top: 0,
                                                left: 0,
                                                border: "unset",
                                                opacity: 0
                                            }}
                                            id="imagingStudies"
                                            name="imagingStudies"
                                            type="file"
                                            inputProps={{ accept: '.doc,.docx,.pdf' }}
                                            fullWidth
                                            disableUnderline
                                            className="dropzone-input"
                                            multiple
                                            onChange={handleFileInputChange}
                                        />
                                    </Box>
                                </Box>
                                {errors?.imagingStudies?.message && <FormHelperText>{errors?.imagingStudies?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>


                        <Grid item lg={6} md={12} sm={12} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Comments</FormLabel>
                            <FormControl fullWidth className='inputfield'>
                                <Input fullWidth
                                    placeholder='Enter comment here'
                                    {...register('comments')}
                                    disableUnderline
                                    multiline
                                    minRows="1" />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Card>
                <Card className='cardStyle' sx={{ marginTop: "40px" }}>
                    <Typography className='title'>Family Medical History</Typography>
                    <Grid container spacing={2}>
                        <Grid item lg={6} md={12} sm={12} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Known Hereditary Conditions Or Illnesses In The Family</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.state)} className='inputfield'>
                                <Input fullWidth
                                    placeholder='Enter here'
                                    {...register('familyHereditaryHealth')}
                                    sx={{ padding: "14px", paddingLeft: "0" }}
                                    disableUnderline
                                    multiline
                                    minRows="2" />
                            </FormControl>
                        </Grid>
                        <Grid item lg={6} md={12} sm={12} xs={12}>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Significant Illnesses In Immediate Family Members</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.state)} className='inputfield'>
                                <Input fullWidth
                                    placeholder='Enter here'
                                    {...register('familyMemberHealthHistory')}
                                    sx={{ padding: "14px", paddingRight: "0", paddingLeft: "0" }}
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

export default MedicalHistory;
