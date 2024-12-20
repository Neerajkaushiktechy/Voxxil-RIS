import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, Typography, TableContainer, TableHead, TableRow, Paper, IconButton, Pagination, Stack, Tooltip } from '@mui/material';
import { getRequest } from '../../../redux/modules/radiology/slice';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import SearchInput from '../../../utils/searchInput';
import SourceIcon from '@mui/icons-material/Source';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { USER_ROLE_DEFAULT } from '../../../constants/Constant';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

const tableHeading = ["Appointment Date & Time", "Order Id", "Patient Name", "Exams", "Appointment Status", "Report Status", "Category", "Action"];

let limit = 10;
let pageCount = 0;

export default function RadiologyList({ setItemData, setShowComponent, itemData }) {
  const dispatch = useDispatch();
  let { getRes } = useSelector(state => state.radiology);
  let { currentBranch } = useSelector(state => state.branch);
  let { userData } = useSelector(state => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredTableHeadings = userData.role !== USER_ROLE_DEFAULT.PATIENT 
  ? tableHeading 
  : tableHeading.filter(column => 
      column !== 'Patient Name' && column !== 'Appointment Status' && column !== 'Category' && column !== 'Report Status'
    );

    const filteredElem= userData.role !== USER_ROLE_DEFAULT.PATIENT
    ? getRes?.data
    :getRes && getRes?.data?.filter((data)=>data?.orderId?.status === "Appointment Complete")

  useEffect(() => {
    if (!currentBranch) { return }
    dispatch(getRequest({ page, limit, searchQuery }))
  }, [dispatch, currentBranch, page, searchQuery]);


  if (getRes?.dataCount && getRes?.dataCount > limit) {
    pageCount = getRes?.dataCount / limit;
    if (pageCount % 2 !== 0) {
      pageCount = Math.ceil(pageCount)
    }
  }

  const changeComponent = (componentName, item) => {
    setShowComponent(componentName);
    setItemData({
      radiologyId: item._id,
      orthancPatientId: item.orthancPatientId,
      examList: item?.examList,
      reportData: item?.reportId,
      seletedpatient: item?.patientId,
      lmp: item?.appoinmentId?.lmp,
      examReason: item?.appoinmentId?.examReason,
      orderId: item?.orderId?.orderId,
      appointmentDate: item?.appoinmentId?.startTime,
      referringDoctor: `${item?.referringSignatureId?.firstName} ${item?.referringSignatureId?.lastName}`,
      studyData: {
        orthancStudyID: item?.orderId?.orthancStudyID,
        orthancStudyDescription: item?.orderId?.orthancStudyDescription,
        orthancStudyInstanceUID: item?.orderId?.orthancStudyInstanceUID
      }
    });
  }
  return (
    <>
      <Stack mb={3} direction="row" justifyContent="space-between">
        <SearchInput setSearchQuery={(searchValue) => { setSearchQuery(searchValue); setPage(1) }} />
      </Stack>
      <TableContainer component={Paper} className='tableShadow'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" className='commonTable'>
          <TableHead>
            <TableRow>
              {filteredTableHeadings?.map((elem) => (
                <StyledTableCell key={elem}>{elem}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredElem?.length > 0 ? (
              filteredElem?.map((appointment) => (
                <StyledTableRow key={appointment._id}>
                  <StyledTableCell align="left">
                    <Typography>{moment(appointment?.appoinmentId?.startTime).format('MM-DD-YYYY HH:mm A')}</Typography>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Typography>{appointment?.orderId?.orderId}</Typography>
                  </StyledTableCell>
                  {userData.role !== USER_ROLE_DEFAULT.PATIENT &&
                  <StyledTableCell align="left">
                    <Typography>{`${appointment?.patientId?.fName} ${appointment?.patientId?.lName}`}</Typography>
                  </StyledTableCell>
                   }
                  <StyledTableCell align="left">
                    <Typography>{appointment.examList.map((item) => item.list.map((listItem) => listItem?.name)).flat().join(", ")}</Typography>
                  </StyledTableCell>
                  {userData.role !== USER_ROLE_DEFAULT.PATIENT &&
                  <StyledTableCell align="left">
                    <Typography className={`status-${appointment?.orderId?.status === "Appointment Miss" ? "miss" :
                      appointment?.orderId?.status === "Appointment Complete" ? "complete" :
                        appointment?.orderId?.status === "Requested" ? "requested" :
                          ""
                      } status-chips`}>
                      {appointment?.orderId?.status && <span className="status-dot"></span>} {appointment?.orderId?.status}
                    </Typography>
                  </StyledTableCell>
                  }
                  {userData.role !== USER_ROLE_DEFAULT.PATIENT &&
                  <StyledTableCell align="left">
                    <Typography className={`status-${appointment?.reportId?.reportStatus === "completed" ? "complete" :
                      appointment?.reportId?.reportStatus === "pending" ? "requested" :
                        "-"
                      } status-chips`}>
                      {appointment?.reportId?.reportStatus && <span className="status-dot"></span>} {appointment?.reportId?.reportStatus || "-"}
                    </Typography>
                  </StyledTableCell>
                  }
                  {userData.role !== USER_ROLE_DEFAULT.PATIENT &&
                  <StyledTableCell align="left">
                    <Typography>{appointment?.appoinmentId?.appoinmentCategory}</Typography>
                  </StyledTableCell>
                  }
                  <StyledTableCell align="left">
                    <Typography>
                      {appointment?.orderId?.status === "Appointment Complete" ?
                        <>
                        {userData.role !== USER_ROLE_DEFAULT.PATIENT &&
                          <Tooltip title="View Files" arrow placement="top">
                            <IconButton color="primary.dark" onClick={() => { changeComponent("viewFiles", appointment) }}>
                              <SourceIcon />
                            </IconButton>
                          </Tooltip>
                          }
                          {userData.role === USER_ROLE_DEFAULT.PATIENT &&
                          <Tooltip title="View Report" arrow placement="top">
                                <IconButton color="primary.dark" onClick={() => { changeComponent("createReport", appointment) }}>
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              }
                          {appointment.reportId
                            ?
                            <>
                              {userData.role !== USER_ROLE_DEFAULT.PATIENT && 
                              <Tooltip title="Edit Report" arrow placement="top">
                                <IconButton color="primary.dark" onClick={() => { changeComponent("createReport", appointment) }}>
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              }               
                              {appointment?.reportId?.reportStatus === "completed" &&
                                <Tooltip title="View Report" arrow placement="top">
                                  <IconButton color="primary.dark" onClick={() => { changeComponent("viewReport", appointment) }}>
                                    <SummarizeIcon />
                                  </IconButton>
                                </Tooltip>
                              }
                            </>
                            :
                            <>
                            {
                             userData.role !== USER_ROLE_DEFAULT.PATIENT ?
                             <Tooltip title="Create Report" arrow placement="top">
                             <IconButton color="primary.dark" onClick={() => { changeComponent("createReport", appointment) }}>
                               <AddIcon />
                             </IconButton>
                           </Tooltip>
                           :null
                            }            
                            </>
                          }
                        </>
                        : '-'
                      }
                    </Typography >
                  </StyledTableCell >
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={filteredTableHeadings.length} align="left">
                  <Typography>There is no data to show</Typography>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {(getRes?.dataCount > limit) && <Pagination count={pageCount} page={page} onChange={(event, value) => { setPage(value); }} />}
    </>
  )
}
