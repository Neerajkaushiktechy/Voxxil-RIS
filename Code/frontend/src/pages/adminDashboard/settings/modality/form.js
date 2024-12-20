import React, { useEffect } from 'react';
import { FormControl, Button, Grid, Paper, Typography, OutlinedInput, Box, FormLabel, FormHelperText } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { postModalityListRequest, putModalityListRequest, resetPostModalityList, resetPutModalityList  } from '../../../../redux/modules/modality/slice';

const validationSchema = yup.object().shape({
    term: yup.string().required("Name is required"),
    decription: yup.string().nullable(),
});

const Form = ({ itemData, toggleList }) => {
    const dispatch = useDispatch();
    let { loading, postListRes, putListRes } = useSelector(state => state.modalities);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: itemData ? itemData : ""
    });


    useEffect(() => {
        if (postListRes) {
            if (postListRes?.success) {
                toggleList()
            }
            toast(postListRes?.message)
            dispatch(resetPostModalityList());
        }
        if (putListRes) {
            if (putListRes?.success) {
                toggleList();
            }
            toast(putListRes?.message);
            dispatch(resetPutModalityList());
        }
    }, [postListRes, putListRes, toggleList, dispatch]);

    const onSubmit = (data) => {
        if (itemData?._id) {
            dispatch(putModalityListRequest(data));
        } else {
            dispatch(postModalityListRequest(data));
        }
    };

    return (
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
            <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
                <Typography variant="h5" className='title'>Modality List Form</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth >
                            <FormLabel>Name</FormLabel>
                            <OutlinedInput className="inputfield" {...register('term')} size='small' placeholder="Enter Modality name" />
                            {errors?.term?.message && <FormHelperText>{errors?.term?.message}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth >
                            <FormLabel>Modality Description</FormLabel>
                            <OutlinedInput className="inputfield" {...register('decription')} size='medium' placeholder="Enter Modality Description" />
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ display: "flex", alignItems: "center",mt:3,justifyContent:"right" }}>
                <Button className="commonBtn" type='submit' variant='contained' disabled={loading} sx={{ marginRight: "16px" }}>{itemData?._id ? "Update" : "Save"} </Button>
                <Button variant='outlined' className='btn cancelBtn' onClick={() => { toggleList() }}>Cancel</Button>
            </Box>
        </Box>
    );
};

export default Form;
