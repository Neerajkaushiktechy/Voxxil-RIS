import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams  } from 'react-router-dom';
import { ressetUpadtePassword, updatePasswordRequest } from '../../redux/modules/auth/authSlice';
import { toast } from 'react-toastify';
import { Box, FormControl, FormHelperText, Grid, OutlinedInput, Typography } from '@mui/material';
import styled from '@emotion/styled';


const schema = yup.object().shape({
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required')
});
const Newpassword = (props) => {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const { token } = useParams()
    console.log(token)
    const { loading, updatePasswordRes } = useSelector((state) => state.auth);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        if (!updatePasswordRes) { return }
        if (updatePasswordRes?.success) {
            navigate(`/login`)
        }
        toast(updatePasswordRes?.message)
        dispatch(ressetUpadtePassword());
    }, [updatePasswordRes, navigate,dispatch])

    const onSubmit = (data) => {
        data = {...data, Authorization: token}
        dispatch(updatePasswordRequest(data));
    };

    const Borderspace = styled("div")(({ theme }) => ({
        display: "flex",
        alignItems: "center",
        backgroundColor: theme.palette.primary.main,
        height: "100vh",
        padding: "0 100px",
        '@media (max-width:575px)': {
            padding: "0 40px",
        },

    }));

    const Mainform = styled("div")(({ theme }) => ({
        minWidth: "400px",
        backgroundColor: theme.palette.secondary.light,
        borderRadius: "16px",
        padding: "40px 60px",
        '@media (max-width:1440px)': {
            padding: "40px",
        },
        '@media (max-width:425px)': {
            minWidth: "auto",
        },
    }));

    const FormLabel = styled("div")(({ theme }) => ({
        fontSize: "18px",
        marginBottom: "8px",
        color: theme.palette.primary.dark,
    }));

    const Button = styled("button")(({ theme }) => ({
        width: "100%",
        padding: "12px 40px",
        border: "unset",
        borderRadius: "10px",
        background: theme.palette.btncolor.main,
        color: theme.palette.secondary.light,
        fontSize: "18px",
        fontWeight: "500",
        lineHeight: "normal",
        cursor: "pointer",
    }));

    const CustomOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
        '@media (max-width:575px)': {
            "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
                padding: "10px 6px",
            }
        },
    }));



    return (
        <>
            <Borderspace>
                <Grid container sx={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    <Grid item >
                        <Box>
                            <Mainform>
                                <Box>
                                    <Typography component={"h4"} variant='p' color={"primary.dark"} fontSize={"42px"} lineHeight={"normal"} fontWeight={"500"} sx={{ '@media (max-width:425px)': { fontSize: "34px" } }}>
                                        Set New Password
                                    </Typography>
                                    <Typography color={"secondary.dark"} fontSize={"18px"} lineHeight={"normal"} fontWeight={"400"} marginBottom={"30px"} sx={{ '@media (max-width:425px)': { fontSize: "16px" } }}>
                                        Must be at least 8 characters.
                                    </Typography>
                                </Box>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Box sx={{ width: "100%", textAlign: "start" }}>
                                        <FormLabel>Enter New Password</FormLabel>
                                        <FormControl sx={{ width: "100%", marginBottom: "30px" }} error={Boolean(errors.password)}>
                                            <CustomOutlinedInput type='password' {...register('password')} sx={{ font: "18px", width: "100%", padding: "0 10px", backgroundColor: "inputbg.main", borderRadius: "10px", '@media (max-width:575px)': { borderRadius: "6px" } }} placeholder="Enter new password" />
                                            {errors?.password?.message && <FormHelperText>{errors?.password?.message}</FormHelperText>}
                                        </FormControl>
                                    </Box>
                                    <Box sx={{ width: "100%", textAlign: "start" }}>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl sx={{ width: "100%", marginBottom: "30px" }} error={Boolean(errors.confirmPassword)}>
                                            <CustomOutlinedInput  type='password' {...register('confirmPassword')} sx={{ font: "18px", width: "100%", padding: "0 10px", backgroundColor: "inputbg.main", borderRadius: "10px", '@media (max-width:575px)': { borderRadius: "6px" } }} placeholder="Confirm password" />
                                            {errors?.confirmPassword?.message && <FormHelperText>{errors?.confirmPassword?.message}</FormHelperText>}
                                        </FormControl>
                                    </Box>
                                    <Button type='submit' disabled={Boolean(loading)}> Reset Password </Button>
                                </form>
                            </Mainform>
                        </Box>
                    </Grid>
                </Grid>
            </Borderspace>
        </>
    )
}

export default Newpassword;