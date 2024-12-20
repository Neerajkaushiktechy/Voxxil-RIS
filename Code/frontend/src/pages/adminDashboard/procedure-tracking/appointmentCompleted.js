import { Box, Button, FormControl, FormHelperText, FormLabel, Grid, Input, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useEffect } from "react";
import SelectStaff from "../radiology/form/SelectStaff";
import { getRequest, getStaffList } from "../../../redux/modules/staff/slice";
import { getIdRequest, putAppointmentStatusRequest, resetPutAppointmentStatus } from "../../../redux/modules/orders/slice";

const validationSchema = yup.object().shape({
    status: yup.string().required("Appoinment Status is required"),
    appoinmentCompleteDescription: yup.string().required("Examination Comment is required"),
    appoinmentCompleteStaffId: yup.string().required("Staff is required"),
    appoinmentCompleteStaffSignaturePin: yup.string().required("Staff Signature Pin is required"),
});

const AppointmentCompleted = ({ orderId }) => {
    const dispatch = useDispatch();
    let { loading, putOrderStatus } = useSelector(state => state.orders);
    const { register, handleSubmit, formState: { errors }, getValues, setValue, trigger } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (putOrderStatus) {
            if (putOrderStatus?.success) {
                dispatch(getIdRequest(orderId))
            }
            toast(putOrderStatus?.message)
            dispatch(resetPutAppointmentStatus());
        }

    }, [putOrderStatus, orderId, dispatch]);

    useEffect(() => {
        dispatch(getStaffList())
        // dispatch(getRequest(""));
    }, [dispatch])

    const onSubmit = (data) => {
        if (!orderId) { return toast("There is some error please ry again later"); }
        dispatch(putAppointmentStatusRequest({ ...data, orderId }));
    };


    const setApointer = (id) => {
        setValue("appoinmentCompleteStaffId", id);
        setValue("appoinmentCompleteStaffSignaturePin", "")
        trigger("appoinmentCompleteStaffId")
    }

    return (
        <>
            <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <FormLabel required>Appointment Status</FormLabel>
                            <Select size='small' className="inputfield" defaultValue={getValues()?.status || "Appointment Complete"} {...register('status')}>
                                <MenuItem value={"Appointment Miss"}>Appointment Miss</MenuItem>
                                <MenuItem value={"Appointment Complete"}>Appointment Complete</MenuItem>
                                <MenuItem value={"Appointment Cancelled"}>Appointment Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormLabel required>Examination Comment</FormLabel>
                        <FormControl fullWidth className='inputfield' >
                            <Input fullWidth placeholder='Examination Comment' sx={{ padding: "0" }} {...register('appoinmentCompleteDescription')} disableUnderline multiline minRows="2" />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth className='selectDropdown' >
                            <FormLabel sx={{ marginBottom: "10px" }} required>Staff</FormLabel>
                            <SelectStaff setUserData={setApointer} defaultId={getValues()?.staff} />
                            {errors?.staff?.message && <FormHelperText>{errors?.staff?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth >
                            <FormLabel required>Enter Appointer Signature Pin</FormLabel>
                            <OutlinedInput className="inputfield" type="password" size='small' {...register("appoinmentCompleteStaffSignaturePin")} />
                            {errors?.staffSignaturePin?.message && <FormHelperText>{errors?.staffSignaturePin?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                </Grid>

                <Button className="commonBtn" type='submit' variant='contained' disabled={loading} sx={{ marginTop: "30px" }}>Save</Button>
            </Box>
        </>
    );
}
export default AppointmentCompleted;