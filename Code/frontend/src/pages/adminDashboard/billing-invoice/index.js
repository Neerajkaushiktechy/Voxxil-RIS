import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
    Card, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableBody, RadioGroup, FormControlLabel, Radio, Paper, TableContainer, Checkbox, TextField
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getRequest, resetPost, resetPut } from '../../../redux/modules/invoice/slice';
import moment from 'moment';
import BillingInformation from './billingInformation';
import { setMainHeading } from '../../../redux/modules/mainHeading/slice';
import GenerateInvoicePDF from './invoicePdfGenerator';
import { toast } from 'react-toastify';
import { PRESET_PASSWORD, USER_ROLE_DEFAULT } from '../../../constants/Constant';

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

const billedTableHeading = ["Invoice Date", "OrderID", "Patient Name", "Exams", "Action"];
const unBilledTableHeading = ["Order Date", "OrderID", "Patient Name", "Action"];

const BillingInvoice = () => {
    const dispatch = useDispatch();
    let { userData } = useSelector(state => state.auth);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(userData.role === USER_ROLE_DEFAULT.PATIENT?'Billed Invoices':'Unbilled Invoices');
    const [selectValue, setSelectedValue] = useState(null)
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [showBillingInformation, setShowBillingInformation] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    let { getInvoiceRes, postInvoice, putInvoice } = useSelector(state => state.invoice);
    const { currentBranch } = useSelector(state => state.branch);
    const filteredBilledTableHeading=userData.role !== USER_ROLE_DEFAULT.PATIENT?billedTableHeading:
    billedTableHeading.filter((column)=>column !== "Patient Name")

    useEffect(() => {
        setTimeout(()=>fetchBilling(), 1000)
        // fetchBilling();
    }, [dispatch])

    const fetchBilling = async () => {
        const billingSession = localStorage.getItem('billingLoggedIn');
        await dispatch(setMainHeading("Billing & Invoicing"))
        if(billingSession){
            if(userData.role === USER_ROLE_DEFAULT.PATIENT){
                await dispatch(getRequest({ elm: "billedInvoice" }));
            }else{
                await dispatch(getRequest({ elm: "unbilledInvoice" }));
            }
        }else{
            setPasswordModalOpen(true);
        }
    }

    useEffect(()=> {
        const billingSession = localStorage.getItem('billingLoggedIn');
        if (selectedOption === 'Billed Invoices' && currentBranch?.id && billingSession) {
            dispatch(getRequest({ elm: 'billedInvoice' }));
            setSelectedOrders([])
        } else if (selectedOption === 'Unbilled Invoices' && currentBranch?.id && billingSession) {
            dispatch(getRequest({ elm: 'unbilledInvoice' }));
        }
    }, [currentBranch?.id])

    useEffect(() => {
        if (postInvoice?.success) {
            toast(postInvoice?.message)
            dispatch(resetPost())
        }
        else if (putInvoice?.success) {
            toast(putInvoice?.message)
            dispatch(resetPut())
        }

    }, [postInvoice?.success, putInvoice?.success])

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        if (event.target.value === 'Billed Invoices') {
            dispatch(getRequest({ elm: 'billedInvoice' }));
            setSelectedOrders([])
        } else if (event.target.value === 'Unbilled Invoices') {
            dispatch(getRequest({ elm: 'unbilledInvoice' }));
        }
    };

    const handleCheckboxChange = (orderId, patientId) => {
        const updatedSelectedOrders = [...selectedOrders];
        const existingOrderIndex = updatedSelectedOrders.findIndex(order => order.orderId === orderId);

        if (existingOrderIndex !== -1) {
            updatedSelectedOrders.splice(existingOrderIndex, 1);
        } else {
            updatedSelectedOrders.push({ orderId, patientId });
        }

        setSelectedOrders(updatedSelectedOrders);
    };

    const handleGenerateInvoice = () => {
        if (selectedOption === 'Unbilled Invoices') {
            if (selectedOrders.length === 0) {
                setDialogMessage('Please select any order.');
                setDialogOpen(true);
            } else {
                const firstPatientId = selectedOrders[0].patientId;
                const allSamePatient = selectedOrders.every(order => order.patientId === firstPatientId);

                if (allSamePatient) {
                    setShowBillingInformation(true);
                } else {
                    setDialogMessage('You have selected different patients to generate invoice. Please select single patient invoices.');
                    setDialogOpen(true);
                }
            }
        }
    };

    const handleGoBack = () => {
        setShowBillingInformation(false);
        if (selectedOption === "Unbilled Invoices") {
            setEditingInvoice(null)
            dispatch(getRequest({ elm: "unbilledInvoice" }));
        }
        else {
            setEditingInvoice(null)
            dispatch(getRequest({ elm: "billedInvoice" }));
        }
    };


    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleUpdateInvoice = (invoice) => {
        setEditingInvoice(invoice);
        setShowBillingInformation(true);
    };


    const handlePrintInvoice = (invoice) => {
        GenerateInvoicePDF(invoice);
    };


    const handleSendEmail = () => {
        setEmailDialogOpen(true);
    };

    const handleEmailDialogClose = () => {
        setEmailDialogOpen(false);
        setEmail('');
    };

    const handleSend = () => {
        setEmailDialogOpen(false);
        setEmail('');
    };

    const handlePasswordSubmit = () => {
        const storedPassword = process.env.REACT_APP_BILLING_PASSWORD;
        if (password === storedPassword) {
            setLoggedIn(true);
            setPasswordModalOpen(false);
            localStorage.setItem("billingLoggedIn", "true");
            dispatch(getRequest({ elm: "unbilledInvoice" }));
        } else {
            alert("Wrong password");
        }
    };


    return (
        <>
            {showBillingInformation ? (
                <BillingInformation orders={selectedOrders} onGoBack={handleGoBack} itemData={[editingInvoice]} />
            ) : (
                <>
                {
                    userData.role !== USER_ROLE_DEFAULT.PATIENT ?
                    <Box display="flex" justifyContent="flex-end" alignItems="center" p={2}>
                        <RadioGroup
                            row
                            value={selectedOption}
                            onChange={handleOptionChange}
                        >
                            <FormControlLabel
                                value="Billed Invoices"
                                control={<Radio />}
                                label="Billed Invoices"
                            />
                            <FormControlLabel
                                value="Unbilled Invoices"
                                control={<Radio />}
                                label="Unbilled Invoices"
                            />
                        </RadioGroup>               
                    </Box>
                     :
                     null
                     }    
                    <Box display="flex" justifyContent="flex-end" alignItems="center" p={2}>
                        {selectedOption === 'Unbilled Invoices' && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleGenerateInvoice}
                            >
                                Generate Invoice
                            </Button>
                        )}
                    </Box>

                    <Card className='cardStyle' sx={{ marginTop: "40px" }}>
                        <TableContainer component={Paper} className='tableShadow'>
                            <Table sx={{ width: "100%" }} aria-label="customized table" className='commonTable'>
                                <TableHead>
                                    <TableRow>
                                        {selectedOption === "Billed Invoices" &&
                                            filteredBilledTableHeading.map((elem) => (
                                                <StyledTableCell key={elem}>{elem}</StyledTableCell>
                                            ))
                                        }

                                        {selectedOption === "Unbilled Invoices" &&
                                            unBilledTableHeading.map((elem) => (
                                                <StyledTableCell key={elem}>{elem}</StyledTableCell>
                                            ))
                                        }
                                    </TableRow>

                                </TableHead>
                                {selectedOption === "Billed Invoices" &&
                                    <TableBody>
                                        {getInvoiceRes?.invoicesStatus && getInvoiceRes?.invoicesStatus.length > 0 ? (
                                            getInvoiceRes?.invoicesStatus.map((invoice, index) => (
                                                <StyledTableRow key={invoice._id}>
                                                    <StyledTableCell align="left">
                                                        {moment(invoice.createdAt).format("MM-DD-YYYY")}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">{[...new Set(invoice?.invoiceDetail?.map(item => item?.orderId))].join(', ')}</StyledTableCell>
                                                    {userData.role !== USER_ROLE_DEFAULT.PATIENT && <StyledTableCell align="left">{`${invoice?.patientId?.fName} ${invoice?.patientId?.lName}`}</StyledTableCell>}
                                                    {/* <StyledTableCell align="left">{invoice?.invoiceDetail?.map(item => item?.examId).join(', ')}</StyledTableCell> */}
                                                    <StyledTableCell align="left">
                                                        {invoice?.invoiceDetail?.map((item, index) => (
                                                            <span key={item.examId}>
                                                                {item.examId}
                                                                {/* Add a line break after every two values */}
                                                                {index % 2 === 1 && index !== invoice.invoiceDetail.length - 1 ? <br /> : null}
                                                            </span>
                                                        ))}
                                                    </StyledTableCell>

                                                    {selectedOption === 'Billed Invoices' && (
                                                        <StyledTableCell align="left">
                                                            {userData.role !== USER_ROLE_DEFAULT.PATIENT ?
                                                            <Button

                                                                variant="outlined"
                                                                color="primary"
                                                                // onClick={() => handleUpdateInvoice(getInvoiceRes?.invoicesStatus)}
                                                                onClick={() => handleUpdateInvoice(invoice)}
                                                            >
                                                                Update Invoice
                                                            </Button>:null}
                                                            <Button
                                                                sx={{ marginLeft: 1 }}
                                                                variant="outlined"
                                                                color="primary"
                                                                onClick={() => handlePrintInvoice(invoice)}
                                                            >
                                                                Print Invoice
                                                            </Button>
                                                            {userData.role !== USER_ROLE_DEFAULT.PATIENT ?
                                                            <Button
                                                                sx={{ marginLeft: 1 }}
                                                                variant="outlined"
                                                                color="primary"
                                                                onClick={handleSendEmail}
                                                            >
                                                                Send Email
                                                            </Button>:null}
                                                        </StyledTableCell>
                                                    )}
                                                    {selectedOption === 'Unbilled Invoices' && (
                                                        <StyledTableCell align="left">
                                                            <Checkbox
                                                                checked={selectedOrders.some(order => order.orderId === invoice.orderId)}
                                                                onChange={() => handleCheckboxChange(invoice.orderId, invoice.patientId._id)}
                                                            />
                                                        </StyledTableCell>
                                                    )}
                                                </StyledTableRow>
                                            ))
                                        ) : (
                                            <StyledTableRow>
                                                <StyledTableCell align="left">
                                                    <Typography>There is no data to show</Typography>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )}
                                    </TableBody>
                                }

                                {selectedOption === "Unbilled Invoices" &&
                                    <TableBody>
                                        {getInvoiceRes?.invoicesStatus && getInvoiceRes?.invoicesStatus.length > 0 ? (
                                            getInvoiceRes?.invoicesStatus.map((invoice, index) => (
                                                <StyledTableRow key={invoice._id}>
                                                    <StyledTableCell align="left">
                                                        {moment(invoice.createdAt).format("MM-DD-YYYY")}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        {invoice?.orderId}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">{`${invoice?.patientId?.fName} ${invoice?.patientId?.lName}`}</StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        <Checkbox
                                                            checked={selectedOrders.some(order => order.orderId === invoice.orderId)}
                                                            onChange={() => handleCheckboxChange(invoice.orderId, invoice.patientId._id)}
                                                        />
                                                    </StyledTableCell>

                                                </StyledTableRow>
                                            ))
                                        ) : (
                                            <StyledTableRow>
                                                <StyledTableCell align="left">
                                                    <Typography>There is no data to show</Typography>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )}
                                    </TableBody>
                                }

                            </Table>
                        </TableContainer>
                    </Card>
                    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                        <DialogTitle>Error</DialogTitle>
                        <DialogContent>
                            <Typography>{dialogMessage}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary">
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={emailDialogOpen} onClose={handleEmailDialogClose}>
                        <DialogTitle>Send Report</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEmailDialogClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleSend} color="primary">
                                Send
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)}>
                        <DialogTitle>Enter Password to Access this Section</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button onClick={handlePasswordSubmit} variant="contained" color="primary">Submit</Button>
                        </DialogContent>
                    </Dialog>
                </>
            )
            }
        </>
    );
};

export default BillingInvoice;
