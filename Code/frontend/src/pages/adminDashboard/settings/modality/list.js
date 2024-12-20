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
import { getModalityListRequest, resetDeleteModalityList, deleteModalityListRequest } from '../../../../redux/modules/modality/slice';

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

export default function List({ setItemData, toggleList }) {
    const dispatch = useDispatch();
    let { modalities, deleteListRes } = useSelector(state => state.modalities);
    let { currentBranch } = useSelector(state => state.branch);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!currentBranch) { return }
        dispatch(getModalityListRequest({ page, limit, searchQuery }))
    }, [dispatch, currentBranch, page, searchQuery]);



    useEffect(() => {
        if (deleteListRes) {
            if (deleteListRes?.success) {
                dispatch(getModalityListRequest({ page, limit, searchQuery }))
            }
            toast(deleteListRes?.message);
            dispatch(resetDeleteModalityList());
        }
    }, [dispatch, deleteListRes, searchQuery, page]);

    if (modalities?.dataCount && modalities?.dataCount > limit) {
        pageCount = modalities?.dataCount / limit;
        if (pageCount % 2 !== 0) {
            pageCount = Math.ceil(pageCount)
        }
    }

    return (
        <>
            <Stack mb={3} direction={"row"} justifyContent="space-between">
                <SearchInput setSearchQuery={(searchValue) => { setSearchQuery(searchValue); setPage(1) }} />
            </Stack>
            <TableContainer component={Paper} className='tableShadow'>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" className='commonTable'>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Modality name</StyledTableCell>
                            <StyledTableCell>Description</StyledTableCell>
                            <StyledTableCell align="right">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {modalities?.data?.length > 0 ?
                            modalities?.data?.map(elem => (
                                <StyledTableRow key={elem._id}>
                                    <StyledTableCell align="left"><EllipsisText> {elem?.term} </EllipsisText></StyledTableCell>
                                    <StyledTableCell align="left"><EllipsisText> {elem?.decription}</EllipsisText></StyledTableCell>
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
            {(modalities?.dataCount > limit) && <Pagination count={pageCount} page={page} onChange={(event, value) => { setPage(value); }} />}
            <DeleteConfirmationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={() => { dispatch(deleteModalityListRequest(deleteItemId)); setIsModalOpen(false) }} />
        </>
    );
}