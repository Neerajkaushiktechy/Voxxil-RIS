import React, { useEffect, useState } from 'react';
import { FormControl, Button, Grid, FormHelperText, Select, MenuItem, Avatar, OutlinedInput, FormLabel } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { putRequest, resetPut } from '../../../redux/modules/profile/slice';
import { toast } from 'react-toastify';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from 'moment/moment';
import SignatureCanvas from './signatureCanvas';

const getValidationSchema = (userData)=>{
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
    signatureImage: yup.string(),
    ...(userData && userData?.role !== "Patient" && {
        signaturePin: yup.string(),
    }),
});
};

const ProfileForm = ({ itemData, toggleList }) => {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.auth);
    const validationSchema = getValidationSchema(userData);
    const [avatarFile, setAvatarFile] = useState(Boolean(itemData?.avatar));
    const [isSignatureFile, setSignatureFile] = useState(Boolean(itemData?.signatureImage));
    let { loading, putRes } = useSelector(state => state.profile);
    const { register, handleSubmit, formState: { errors }, getValues, setValue, trigger } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: { ...itemData, avatar: "", signatureImage: "" }
    });

    useEffect(() => {
        if (!putRes) { return }
        if (putRes?.success) {
            toggleList();
        }
        toast(putRes?.message);
        dispatch(resetPut());
    }, [putRes, toggleList, dispatch]);

    const onSubmit = (data) => {
        if (!itemData?._id) { toast("There is some problem please try again later"); return; }
        const formData = new FormData();
        for (const i in data) {
            if (i === "avatar") {
                if (!avatarFile) {
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
        dispatch(putRequest(formData));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormLabel>Avatar</FormLabel>
                    {avatarFile
                        ?
                        <>
                            <Avatar
                                alt={itemData?.firstName}
                                src={`${process.env.REACT_APP_SERVER_API}api/profile/${itemData?._id}/avatar/${itemData?.avatar}`}
                                sx={{ width: 100, height: 100 }} />
                            <Button onClick={() => { setAvatarFile(false) }}>Remove Image</Button>
                        </>
                        :
                        <FormControl fullWidth error={Boolean(errors.avatar)}>
                            <OutlinedInput className="inputfield" type="file" fullWidth onChange={(e) => {
                                setValue('avatar', e.target.files[0]);
                                trigger("avatar")
                            }} />
                            {errors?.avatar?.message && <FormHelperText>{errors?.avatar?.message}</FormHelperText>}
                        </FormControl>
                    }
                </Grid>
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
                        <OutlinedInput className="inputfield" label=""  fullWidth {...register('phone')} />
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
                        <Select className='inputfield' label="Gender" defaultValue={itemData?.gender || "male"} {...register('gender')}>
                            <MenuItem value={"male"}>Male</MenuItem>
                            <MenuItem value={"female"}>Female</MenuItem>
                            <MenuItem value={"other"}>Other</MenuItem>
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
                {userData?.role !== "Patient" ? (<>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.signaturePin)}>
                            <FormLabel>Signature Pin</FormLabel>
                            <OutlinedInput className="inputfield" label="" fullWidth {...register('signaturePin')} />
                            {errors?.signaturePin?.message && <FormHelperText>{errors?.signaturePin?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <FormLabel>Signature Image</FormLabel>
                        {isSignatureFile
                            ?
                            <div>
                                <img alt={itemData?.firstName} src={`${process.env.REACT_APP_SERVER_API}api/profile/${itemData?._id}/signatureImage/signature.png`} style={{ height: "100px" }} />
                                <div>
                                    <Button onClick={() => { setSignatureFile(false) }}>Remove Image</Button>
                                </div>
                            </div>
                            :
                            <SignatureCanvas getValues={getValues} setValue={setValue} trigger={trigger} />
                        }
                    </Grid>
                </>):null}
                
                <Grid item xs={12} textAlign={"right"}>
                    <Button type="button" sx={{ marginRight: 2 }} variant='contained' size="large" disabled={loading} onClick={toggleList}>
                        Cancel
                    </Button>
                    <Button type="submit" variant='contained' size="large" disabled={loading}>
                        {itemData?._id ? "Update" : "Submit"}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ProfileForm;