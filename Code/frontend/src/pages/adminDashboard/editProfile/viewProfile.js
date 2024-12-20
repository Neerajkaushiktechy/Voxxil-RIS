import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientRequest, getRequest, putPasswordRequest, resetPasswordPut } from "../../../redux/modules/profile/slice";
import * as yup from 'yup';
import { Avatar, Paper, Grid, Typography, Stack, Button, FormControl, FormHelperText, OutlinedInput, FormLabel } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { setMainHeading } from "../../../redux/modules/mainHeading/slice";
import { USER_ROLE_DEFAULT } from "../../../constants/Constant";


const validationSchema = yup.object().shape({
    oldPassword: yup.string().required('Old Password is required'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters').notOneOf([yup.ref('oldPassword'), null], 'New Password must be different from Old Password'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required')
});

const ViewProfile = ({ toggleList, setItemData, itemData }) => {
    const dispatch = useDispatch();
    let { userData } = useSelector(state => state.auth);
    let { loading, getRes, putPasswordRes,getPatientRes } = useSelector(state => state.profile);
    const { register, handleSubmit, formState: { errors } ,reset} = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        dispatch(setMainHeading("Edit Profile"))
        if(userData.role !== USER_ROLE_DEFAULT.PATIENT){
            dispatch(getRequest())
        }else{
            dispatch(getPatientRequest())
        }
    }, [dispatch]);

    useEffect(() => {
        if (!putPasswordRes) { return }
        if (putPasswordRes?.success) {
            dispatch(getRequest())
            reset(); 
        }
        toast(putPasswordRes?.message);
        dispatch(resetPasswordPut());
    }, [putPasswordRes, toggleList, dispatch]);

    const onSubmit = (data) => {
        dispatch(putPasswordRequest(data));
    };

    const handleEditClick = () => {
        if (userData.role === USER_ROLE_DEFAULT.PATIENT) {
            setItemData(getPatientRes?.data);
        } else {
            setItemData(getRes?.data);
        }
        toggleList();
    };

    const userRole = userData.role === USER_ROLE_DEFAULT.PATIENT ;
    return (
        <>
            <Paper elevation={3} style={{ padding: '20px', margin: 'auto' }} className='cardStyle'>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Typography variant="h5">Personal Information</Typography>
                    <Button variant="contained" onClick={handleEditClick}> Edit</Button>
                </Stack>
                <Grid container spacing={2}>
                    <Grid item xs={12} align="center">
                        {getRes?.data?.avatar
                            ?
                            <Avatar
                                alt={getRes?.data?.firstName}
                                src={getRes?.data?._id ? `${process.env.REACT_APP_SERVER_API}api/profile/${getRes?.data?._id}/avatar/${getRes?.data?.avatar}` : ""}
                                sx={{ width: 100, height: 100 }}
                            />
                            :
                            <Avatar sx={{ width: 100, height: 100 }}>{getRes?.data?.firstName?.slice(0, 1)}</Avatar>
                        }
                    </Grid>

                    <Grid item lg={4} md={4} sm={4} xs={6}>
                        <Typography variant="subtitle1" color="secondary.dark">First Name:</Typography>
                        <Typography variant="subtitle1">{userRole?getPatientRes?.data.fName:getRes?.data?.firstName}</Typography>
                    </Grid>

                    <Grid item lg={4} md={4} sm={4} xs={6}>
                        <Typography variant="subtitle1" color="secondary.dark">Last Name:</Typography>
                        <Typography variant="subtitle1">{userRole?getPatientRes?.data.lName:getRes?.data?.lastName}</Typography>
                    </Grid>

                    <Grid item lg={4} md={4} sm={4} xs={6}>
                        <Typography variant="subtitle1" color="secondary.dark">Email:</Typography>
                        <Typography variant="subtitle1">{userRole?getPatientRes?.data.email:getRes?.data?.email}</Typography>
                    </Grid>

                    <Grid item lg={4} md={4} sm={4} xs={6}>
                        <Typography variant="subtitle1" color="secondary.dark">Phone:</Typography>
                        <Typography variant="subtitle1">{userRole?getPatientRes?.data.contactNumber:getRes?.data?.phone}</Typography>
                    </Grid>

                    <Grid item lg={4} md={4} sm={4} xs={6}>
                        <Typography variant="subtitle1" color="secondary.dark">Gender:</Typography>
                        <Typography variant="subtitle1">{userRole?getPatientRes?.data.gender:getRes?.data?.gender}</Typography>
                    </Grid>

                    <Grid item lg={4} md={4} sm={4} xs={6}>
                        <Typography variant="subtitle1" color="secondary.dark">Country:</Typography>
                        <Typography variant="subtitle1">{userRole?getPatientRes?.data.country:getRes?.data?.country}</Typography>
                    </Grid>
                   { userData.role !== USER_ROLE_DEFAULT.PATIENT &&
                    <Grid item lg={4} md={4} sm={4} xs={6}>
                        <Typography variant="subtitle1" color="secondary.dark">State:</Typography>
                        <Typography variant="subtitle1">{getRes?.data?.state}</Typography>
                    </Grid>
                    }
                    {userData.role !== USER_ROLE_DEFAULT.PATIENT &&
                    <Grid item lg={4} md={4} sm={4} xs={6}>
                        <Typography variant="subtitle1" color="secondary.dark">City:</Typography>
                        <Typography variant="subtitle1">{getRes?.data?.city}</Typography>
                    </Grid>
                    }
                    <Grid item lg={4} md={4} sm={4} xs={6}>
                        <Typography variant="subtitle1" color="secondary.dark">Zip Code:</Typography>
                        <Typography variant="subtitle1">{userRole?getPatientRes?.data.postalCode:getRes?.data?.zipCode}</Typography>
                    </Grid>
                    {userData.role !== USER_ROLE_DEFAULT.PATIENT &&
                    <Grid item lg={4} md={4} sm={4} xs={6}>
                        <Typography variant="subtitle1" color="secondary.dark">Tax ID:</Typography>
                        <Typography variant="subtitle1">{getRes?.data?.taxId}</Typography>
                    </Grid>
                    }
                </Grid>
            </Paper>

            <Paper component={"form"} onSubmit={handleSubmit(onSubmit)} elevation={3} style={{ padding: '20px', margin: 'auto', marginTop: "50px" }} className='cardStyle'>
                <Typography variant="h5">Change password</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={4} >
                        <FormControl fullWidth error={Boolean(errors.oldPassword)}>
                            <FormLabel>Old Password</FormLabel>
                            <OutlinedInput type="password" className="inputfield" fullWidth {...register('oldPassword')} />
                            {errors?.oldPassword?.message && <FormHelperText>{errors?.oldPassword?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} >
                        <FormControl fullWidth error={Boolean(errors.password)}>
                            <FormLabel>New Password</FormLabel>
                            <OutlinedInput type="password" className="inputfield" fullWidth {...register('password')} />
                            {errors?.password?.message && <FormHelperText>{errors?.password?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} >
                        <FormControl fullWidth error={Boolean(errors.confirmPassword)}>
                            <FormLabel>Confirm Password</FormLabel>
                            <OutlinedInput type="password" className="inputfield" fullWidth {...register('confirmPassword')} />
                            {errors?.confirmPassword?.message && <FormHelperText>{errors?.confirmPassword?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} textAlign={"right"}>

                        <Button type="submit" variant='contained' size="large" disabled={loading}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}

export default ViewProfile;