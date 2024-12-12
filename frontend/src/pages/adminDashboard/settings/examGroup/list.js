import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, Typography, TableContainer, TableHead, TableRow, Paper, IconButton, Stack, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { DeleteConfirmationModal } from '../../../../utils/modal';
import SearchInput from '../../../../utils/searchInput';
import { deleteExamGroupRequest, getExamGroupRequest, resetDeleteExamGroup } from '../../../../redux/modules/exam/slice';

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


let deleteItemId;
let limit = 10;
let pageCount = 0;
export default function List({ setItemData, toggleList,currentPage,setCurrentPage }) {
    const dispatch = useDispatch();
    let { getGroupRes, deleteGroupRes } = useSelector(state => state.exam);
    let { currentBranch } = useSelector(state => state.branch);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!currentBranch) { return }
        dispatch(getExamGroupRequest({ page:currentPage, limit, searchQuery }))
    }, [dispatch, currentBranch, currentPage, searchQuery]);

    useEffect(() => {
        if (!deleteGroupRes) { return }
        if (deleteGroupRes?.success) {
            dispatch(getExamGroupRequest({ page:currentPage, limit }))
        }
        toast(deleteGroupRes?.message);
        dispatch(resetDeleteExamGroup());
    }, [dispatch, deleteGroupRes, currentPage]);

    if (getGroupRes?.dataCount && getGroupRes?.dataCount > limit) {
        pageCount = getGroupRes?.dataCount / limit;
        if (pageCount % 2 !== 0) {
            pageCount = Math.ceil(pageCount)
        }
    }
    return (
        <>
            <Stack mb={3} direction={"row"} justifyContent="space-between">
            <SearchInput setSearchQuery={(searchValue) => { setSearchQuery(searchValue); setPage(1) }} />
                {/* <Button className='commonBtn' variant="contained" onClick={() => { toggleList(); setItemData({}); }} startIcon={<AddIcon />}> Add </Button> */}
            </Stack>
            <TableContainer component={Paper} className='tableShadow'>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" className='commonTable'>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Exam Group name</StyledTableCell>
                            <StyledTableCell>Exam list</StyledTableCell>
                            <StyledTableCell align="right">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getGroupRes?.data?.length > 0 ?
                            getGroupRes?.data?.map(elem => (
                                <StyledTableRow key={elem._id}>
                                    <StyledTableCell align="left"><EllipsisText> {elem?.name}</EllipsisText></StyledTableCell>
                                    <StyledTableCell align="left"><EllipsisText> {elem?.list.map(item => item.name).join(", ")}</EllipsisText></StyledTableCell>
                                    <StyledTableCell align="right">
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
                                <StyledTableCell colSpan={3} align="left"><Typography>There is no data to show</Typography></StyledTableCell>
                            </StyledTableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {(getGroupRes?.dataCount > limit) && <Pagination count={pageCount} page={currentPage} onChange={(event, value) => { setPage(value); setCurrentPage(value)}} />}
            <DeleteConfirmationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={() => { dispatch(deleteExamGroupRequest(deleteItemId)); setIsModalOpen(false) }} />
        </>
    );
}