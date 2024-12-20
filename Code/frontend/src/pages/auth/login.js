import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    loginRequest,
    resetLoginRequest,
} from "../../redux/modules/auth/authSlice";
import { toast } from "react-toastify";
import {
    Box,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Radio,
    RadioGroup,
    Typography,
    Select,
    MenuItem,
} from "@mui/material";
import styled from "@emotion/styled";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Borderspace = styled("div")(({ theme }) => ({
    padding: "100px",
    "@media (max-width:1024px)": {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#69cbf9",
        height: "100vh",
        padding: "0 100px",
    },
    "@media (max-width:575px)": {
        padding: "0 60px",
    },
}));

const Mainimg = styled("div")(({ theme }) => ({
    margin: "auto",
    maxWidth: "470px",
}));

const Mainform = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.secondary.light,
    borderRadius: "16px",
    padding: "30px 40px",
    "@media (max-width:1440px)": {
        padding: "40px",
    },
}));

const FormLabel = styled("div")(({ theme }) => ({
    fontSize: "18px",
    marginBottom: "8px",
    color: theme.palette.primary.dark,
}));

const CustomLink = styled(Link)(({ theme }) => ({
    display: "inline-block",
    textAlign: "end",
    marginBottom: "30px",
    fontSize: "16px",
    color: theme.palette.primary.dark,
    cursor: "pointer",
    textDecoration: "unset",
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

const Radiobtn = styled(FormControlLabel)(({ theme }) => ({
    position: "relative",
    padding: "7px 26px",
    borderRadius: "6px",
    background: theme.palette.secondary.light,
    border: "1px solid",
    borderColor: theme.palette.btncolor.main,
    color: "#052F5D",
    fontSize: "18px",
    fontWeight: "500",
    lineHeight: "normal",
    cursor: "pointer",

    "& .MuiRadio-root": {
        position: "absolute",
        top: "8px",
        right: "8px",
        padding: "0",
        width: "16px",
        height: "16px",
    },

    "& .MuiTypography-root": {
        minWidth: "103px",
        fontWeight: "500",
    },

    "@media (max-width:1200px)": {
        "& .MuiTypography-root": {
            fontSize: "16px",
            minWidth: "81px",
            fontWeight: "500",
        },
    },
    "@media (max-width:425px)": {
        width: "100%",

        "& span": {
            width: "100%",
        },

        "& .MuiRadio-root": {
            right: "12px",
        },
    },
}));

const CustomOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
    "@media (max-width:575px)": {
        "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
            padding: "10px 6px",
        },
    },
}));
const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
    role: yup.string().required("Please select Login user type"),
});
const Login = () => {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const { loading, isLoggedIn, res, userData } = useSelector(
        (state) => state.auth
    );
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        trigger,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (res) {
            if (isLoggedIn) {
                navigate(`/${userData.role}`);
            }
            toast(res?.message);
            dispatch(resetLoginRequest());
        }
    }, [res, userData, isLoggedIn, navigate, dispatch]);

    const onSubmit = (data) => {
        dispatch(loginRequest(data));
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <>
            <Borderspace>
                <Grid
                    container
                    sx={{
                        width: "100%",
                        background: "linear-gradient(180deg, #E8F7FE, #69cbf9)",
                        borderRadius: "60px",
                        "@media (max-width:1024px)": { background: "transparent" },
                    }}
                >
                    <Grid
                        item
                        lg={6}
                        md={12}
                        sx={{
                            backgroundColor: "#E8F7FE",
                            minHeight: "747px",
                            borderRadius: "60px 80px 80px 60px",
                            "@media (max-width:1440px)": {
                                borderRadius: "40px 60px 60px 40px",
                            },
                            "@media (max-width:1024px)": { display: "none" },
                        }}
                    >
                        <Box
                            sx={{
                                marginBottom: "40px",
                                marginTop: "60px",
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                component={"h1"}
                                variant="p"
                                color={"primary.dark"}
                                fontSize={"60px"}
                                lineHeight={"normal"}
                            >
                                Hello,
                            </Typography>
                            <Typography
                                component={"h4"}
                                variant="p"
                                color={"primary.dark"}
                                fontSize={"42px"}
                                lineHeight={"140.2%"}
                                fontWeight={"500"}
                            >
                                Welcome to Voxxil RIS
                            </Typography>
                        </Box>
                        <Mainimg>
                            <img
                                alt="Login"
                                src={require("../../assets/images/Main-Img.png")}
                            />
                        </Mainimg>
                    </Grid>
                    <Grid
                        item
                        lg={6}
                        md={12}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            backgroundColor: "#69CBF9",
                            minHeight: "747px",
                            borderRadius: "80px 60px 60px 80px",
                            "@media (max-width:1440px)": {
                                borderRadius: "60px 40px 40px 60px",
                            },
                            "@media (max-width:1024px)": {
                                backgroundColor: "transparent",
                                minHeight: "unset",
                            },
                        }}
                    >
                        <Box
                            textAlign={"center"}
                            sx={{
                                width: "100%",
                                padding: "60px 108px",
                                "@media (max-width:1440px)": { padding: "30px 40px" },
                                "@media (max-width:1024px)": {
                                    backgroundColor: "transparent",
                                    padding: "0",
                                },
                            }}
                        >
                            <Mainform>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Box>
                                        <Typography
                                            component={"h4"}
                                            variant="p"
                                            color={"primary.dark"}
                                            fontSize={"42px"}
                                            lineHeight={"normal"}
                                            fontWeight={"500"}
                                        >
                                            Login
                                        </Typography>
                                        <Typography
                                            color={"secondary.dark"}
                                            fontSize={"18px"}
                                            lineHeight={"normal"}
                                            fontWeight={"400"}
                                            marginBottom={"30px"}
                                        >
                                            Please enter the required fields.
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <FormControl
                                            sx={{ marginBottom: "30px" }}
                                            error={Boolean(errors.email)}
                                        >
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                                sx={{ "@media (max-width:425px)": { width: "100%" } }}
                                            >
                                                
                                                <Radiobtn
                                                    value="staff"
                                                    control={
                                                        <Radio
                                                            checked={getValues("role") === "staff"}
                                                            onChange={() => {
                                                                setValue("role", "staff");
                                                                trigger("role");
                                                            }}
                                                        />
                                                    }
                                                    label="Staff"
                                                    sx={{
                                                        marginRight: "10",
                                                        '& .MuiRadio-root': {
                                                            alignItems: "baseline",
                                                        },
                                                        "@media (max-width:425px)": {
                                                            marginTop: "10px",
                                                            marginLeft: "0",
                                                        },
                                                    }}
                                                />
                                                <Radiobtn
                                                    value="patient"
                                                    control={
                                                        <Radio
                                                            checked={getValues("role") === "patient"}
                                                            onChange={() => {
                                                                setValue("role", "patient");
                                                                trigger("role");
                                                            }}
                                                        />
                                                    }
                                                    label="Patient"
                                                    aria-checked="true"
                                                    sx={{
                                                        marginRight: "0",
                                                        '& .MuiRadio-root': {
                                                            alignItems: "baseline",
                                                        },
                                                        marginLeft: "0",
                                                        "@media (max-width:425px)": { margin: "auto" },
                                                    }}
                                                />
                                            </RadioGroup>
                                            {errors?.role?.message && (
                                                <FormHelperText>
                                                    {errors?.role?.message}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        
                                    </Box>
                                    <Box sx={{ width: "100%", textAlign: "start" }}>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl
                                            sx={{ width: "100%", marginBottom: "30px" }}
                                            error={Boolean(errors.email)}
                                        >
                                            <CustomOutlinedInput
                                                {...register("email")}
                                                sx={{
                                                    font: "18px",
                                                    width: "100%",
                                                    padding: "0 10px",
                                                    backgroundColor: "inputbg.main",
                                                    borderRadius: "10px",
                                                    "@media (max-width:575px)": { borderRadius: "6px" },
                                                }}
                                                placeholder="Enter your email"
                                            />
                                            {errors?.email?.message && (
                                                <FormHelperText>
                                                    {errors?.email?.message}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Box>
                                    <Box sx={{ textAlign: "start" }}>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl
                                            sx={{ width: "100%", marginBottom: "20px" }}
                                            error={Boolean(errors.password)}
                                        >
                                            <CustomOutlinedInput
                                                {...register("password")}
                                                type={showPassword ? "text" : "password"}
                                                sx={{
                                                    font: "18px",
                                                    width: "100%",
                                                    padding: "0 10px",
                                                    backgroundColor: "inputbg.main",
                                                    borderRadius: "10px",
                                                    "@media (max-width:575px)": { borderRadius: "6px" },
                                                }}
                                                placeholder="Enter your password"
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            type="button"
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? (
                                                                <VisibilityOff />
                                                            ) : (
                                                                <Visibility />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                            {errors?.password?.message && (
                                                <FormHelperText>
                                                    {errors?.password?.message}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Box>
                                    {/* <Box sx={{ width: "100%", textAlign: "start" }}>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl sx={{ width: "100%", marginBottom: "30px" }} error={Boolean(errors.role)}>
                                            <Select
                                                {...register("role")} value={getValues("role")} onChange={(e) => {
                                                    setValue("role", e.target.value);
                                                    trigger("role");
                                                }}
                                            >
                                                <MenuItem value="admin">Admin</MenuItem>
                                                <MenuItem value="juniorRadiologist">Junior Radiologist</MenuItem>
                                                <MenuItem value="seniorRadiologist">Senior Radiologist</MenuItem>
                                                <MenuItem value="radiologist">Radiologist</MenuItem>
                                                <MenuItem value="cardiothoracicRadiology">Cardiothoracic Radiology</MenuItem>
                                                <MenuItem value="patient">Patient</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box> */}
                                    <Box textAlign={"right"}>
                                        <CustomLink to="/forgot-password">
                                            Forgot Password?
                                        </CustomLink>
                                    </Box>
                                    <Button type="submit" disabled={Boolean(loading)}>
                                        Login
                                    </Button>
                                </form>
                            </Mainform>
                        </Box>
                    </Grid>
                </Grid>
            </Borderspace>
        </>
    );
};

export default Login;
