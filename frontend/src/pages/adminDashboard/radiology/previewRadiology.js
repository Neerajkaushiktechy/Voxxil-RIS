import styled from "@emotion/styled";
import { Box, Button, Checkbox, FormControlLabel, Grid, Paper, Radio, Table, TableBody, TableHead, TableRow, Typography } from "@mui/material"
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useEffect, useState } from "react";
import { getIdRequest } from "../../../redux/modules/radiology/slice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const PreviewRadiology = ({ setPreviewRadiology, itemData }) => {
    const dispatch = useDispatch();
    let { getIdRes } = useSelector(state => state.radiology);
    const [radiologyData, setRadiologyData] = useState({
    });

    useEffect(() => {
        if (itemData?.id) {
            dispatch(getIdRequest(itemData.id));
        }
    }, [dispatch, itemData])

    useEffect(() => {
        if (!getIdRes?.success) {
            toast(getIdRes?.message)
        }

        if (getIdRes?.data?._id) {
            setRadiologyData(getIdRes?.data)
        }
    }, [getIdRes, setPreviewRadiology]);

    const handlePrint = () => {
        const printContent = document.getElementById("print-content");
        if (printContent) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContent.innerHTML;
            window.print();
            document.body.innerHTML = originalContents;
        }
    }
    return (
        <Box mt={5} className="previewDataTitle" >
            <Box id="print-content">
                <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
                    <Typography variant="h5" className='title'>Appointment</Typography>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Typography color="secondary.secondary">Category</Typography>
                            <Typography sx={{ fontWeight: 500 }}  >{radiologyData?.appoinmentId?.appoinmentCategory}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Typography color="text.secondary">Appointment Start Date</Typography>
                            <Typography sx={{ fontWeight: 500 }}>{moment.utc(radiologyData?.appoinmentId?.startTime).format('MM/DD/YYYY HH:mm:ss')}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Typography color="text.secondary">Appointment End Date</Typography>
                            <Typography sx={{ fontWeight: 500 }}>{moment.utc(radiologyData?.appoinmentId?.endTime).format('MM/DD/YYYY HH:mm:ss')}</Typography>
                        </Grid>

                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Typography color="text.secondary">Referring Consultant / GP</Typography>
                            <Typography sx={{ fontWeight: 500 }}>{radiologyData?.appoinmentId?.referId ? `${radiologyData?.appoinmentId?.referId}` : "-"}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Typography color="text.secondary">Pregnant </Typography>
                            <Typography sx={{ fontWeight: 500, textTransform: 'capitalize' }} color="primary.dark">{String(radiologyData?.appoinmentId?.isPregnant)}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Typography color="text.secondary">Lmp</Typography>
                            <Typography sx={{ fontWeight: 500 }}>{radiologyData?.appoinmentId?.isPregnant ? `${radiologyData?.appoinmentId?.lmp} week ago` : "-"}</Typography>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
                    <Typography variant="h5" className='title'>Patient Details</Typography>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Typography color="text.secondary">First Name </Typography>
                            <Typography sx={{ fontWeight: 500 }}>{radiologyData?.patientId?.fName}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Typography color="text.secondary">Last Name </Typography>
                            <Typography sx={{ fontWeight: 500 }}>{radiologyData?.patientId?.lName}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Typography color="text.secondary">Email </Typography>
                            <Typography sx={{ fontWeight: 500 }}>{radiologyData?.patientId?.email}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Typography color="text.secondary">D.O.B </Typography>
                            <Typography sx={{ fontWeight: 500 }}> {moment(radiologyData?.patientId?.dob).format('DD/MM/YYYY')}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Typography color="text.secondary">Gender </Typography>
                            <Typography sx={{ fontWeight: 500 }}>{radiologyData?.patientId?.gender}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
                <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
                    <Table className='commonTable'>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Tick/Exam</StyledTableCell>
                                <StyledTableCell>Modality</StyledTableCell>
                                <StyledTableCell>Group</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {radiologyData?.examList?.length > 0 ?
                                radiologyData?.examList?.map((item, index) => (
                                    item?.examListModality?.length > 0 &&
                                    item?.examListModality?.map(elem => (
                                        <StyledTableRow key={`${elem._id}-${index}`}>
                                            <StyledTableCell align="left">
                                                <Typography>{elem.examName}</Typography>
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                <Typography>{`${elem.modalityName}(${elem.modalityDescription})`}</Typography>
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                <Typography>{item.group.name}</Typography>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                ))
                                :
                                <StyledTableRow>
                                    <StyledTableCell colSpan={3} align="left"><Typography>There is no data to show</Typography></StyledTableCell>
                                </StyledTableRow>
                            }
                        </TableBody>
                    </Table>
                </Paper>

                <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
                    <Typography variant="h5" className='title'>Special Instructions</Typography>
                    <Box className='patientData'>
                        <Grid container spacing={2}>
                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <Typography sx={{ fontWeight: "500" }}>Special Instructions</Typography>
                            </Grid>
                            <Grid item lg={8} md={8} sm={8} xs={12}>
                                <Box sx={{ display: "flex", alignItems: "baseline" }}>
                                    <Box>
                                        <FormControlLabel control={<Checkbox checked={radiologyData?.isCorrectPatient || false} />} label={"Correct Patient "} />
                                    </Box>
                                    <Box mr={4}>-</Box>
                                    <Box>
                                        <Typography>{radiologyData?.correctPatientValue}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "baseline" }}>
                                    <Box>
                                        <FormControlLabel control={<Checkbox checked={radiologyData?.isCorrectSide || false} />} label={"Correct Side"} />
                                    </Box>
                                    <Box mr={4}>-</Box>
                                    <Box>
                                        <Typography>{radiologyData?.correctSideValue}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "baseline" }}>
                                    <Box>
                                        <FormControlLabel control={<Checkbox checked={radiologyData?.isCorrectProcedure || false} />} label={"Correct Procedure "} />
                                    </Box>
                                    <Box mr={4}>-</Box>
                                    <Box>
                                        <Typography>{radiologyData?.correctProcedureValue}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <Typography sx={{ fontWeight: "500" }}>Option Selected</Typography>
                            </Grid>
                            <Grid item lg={8} md={8} sm={8} xs={12}>

                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Box>
                                        <Typography color="text.secondary">Contrast </Typography>
                                    </Box>
                                    <Box mr={4}>-</Box>
                                    <Box>
                                        <Typography>{radiologyData?.contrastValue === "true" ? "Yes" : "No"}</Typography>
                                    </Box>
                                </Box>

                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <Typography sx={{ fontWeight: "500" }}>Allergies/Infection Status?</Typography>
                            </Grid>
                            <Grid item lg={8} md={8} sm={8} xs={12}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Typography>{radiologyData?.allergiesDetails}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                </Paper>
                <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
                    <Typography variant="h5" className='title'>Referring Clinical Signature and Others</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Typography color="text.secondary">Referring </Typography>
                            <Typography sx={{ fontWeight: 500 }}>{radiologyData?.referringSignatureId?.firstName} {radiologyData?.referringSignatureId?.lastName}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography color="text.secondary">Signature</Typography>
                            {radiologyData?.isReferringSignatureVerified ? <img height={"70px"} src={`${process.env.REACT_APP_SERVER_API}api/profile/${radiologyData?.referringSignatureId?._id}/signatureImage/${radiologyData?.referringSignatureId?.signatureImage}`} alt="signature" /> : "-"}
                        </Grid>
                        <Grid item xs={3}>
                            <Typography color="text.secondary">Is Referring Clinical Signature verified</Typography>
                            <Typography sx={{ fontWeight: 500 }}>{String(radiologyData?.isReferringSignatureVerified)}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography color="text.secondary">Date</Typography>
                            <Typography sx={{ fontWeight: 500 }}>{moment.utc(radiologyData?.referringDate).format('MM-DD-YYYY')}</Typography>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Typography color="text.secondary">Authorised By</Typography>
                            <Typography sx={{ fontWeight: 500 }}>{radiologyData?.authorisedId?.firstName} {radiologyData?.authorisedId?.lastName}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography color="text.secondary">Authorised Date </Typography>
                            <Typography sx={{ fontWeight: 500 }}>{moment.utc(radiologyData?.referringDate).format('MM-DD-YYYY')}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography color="text.secondary">Operator/(MIT)</Typography>
                            <Typography sx={{ fontWeight: 500 }}>{radiologyData?.operatorId?.firstName} {radiologyData?.operatorId?.lastName}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography color="text.secondary"> Operator Date </Typography>
                            <Typography sx={{ fontWeight: 500 }}>{moment.utc(radiologyData?.operatorDate).format('MM-DD-YYYY')}</Typography>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
                    <Typography variant="h5" className='title'>Appointer</Typography>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Typography color="text.secondary">Appointer</Typography>
                            <Typography sx={{ fontWeight: 500 }}>{radiologyData?.appointerId?.firstName} {radiologyData?.appointerId?.lastName}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Typography color="text.secondary">Appointer Signature</Typography>
                            {radiologyData?.isAppointerSignatureVerified ? <img height={"70px"} src={`${process.env.REACT_APP_SERVER_API}api/profile/${radiologyData?.appointerId?._id}/signatureImage/${radiologyData?.appointerId?.signatureImage}`} alt="signature" /> : "-"}
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <Typography color="text.secondary">Is Appointer Signature verified</Typography>
                            <Typography sx={{ fontWeight: 500 }}>{String(radiologyData?.isAppointerSignatureVerified)}</Typography>
                        </Grid>
                    </Grid>
                </Paper>

            </Box>
            <Box mt={5} textAlign={"right"}>
                <Button variant='outlined' className='btn prevBtn' sx={{ marginRight: "16px" }} onClick={() => handlePrint()}>
                    Print
                </Button>
                <Button className="commonBtn" type='submit' variant='contained' sx={{ marginRight: "16px" }} onClick={() => { setPreviewRadiology() }}>Done</Button>
                <Button variant='outlined' className='btn cancelBtn' onClick={() => { setPreviewRadiology() }}>Back</Button>
            </Box>

        </Box>
    )
}
export default PreviewRadiology;