import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
    FormControl, Grid, Card, Box, Typography, Stepper, Step, StepLabel, FormLabel, StepContent, Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableBody, Autocomplete, TextField
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getIdRequest, getRequest, getPatientOrdersRequest, resetgetPatientOrders, resetGetId } from '../../../redux/modules/orders/slice';
import moment from 'moment';
import AppointmentCompleted from './appointmentCompleted';
import { setMainHeading } from '../../../redux/modules/mainHeading/slice';


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

const ProcedureTracking = () => {
    const dispatch = useDispatch();
    let { getRes, getIdRes, getPatientOrders } = useSelector(state => state.orders);
    const [selectedOrder, setSelectedOrder] = useState([]);
    const [patientOrders, setPatientOrders] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);
    const [orderModal, setOrderModal] = useState(false);

    const {currentBranch} = useSelector(state => state.branch);
    useEffect(()=>{
        if(currentBranch && currentBranch?.id){
            setSelectedValue(null)
            setSelectedOrder(null);
        }
    }, [currentBranch?.id])

    useEffect(() => {
        dispatch(setMainHeading("Procedure Tracking"))
        if (getIdRes?.success) {
            const list = getIdRes?.data[0]?.radiologyId?.examList?.map((item) => item.list).flat();
            let activeStep = 0;
            const currentTimestamp = moment();
            const appoinmentTime = moment(getIdRes?.data[0]?.radiologyId?.appoinmentId?.startTime);
            if (getIdRes?.data[0]?.appoinmentCompleteStaffId && getIdRes?.data[0]?.status === "Appointment Complete") (
                activeStep = 2
            )
            else if (currentTimestamp.isAfter(appoinmentTime)) {
                activeStep = 1
            }
            setSelectedValue({
                orderId: getIdRes?.data[0]?.orderId,
                status: getIdRes?.data[0]?.status,
                appoinmentCompleteStaffId: getIdRes?.data[0]?.appoinmentCompleteStaffId,
                appoinmentCompleteDescription: getIdRes?.data[0]?.appoinmentCompleteDescription,
                appoinment: getIdRes?.data[0]?.radiologyId?.appoinmentId,
                patient: getIdRes?.data[0]?.patientId,
                examList: list,
                activeStep,
            })
            dispatch(resetGetId())
        } else if (getPatientOrders?.success) {
            setOrderModal(true)
            setPatientOrders(getPatientOrders?.data);
            dispatch(resetgetPatientOrders())
        }
    }, [dispatch, getIdRes, getPatientOrders])


    const handleSelect = (selected) => {
        if (selected) {
            setSelectedOrder(selected);
            setSelectedPatient(null)
            dispatch(getIdRequest(selected.orderId))
        }
    };

    const handlepatientSelect = (selected) => {
        if (selected) {
            setSelectedValue(null)
            setSelectedOrder(null);
            setSelectedPatient(selected)
            dispatch(getPatientOrdersRequest(selected?._id))
        }
    };

    const handleInputChange = async (value, elm) => {
        dispatch(getRequest({ value: value, elm: elm }));
    }


    return (
        <>
            <Box>
                <Grid container spacing={2}>
                    <Grid item lg={4} md={4} sm={6} xs={12} className='girdMarginBottom'>
                        <FormControl fullWidth className='selectDropdown'>
                            <FormLabel sx={{ marginBottom: "9px" }} >Order ID</FormLabel>
                            <Autocomplete
                                sx={{ height: "58px", backgroundColor: "#F5F7F9", borderRadius: "6px", fontSize: "20px", border: "1px solid #ccc" }}
                                value={selectedOrder}
                                options={getRes?.orders || []}
                                getOptionValue={(option) => option._id}
                                getOptionLabel={(option) => option?.orderId || ''}
                                onInputChange={(event, value) => handleInputChange(value, "order")}
                                onChange={(event, newValue) => handleSelect(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="Select an Order Id" />
                                )}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12} className='girdMarginBottom'>
                        <FormControl fullWidth className='selectDropdown'>
                            <FormLabel sx={{ marginBottom: "9px" }} >Patient</FormLabel>
                            <Autocomplete
                                sx={{ height: "58px", backgroundColor: "#F5F7F9", borderRadius: "6px", fontSize: "20px", border: "1px solid #ccc" }}
                                value={selectedPatient}
                                autoFocus={false}
                                options={getRes?.patients || []}
                                getOptionValue={(option) => option._id}
                                getOptionLabel={(option) => `${option?.fName} ${option?.lName},  ${option?.gender},  ${option?.dob},  ${option?.email}`}
                                onInputChange={(event, value) => handleInputChange(value, "patient")}
                                onChange={(event, newValue) => handlepatientSelect(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="Select a Patient" />
                                )}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                {selectedValue &&
                    <>
                        <Card className='cardStyle' sx={{ marginTop: "40px" }}>
                            <Typography className='title'>Patient Information</Typography>
                            <Grid container spacing={2}>
                                <Grid item lg={4} md={4} sm={4} xs={6} >
                                    <Typography color="text.secondary">First Name</Typography>
                                    <Typography>{selectedValue?.patient?.fName}</Typography>
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} xs={6} >
                                    <Typography color="text.secondary">Last Name</Typography>
                                    <Typography>{selectedValue?.patient?.lName}</Typography>
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} xs={6} className='girdMarginBottom'>
                                    <Typography color="text.secondary">Email Address</Typography>
                                    <Typography>{selectedValue?.patient?.email}</Typography>
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} xs={6}>
                                    <Typography color="text.secondary">Gender</Typography>
                                    <Typography>{selectedValue?.patient?.gender}</Typography>
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} xs={6} >
                                    <Typography color="text.secondary">D.O.B</Typography>
                                    <Typography>{selectedValue?.patient?.dob}</Typography>
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} xs={6} >
                                    <Typography color="text.secondary">Exams</Typography>
                                    <Box>
                                        {selectedValue?.examList?.map((item, index) => (
                                            <Typography component={"span"} key={item?._id}>{item?.name}{selectedValue?.examList?.length - 1 !== index && ", "}</Typography>
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                        <Stepper activeStep={selectedValue?.activeStep} orientation="vertical" sx={{ marginTop: "40px" }}>
                            <Step>
                                <StepLabel>
                                    Appointment Made
                                    <Grid container spacing={2}>
                                        <Grid item lg={4} md={4} sm={4} xs={6} >
                                            <Typography sx={{ fontSize: "18px" }} color="text.secondary">Appointment description</Typography>
                                            <Typography sx={{ fontSize: "18px", fontWeight: 500 }}>{selectedValue?.appoinment?.appoinmentCategory}</Typography>
                                        </Grid>
                                        <Grid item lg={4} md={4} sm={4} xs={6} >
                                            <Typography sx={{ fontSize: "18px" }} color="text.secondary">Appointment Start time</Typography>
                                            <Typography sx={{ fontSize: "18px", fontWeight: 500 }}>{moment(selectedValue?.appoinment?.startTime).format("MM-DD-YYYY hh:mm A")}</Typography>
                                        </Grid>
                                        <Grid item lg={4} md={4} sm={4} xs={6} className='girdMarginBottom'>
                                            <Typography sx={{ fontSize: "18px" }} color="text.secondary">Appoinment Duration</Typography>
                                            <Typography sx={{ fontSize: "18px", fontWeight: 500 }}>{selectedValue?.appoinment?.appoinmentDuration} Minutes</Typography>
                                        </Grid>
                                    </Grid>
                                </StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>
                                    Appointment Completed
                                    {selectedValue?.appoinmentCompleteStaffId?._id &&
                                        <Grid container spacing={2}>
                                            <Grid item lg={3} md={6} sm={6} xs={12}>
                                                <Typography color="text.secondary">First Name </Typography>
                                                <Typography sx={{ fontWeight: 500 }}>{selectedValue?.appoinmentCompleteStaffId?.firstName}</Typography>
                                            </Grid>
                                            <Grid item lg={3} md={6} sm={6} xs={12}>
                                                <Typography color="text.secondary">Last Name </Typography>
                                                <Typography sx={{ fontWeight: 500 }}>{selectedValue?.appoinmentCompleteStaffId?.lastName || "-"}</Typography>
                                            </Grid>
                                            <Grid item lg={3} md={6} sm={6} xs={12}>
                                                <Typography color="text.secondary">Examination Comment</Typography>
                                                <Typography sx={{ fontWeight: 500 }}>{selectedValue?.appoinmentCompleteDescription || "-"}</Typography>
                                            </Grid>
                                            <Grid item lg={3} md={6} sm={6} xs={12}>
                                                <Typography color="text.secondary">Status</Typography>
                                                <Typography sx={{ fontWeight: 500 }}>{selectedValue?.status || "-"}</Typography>
                                            </Grid>
                                        </Grid>
                                    }
                                </StepLabel>
                                {!selectedValue?.appoinmentCompleteStaffId?._id &&
                                    <StepContent>
                                        <AppointmentCompleted orderId={selectedValue?.orderId} />
                                    </StepContent>
                                }
                            </Step>
                            <Step>
                                <StepLabel>
                                    Modality
                                </StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>
                                    Image Printed
                                </StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>
                                    Report Link
                                </StepLabel>
                            </Step>
                        </Stepper>
                    </>
                }
            </Box>

            <Dialog maxWidth={"xl"} open={orderModal} onClose={() => { setOrderModal(false) }}>
                <DialogTitle>
                    Select Patient Order
                </DialogTitle>
                <DialogContent>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" className='commonTable'>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Appointment Date & Time</StyledTableCell>
                                <StyledTableCell>OrderId</StyledTableCell>
                                <StyledTableCell>Patient Name</StyledTableCell>
                                <StyledTableCell>Exams</StyledTableCell>
                                <StyledTableCell>Category</StyledTableCell>
                                <StyledTableCell>Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {patientOrders?.length > 0 ?
                                patientOrders?.map(elem => (
                                    <StyledTableRow key={elem._id}>
                                        <StyledTableCell align="left"><Typography>{moment(elem?.radiologyId?.appoinmentId?.startTime).format('MM-DD-YYYY HH:mm A')} </Typography></StyledTableCell>
                                        <StyledTableCell align="left"><Typography>{elem?.orderId} </Typography></StyledTableCell>
                                        <StyledTableCell align="left"><Typography>{selectedPatient?.fName} {selectedPatient?.lName}</Typography></StyledTableCell>
                                        <StyledTableCell align="left"><Typography>{elem?.radiologyId?.examList?.map((item) => item.list.map((listItem) => listItem?.name)).flat().join(", ")}</Typography></StyledTableCell>
                                        <StyledTableCell align="left"><Typography>{elem?.radiologyId?.appoinmentId?.appoinmentCategory}</Typography></StyledTableCell>
                                        <StyledTableCell align="left">
                                            <Button onClick={() => {
                                                const list = elem?.radiologyId?.examList?.map((item) => item.list).flat();
                                                let activeStep = 0;
                                                const currentTimestamp = moment();
                                                const appoinmentTime = moment(elem?.radiologyId?.appoinmentId?.startTime);

                                                if (elem?.appoinmentCompleteStaffId && elem?.status === "Appointment Complete") (
                                                    activeStep = 2
                                                )
                                                else if (currentTimestamp.isAfter(appoinmentTime)) {
                                                    activeStep = 1
                                                }
                                                setSelectedValue({
                                                    orderId: elem?.orderId,
                                                    status: elem?.status,
                                                    appoinmentCompleteStaffId: elem?.appoinmentCompleteStaffId,
                                                    appoinmentCompleteDescription: elem?.appoinmentCompleteDescription,
                                                    appoinment: elem?.radiologyId?.appoinmentId,
                                                    patient: selectedPatient,
                                                    examList: list,
                                                    activeStep
                                                })
                                                setOrderModal(false)
                                            }} variant='contained'>Select</Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))
                                :
                                <StyledTableRow>
                                    <StyledTableCell colSpan={6} align="left"><Typography>There is no data to show</Typography></StyledTableCell>
                                </StyledTableRow>
                            }
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOrderModal(false) }}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProcedureTracking;
