import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, Typography, TableContainer, TableHead, TableRow, Paper, IconButton, Pagination, Stack } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import {   deleteUserRequest, getRequestUserList,  resetUserDelete } from '../../../redux/modules/staff/slice';
import { DeleteConfirmationModal } from '../../../utils/modal';
import SearchInput from '../../../utils/searchInput';
import { USER_ROLE, USER_ROLE_DEFAULT } from '../../../constants/Constant';


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
const tableHeading = ["Name", "Role","Email", "Action"];

let deleteItemId;
let limit = 10;
let pageCount = 0;

const userRole = {}
for(let i = 0; i < USER_ROLE.length; i++){
  userRole[USER_ROLE[i].role] = USER_ROLE[i].displayText
}

export default function UsersList({ setItemData, toggleList,setCurrentPage,currentPage }) {
  const dispatch = useDispatch();
  const { getUserListRes,deleteUserRes } = useSelector((state) => state.staff);
  let currentBranch = useSelector(state => state.branch.currentBranch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!currentBranch) { return }
    dispatch(getRequestUserList({ page:currentPage, limit, searchQuery }))
  }, [dispatch,currentBranch, currentPage, searchQuery]);

  useEffect(() => {
    if (currentBranch?.id) {
      dispatch(getRequestUserList({ page:currentPage, limit, searchQuery }))
    }
  }, [currentBranch?.id,currentBranch, currentPage, searchQuery]);

  useEffect(() => {
    if (!deleteUserRes) { return }
    if (deleteUserRes?.success) {
      dispatch(getRequestUserList({ page:currentPage, limit, searchQuery }))
    }
    toast(deleteUserRes?.message);
    dispatch(resetUserDelete());
  }, [dispatch, deleteUserRes,searchQuery, currentPage]);

  if (getUserListRes?.dataCount && getUserListRes?.dataCount > limit) {
    pageCount = getUserListRes?.dataCount / limit;
    if (pageCount % 2 !== 0) {
        pageCount = Math.ceil(pageCount)
    }
}
  return (
    <>
     <Stack mb={3} direction={"row"} justifyContent="space-between">
        <SearchInput setSearchQuery={(searchValue) => { setSearchQuery(searchValue); setPage(1) ; setCurrentPage(1); }} />
      </Stack>
      <TableContainer component={Paper}  className='tableShadow'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" className='commonTable'>
          <TableHead>
            <TableRow>
              {tableHeading.map(elem => (<StyledTableCell key={elem}>{elem}</StyledTableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {getUserListRes?.data?.length > 0 ?
              getUserListRes?.data?.map(elem => (
                <StyledTableRow key={elem._id}>
                  <StyledTableCell align="left"><EllipsisText>{elem.name}</EllipsisText></StyledTableCell>
                  <StyledTableCell align="left"><EllipsisText>{userRole[elem.role]}</EllipsisText></StyledTableCell>
                  <StyledTableCell align="left"><EllipsisText>{elem.email}</EllipsisText></StyledTableCell>
                  <StyledTableCell align="left">
                    <EllipsisText>
                      <IconButton color="primary" onClick={() => { setItemData(elem); toggleList() }}>
                        <EditIcon />
                      </IconButton>
                      {getUserListRes?.data?.length > 1 &&
                        <IconButton color="error" onClick={() => { deleteItemId = elem._id; setIsModalOpen(true) }}>
                          <DeleteIcon />
                        </IconButton>
                      }
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
      {(getUserListRes?.dataCount > limit) && <Pagination count={pageCount} page={currentPage} onChange={(event, value) => { setPage(value); setCurrentPage(value)}} />}
      <DeleteConfirmationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={() => { dispatch(deleteUserRequest(deleteItemId));  setIsModalOpen(false) }} />
    </>
  );
}