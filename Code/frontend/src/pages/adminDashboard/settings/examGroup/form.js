import React, { useEffect, useState } from 'react';
import { FormControl, Button, Grid, Paper, Typography, OutlinedInput, Box, FormLabel, FormHelperText } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getExamListRequest, postExamGroupRequest, putExamGroupRequest, resetPostExamGroup, resetPutExamGroup, } from '../../../../redux/modules/exam/slice';
import Select from 'react-select';

const validationSchema = yup.object().shape({
    name: yup.string().required("name is required"),
    list: yup.array().test('atLeastOne', 'Select at least one service', function (value) {
        return value && value.length > 0;
    }).nullable(),
});

const Form = ({ itemData, toggleList }) => {
    const dispatch = useDispatch();
    const [selectedOptions, setSelectedOptions] = useState(itemData?.list || []);
    let { loading, getListRes, postGroupRes, putGroupRes } = useSelector(state => state.exam);
    const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: itemData ? itemData : ""
    });

    useEffect(() => {
        dispatch(getExamListRequest())
    }, [dispatch])

    useEffect(() => {
        if (postGroupRes) {
            if (postGroupRes?.success) {
                toggleList()
            }
            toast(postGroupRes?.message)
            dispatch(resetPostExamGroup());
        }
        if (putGroupRes) {
            if (putGroupRes?.success) {
                toggleList();
            }
            toast(putGroupRes?.message);
            dispatch(resetPutExamGroup());
        }
    }, [postGroupRes, putGroupRes, toggleList, dispatch]);

    const onSubmit = (data) => {
        if (itemData?._id) {
            dispatch(putExamGroupRequest(data));
        } else {
            dispatch(postExamGroupRequest(data));
        }
    };


    const handleChange = (selected) => {
        let onlyId = selected.map(item => item._id);
        setValue("list", onlyId);
        trigger('list');
        setSelectedOptions(selected);
    };


    return (
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
            <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
                <Typography variant="h5" className='title'>Exam Group Form</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth >
                            <FormLabel>Exam Group Name</FormLabel>
                            <OutlinedInput className="inputfield" {...register('name')} size='small' placeholder="Enter Exam Group name" />
                            {errors?.name?.message && <FormHelperText>{errors?.name?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth error={Boolean(errors.referringConsultant)} className='selectDropdown'>
                            <FormLabel sx={{ marginBottom: "9px" }}>Select Exams</FormLabel>
                            <Select
                                value={selectedOptions}
                                onChange={handleChange}
                                isMulti={true}
                                options={getListRes?.data || []}
                                getOptionValue={(option) => option?._id}
                                getOptionLabel={(option) => option?.name}
                                isSearchable={true}
                                placeholder="Select a Service"
                            />
                            {errors?.list?.message && <FormHelperText>{errors?.list?.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ display: "flex", alignItems: "center", mt: 3, justifyContent: "right" }}>
                <Button className="commonBtn" type='submit' variant='contained' disabled={loading} sx={{ marginRight: "16px" }}>{itemData?._id ? "Update" : "Save"} </Button>
                <Button variant='outlined' className='btn cancelBtn' onClick={() => { toggleList() }}>Cancel</Button>
            </Box>
        </Box>
    );
};

export default Form;
