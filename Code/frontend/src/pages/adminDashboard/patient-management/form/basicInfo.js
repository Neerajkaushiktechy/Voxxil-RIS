import * as React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, Button, Grid, FormHelperText, Card, Select, MenuItem, Box, Typography, FormLabel, OutlinedInput } from '@mui/material';
import { postPatientInformationRequest, putPatientInformationRequest } from '../../../../redux/modules/admin/patientInformation/slice';
import { getPatientDataRequest } from '../../../../redux/modules/admin/patientProfile/slice';
import { putPatientEmergencyContactRequest } from '../../../../redux/modules/admin/patientEmergencyContactInfo/slice';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import ReactSelect from "react-select";
import { countries } from "countries-list";
import { GENDER } from '../../../../constants/Constant';

const validationSchema = yup.object().shape({
    fName: yup.string().required('First Name is required').matches(/^[A-Za-z ]*$/, 'Please enter valid name'),
    lName: yup.string().required('Last Name is required').matches(/^[A-Za-z ]*$/, 'Please enter valid name'),
    email: yup.string().email('Invalid email').required('Email is required'),
    gender: yup.string().required('Gender is required'),
    dob: yup.string().required('Date of Birth is required'),
    address: yup.string(),
    region: yup.string(),
    country: yup.string(),
    postalCode: yup.string().nullable(),
    methodOfCommunication: yup.string(),
    contactNumber: yup.lazy(value => {
        switch (typeof value){
            case 'string':
                return value === '' ? yup.string().nullable() : yup.number().typeError("* Not valid number.").test('len', '* Min 7 to 15 numbers', (val) => val.toString().length >= 7 && val.toString().length <= 15);
            case 'number':
                return yup.number().typeError("* Not valid number.").test('len', '* Min 7 to 15 numbers', (val) => val.toString().length >= 7 && val.toString().length <= 15);
            default:
                return yup.string().nullable();
        }
    }),
    emergencyContactName: yup.string().matches(/^[A-Za-z ]*$/, 'Please enter valid name'),
    relationShipToPatient: yup.string(),
    emergencyContactNumber: yup.lazy(value => {
        switch (typeof value){
            case 'string':
                return value === '' ? yup.string().nullable() : yup.number().typeError("* Not valid number.").test('len', '* Min 7 to 15 numbers', (val) => val.toString().length >= 7 && val.toString().length <= 15);
            case 'number':
                return yup.number().typeError("* Not valid number.").test('len', '* Min 7 to 15 numbers', (val) => val.toString().length >= 7 && val.toString().length <= 15);
            default:
                return yup.string().nullable();
        }
    }),
});

const BasicInfo = ({ itemData, formData, onNext, onBack }) => {
    const dispatch = useDispatch();
    const [gender, setGender] = useState('');
    const [country, setCountry] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [communicationMethod, setCommunicationMethod] = useState('');
    const [patientRelation, setPatientRelation] = useState('')
    let { currentBranch } = useSelector(state => state.branch);
    let { getMasterRes, getPatientDataRes } = useSelector(state => state.patientProfile);

    const { register, handleSubmit, formState: { errors }, setValue, getValues, trigger, clearErrors } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {...formData,dob: formData?.dob ? formData.dob : moment().format('YYYY-MM-DD') },
    });

    useEffect(() => {
        const pId = localStorage.getItem("pId")
        if (itemData?._id || pId) {

            dispatch(getPatientDataRequest({ type: "basicInformation", id: itemData?._id !== undefined ? itemData?._id : pId }))
        }


    }, [dispatch, itemData])



    useEffect(() => {
        if (getPatientDataRes?.patientData) {
            setValue('fName', getPatientDataRes?.patientData?.fName);
            setValue('lName', getPatientDataRes?.patientData?.lName);
            setValue('gender', getPatientDataRes?.patientData?.gender);
            setValue('dob', getPatientDataRes?.patientData?.dob);
            setValue('email', getPatientDataRes?.patientData?.email);
            setValue('address', getPatientDataRes?.patientData?.address);
            setValue('postalCode', getPatientDataRes?.patientData?.postalCode);
            setValue('contactNumber', getPatientDataRes?.patientData?.contactNumber);
            setValue('emergencyContactName', getPatientDataRes?.patientData?.emergencyContactName);
            setValue('emergencyContactNumber', getPatientDataRes?.patientData?.emergencyContactNumber);
            setValue('region', getPatientDataRes?.patientData?.region);
            setValue('country', getPatientDataRes?.patientData?.country);
            setValue('methodOfCommunication', getPatientDataRes?.patientData?.methodOfCommunication);
            setValue('relationShipToPatient', getPatientDataRes?.patientData?.relationShipToPatient);
            setGender(getPatientDataRes?.patientData?.gender)
            setCountry(getPatientDataRes?.patientData?.country)
            setCommunicationMethod(getPatientDataRes?.patientData?.methodOfCommunication)
            setPatientRelation(getPatientDataRes?.patientData?.relationShipToPatient)
            const selectedCountry = getPatientDataRes?.patientData?.country
                ? { value: getPatientDataRes?.patientData?.country, label: getPatientDataRes?.patientData?.country }
                : null;
            setSelectedCountry(selectedCountry);

        }
    }, [getPatientDataRes, setValue, setGender, setCountry, setCommunicationMethod, setPatientRelation]);

    const onSubmit = (data) => {
        const pId = localStorage.getItem("pId")
        if (itemData?._id || pId) {
            data.country = country;
            data.methodOfCommunication = communicationMethod
            data.relationShipToPatient = patientRelation
            data.gender = gender
            dispatch(putPatientInformationRequest({ formData: data, _id: itemData?._id !== undefined ? itemData?._id : pId }))
            dispatch(putPatientEmergencyContactRequest({ formData: data, _id: itemData?._id !== undefined ? itemData?._id : pId ,branchId: currentBranch?.id}))
        }
        else {
            dispatch(postPatientInformationRequest({ formData: data, branchId: currentBranch?.id }))
        }
        onNext({ basicInfo: data });
    };
    const nextStep = () => {
        onNext();
    }
    const handleChange = (fieldName) => (event, selected, options) => {
        switch (fieldName) {
            case 'gender':
                setGender(event.target.value);
                setValue('gender', event.target.value);
                clearErrors('gender')
                break;
            case 'methodOfCommunication':
                setCommunicationMethod(event.target.value);
                break;
            case 'relation':
                setPatientRelation(event.target.value);
                break;
            default:

        }
    };
    const handleSearchInputChange = (selected) => {
        if (selected) {
            setCountry(selected?.value)
            setSelectedCountry(selected);
        }
    };
    const options = Object.entries(countries)
        .map((code) => {
            return {
                value: code[1].name,
                label: (
                    <>
                        <span> {code[1].name}</span>
                    </>
                )
            };
        })
        .filter(Boolean);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
                <Card className='cardStyle' sx={{ marginTop: "40px" }}>
                    <Typography className='title'>Personal Information</Typography>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={6} sm={6} xs={12} >
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} required>First Name</FormLabel>
                            <FormControl fullWidth error={Boolean(errors?.fName)} className='inputfield'>
                                <OutlinedInput placeholder='First Name' fullWidth {...register('fName')} />
                                {errors?.fName?.message && <FormHelperText>{errors?.fName?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12} >
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} required>Last Name</FormLabel>
                            <FormControl fullWidth error={Boolean(errors?.lName)} className='inputfield' >
                                <OutlinedInput placeholder="Last Name" fullWidth {...register('lName')} />
                                {errors?.lName?.message && <FormHelperText>{errors?.lName?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12} className='girdMarginBottom'>
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} required>Gender</FormLabel>
                            <FormControl fullWidth error={Boolean(errors?.gender)} className='inputfield'>
                                <Select {...register('gender')} value={gender} onChange={handleChange('gender')}>
                                    <MenuItem value={GENDER.MALE}>Male</MenuItem>
                                    <MenuItem value={GENDER.FEMALE}>Female</MenuItem>
                                    <MenuItem value={GENDER.OTHER}>Other</MenuItem>
                                </Select>
                                {errors?.gender?.message && <FormHelperText>{errors?.gender?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12} >
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} required>DOB</FormLabel>
                            <FormControl fullWidth error={Boolean(errors?.dob)}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker format="DD-MM-YYYY" disableFuture={true} className="inputfield" value={moment(getValues().dob)} onChange={(date) => { setValue("dob", moment(date).format('YYYY-MM-DD')); trigger("dob") }} />
                                </LocalizationProvider>
                                {errors?.dob?.message && <FormHelperText>{errors?.dob?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12} >
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} required>Email</FormLabel>
                            <FormControl fullWidth error={Boolean(errors?.email)} className='inputfield'>
                                <OutlinedInput placeholder="Email" type='email' fullWidth {...register('email')} />
                                {errors?.email?.message && <FormHelperText>{errors?.email?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    </Grid>
                </Card>

                <Card sx={{ marginTop: "50px" }} className='cardStyle'>
                    <Typography className='title'>Contact Information</Typography>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={6} sm={6} xs={12} >
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Address</FormLabel>
                            <FormControl fullWidth error={Boolean(errors?.address)} className='inputfield'>
                                <OutlinedInput placeholder="Address" fullWidth {...register('address')} />
                                {errors?.address?.message && <FormHelperText>{errors?.address?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12} >
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Region</FormLabel>
                            <FormControl fullWidth error={Boolean(errors?.region)} className='inputfield'>
                                <OutlinedInput placeholder="Region" fullWidth {...register('region')} />
                                {errors?.region?.message && <FormHelperText>{errors?.region?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12} >
                            <FormControl fullWidth error={Boolean(errors?.referringConsultant)} className='selectDropdown'>
                                <FormLabel sx={{ marginBottom: "9px" }} >Country</FormLabel>
                                <ReactSelect
                                    {...register('country')}
                                    autoFocus={false}
                                    value={selectedCountry}
                                    onChange={handleSearchInputChange}
                                    placeholder="Select a Country"
                                    isMulti={false}
                                    isClearable={true}
                                    isSearchable={true}
                                    isDisabled={false}
                                    options={options}
                                    classNamePrefix="select"
                                />
                                {errors?.referringConsultant?.message && <FormHelperText>{errors?.referringConsultant?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12} >
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Postal Code</FormLabel>
                            <FormControl fullWidth error={Boolean(errors?.postalCode)} className='inputfield'>
                                <OutlinedInput  placeholder="Postal Code" fullWidth {...register('postalCode')} />
                                {errors?.postalCode?.message && <FormHelperText>{errors?.postalCode?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12} >
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Method of Communication</FormLabel>
                            <FormControl fullWidth error={Boolean(errors.methodOfCommunication)} className='inputfield'>
                                <Select {...register('methodOfCommunication')} value={communicationMethod} onChange={handleChange('methodOfCommunication')}>
                                    <MenuItem value="Video call">Video call</MenuItem>
                                    <MenuItem value="Voice call">Voice call</MenuItem>
                                </Select>
                                {errors?.methodOfCommunication?.message && <FormHelperText>{errors?.methodOfCommunication?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12} >
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Contact Number</FormLabel>
                            <FormControl fullWidth error={Boolean(errors?.contactNumber)} className='inputfield'>
                                <OutlinedInput placeholder="Contact Number" fullWidth {...register('contactNumber')} />
                                {errors?.contactNumber?.message && <FormHelperText>{errors?.contactNumber?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    </Grid>
                </Card>
                <Card sx={{ marginTop: "40px", marginBottom: "40px" }} className='cardStyle'>
                    <Typography className='title'> Emergency Contact Information</Typography>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={6} sm={6} xs={12} >
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Name of Emergency Contact</FormLabel>
                            <FormControl fullWidth error={Boolean(errors?.emergencyContactName)} className='inputfield'>
                                <OutlinedInput
                                    placeholder="Name of Emergency Contact" fullWidth {...register('emergencyContactName')} />
                                {errors?.emergencyContactName?.message && <FormHelperText>{errors?.emergencyContactName?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12} >
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Relationship To Patient</FormLabel>
                            <FormControl fullWidth error={Boolean(errors?.relationShipToPatient)} className='inputfield'>
                                <Select  {...register('relationShipToPatient')}
                                    value={patientRelation}
                                    onChange={handleChange('relation')}>
                                    {getMasterRes?.relationList.map((elm) => (
                                        <MenuItem key={elm._id} value={elm.relation}>
                                            {elm.relation}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors?.relationShipToPatient?.message && <FormHelperText>{errors?.relationShipToPatient?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12} >
                            <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Emergency Contact Number</FormLabel>
                            <FormControl fullWidth error={Boolean(errors?.emergencyContactNumber)} className='inputfield'>
                                <OutlinedInput
                                    placeholder="Emergency Contact Number" fullWidth {...register('emergencyContactNumber')} />
                                {errors?.emergencyContactNumber?.message && <FormHelperText>{errors?.emergencyContactNumber?.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
            <Box display={'flex'} flexDirection={'row'} alignItems={'left'} justifyContent={'end'} >
                <Button type='submit' className='commonBtn' >
                    {getPatientDataRes?.patientData ? "Update and Next" : "Save and Next"}
                </Button>
                {itemData?._id || localStorage.getItem("pId") ? (
                    <Button className='commonBtn' sx={{ ml: 2 }} onClick={nextStep}>
                        Next
                    </Button>
                ) : null}
            </Box>
        </form >
    );
};

export default BasicInfo;
