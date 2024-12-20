import React, { useEffect } from 'react';
import { FormControl, Button, Grid, Paper, Typography, OutlinedInput, Box, FormLabel, FormHelperText } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { postExamListRequest, putExamListRequest, resetPostExamList, resetPutExamList } from '../../../../redux/modules/exam/slice';
import MultiSelect from './component/MultiSelect';
import AutoCompleteWithLabel from './component/AutoCompleteWithLabel';
import { getModalityListRequest } from '../../../../redux/modules/modality/slice';

const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    modality: yup.array(
        yup.object({
            decription: yup.string().required(),
            term: yup.string().required(),
            _id: yup.string().required()
        })
      ).min(1, 'Modality is required').required("Modality is required"),
    // modality: yup.string().required("Modality is required"),
    // modalityDescription: yup.string().nullable()
});

const Form = ({ itemData, toggleList }) => {
    const dispatch = useDispatch();
    const modalities = useSelector(state => state.modalities.modalities.data)

    useEffect(() => {
        dispatch(getModalityListRequest({  page:1, limit:200, searchQuery:''}))
    }, [dispatch]);

    let { loading, postListRes, putListRes } = useSelector(state => state.exam);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: itemData ? itemData : ""
    });

    const updateModalityValues = (values) => {
        console.log('newValue', values)
        setValue('modality', values);
    }


    useEffect(() => {
        if (postListRes) {
            if (postListRes?.success) {
                toggleList()
            }
            toast(postListRes?.message)
            dispatch(resetPostExamList());
        }
        if (putListRes) {
            if (putListRes?.success) {
                toggleList();
            }
            toast(putListRes?.message);
            dispatch(resetPutExamList());
        }
    }, [postListRes, putListRes, toggleList, dispatch]);

    const onSubmit = (data) => {
        if (itemData?._id) {
            dispatch(putExamListRequest(data));
        } else {
            dispatch(postExamListRequest(data));
        }
    };

    console.log(itemData?.modality);

    return (
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
            <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
                <Typography variant="h5" className='title'>Exam List Form</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth >
                            <FormLabel>Exam Name</FormLabel>
                            <OutlinedInput className="inputfield" {...register('name')} size='small' placeholder="Enter Exam name" />
                            {errors?.name?.message && <FormHelperText>{errors?.name?.message}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth >
                            <FormLabel>Modality</FormLabel>
                            {/* <MultiSelect modalities={modalities} /> */}
                            {modalities && modalities.length > 0 ? <AutoCompleteWithLabel modalities={modalities} updateModalityValues={updateModalityValues} 
                                existingModality = {Array.isArray(itemData?.modality) && itemData?.modality.length > 0 ?  itemData?.modality : []}
                            />:null}
                            
                            {errors?.modality?.message && <FormHelperText>{errors?.modality?.message}</FormHelperText>}
                        </FormControl>
                        {/* <FormControl fullWidth >
                            <FormLabel>Modality Description</FormLabel>
                            <OutlinedInput className="inputfield" {...register('modalityDescription')} size='medium' placeholder="Enter Modality Description" />
                        </FormControl> */}
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
