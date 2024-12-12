import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMainHeading } from "../../redux/modules/mainHeading/slice";
import { Box, Paper, Typography, Pagination } from "@mui/material";
import { getPatientDashboardData } from "../../redux/modules/dashboard/slice";
import { generateFullDate, getTime } from "../../helper/dateTime";
import { convertToTitleCase } from "../../helper/stringHelper";
import DeclinedOrderDetails from "../adminDashboard/component/declinedOrderDetails";
import { Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';


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
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const EllipsisText = ({ children }) => <Typography>{children}</Typography>;

const tableHeading = [
  "Appointment Date and Time",
  "Exam List",
  "Branch Name",
  "Branch Contact No",
  "Branch Address",
];


const PatientDashboard = () => {
  const dispatch = useDispatch();
  const [viewRadiologyModal, setViewRadiologyModal] = useState({
    openViewRadiologyModal: false,
    orderDetails: {}
  })
  let { todayAppointments, declinedAppointments,upcomingAppointments ,pastAppointments} = useSelector(state => state.dashboard.patientDashboardData);
  let currentBranch = useSelector(state => state.branch.currentBranch);
  const [currentPage, setCurrentPage] = useState({
    today: 1,
    upcoming: 1,
    past: 1
  });
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(setMainHeading("Welcome back!"));

    dispatch(getPatientDashboardData())
  }, [dispatch]);


  useEffect(() => {
    if (currentBranch?.id && currentBranch?.id.length > 0) {
      dispatch(getPatientDashboardData())
    }
  }, [currentBranch?.id]);

  const displayOrderDetailHandler = async (order) => {
    setViewRadiologyModal({
      openViewRadiologyModal: true,
      orderDetails: order
    })
  }

  const handlePageChange = (event, value, section) => {
    setCurrentPage((prev) => ({ ...prev, [section]: value }));
  };

  const paginateData = (data, section) => {
    const startIndex = (currentPage[section] - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };
  return (
    <>
      <DeclinedOrderDetails
        viewRadiologyModal={viewRadiologyModal}
        setViewRadiologyModal={setViewRadiologyModal}
      />
      <Box className="patient-dashboard-listing">
        <Typography variant="h5" className='title' sx={{color:'#052F5D'}}>Todays Appointments</Typography>
          <TableContainer component={Paper}  className='tableShadow' sx={{marginBottom: '60px'}}>
            <Table sx={{ minWidth: 700, }} aria-label="customized table" className='commonTable'>
              <TableHead>
                <TableRow>
                  {tableHeading.map(elem => (<StyledTableCell key={elem}>{elem}</StyledTableCell>))}
                </TableRow>
              </TableHead>
              <TableBody>
                {todayAppointments && todayAppointments?.length !== 0 ?
                  paginateData(todayAppointments, 'today').map((elem, index) => (               
                    <StyledTableRow key={elem._id}>
                      <StyledTableCell align="left" sx={{width:'20%'}}><EllipsisText>{generateFullDate(elem?.appoinments?.startTime)} ({getTime(elem?.appoinments?.startTime)})</EllipsisText></StyledTableCell>
                      <StyledTableCell align="left" sx={{width:'20%'}}><EllipsisText>{elem?.examList.map((item) => item.examListModality.map((listItem) => listItem?.examName)).flat().join(", ")}</EllipsisText></StyledTableCell>
                      <StyledTableCell align="left" sx={{width:'20%'}}><EllipsisText>{elem?.branch?.name}</EllipsisText></StyledTableCell>
                      <StyledTableCell align="left" sx={{width:'20%'}}><EllipsisText>{elem?.branch?.phone}</EllipsisText></StyledTableCell>
                      <StyledTableCell align="left" sx={{width:'20%'}}><EllipsisText>{elem?.branch?.address}</EllipsisText></StyledTableCell>
                    </StyledTableRow>
                ))
                  :
                  <StyledTableRow>
                    <StyledTableCell colSpan={tableHeading.length} align="left"><Typography>There is no data to show</Typography></StyledTableCell>
                  </StyledTableRow> 
                } 
                <StyledTableRow>
                {todayAppointments && todayAppointments?.length > itemsPerPage &&

                <StyledTableCell colSpan={tableHeading.length}>
                <Pagination
                  count={Math.ceil(todayAppointments.length / itemsPerPage)}
                  page={currentPage.today}
                  onChange={(event, value) => handlePageChange(event, value, 'today')}
                  sx={{ '& .MuiPagination-ul': { justifyContent: 'end' } }}
                />  
                </StyledTableCell>
                }
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>

        <Typography variant="h5" className='title' sx={{color:'#052F5D'}}>Upcoming Appointments</Typography>
          <TableContainer component={Paper}  className='tableShadow' sx={{marginBottom: '60px'}}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table" className='commonTable'>
              <TableHead>
                <TableRow>
                  {tableHeading.map(elem => (<StyledTableCell key={elem}>{elem}</StyledTableCell>))}
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingAppointments && upcomingAppointments?.length !== 0 ?
                  paginateData(upcomingAppointments, 'upcoming').map((elem, index) => (
                    <StyledTableRow key={elem._id}>
                      <StyledTableCell sx={{width:'20%'}} align="left"><EllipsisText>{generateFullDate(elem?.appoinments?.startTime)} ({getTime(elem?.appoinments?.startTime)})</EllipsisText></StyledTableCell>
                      <StyledTableCell align="left" sx={{width:'20%'}}><EllipsisText>{elem?.examList.map((item) => item.examListModality.map((listItem) => listItem?.examName)).flat().join(", ")}</EllipsisText></StyledTableCell>
                      <StyledTableCell align="left" sx={{width:'20%'}}><EllipsisText>{elem?.branch?.name}</EllipsisText></StyledTableCell>
                      <StyledTableCell align="left" sx={{width:'20%'}}><EllipsisText>{elem?.branch?.phone}</EllipsisText></StyledTableCell>
                      <StyledTableCell align="left" sx={{width:'20%'}}><EllipsisText>{elem?.branch?.address}</EllipsisText></StyledTableCell>
                    </StyledTableRow>
                ))
                  :
                  <StyledTableRow>
                    <StyledTableCell colSpan={tableHeading.length} align="left"><Typography>There is no data to show</Typography></StyledTableCell>
                  </StyledTableRow> 
                }
                <StyledTableRow  >
                {upcomingAppointments && upcomingAppointments?.length > itemsPerPage &&
                <StyledTableCell colSpan={tableHeading.length}>
                  <Pagination
                    count={Math.ceil(upcomingAppointments?.length / itemsPerPage)}
                    page={currentPage.upcoming}
                    onChange={(event, value) => handlePageChange(event, value, 'upcoming')}
                    sx={{ '& .MuiPagination-ul': { justifyContent: 'end' } }}
                  />  
                </StyledTableCell>
                }
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
      <Typography variant="h5" className='title' sx={{color:'#052F5D'}}>Past Appointments</Typography>
        <TableContainer component={Paper}  className='tableShadow' sx={{marginBottom: '20px'}}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" className='commonTable'>
            <TableHead>
              <TableRow>
                {tableHeading.map(elem => (<StyledTableCell key={elem}>{elem}</StyledTableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {pastAppointments && pastAppointments.length !== 0 ?
                paginateData(pastAppointments, 'past').map((elem, index) => (
                  <StyledTableRow key={elem._id}>
                    <StyledTableCell align="left" sx={{width:'20%'}}><EllipsisText>{generateFullDate(elem?.appoinments?.startTime)} ({getTime(elem?.appoinments?.startTime)})</EllipsisText></StyledTableCell>
                    <StyledTableCell align="left" sx={{width:'20%'}}><EllipsisText>{elem?.examList.map((item) => item.examListModality.map((listItem) => listItem?.examName)).flat().join(", ")}</EllipsisText></StyledTableCell>
                    <StyledTableCell align="left" sx={{width:'20%'}}><EllipsisText>{elem?.branch?.name}</EllipsisText></StyledTableCell>
                    <StyledTableCell align="left" sx={{width:'20%'}}><EllipsisText>{elem?.branch?.phone}</EllipsisText></StyledTableCell>
                    <StyledTableCell align="left" sx={{width:'20%'}}><EllipsisText>{elem?.branch?.address}</EllipsisText></StyledTableCell>
                  </StyledTableRow>
              ))
                :
                <StyledTableRow>
                  <StyledTableCell colSpan={tableHeading.length} align="left"><Typography>There is no data to show</Typography></StyledTableCell>
                </StyledTableRow> 
              } 
              <StyledTableRow  >
              {pastAppointments && pastAppointments?.length > itemsPerPage &&
              <StyledTableCell colSpan={tableHeading.length}>
                <Pagination
                  count={Math.ceil(pastAppointments?.length / itemsPerPage)}
                  page={currentPage.past}
                  onChange={(event, value) => handlePageChange(event, value, 'past')}
                  sx={{ '& .MuiPagination-ul': { justifyContent: 'end' } }}
                />
                </StyledTableCell>
              }
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box> 
    </>
  )
}

export default PatientDashboard;