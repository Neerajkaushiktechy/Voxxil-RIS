import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, FormLabel, FormControl, FormHelperText, OutlinedInput } from '@mui/material';
import { useForm } from 'react-hook-form';
import CancelIcon from '@mui/icons-material/Cancel';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const validationSchema = yup.object().shape({
    denialReasonText: yup.string().required("Validation for denial reason is required"),
});



const DeclineOrderDialog = (props) => {
    const { message, handleConfirmDialogClose, handleConfirmDialogConfirm, showConfirmationDialog } = props;
    const handleClose = () => props.handleConfirmDialogClose(false);
    const { register, handleSubmit, formState: { errors }, setValue, getValues, trigger, clearErrors } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data) => {
        handleConfirmDialogConfirm(data)
    };


    return (
        <Dialog open={showConfirmationDialog} onClose={() => handleConfirmDialogClose(false)} component={"form"} onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
                {message}
                <Box
                    component="form"
                    // sx={{
                    //     '& .MuiTextField-root': { m: 1 },
                    // }}
                    noValidate
                    autoComplete="off"
                    sx={{ marginTop: "16px !important",}}
                >
                    <FormLabel sx={{ fontSize: "16px", color: "primary.dark" }} required>Denial Validation Text</FormLabel>
                    <FormControl fullWidth error={Boolean(errors?.denialReasonText)} className='inputfield' sx={{
                               marginTop: "6px !important",
                                "& .MuiInputBase-root": {
                                  padding: "0px !important",
                                },
                              }}>
                        <OutlinedInput placeholder='Denial Validation Text' fullWidth {...register('denialReasonText')}
                            rows={3}
                            multiline
                            inputProps={{style: {fontSize: '16px', padding:'10px'}}}
                        />
                        {errors?.denialReasonText?.message && <FormHelperText>{errors?.denialReasonText?.message}</FormHelperText>}
                    </FormControl>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => handleConfirmDialogClose(false)} color="primary">
                    Cancel
                </Button>
                <Button color="primary" type='submit'>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeclineOrderDialog;