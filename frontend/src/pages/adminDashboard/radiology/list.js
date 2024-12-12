import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, Typography, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Pagination, Stack } from '@mui/material';
import { deleteRequest, getRequest, resetDelete, resetIdGet } from '../../../redux/modules/radiology/slice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { DeleteConfirmationModal, ViewConfirmationModal } from '../../../utils/modal';
import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import SearchInput from '../../../utils/searchInput';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SummarizeIcon from '@mui/icons-material/Summarize';
import DicomViewer from '../image-report/DwvComponent';
import { USER_ROLE_DEFAULT, USER_ROLE } from '../../../constants/Constant';

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

const tableHeading = ["Appointment Date & Time", "Order Id", "Patient Name", "Exams", "Status", "Category", "Action"];

let deleteItemId;
let limit = 10;
let pageCount = 0;

export default function RadiologyList({ setItemData, toggleList, setPreviewRadiology }) {
  const dispatch = useDispatch();
  let { getRes, deleteRes } = useSelector(state => state.radiology);
  let data = useSelector(state => state.orders);
  let { currentBranch } = useSelector(state => state.branch);
  let { userData } = useSelector(state => state.auth);
  let { getRes: profileData } = useSelector(state => state.profile);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [previewReprt, setPreviewReport] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [appointmentCompleteDescription, setAppointmentCompleteDescription] = useState("");

  const filteredTableHeadings = userData.role !== USER_ROLE_DEFAULT.PATIENT 
  ? tableHeading 
  : tableHeading.filter(column => 
      column !== 'Patient Name' && column !== 'Status' && column !== 'Category'
    );

    const filteredElem= userData.role !== USER_ROLE_DEFAULT.PATIENT
    ? getRes?.data
    :getRes && getRes?.data?.filter((data)=>data?.orderId?.status === "Appointment Complete")

  useEffect(() => {
    if (!currentBranch) { return }
    dispatch(getRequest({ page, limit, searchQuery }))
  }, [dispatch, currentBranch, page, searchQuery]);

  useEffect(() => {
    if (!deleteRes) { return }
    if (deleteRes?.success) {
      dispatch(getRequest({ page, limit }))
    }
    toast(deleteRes?.message);
    dispatch(resetDelete());
  }, [dispatch, deleteRes, page]);

  if (getRes?.dataCount && getRes?.dataCount > limit) {
    pageCount = getRes?.dataCount / limit;
    if (pageCount % 2 !== 0) {
      pageCount = Math.ceil(pageCount)
    }
  }

  const renderingRow = (elem) => {
    let ruturnElem = (
      <StyledTableRow key={elem._id}>
        <StyledTableCell align="left">
          <Typography>
            {moment(elem?.appoinmentId?.startTime).format("MM-DD-YYYY HH:mm A")}{" "}
          </Typography>
        </StyledTableCell>
        <StyledTableCell align="left">
          <Typography>{elem?.orderId?.orderId} </Typography>
        </StyledTableCell>
        {userData.role !== USER_ROLE_DEFAULT.PATIENT && 
        <StyledTableCell align="left">
          <Typography>
            {elem?.patientId?.fName} {elem?.patientId?.lName}
          </Typography>
        </StyledTableCell>
        }
        <StyledTableCell align="left">
          <Typography>
            {elem.examList
              .map((item) => item.list.map((listItem) => listItem?.name))
              .flat()
              .join(", ")}
          </Typography>
        </StyledTableCell>
        {userData.role !== USER_ROLE_DEFAULT.PATIENT &&
        <StyledTableCell align="left">
          <Typography
            className={`status-${
              elem?.orderId?.status === "Appointment Miss"
                ? "miss"
                : elem?.orderId?.status === "Appointment Complete"
                ? "complete"
                : elem?.orderId?.status === "Requested"
                ? "requested"
                : ""
            } status-chips`}
          >
            {elem?.orderId?.status && <span className="status-dot"></span>}{" "}
            {elem?.orderId?.status}
          </Typography>
        </StyledTableCell>
        }
        {userData.role !== USER_ROLE_DEFAULT.PATIENT &&
        <StyledTableCell align="left">
          <Typography>{elem?.appoinmentId?.appoinmentCategory}</Typography>
        </StyledTableCell>
        }
        <StyledTableCell align="left">
          <Typography>
            <IconButton
              color="primary.dark"
              onClick={() => {
                setItemData({ id: elem._id });
                if(userData.role !== USER_ROLE_DEFAULT.PATIENT){
                  setPreviewRadiology(true);
                }else{
                  setAppointmentCompleteDescription(elem.orderId.appoinmentCompleteDescription);
                  setIsViewModalOpen(true)
                }
              }}
            >
              <VisibilityIcon />
            </IconButton>
            {userData.role !== USER_ROLE_DEFAULT.PATIENT ?<IconButton
              color="primary"
              onClick={() => {
                setItemData({ id: elem._id ,gender:elem?.patientId?.gender,});
                toggleList();
              }}
            >
              <EditIcon />
            </IconButton>:null}
            {userData.role===USER_ROLE_DEFAULT.ADMIN ?(
            <IconButton
              color="error"
              onClick={() => {
                deleteItemId = elem._id;
                setIsModalOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>):<></>}
            {/* {profileData?.data?.role === "seniorRadiologist" ? (
                          <IconButton>
                            {profileData?.data?.role === "seniorRadiologist" && (
                              <SummarizeIcon onClick={() => {
                                setPreviewReport(true);
                                setSelectedPatient({
                                  fName: elem?.patientId?.fName,
                                  lName: elem?.patientId?.lName,
                                  gender: elem?.patientId?.gender,
                                  email: elem?.patientId?.email,
                                  dob: elem?.patientId?.dob,
                                  orthancParentPatientId: elem?.patientId?.orthancParentPatientId,
                                  orthancPatientId: elem?.patientId?.orthancPatientId,
                                  _id: elem?.patientId?._id
                                });
                              }} />
                            )}
                          </IconButton>
                        ) : null} */}
          </Typography>
        </StyledTableCell>
      </StyledTableRow>
    );
    if (elem.isReffered) {
      if (elem.orderId !== null) {
        return ruturnElem;
      }
      return null;
    } else {
      return ruturnElem;
    }
  };

  return (
    <>
      {!previewReprt && (
        <>
          <Stack mb={3} direction={"row"} justifyContent="space-between">
            <SearchInput setSearchQuery={(searchValue) => { setSearchQuery(searchValue); setPage(1) }} />
            {userData.role===USER_ROLE_DEFAULT.ADMIN ?(<Button className='commonBtn' variant="contained" onClick={() => { toggleList(); setItemData({}); dispatch(resetIdGet()) }} startIcon={<AddIcon />}> Add </Button>):<></>}
          </Stack>
          <TableContainer component={Paper} className='tableShadow'>
            <Table sx={{ minWidth: 700 }} aria-label="customized table" className='commonTable'>
              <TableHead>
                <TableRow>
                  {filteredTableHeadings.map(elem => (<StyledTableCell key={elem}>{elem}</StyledTableCell>))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredElem?.length > 0 ?
                  filteredElem?.map(elem => (
                    <>
                      {renderingRow(elem)}
                    </>
                  ))
                  :
                  <StyledTableRow>
                    <StyledTableCell colSpan={filteredTableHeadings?.length} align="left"><Typography>There is no data to show</Typography></StyledTableCell>
                  </StyledTableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>

          {(getRes?.dataCount > limit) && <Pagination count={pageCount} page={page} onChange={(event, value) => { setPage(value); }} />}
          <DeleteConfirmationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={() => { dispatch(deleteRequest(deleteItemId)); setIsModalOpen(false) }} />
          <ViewConfirmationModal  description={appointmentCompleteDescription} open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} onConfirm={() => {  setIsViewModalOpen(false) }} />
        </>
      )}
      {previewReprt && (
        <DicomViewer patient={selectedPatient} onClose={() => setPreviewReport(false)} />
      )}
    </>
  );
}