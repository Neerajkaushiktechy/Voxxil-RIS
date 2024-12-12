import { Box, Card, Grid, Button, Typography, FormLabel, FormControl, Input } from '@mui/material'
import { getStudiesImagesRequest, getReportRequest, postReportRequest, putReportRequest, resetGetReport } from '../../../../redux/modules/report/slice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

const validationSchema = yup.object().shape({
    imageComments: yup.array().of(
        yup.object().shape({
            imageID: yup.string(),
            comment: yup.string(),
        })
    ),
    reportStatus: yup.string(),

});

export default function ImagingRadiologyReport({ itemData, onBack, setSaveType }) {
    const dispatch = useDispatch();
    let { loading, getReportRes } = useSelector(state => state.report);
    let { currentBranch } = useSelector(state => state.branch);
    const formRef = useRef(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            imageComments: itemData?.studyImages?.map(imageID => ({ imageID, comment: "" })) || [],
            reportStatus: itemData?.reportData?.reportStatus,
        },
    });

    useEffect(() => {
        if (!currentBranch) { return }
        if (itemData.reportData) { dispatch(getReportRequest(itemData.reportData?._id)); }
        if (!itemData?.studyImages && !itemData?.parentPatientResError) {
            dispatch(getStudiesImagesRequest({ orthancStudyID: itemData?.studyData?.orthancStudyID }));
        }
        else {
            setValue('imageComments', itemData?.studyImages?.map(imageID => ({ imageID, comment: "" })) || []);
        }
    }, [dispatch, itemData, setValue]);

    useEffect(() => {
        if (getReportRes) {
            if (getReportRes?.success) {
                // Iterate through imageComments and set values
                getReportRes.data.imageComments.forEach((comment, index) => {
                    setValue(`imageComments.${index}.comment`, comment.comment);
                });
            }
            dispatch(resetGetReport());
        }
    }, [dispatch, getReportRes, setValue, itemData]);


    if (loading) {
        return <Typography sx={{ color: "primary.dark", fontSize: "30px", fontWeight: "600", textAlign: "center" }}>Fetching Images Please Wait...</Typography>
    }

    if (itemData?.parentPatientResError) {
        return <Typography sx={{ color: "primary.dark", fontSize: "30px", fontWeight: "600", textAlign: "center" }}>{itemData?.parentPatientResError}</Typography>
    }


    const onSubmit = (data) => {
        if (itemData?.reportData?._id) {
            data.reportId = itemData?.reportData?._id;
            dispatch(putReportRequest(data));
        } else {
            dispatch(postReportRequest(data));
        }
    };

    return (
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)} ref={formRef}>
            <Card className='cardStyle' sx={{ marginTop: "40px" }}>
                <Typography sx={{ color: "primary.dark", fontSize: "30px", fontWeight: "600", textAlign: "center" }}>Dicom Images</Typography>
                <Grid container spacing={2}>
                    {itemData?.studyImages?.map(item => {
                        return (
                            <Grid key={item} item lg={6} md={6} sm={6} xs={12} className='girdMarginBottom'>
                                {/* <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }} >Anatomy Label</FormLabel> */}
                                {/* <FormControl fullWidth className='inputfield'> */}
                                <a href={`${process.env.REACT_APP_ORTHANC_SERVER_URL}/stone-webviewer/index.html?study=${itemData?.studyData?.orthancStudyInstanceUID}`} target="_blank" rel="noreferrer">
                                    <img src={`${process.env.REACT_APP_ORTHANC_SERVER_URL}/instances/${item}/preview`} alt="Description of the " />
                                </a>
                                {/* </FormControl> */}
                                <Box>
                                    <FormLabel sx={{ fontSize: "20px", color: "primary.dark" }}>Comment</FormLabel>
                                </Box>
                                <FormControl fullWidth className='inputfield'>
                                    <Input fullWidth
                                        placeholder='Enter here'
                                        sx={{ padding: "14px", paddingRight: "0", paddingLeft: "0" }}
                                        disableUnderline
                                        multiline
                                        minRows="2"
                                        {...register(`imageComments.${itemData?.studyImages?.indexOf(item)}.comment`)}
                                    />
                                </FormControl>
                                {/* <Button className='commonBtn' variant="contained">Save</Button> */}
                            </Grid>
                        )
                    })}

                </Grid>
            </Card>
            <Box sx={{ display: "flex", justifyContent: "space-between", paddingTop: "20px", marginTop: "20px" }}>
                <Button onClick={onBack} className='commonBtn' variant="contained">
                    Back
                </Button>
                {/* <Button className='commonBtn' variant="contained" onClick={onNext}>Save And Exit</Button> */}
                <Button type="submit" className='commonBtn' variant="contained" onClick={() => { setSaveType("next") }} disabled={loading}> Next</Button>
            </Box>
        </Box>
    )
}
