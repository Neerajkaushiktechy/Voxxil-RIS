import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, RadioGroup, Radio, FormControlLabel, Button, Box, Chip, Stack, Pagination, Tooltip  } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {  useNavigate } from "react-router-dom";
import { deleteRequest, getRequest, resetDelete, resetIdGet } from '../../../redux/modules/radiology/slice';
import { getReferralList, createReferralOrder, resetSuccessErrorMessage, declienReferralOrder } from '../../../redux/modules/referral/slice';
import ConfirmDialog from '../../../component/ConfirmDialog';
import DeclineOrderDialog from '../../../component/DeclineOrderDialog';
import SearchInput from '../../../utils/searchInput';
import { generateFullDate, getTime } from '../../../helper/dateTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { getdeclineReferralList } from "../../../redux/modules/dashboard/slice";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeclinedOrderDetails from './component/declinedOrderDetails';


let pageCount = 0;
const ReferredList = ({ setItemData, toggleList, setShowList }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [viewRadiologyModal, setViewRadiologyModal] = useState({
        openViewRadiologyModal:false,
        orderDetails:{}
    })
    const [selectedOption, setSelectedOption] = useState('refeeredBy');
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [selectedPatientGender, setSelectedPatientGender] = useState(null);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [showDeclineDialog, setShowDeclineDialog] = useState(false);
    const currentBranch = useSelector(state => state.branch.currentBranch);
    const referralList = useSelector(state => state.referral.referralList)
    const referral = useSelector(state => state.referral);

    const [tableColumns, setTableColumns] = useState(['Patient Name', 'Exams', 'Referred From(Branch)', 'Created Date', 'Created Time', 'Action']);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        if(event.target.value === 'declinedOrder'){
            setTableColumns(['Patient Name', 'Exams', 'Referred From(Branch)', 'Referred To(Branch)', 'Created Date', 'Created Time',  'Action'])
        }
        else if(event.target.value === 'refeeredBy'){
            setTableColumns(['Patient Name', 'Exams', 'Referred From(Branch)', 'Created Date', 'Created Time',  'Action'])
        } else {
            setTableColumns(['Patient Name', 'Exams',  'Referred To(Branch)', 'Created Date', 'Created Time'])
        }
    };

    useEffect(() => {
        dispatch(getReferralList({
            searchBy:selectedOption, page, limit, searchQuery
        }));
    }, [])

    useEffect(() => {
        dispatch(getReferralList({
            searchBy:selectedOption, page, limit, searchQuery
        }));
    }, [selectedOption])

    useEffect(() => {
        dispatch(getReferralList({
            searchBy:selectedOption, page, limit, searchQuery
        }));
    }, [currentBranch?.id])

    useEffect(() => {
        if (!currentBranch) { return }
        dispatch(getReferralList({
            searchBy:selectedOption, page, limit, searchQuery
        }));
      }, [dispatch, currentBranch, page, searchQuery]);

    const renderExamList = (exams) => {
        const allExams = exams.flatMap(exam => exam.list.map(subExam => subExam.name));
        return (
            <Stack direction="row" spacing={1}>
                {allExams.map((exam, index) => <Chip label={exam} key={`${exam}-${index}`} />)}
            </Stack>
        )
    }


    const renderStatus = (patient) => {
        if(patient.orderId) {
            return (
                <Stack direction="row" spacing={1}>
                    <Chip label={'Order Created'} />
                </Stack>
            )
        } else {
            return (
                <>
                    <Button
                        sx={{mr:'5px'}}
                        variant="outlined"
                        onClick={() => { 
                            setSelectedPatientGender(patient?.patientId?.gender);
                            setShowConfirmationDialog(true);
                            setSelectedRecordId(patient._id);
                            }}
                    >
                        <Tooltip title="Accept Order">
                            <CheckCircleOutlineIcon />
                        </Tooltip>
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => { 
                            setShowDeclineDialog(true);
                            setSelectedRecordId(patient._id);
                        }}
                    >
                        <Tooltip title="Deney Order">
                            <HighlightOffIcon color="error" />
                        </Tooltip>
                    </Button>
                </>
            )
        }
    }
    const createNewOrderHandler = async () => {
        dispatch(resetIdGet());
        navigate(`/admin/radiology?radiologyId=${selectedRecordId}`,{ state: { gender: selectedPatientGender }});
        
    }

    const cancelNewOrderHandler = () => {
        setShowConfirmationDialog(false);
        setShowDeclineDialog(false);
        setSelectedRecordId(null);
        setSelectedPatientGender(null);
    }

    const declineNewOrderHandler = async (data) => {
        try {
            // console.log(new Date())
            const payload = {radiologyId: selectedRecordId, ...data, denialTimeString: new Date()}
            console.log(data)
            await dispatch(declienReferralOrder(payload));
            cancelNewOrderHandler();
            await dispatch(getReferralList({
                searchBy:selectedOption, page, limit, searchQuery
            }));
        } catch(err) {

        }
        
    }
    useEffect(() => {
        if(referral.success == true){
            toast(referral.successMsg);
        }
        if(referral.success == false){
            toast(referral.errMesg);
        }
        setTimeout(() => {
            dispatch(resetSuccessErrorMessage())
        }, 5000)
    }, [referral.successMsg])
    

    if (referralList?.dataCount && referralList?.dataCount > limit) {
        pageCount = referralList?.dataCount / limit;
        if (pageCount % 2 !== 0) {
          pageCount = Math.ceil(pageCount)
        }
      }

    const displayOrderDetailHandler = async (order) => {
        setViewRadiologyModal({
            openViewRadiologyModal:true,
            orderDetails: order
        })
    }

    return (
        <div>
            <>
                <DeclinedOrderDetails 
                    viewRadiologyModal = {viewRadiologyModal}
                    setViewRadiologyModal = {setViewRadiologyModal}
                />
                <ConfirmDialog 
                    showConfirmationDialog = {showConfirmationDialog}
                    message = {'Are you sure that you want to create a new order out of this referral?'}
                    handleConfirmDialogClose = {cancelNewOrderHandler}
                    handleConfirmDialogConfirm = {createNewOrderHandler}
                />

                <DeclineOrderDialog 
                    showConfirmationDialog = {showDeclineDialog}
                    message = {'Are you sure that you want to decline this order out of this referral?'}
                    handleConfirmDialogClose = {cancelNewOrderHandler}
                    handleConfirmDialogConfirm = {declineNewOrderHandler}
                />
                
                <Box display="flex" justifyContent="flex-end" alignItems="center" p={2}>
                    <RadioGroup row value={selectedOption} onChange={handleOptionChange}>
                        <FormControlLabel value="declinedOrder" control={<Radio />} label="Declined Order" />
                        <FormControlLabel value="refeeredBy" control={<Radio />} label="Incoming" />
                        <FormControlLabel value="refeeredTo" control={<Radio />} label="Outgoing" />
                    </RadioGroup>
                </Box>
                
                <Stack mb={3} direction={"row"} justifyContent="space-between">
                    <SearchInput 
                        setSearchQuery={(searchValue) => { setSearchQuery(searchValue); setPage(1) }} 
                    />
                    <Box display="flex" justifyContent="flex-end" alignItems="center" pr={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => { toggleList(); setItemData({}); dispatch(resetIdGet()); dispatch(setShowList(false)) }}
                        >
                            Add Referral
                        </Button>
                    </Box>
                </Stack>
                
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {tableColumns.map((heading, index) => (
                                    <TableCell key={index}>{heading}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {referralList && referralList?.data && referralList?.data.length>0 ? referralList?.data.map(patient => 
                                (<TableRow key={patient._id}>
                                    <TableCell>{patient.patientId.fName} {patient.patientId.lName}</TableCell>
                                    <TableCell>
                                        {
                                            renderExamList(patient.examList)
                                        }
                                    </TableCell>
                                    {
                                        selectedOption === 'declinedOrder'?(
                                            <>
                                                <TableCell>{patient.createdByBranch.name}</TableCell>
                                                <TableCell>{patient.refferedToBranch.name}</TableCell>
                                            </>
                                        ):(<TableCell>{selectedOption === 'refeeredBy' ? patient.createdByBranch.name: patient.refferedToBranch.name}</TableCell>)
                                    }
                                    
                                    <TableCell>{generateFullDate(patient.createdAt)}</TableCell>
                                    <TableCell>{getTime(patient.createdAt)}</TableCell>
                                    {selectedOption === 'refeeredBy' ? <TableCell>
                                        {renderStatus(patient)}
                                    </TableCell>:null}
                                    {selectedOption === 'declinedOrder' ? <TableCell>
                                        <Button onClick={()=>displayOrderDetailHandler(patient)}>
                                            <VisibilityIcon />
                                        </Button>
                                    </TableCell>:null}
                                </TableRow>)
                            ): <TableRow><TableCell colSpan={3}>No Record Found</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
                {(referralList?.dataCount > limit) && <Pagination count={pageCount} page={page} onChange={(event, value) => { setPage(value); }} />}
            </>
        </div >
    );
};

export default ReferredList;
