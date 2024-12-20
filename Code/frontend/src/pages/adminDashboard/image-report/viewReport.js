import { React, useEffect, useRef, useState } from 'react'
import { Box, Typography, Divider, Button, Grid } from '@mui/material'
import logo from '../../../assets/images/Logo.png'
import { useDispatch, useSelector } from 'react-redux';
import { getReportRequest, getStudiesImagesRequest, resetGetReport } from '../../../redux/modules/report/slice';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';

export default function ViewReport({ itemData }) {
    const dispatch = useDispatch();
    const componentRef = useRef();
    let { currentBranch } = useSelector(state => state.branch);
    let { loading, getReportRes } = useSelector(state => state.report);
    const [reportInfo, setReportInfo] = useState(null);
    useEffect(() => {
        if (!currentBranch) { return }
        dispatch(getReportRequest(itemData?.reportData?._id));
    }, [dispatch, currentBranch, itemData]);


    useEffect(() => {
        if (getReportRes && getReportRes?.success) {
            setReportInfo(getReportRes.data)
            if (!itemData?.studyImages && !itemData?.parentPatientResError && getReportRes?.data?.reportStatus === "completed") {
                dispatch(getStudiesImagesRequest({ orthancStudyID: itemData?.studyData?.orthancStudyID }));
            }
            // dispatch(resetGetReport())
        }
    }, [dispatch, getReportRes, itemData])

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const calculateAge = (dateOfBirth) => moment().diff(moment(dateOfBirth), 'years');
    return (
        <Box ref={componentRef} p={5} sx={{ maxWidth: "1100px", margin: "0 auto", fontFamily: 'Helvetica' }}>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={logo} style={{ width: "70px" }} alt="Logo" />
            </Box>


            {loading ? <Typography sx={{ color: "primary.dark", fontSize: "30px", fontWeight: "600", textAlign: "center" }}>Fetching Data please wait Images...</Typography>
                :
                <>
                    <Grid className='customFont'>
                        <Grid container spacing={2} sx={{ marginTop: "20px", padding: "0" }}>
                            <Grid item xs={6}>
                                <Box style={{ display: 'flex', gap: "10px" }}>
                                    <Typography sx={{ flexShrink: 0, fontSize: "15px", fontWeight: "600", color: "primary.dark" }}> Patient Name :</Typography>
                                    <Typography sx={{ color: "#052F5D", fontSize: "15px", fontWeight: "400", textTransform: "capitalize" }}> {itemData?.seletedpatient?.fName} {itemData?.seletedpatient?.lName}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box style={{ display: 'flex', gap: "10px" }}>
                                    <Typography sx={{ flexShrink: 0, fontSize: "15px", fontWeight: "600", color: "primary.dark" }}>DOB :</Typography>
                                    <Typography sx={{ color: "#052F5D", fontSize: "15px", fontWeight: "400" }}> {itemData?.seletedpatient?.dob}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box style={{ display: 'flex', gap: "10px" }}>
                                    <Typography sx={{ flexShrink: 0, fontSize: "15px", fontWeight: "600", color: "primary.dark" }}>Gender :</Typography>
                                    <Typography sx={{ color: "#052F5D", fontSize: "15px", fontWeight: "400", textTransform: "capitalize" }}> {itemData?.seletedpatient?.gender}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box style={{ display: 'flex', gap: "10px" }}>
                                    <Typography sx={{ flexShrink: 0, fontSize: "15px", fontWeight: "600", color: "primary.dark" }}> Age :</Typography>
                                    <Typography sx={{ color: "#052F5D", fontSize: "15px", fontWeight: "400" }}>{calculateAge(itemData?.seletedpatient?.dob)}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box style={{ display: 'flex', gap: "10px" }}>
                                    <Typography sx={{ flexShrink: 0, fontSize: "15px", fontWeight: "600", color: "primary.dark" }}> Referring Doctor :</Typography>
                                    <Typography sx={{ color: "#052F5D", fontSize: "15px", fontWeight: "400", textTransform: "capitalize" }}>{itemData?.referringDoctor}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box style={{ display: 'flex', gap: "10px" }}>
                                    <Typography sx={{ flexShrink: 0, fontSize: "15px", fontWeight: "600", color: "primary.dark" }}> Appointment Date :</Typography>
                                    <Typography sx={{ color: "#052F5D", fontSize: "15px", fontWeight: "400" }}>{itemData?.appointmentDate?.split('T')[0]}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box style={{ gap: "10px" }}>
                                    <Typography sx={{ flexShrink: 0, fontSize: "15px", fontWeight: "600", color: "primary.dark" }}> Reason for Exam :</Typography>
                                    <Typography sx={{ color: "#052F5D", fontSize: "15px", fontWeight: "400", textTransform: "capitalize", textAlign: "justify", marginTop: "5px" }}>{itemData?.examReason}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Divider sx={{ color: "black", marginTop: "10px", marginBottom: "30px" }} />

                        <Box style={{ marginBottom: "20px" }}>
                            <Typography sx={{ flexShrink: 0, fontSize: "15px", fontWeight: "600", }}>Clinical Details :</Typography>
                            <Typography sx={{ color: "black", fontSize: "15px", textAlign: "justify", marginTop: "5px" }}>{reportInfo?.clinicalInfo || "N/A"}</Typography>
                        </Box>

                        <Box style={{ marginBottom: "20px" }}>
                            <Typography sx={{ flexShrink: 0, fontSize: "15px", fontWeight: "600" }}>Diagnostic Objectives :</Typography>
                            <Typography sx={{ color: "black", fontSize: "15px", textAlign: "justify", marginTop: "5px" }}>{reportInfo?.diagnosticObjectives || "N/A"}</Typography>
                        </Box>

                        <Box style={{ marginBottom: "20px" }}>
                            <Typography sx={{ flexShrink: 0, fontSize: "15px", fontWeight: "600" }}>Findings :</Typography>
                            <Typography sx={{ color: "black", fontSize: "15px", textAlign: "justify", marginTop: "5px" }}>
                                {reportInfo?.findings || "N/A"}
                            </Typography>
                        </Box>

                        <Box style={{ marginBottom: "20px" }}>
                            <Typography sx={{ flexShrink: 0, fontSize: "15px", fontWeight: "600" }}>Radiographic Impression : </Typography>
                            <Typography sx={{ color: "black", fontSize: "15px", textAlign: "justify", marginTop: "5px" }}>
                                {reportInfo?.radiographicImpression || "N/A"}
                            </Typography>
                        </Box>

                        {reportInfo?.appointerId?._id &&
                            <Box>
                                <Typography sx={{ fontSize: "15px", fontWeight: "600", }}>Radiologist name and signature :</Typography>
                                <Typography sx={{ color: "black", fontSize: "15px", marginTop: "5px" }}>Thank you for the referral of this patient and the opportunity to serve your practice.</Typography>
                                <Box textAlign={"right"}>
                                    <img alt={reportInfo?.appointerId?.firstName} src={`${process.env.REACT_APP_SERVER_API}api/profile/${reportInfo?.appointerId?._id}/signatureImage/signature.png`} style={{ height: "100px" }} />
                                    <Typography sx={{ fontSize: "15px", fontWeight: "600" }}>{reportInfo?.appointerId?.firstName} {reportInfo?.appointerId?.lastName}</Typography>
                                </Box>
                            </Box>
                        }
                        {/* 
                    {reportInfo?.orthancStudy &&

                        <Box sx={{ marginTop: "10px" }}>
                            <Typography sx={{ fontWeight: 'bold', marginTop: "20px" }}>The following are selected images from the volume illustrating major findings</Typography>
                            <img style={{ maxWidth: '500px' }} src={`${process.env.REACT_APP_ORTHANC_SERVER_URL}/${reportInfo.instances.Path}/preview`} alt="Description of the " />
                            <Typography>{reportInfo?.orthancStudy?.MainDicomTags?.StudyDescription}</Typography>
                        </Box>
                    } */}

                        {/* {insatnceList && insatnceList?.map((elem) => {
                        return (
                            <Box sx={{ marginTop: "10px" }}>
                                <img style={{ width: '50%' }} src={`${process.env.REACT_APP_ORTHANC_SERVER_URL}/instances/${elem.ID}/preview`} alt="Description of the " />
                            </Box>
                        )
                    })} */}

                        <Grid container spacing={2}>
                            {itemData?.studyImages?.map(item => {
                                const commentInfo = getReportRes?.data?.imageComments.find(comment => comment.imageID === item);
                                const commentText = commentInfo ? commentInfo.comment : "No comment available";
                                return (
                                    <Grid key={item} item lg={6} md={6} sm={6} xs={12} className='girdMarginBottom'>
                                        <a href={`${process.env.REACT_APP_ORTHANC_SERVER_URL}/stone-webviewer/index.html?study=${itemData?.studyData?.orthancStudyInstanceUID}`} target="_blank" rel="noreferrer">
                                            <img src={`${process.env.REACT_APP_ORTHANC_SERVER_URL}/instances/${item}/preview`} alt="Description of the " />
                                        </a>
                                        <Typography sx={{ flexShrink: 0, fontSize: "15px", fontWeight: "600", }}>Comment : </Typography>
                                        <Typography sx={{ color: "black", fontSize: "15px", textAlign: "justify" }}> {commentText}</Typography>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>

                    {reportInfo?.appointerId?._id &&
                        <Button className='commonBtn' variant="contained" onClick={() => handlePrint()} sx={{
                            marginTop: "50px",
                            display: "flex",
                            justifyContent: "left",
                            marginLeft: 'auto',
                            '@media print': { display: 'none' }
                        }}>Print Report</Button>
                    } 
                </>
            }
        </Box >
    )
}
