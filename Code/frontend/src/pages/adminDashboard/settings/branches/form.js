import React, { useEffect } from 'react';
import { FormControl, TextField, Button, Grid, FormHelperText, OutlinedInput, FormLabel} from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { postRequest, putRequest, resetPost, resetPut } from '../../../../redux/modules/branch/slice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const getValidationSchema = (itemData) => {
    return yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().trim().required('Phone number is required').matches(/^[0-9]*$/, 'Phone number must contain only digits').min(7, 'Phone number must be at least 7 digits').max(15, 'Phone number cannot exceed 15 digits'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    country: yup.string().required('Country is required'),
    address: yup.string().required('Address is required'),
    ...(itemData && !itemData._id && {
            branchCode: yup.string().required('Branch code is required').matches(/^[a-zA-Z0-9]{1,10}$/, 'Branch code must be upto 10 characters long and contain only alphanumeric characters')
        })
    });
};

const BranchForm = ({ itemData, toggleList, onlyForm = false }) => {
    const dispatch = useDispatch();
    const validationSchema = getValidationSchema(itemData);
    let navigate = useNavigate();
    let { loading, postRes, putRes } = useSelector(state => state.branch);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: itemData
    });

    useEffect(() => {
        if (postRes) {
          if(onlyForm){
            if(postRes?.success){navigate(`/admin`);}
          }else if(postRes?.success){
            toggleList();
          }
    
          toast(postRes?.message);
          dispatch(resetPost());
        }
        if (putRes) {
          if (putRes?.success) {
            toggleList();
          }
          toast(putRes?.message);
          dispatch(resetPut());
        }
      }, [onlyForm, postRes, putRes, toggleList, navigate, dispatch]);

    const onSubmit = (data) => {
        if (itemData?._id) {
            dispatch(putRequest(data));
        } else {
            dispatch(postRequest(data));
        }
    };

    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ maxWidth: `${onlyForm ? "1200px" : "100%"}` }} mx={"auto"}>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.name)}>
                        <FormLabel>Branch Name</FormLabel>
                        <OutlinedInput className="inputfield" size='small' fullWidth {...register("name")} />
                        {errors?.name?.message && <FormHelperText>{errors?.name?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.email)}>
                        <FormLabel>Branch Email</FormLabel>
                        <OutlinedInput className="inputfield" size='small' fullWidth {...register('email')} />
                        {errors?.email?.message && <FormHelperText>{errors?.email?.message}</FormHelperText>}
                    </FormControl>
                </Grid>

                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.phone)}>
                        <FormLabel>Phone Number</FormLabel>
                        <TextField className="inputfield" size='small' fullWidth {...register('phone')} />
                        {errors?.phone?.message && <FormHelperText>{errors?.phone?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.city)}>
                        <FormLabel>City</FormLabel>
                        <TextField className="inputfield" size='small' fullWidth {...register('city')} />
                        {errors?.city?.message && <FormHelperText>{errors?.city?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.state)}>
                        <FormLabel>State</FormLabel>
                        <TextField className="inputfield" size='small' fullWidth {...register('state')} />
                        {errors?.state?.message && <FormHelperText>{errors?.state?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.country)}>
                        <FormLabel>Country</FormLabel>
                        <TextField className="inputfield" size='small' fullWidth {...register('country')} />
                        {errors?.country?.message && <FormHelperText>{errors?.country?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth error={Boolean(errors.address)}>
                        <FormLabel>Address</FormLabel>
                        <TextField className="inputfield" size='small' fullWidth {...register('address')} />
                        {errors?.address?.message && <FormHelperText>{errors?.address?.message}</FormHelperText>}
                    </FormControl>
                </Grid>
                {/* {itemData._id ? null : ( */}
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <FormControl fullWidth error={Boolean(errors.branchCode)}>
                            <FormLabel>Branch Code</FormLabel>
                            <TextField className="inputfield" size='small' fullWidth {...register('branchCode')}
                                InputProps={{
                                    readOnly: itemData._id?true:false,
                                  }}
                            />
                            {errors?.branchCode?.message && <FormHelperText>{errors?.branchCode?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                {/* )} */}

                <Grid item xs={12} textAlign={"right"}>
                    <Button type="submit" variant='contained' size="large" disabled={loading}>
                        {itemData?._id ? "Update" : "Submit"}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default BranchForm;