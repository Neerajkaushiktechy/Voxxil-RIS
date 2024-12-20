import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, Typography, TableContainer, TableHead, TableRow, Paper, IconButton, Pagination, Box } from '@mui/material';
import { getPatientProfileRequest, deletePatientProfileRequest, resetDelete, resetPatientData } from '../../../redux/modules/admin/patientProfile/slice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { DeleteConfirmationModal } from '../../../utils/modal';
import PatientTabHeader from './patientTabHeader';
import moment from 'moment';

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
const EllipsisText = ({ children }) => (
    <Typography>
        {children}
    </Typography>
);
const tableHeading = ["Full Name", "Patient ID", "Email Address", "Phone Number", "Date of Birth", "Gender", "Action"];

let deleteItemId;
export default function PatientList({ setItemData, toggleList }) {
    const [searchText, setSearchText] = useState("");
    const [searchType, setSearchType] = useState("");
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    // let { getInfoRes, deleteRes } = useSelector(state => state.patientRegistration);
    let { getInfoRes, deleteRes } = useSelector(state => state.patientProfile);
    let { currentBranch } = useSelector(state => state.branch);
    const [isModalOpen, setIsModalOpen] = useState(false);
    let cardLimit = 10;
    let pageCount = 0;

    if (getInfoRes?.dataCount && getInfoRes?.dataCount > cardLimit) {
        pageCount = getInfoRes.dataCount / cardLimit;
        if (pageCount % 2 !== 0) {
            pageCount = Math.ceil(pageCount)
        }
    }

    // useEffect(() => {
    //     dispatch(resetPutPatientInsurance())
    //     dispatch(resetPostPatientInsurance())
    //     dispatch(resetPutPatientPhysician())
    //     dispatch(resetPostPatientPhysician())
    //     dispatch(resetPutPatientLifeStyle())
    //     dispatch(resetPostPatientLifeStyle())
    // }, [dispatch])

    useEffect(() => {
        if (!currentBranch) { return }
        // dispatch(getPatientInformationRequest({
        //     limit: cardLimit, search: searchText, searchType: searchType, skip: (page - 1) * cardLimit,
        //     currentBranch: currentBranch?.id,
        // }))
        dispatch(getPatientProfileRequest({
            limit: cardLimit, search: searchText, searchType: searchType, skip: (page - 1) * cardLimit,
            currentBranch: currentBranch?.id,
        }))
        dispatch(resetPatientData())
        localStorage.removeItem("pId")
    }, [dispatch, currentBranch, searchText, searchType, cardLimit, page]);

    useEffect(() => {
        if (!deleteRes) { return }
        if (deleteRes?.success) {
            // dispatch(getPatientInformationRequest({
            //     limit: cardLimit, search: searchText, searchType: searchType, skip: (page - 1) * cardLimit,
            //     currentBranch: currentBranch?.id,
            // }))
            dispatch(getPatientProfileRequest({
                limit: cardLimit, search: searchText, searchType: searchType, skip: (page - 1) * cardLimit,
                currentBranch: currentBranch?.id,
            }))
        }
        toast(deleteRes?.message);
        dispatch(resetDelete());
    }, [dispatch, deleteRes, currentBranch, cardLimit, page, searchText, searchType]);

    const handleSearchCallback = (type, text) => {
        setSearchType(type);
        setSearchText(text);
        setPage(1);
    }

    const handlePagination = (event, value) => {
        setPage(value);
    };
    // useEffect(() => {
    //     dispatch(
    //         getPatientInformationRequest({
    //             limit: cardLimit, search: searchText, searchType: searchType, skip: (page - 1) * cardLimit,
    //             currentBranch: currentBranch?.id,
    //         })
    //     );
    // }, [dispatch, page, searchText, searchType, currentBranch, cardLimit]);
    // console.log(getInfoRes, "infores")
    return (
        <>
            <PatientTabHeader handleSearchCallback={handleSearchCallback} />
            <TableContainer component={Paper} className='tableShadow'>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" className='commonTable'>
                    <TableHead>
                        <TableRow>
                            {tableHeading.map(elem => (<StyledTableCell key={elem}>{elem}</StyledTableCell>))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getInfoRes?.data?.length > 0 ?
                            getInfoRes?.data?.map(elem => (
                                <StyledTableRow key={elem._id}>
                                    <StyledTableCell align="left"><EllipsisText>{`${elem.fName} ${elem.lName}`}</EllipsisText></StyledTableCell>
                                    <StyledTableCell align="left"><EllipsisText>{elem?.orthancPatientId}</EllipsisText></StyledTableCell>
                                    <StyledTableCell align="left"><EllipsisText>{elem?.email}</EllipsisText></StyledTableCell>
                                    <StyledTableCell align="left"><EllipsisText>{elem?.contactNumber}</EllipsisText></StyledTableCell>
                                    <StyledTableCell align="left"><EllipsisText>{moment(elem?.dob).format('DD-MM-YYYY')}</EllipsisText></StyledTableCell>
                                    <StyledTableCell align="left"><Typography className = {"patient-gender"}>{elem?.gender}</Typography></StyledTableCell>
                                    <StyledTableCell align="left">
                                        <EllipsisText>
                                            <IconButton color="primary" onClick={() => { setItemData(elem); toggleList() }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => { deleteItemId = elem._id; setIsModalOpen(true) }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </EllipsisText>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                            :
                            <StyledTableRow>
                                <StyledTableCell colSpan={tableHeading.length} align="left"><Typography>There is no data to show</Typography></StyledTableCell>
                            </StyledTableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Box textAlign="center" mt="40px">
                <Pagination count={pageCount} color="secondary" shape="rounded" page={page} sx={{ display: "inline-block" }} onChange={handlePagination} />
            </Box>
            <DeleteConfirmationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={() => { dispatch(deletePatientProfileRequest(deleteItemId)); setIsModalOpen(false) }} />
        </>
    );
}