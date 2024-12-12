import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
    Grid, Card, Box, Typography, FormLabel, Button, Table, TableHead, TableRow, TableBody, TextField, TableContainer, Paper, Input,FormHelperText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getIdRequest, resetgetPatientOrders, resetGetId } from '../../../redux/modules/orders/slice';
import { postRequest, putRequest, resetPost, resetPut } from '../../../redux/modules/invoice/slice';
import moment from 'moment';
import { setMainHeading } from '../../../redux/modules/mainHeading/slice';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

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


const tableHeading = ["Sno.", "Order Date", "OrderID", "Exam", "Unit/Quantity", "Unit Price ($)", "Cost ($)"];

const validationSchema = yup.object().shape({
    totalCost: yup.string(),
    examList: yup.array().of(
        yup.object().shape({
            orderId: yup.string('Order ID is required'),
            examId: yup.string('Exam ID is required'),
            unit: yup.number().typeError('Unit must be a number').positive('Unit must be a positive number').required('Unit is required'),
            unitPrice: yup.number().typeError('Unit Price must be a number').positive('Unit Price must be a positive number').required('Unit Price is required'),
            // cost: yup.number().required('Cost is required').positive('Cost must be a positive number'),
        })
    ),
});

const BillingInformation = ({ orders, onGoBack, itemData }) => {
    const dispatch = useDispatch();
    let { getIdRes, getPatientOrders } = useSelector(state => state.orders);
    let { postInvoice, putInvoice } = useSelector(state => state.invoice);
    const [patientOrders, setPatientOrders] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const [orderModal, setOrderModal] = useState(false);
    const [quantityValues, setQuantityValues] = useState([]);
    const [unitPriceValues, setUnitPriceValues] = useState([]);
    const [notes, setNotes] = useState("")

    const {register, handleSubmit, formState: { errors }, } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        dispatch(setMainHeading("Billing & Invoicing"))
        if (getIdRes?.success) {
            const list = getIdRes?.data?.reduce((acc, order) => [
                ...acc,
                ...(order.radiologyId?.examList?.flatMap(group => group.list.map(item => ({
                    ...item,
                    orderId: order.orderId,
                    createdAt: order.createdAt
                }))) || [])
            ], []);

            setSelectedValue({
                patient: getIdRes?.data[0]?.patientId,
                examList: list,
            })
            dispatch(resetGetId())
        } else if (getPatientOrders?.success) {
            setOrderModal(true)
            setPatientOrders(getPatientOrders?.data);
            dispatch(resetgetPatientOrders())
        }
    }, [dispatch, getIdRes, getPatientOrders])


    useEffect(() => {
        const orderIds = orders.map(order => order.orderId).join(', ');
        dispatch(getIdRequest(orderIds));
    }, [dispatch, orders]);

    useEffect(() => {
        if (itemData[0]) {
            const initialQuantities = itemData[0]?.invoiceDetail.map((exam) => exam.unit) || [];
            const initialUnitPrices = itemData[0]?.invoiceDetail.map((exam) => exam.unitPrice) || [];

            setQuantityValues(initialQuantities);
            setUnitPriceValues(initialUnitPrices);
            setNotes(itemData[0]?.notes)
        }
    }, [itemData]);

    useEffect(() => {
        if (postInvoice?.success || putInvoice?.success) {
            onGoBack();
            dispatch(resetPut())
            dispatch(resetPost())
        }
    }, [postInvoice?.success, putInvoice?.success, onGoBack]);

    const handleQuantityChange = (e, index) => {
        const newQuantityValues = [...quantityValues];
        newQuantityValues[index] = e.target.value;
        setQuantityValues(newQuantityValues);
    };

    const handleUnitPriceChange = (e, index) => {
        const newUnitPriceValues = [...unitPriceValues];
        newUnitPriceValues[index] = e.target.value;
        setUnitPriceValues(newUnitPriceValues);
    };

    const calculateCost = (quantity, unitPrice) => {
        const parsedQuantity = parseFloat(quantity) || 0;
        const parsedUnitPrice = parseFloat(unitPrice) || 0;
        return parsedQuantity * parsedUnitPrice;
    };


    const calculateTotalCost = () => {
        return quantityValues.reduce((total, quantity, index) => {
            const cost = calculateCost(quantity, unitPriceValues[index]);
            return total + cost;
        }, 0).toString();
    };

    const onchangeNotes = (value) => {
        setNotes(value)
    }
    const onSubmit = (data) => {
        if (itemData[0]) {
            const { examList } = itemData[0].invoiceDetail
            const updatedInvoiceDetail = itemData[0].invoiceDetail.map((exam, index) => {
                console.log(exam, "exam")
                console.log(itemData, "itemdata")
                console.log(selectedValue, "selectedvalue")
                return {
                    _id: exam._id,
                    orderDate: exam.orderDate,
                    orderId: exam.orderId,
                    examName: exam.examId,
                    unit: quantityValues[index] || '0',
                    unitPrice: unitPriceValues[index] || '0',
                    cost: calculateCost(quantityValues[index], unitPriceValues[index]).toString(),
                };
            });

            const requestUpdateData = {
                patientId: itemData[0]?.patientId?._id,
                invoiceDetail: updatedInvoiceDetail,
                totalCost: calculateTotalCost(),
                invoiceId: itemData[0].invoiceId,
                notes: notes
            };
            console.log(requestUpdateData, "update")
            console.log(itemData[0].invoiceDetail, "examlist")
            dispatch(putRequest(requestUpdateData));
        }
        else {
            const { examList } = selectedValue;

            const invoiceDetail = examList.map((exam, index) => {
                return {
                    orderDate: exam.createdAt,
                    orderId: exam.orderId,
                    examId: exam._id,
                    unit: quantityValues[index] || '0',
                    unitPrice: unitPriceValues[index] || '0',
                    cost: calculateCost(quantityValues[index], unitPriceValues[index]).toString(),
                };
            });

            const requestData = {
                patientId: selectedValue?.patient?._id,
                invoiceDetail,
                totalCost: selectedValue?.examList.reduce((total, exam, index) => {
                    const cost = calculateCost(quantityValues[index], unitPriceValues[index]);
                    return total + cost;
                }, 0).toString(),
                notes: notes
            };
            dispatch(postRequest(requestData));
        }

    };

    return (
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
            <>
                <Grid item lg={2} md={2} sm={6} xs={12} className='girdMarginBottom'>
                    <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "start" }}>
                        <Button onClick={onGoBack} className='commonBtn' variant="contained"> Back </Button>
                    </Box>
                </Grid>
                <Card className='cardStyle' sx={{ marginTop: "40px" }}>
                    <Typography className='title'>Patient Information</Typography>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={4} sm={4} xs={6}>
                            <Typography color="text.secondary">First Name</Typography>
                            <Typography>{itemData[0] ? itemData[0]?.patientId?.fName : selectedValue?.patient?.fName}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={6}>
                            <Typography color="text.secondary">Last Name</Typography>
                            <Typography>{itemData[0] ? itemData[0]?.patientId?.lName : selectedValue?.patient?.lName}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={6} className='girdMarginBottom'>
                            <Typography color="text.secondary">Email Address</Typography>
                            <Typography>{itemData[0] ? itemData[0]?.patientId?.email : selectedValue?.patient?.email}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={6}>
                            <Typography color="text.secondary">Gender</Typography>
                            <Typography>{itemData[0] ? itemData[0]?.patientId?.gender : selectedValue?.patient?.gender}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={6}>
                            <Typography color="text.secondary">D.O.B</Typography>
                            <Typography>{itemData[0] ? itemData[0]?.patientId?.dob : selectedValue?.patient?.dob}</Typography>
                        </Grid>
                    </Grid>

                </Card>
                <Card className='cardStyle' sx={{ marginTop: "40px" }}>
                    <TableContainer component={Paper} className='tableShadow'>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table" className='commonTable'>
                            <TableHead>
                                <TableRow>
                                    {tableHeading.map((elem) => (
                                        <StyledTableCell key={elem}>{elem}</StyledTableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            {selectedValue ? (

                                <TableBody>
                                    {selectedValue?.examList ? (
                                        selectedValue?.examList?.map((exam, index) => (
                                            <StyledTableRow key={exam._id}>
                                                <StyledTableCell align="left">{index + 1}</StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {moment(exam.createdAt).format("MM-DD-YYYY")}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">{exam.orderId}</StyledTableCell>
                                                <StyledTableCell align="left">{exam.name}</StyledTableCell>
                                                <StyledTableCell align="left" >
                                                    <Input
                                                        value={quantityValues[index]}
                                                        {...register(`examList[${index}].unit`)}
                                                        onChange={(e) => handleQuantityChange(e, index)}
                                                        error={!!errors.examList?.[index]?.unit}
                                                    />
                                                    {errors.examList?.[index]?.unit && (
                                                        <FormHelperText error>{errors.examList[index].unit.message}</FormHelperText>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="left" >
                                                    <Input
                                                        value={unitPriceValues[index]}
                                                        {...register(`examList[${index}].unitPrice`)}
                                                        onChange={(e) => handleUnitPriceChange(e, index)}
                                                        error={!!errors.examList?.[index]?.unitPrice}
                                                    />
                                                    {errors.examList?.[index]?.unitPrice && (
                                                        <FormHelperText error>{errors.examList[index].unitPrice.message}</FormHelperText>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    <TextField
                                                        disabled
                                                        value={calculateCost(quantityValues[index], unitPriceValues[index])}
                                                    />  
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    ) : (
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={tableHeading.length} align="left">
                                                <Typography>There is no data to show</Typography>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    )}
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={tableHeading.length - 1} align="right">
                                            <Typography variant="subtitle1" color="textSecondary">Total:</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="left" >
                                            <TextField
                                                disabled
                                                value={selectedValue?.examList.reduce((total, exam, index) => {
                                                    const cost = calculateCost(quantityValues[index], unitPriceValues[index]);
                                                    return total + cost;
                                                }, 0)}
                                            />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            ) : null}

                            {itemData[0] ? (
                                <TableBody>
                                    {itemData[0] ? (
                                        itemData[0]?.invoiceDetail?.map((exam, index) => (
                                            <StyledTableRow key={exam._id}>
                                                <StyledTableCell align="left">{index + 1}</StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {moment(exam.orderDate).format("MM-DD-YYYY")}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">{exam.orderId}</StyledTableCell>
                                                <StyledTableCell align="left">{exam.examId}</StyledTableCell>
                                                <StyledTableCell align="left" >
                                                    <Input
                                                        defaultValue={exam.unit}
                                                        {...register(`examList[${index}].unit`)}
                                                        onChange={(e) => handleQuantityChange(e, index)}
                                                        error={!!errors.examList?.[index]?.unit}
                                                    />
                                                    {errors.examList?.[index]?.unit && (
                                                        <FormHelperText error>{errors.examList[index].unit.message}</FormHelperText>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="left" >
                                                    <Input
                                                        defaultValue={exam.unitPrice}
                                                        {...register(`examList[${index}].unitPrice`)}
                                                        onChange={(e) => handleUnitPriceChange(e, index)}
                                                        error={!!errors.examList?.[index]?.unitPrice}
                                                    />
                                                    {errors.examList?.[index]?.unitPrice && (
                                                        <FormHelperText error>{errors.examList[index].unitPrice.message}</FormHelperText>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    <TextField
                                                        defaultValue={exam.cost}
                                                        disabled
                                                        value={calculateCost(quantityValues[index], unitPriceValues[index])}
                                                    />
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    ) : (
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={tableHeading.length} align="left">
                                                <Typography>There is no data to show</Typography>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    )}
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={tableHeading.length - 1} align="right">
                                            <Typography variant="subtitle1" color="textSecondary">Total:</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="left" >
                                            <StyledTableCell align="left" >
                                                <TextField
                                                    disabled
                                                    defaultValue={itemData ? itemData[0]?.totalCost : calculateTotalCost()}
                                                    value={calculateTotalCost()}
                                                />
                                            </StyledTableCell>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            ) : null}
                        </Table>

                    </TableContainer>
                    <Grid item lg={6} md={6} sm={6} xs={12} pt={2}>
                        <FormLabel sx={{ left: "15px", color: "#052F5D", padding: "0px" }}>Notes</FormLabel>
                        <TextField value={notes} onChange={(e) => onchangeNotes(e.target.value)} fullWidth multiline rows={4} className="inputfield" size='medium' />
                    </Grid>
                </Card>
                <Grid item lg={2} md={2} sm={6} xs={12} className='girdMarginBottom'>
                    <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "end" }}>
                        <Button type='submit' className='commonBtn' variant="contained"> {itemData[0] ? "Update" : "Save"} </Button>
                    </Box>
                </Grid>
            </>
        </Box>
    );
};

export default BillingInformation;
