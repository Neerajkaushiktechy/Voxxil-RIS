import React, { useEffect, useState } from 'react';
import { FormControl, Button, Grid, FormHelperText, Select, MenuItem, Avatar, OutlinedInput, FormLabel, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from 'moment/moment';
import SignatureCanvas from '../editProfile/signatureCanvas';
import { postRequest, putUserRequest, resetPost, resetUserPut } from '../../../redux/modules/staff/slice';
import { GENDER, USER_ROLE, USER_ROLE_DEFAULT } from '../../../constants/Constant';

const getValidationSchema = (itemData) => {
    console.log(itemData._id)
    if(itemData._id) {
        return yup.object().shape({
            avatar: yup.mixed()
                .test('file-type', 'Invalid file type', function (value) {
                    if (!value) return true; // If no file is provided, consider it valid
                    const allowedFileTypes = ['image/jpeg', 'image/png']; // Adjust the allowed file types as needed
                    return allowedFileTypes.includes(value.type);
                }),
            firstName: yup.string().required('First Name is required'),
            lastName: yup.string(),
            email: yup.string().email('Invalid email').required('Email is required'),
            phone: yup.lazy(value => {
                switch (typeof value) {
                  case 'string':
                    return value.trim() === '' ? yup.string().nullable() : yup.string()
                      .matches(/^[0-9]*$/, 'Phone number must contain only digits')
                      .min(7, 'Phone number must be at least 7 digits')
                      .max(15, 'Phone number cannot exceed 15 digits')
                  default:
                    return yup.string().nullable();
                }
            }),       
            gender: yup.string(),
            dob: yup.string().nullable(),
            country: yup.string(),
            state: yup.string(),
            city: yup.string(),
            zipCode: yup.string(),
            taxId: yup.string(),
            // signaturePin: yup.string(),
            role: yup.string().required('Role is required'),
            password: yup.string(),
            // ...(itemData && !itemData._id && {
            //     signatureImage: yup.string()
            // }),
        });
    } else {
        return yup.object().shape({
            avatar: yup.mixed()
                .test('file-type', 'Invalid file type', function (value) {
                    if (!value) return true; // If no file is provided, consider it valid
                    const allowedFileTypes = ['image/jpeg', 'image/png']; // Adjust the allowed file types as needed
                    return allowedFileTypes.includes(value.type);
                }),
            firstName: yup.string().required('First Name is required'),
            lastName: yup.string(),
            email: yup.string().email('Invalid email').required('Email is required'),
            phone: yup.lazy(value => {
                switch (typeof value) {
                  case 'string':
                    return value.trim() === '' ? yup.string().nullable() : yup.string()
                      .matches(/^[0-9]*$/, 'Phone number must contain only digits')
                      .min(7, 'Phone number must be at least 7 digits')
                      .max(15, 'Phone number cannot exceed 15 digits')
                  default:
                    return yup.string().nullable();
                }
            }),            
            gender: yup.string(),
            dob: yup.string().nullable(),
            country: yup.string(),
            state: yup.string(),
            city: yup.string(),
            zipCode: yup.string(),
            taxId: yup.string(),
            // signaturePin: yup.string(),
            role: yup.string().required('Role is required'),
            password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
            // ...(itemData && !itemData._id && {
            //     signatureImage: yup.string()
            // }),
        });
    }
    
};

const UserForm = ({ itemData, toggleList }) => {
    const dispatch = useDispatch();
    const validationSchema = getValidationSchema(itemData);
    const { postRes, putUserRes, loading } = useSelector((state) => state.staff);
    const [avatarFile, setAvatarFile] = useState(Boolean(itemData?.avatar));
    const [isSignatureFile, setSignatureFile] = useState(null);
    const { register, handleSubmit, formState: { errors }, getValues, setValue, trigger } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: { ...itemData, avatar: "" }
    });

    useEffect(() => {
        if (postRes) {
            if (postRes?.success) {
                toggleList()
            }
            toast(postRes?.message)
            dispatch(resetPost());
        }
        if (putUserRes) {
            if (putUserRes?.success) {
                toggleList();
            }
            toast(putUserRes?.message);
            dispatch(resetUserPut());
        }

    }, [postRes, putUserRes, toggleList, dispatch]);

    const onSubmit = (data, itemData) => {
        const formData = new FormData();
        for (const i in data) {
            if (i === "avatar") {
                if (avatarFile) {
                    formData.append("avatar", data[i] || avatarFile);
                }
                continue;
            }
            else if (i === "signatureImage") {
                if (!isSignatureFile) {
                    formData.append("signatureImage", data[i] || isSignatureFile);
                }
                continue;
            }
            formData.append(i, data[i]);
        }
        if (itemData?._id) {
            dispatch(putUserRequest(formData));
        } else {
            dispatch(postRequest(formData));
        }

    };


    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data, itemData))}>
            <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.firstName)}>
                        <FormLabel>First name</FormLabel>
                        <OutlinedInput className="inputfield" fullWidth {...register('firstName')} />
                        {errors?.firstName?.message && <FormHelperText>{errors?.firstName?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.lastName)}>
                        <FormLabel>Last name</FormLabel>
                        <OutlinedInput className="inputfield" fullWidth {...register('lastName')} />
                        {errors?.lastName?.message && <FormHelperText>{errors?.lastName?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.email)}>
                        <FormLabel>Email</FormLabel>
                        <OutlinedInput className="inputfield" label="" fullWidth {...register('email')} />
                        {errors?.email?.message && <FormHelperText>{errors?.email?.message}</FormHelperText>}
                    </FormControl>
                </Grid>

                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.phone)}>
                        <FormLabel>Phone Number</FormLabel>
                        <OutlinedInput className="inputfield" label="" fullWidth {...register('phone')} />
                        {errors?.phone?.message && <FormHelperText>{errors?.phone?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.dob)}>
                        <FormLabel>Date of birth</FormLabel>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker className="inputfield" disableFuture={true} format="DD-MM-YYYY" value={moment(getValues().dob)} onChange={(date) => { setValue("dob", moment(date).format('YYYY-MM-DD')); trigger("dob") }} />
                        </LocalizationProvider>
                        {errors?.dob?.message && <FormHelperText>{errors?.dob?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                        <FormLabel>Gender</FormLabel>
                        <Select className='inputfield' label="Gender"  {...register('gender')}
                         value={getValues("gender") || ''}
                         onChange={(e) => {
                             setValue("gender", e.target.value);
                             trigger("gender");
                         }}
                        >
                            <MenuItem value={GENDER.MALE}>Male</MenuItem>
                            <MenuItem value={GENDER.FEMALE}>Female</MenuItem>
                            <MenuItem value={GENDER.OTHER}>Other</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormLabel>Country</FormLabel>
                    <FormControl fullWidth error={Boolean(errors.country)}>
                        <OutlinedInput className="inputfield" label="" fullWidth {...register('country')} />
                        {errors?.country?.message && <FormHelperText>{errors?.country?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.state)}>
                        <FormLabel>State</FormLabel>
                        <OutlinedInput className="inputfield" label="" fullWidth {...register('state')} />
                        {errors?.state?.message && <FormHelperText>{errors?.state?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.city)}>
                        <FormLabel>City</FormLabel>
                        <OutlinedInput className="inputfield" label="" fullWidth {...register('city')} />
                        {errors?.city?.message && <FormHelperText>{errors?.city?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.zipCode)}>
                        <FormLabel>Zip Code</FormLabel>
                        <OutlinedInput className="inputfield" label="" fullWidth {...register('zipCode')} />
                        {errors?.zipCode?.message && <FormHelperText>{errors?.zipCode?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.taxId)}>
                        <FormLabel>Tax ID</FormLabel>
                        <OutlinedInput className="inputfield" label="" fullWidth {...register('taxId')} />
                        {errors?.taxId?.message && <FormHelperText>{errors?.taxId?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                {itemData._id ? <></>: (
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.password)}>
                            <FormLabel>Password</FormLabel>
                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { m: 1 },
                                }}
                                noValidate
                                autoComplete="off"
                                >
                                <OutlinedInput className="inputfield" label="" type="password" fullWidth {...register('password')} autoComplete='off' />
                            </Box>
                            
                            {errors?.password?.message && <FormHelperText>{errors?.password?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                )}
                

                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <Box sx={{ width: "100%", textAlign: "start" }}>
                        <FormLabel>Role</FormLabel>
                        <FormControl sx={{ width: "100%", marginBottom: "30px", borderWidth: 1 }} error={Boolean(errors.role)} variant="filled">
                            <Select
                                {...register("role")}
                                value={getValues("role")}
                                onChange={(e) => {
                                    setValue("role", e.target.value);
                                    trigger("role");
                                }}
                                defaultValue={USER_ROLE_DEFAULT.ADMIN}
                            >
                                {USER_ROLE.map(role=>(<MenuItem value={role.role}>{role.displayText}</MenuItem>))}
                            </Select>
                            {errors?.role?.message && <FormHelperText>{errors?.role?.message}</FormHelperText>}
                        </FormControl>
                    </Box>
                </Grid>

                <Grid item xs={12} textAlign={"right"}>
                    <Button type="button" sx={{ marginRight: 2 }} variant='contained' size="large" onClick={toggleList} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant='contained' size="large" >
                        {itemData?._id ? "Update" : "Submit"}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default UserForm;


