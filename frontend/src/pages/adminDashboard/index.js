import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMainHeading } from "../../redux/modules/mainHeading/slice";
import { Box, Grid, LinearProgress, MenuItem, Paper, Select, Typography, Button } from "@mui/material";
import { getRequest } from "../../redux/modules/dashboard/slice";
import { getdeclineReferralList } from "../../redux/modules/dashboard/slice";
import { generateFullDate, getTime } from "../../helper/dateTime";
import { convertToTitleCase } from "../../helper/stringHelper";
import DeclinedOrderDetails from "./component/declinedOrderDetails";
import VisibilityIcon from '@mui/icons-material/Visibility';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [viewRadiologyModal, setViewRadiologyModal] = useState({
    openViewRadiologyModal:false,
    orderDetails:{}
  })
  const [selectedVisitors, setSelectedVisitors] = useState('1 Week');
  const [selectedAppointments, setSelectedAppointments] = useState('1 Week');
  const [selectedPatients, setSelectedPatients] = useState('1 Week');
  const [selectedRooms, setSelectedRooms] = useState('1 Week');
  let { getRes, declineReferral } = useSelector(state => state.dashboard);
  let currentBranch = useSelector(state => state.branch.currentBranch);

  useEffect(() => {
    dispatch(setMainHeading("Welcome back!"));

    // dispatch(getdeclineReferralList())
  }, [dispatch]);


  useEffect(() => {
    if (currentBranch?.id && currentBranch?.id.length > 0) {
      dispatch(getRequest())
      dispatch(getdeclineReferralList())
    }
  }, [currentBranch?.id]);

  const displayOrderDetailHandler = async (order) => {
    setViewRadiologyModal({
        openViewRadiologyModal:true,
        orderDetails: order
    })
}

  return (
    <>
       <DeclinedOrderDetails 
                    viewRadiologyModal = {viewRadiologyModal}
                    setViewRadiologyModal = {setViewRadiologyModal}
                />
      <Box className="dashboard-cards">
        <Grid container spacing={4}>
          <Grid item xl={3} lg={6} sm={12} className="card-1">
            <Box sx={{ padding: "20px", borderRadius: "10px", backgroundColor: "#EBECFC" }}>
              <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                <Box display={"flex"} alignItems={"center"}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="5" fill="#2D33C0" />
                    <path d="M14.9499 6.4C14.7643 6.4 14.5862 6.32625 14.4549 6.19497C14.3237 6.0637 14.2499 5.88565 14.2499 5.7C14.2499 5.51435 14.3237 5.3363 14.4549 5.20503C14.5862 5.07375 14.7643 5 14.9499 5H17.7499C17.9356 5 18.1136 5.07375 18.2449 5.20503C18.3762 5.3363 18.4499 5.51435 18.4499 5.7V8.5C18.4499 8.68565 18.3762 8.8637 18.2449 8.99497C18.1136 9.12625 17.9356 9.2 17.7499 9.2C17.5643 9.2 17.3862 9.12625 17.2549 8.99497C17.1237 8.8637 17.0499 8.68565 17.0499 8.5V7.3898L12.9948 11.4449C12.8635 11.5761 12.6855 11.6499 12.4999 11.6499C12.3143 11.6499 12.1363 11.5761 12.005 11.4449L10.0499 9.4898L6.3448 13.1949C6.21278 13.3224 6.03596 13.393 5.85242 13.3914C5.66888 13.3898 5.49332 13.3162 5.36353 13.1864C5.23374 13.0566 5.16013 12.881 5.15853 12.6975C5.15694 12.5139 5.22749 12.3371 5.355 12.2051L9.555 8.0051C9.68627 7.87387 9.86429 7.80015 10.0499 7.80015C10.2355 7.80015 10.4135 7.87387 10.5448 8.0051L12.4999 9.9602L16.0601 6.4H14.9499ZM6.5499 16.2V18.3C6.5499 18.4857 6.47615 18.6637 6.34488 18.795C6.2136 18.9263 6.03555 19 5.8499 19C5.66425 19 5.4862 18.9263 5.35493 18.795C5.22365 18.6637 5.1499 18.4857 5.1499 18.3V16.2C5.1499 16.0143 5.22365 15.8363 5.35493 15.705C5.4862 15.5737 5.66425 15.5 5.8499 15.5C6.03555 15.5 6.2136 15.5737 6.34488 15.705C6.47615 15.8363 6.5499 16.0143 6.5499 16.2ZM10.0499 13.4C10.0499 13.2143 9.97615 13.0363 9.84488 12.905C9.7136 12.7737 9.53555 12.7 9.3499 12.7C9.16425 12.7 8.9862 12.7737 8.85493 12.905C8.72365 13.0363 8.6499 13.2143 8.6499 13.4V18.3C8.6499 18.4857 8.72365 18.6637 8.85493 18.795C8.9862 18.9263 9.16425 19 9.3499 19C9.53555 19 9.7136 18.9263 9.84488 18.795C9.97615 18.6637 10.0499 18.4857 10.0499 18.3V13.4ZM12.8499 14.1C13.0356 14.1 13.2136 14.1737 13.3449 14.305C13.4762 14.4363 13.5499 14.6143 13.5499 14.8V18.3C13.5499 18.4857 13.4762 18.6637 13.3449 18.795C13.2136 18.9263 13.0356 19 12.8499 19C12.6643 19 12.4862 18.9263 12.3549 18.795C12.2237 18.6637 12.1499 18.4857 12.1499 18.3V14.8C12.1499 14.6143 12.2237 14.4363 12.3549 14.305C12.4862 14.1737 12.6643 14.1 12.8499 14.1ZM17.0499 11.3C17.0499 11.1143 16.9762 10.9363 16.8449 10.805C16.7136 10.6737 16.5356 10.6 16.3499 10.6C16.1643 10.6 15.9862 10.6737 15.8549 10.805C15.7237 10.9363 15.6499 11.1143 15.6499 11.3V18.3C15.6499 18.4857 15.7237 18.6637 15.8549 18.795C15.9862 18.9263 16.1643 19 16.3499 19C16.5356 19 16.7136 18.9263 16.8449 18.795C16.9762 18.6637 17.0499 18.4857 17.0499 18.3V11.3Z" fill="white" />
                  </svg>
                  <h2>Overall Visitors</h2>
                </Box>
                <Select
                  className="single-select-dropdown"
                  name="searchType"
                  required
                  sx={{ width: "auto", minWidth: "150px", border: "solid", borderRadius: "6px", color: "#052F5D" }}
                  fullWidth
                  value={selectedVisitors}  
                  onChange={(event)=>setSelectedVisitors(event.target.value)} 
                >
                <MenuItem value="1 Week">1 Week</MenuItem>
                <MenuItem value="2 Week">2 Week</MenuItem>
                <MenuItem value="3 Week">3 Week</MenuItem>
                <MenuItem value="4 Week">4 Week</MenuItem>
                <MenuItem value="This Month">This Month</MenuItem>
                <MenuItem value="Last Month">Last Month</MenuItem>
                <MenuItem value="Last 2 Months">Last 2 Months</MenuItem>
              </Select>
              </Box>
              <Typography>
                <h1>10,525</h1>
                <p>Data obtained from the last 2 weeks from 5.567 visitors to 7,435 Visitor.</p>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                <Box sx={{ width: "100%", mr: 2 }}>
                  <LinearProgress variant="determinate" />
                </Box>
                <span>1,345 Today </span>
              </Box>
            </Box>
          </Grid>
          <Grid item xl={3} lg={6} sm={12} className="card-2">
            <Box sx={{ padding: "20px", borderRadius: "10px", backgroundColor: "#FFF1FB" }}>
              <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                <Box display={"flex"} alignItems={"center"}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="5" fill="#B80587" />
                    <path d="M14.9499 6.4C14.7643 6.4 14.5862 6.32625 14.4549 6.19497C14.3237 6.0637 14.2499 5.88565 14.2499 5.7C14.2499 5.51435 14.3237 5.3363 14.4549 5.20503C14.5862 5.07375 14.7643 5 14.9499 5H17.7499C17.9356 5 18.1136 5.07375 18.2449 5.20503C18.3762 5.3363 18.4499 5.51435 18.4499 5.7V8.5C18.4499 8.68565 18.3762 8.8637 18.2449 8.99497C18.1136 9.12625 17.9356 9.2 17.7499 9.2C17.5643 9.2 17.3862 9.12625 17.2549 8.99497C17.1237 8.8637 17.0499 8.68565 17.0499 8.5V7.3898L12.9948 11.4449C12.8635 11.5761 12.6855 11.6499 12.4999 11.6499C12.3143 11.6499 12.1363 11.5761 12.005 11.4449L10.0499 9.4898L6.3448 13.1949C6.21278 13.3224 6.03596 13.393 5.85242 13.3914C5.66888 13.3898 5.49332 13.3162 5.36353 13.1864C5.23374 13.0566 5.16013 12.881 5.15853 12.6975C5.15694 12.5139 5.22749 12.3371 5.355 12.2051L9.555 8.0051C9.68627 7.87387 9.86429 7.80015 10.0499 7.80015C10.2355 7.80015 10.4135 7.87387 10.5448 8.0051L12.4999 9.9602L16.0601 6.4H14.9499ZM6.5499 16.2V18.3C6.5499 18.4857 6.47615 18.6637 6.34488 18.795C6.2136 18.9263 6.03555 19 5.8499 19C5.66425 19 5.4862 18.9263 5.35493 18.795C5.22365 18.6637 5.1499 18.4857 5.1499 18.3V16.2C5.1499 16.0143 5.22365 15.8363 5.35493 15.705C5.4862 15.5737 5.66425 15.5 5.8499 15.5C6.03555 15.5 6.2136 15.5737 6.34488 15.705C6.47615 15.8363 6.5499 16.0143 6.5499 16.2ZM10.0499 13.4C10.0499 13.2143 9.97615 13.0363 9.84488 12.905C9.7136 12.7737 9.53555 12.7 9.3499 12.7C9.16425 12.7 8.9862 12.7737 8.85493 12.905C8.72365 13.0363 8.6499 13.2143 8.6499 13.4V18.3C8.6499 18.4857 8.72365 18.6637 8.85493 18.795C8.9862 18.9263 9.16425 19 9.3499 19C9.53555 19 9.7136 18.9263 9.84488 18.795C9.97615 18.6637 10.0499 18.4857 10.0499 18.3V13.4ZM12.8499 14.1C13.0356 14.1 13.2136 14.1737 13.3449 14.305C13.4762 14.4363 13.5499 14.6143 13.5499 14.8V18.3C13.5499 18.4857 13.4762 18.6637 13.3449 18.795C13.2136 18.9263 13.0356 19 12.8499 19C12.6643 19 12.4862 18.9263 12.3549 18.795C12.2237 18.6637 12.1499 18.4857 12.1499 18.3V14.8C12.1499 14.6143 12.2237 14.4363 12.3549 14.305C12.4862 14.1737 12.6643 14.1 12.8499 14.1ZM17.0499 11.3C17.0499 11.1143 16.9762 10.9363 16.8449 10.805C16.7136 10.6737 16.5356 10.6 16.3499 10.6C16.1643 10.6 15.9862 10.6737 15.8549 10.805C15.7237 10.9363 15.6499 11.1143 15.6499 11.3V18.3C15.6499 18.4857 15.7237 18.6637 15.8549 18.795C15.9862 18.9263 16.1643 19 16.3499 19C16.5356 19 16.7136 18.9263 16.8449 18.795C16.9762 18.6637 17.0499 18.4857 17.0499 18.3V11.3Z" fill="white" />
                  </svg>
                  <h2>Appointments</h2>
                </Box>
                <Select
                  className="single-select-dropdown"
                  name="searchType"
                  required
                  sx={{ width: "auto", minWidth: "150px", border: "solid", borderRadius: "6px", color: "#052F5D" }}
                  fullWidth
                  value={selectedAppointments}  
                  onChange={(event)=>setSelectedAppointments(event.target.value)} 
                >
                <MenuItem value="1 Week">1 Week</MenuItem>
                <MenuItem value="2 Week">2 Week</MenuItem>
                <MenuItem value="3 Week">3 Week</MenuItem>
                <MenuItem value="4 Week">4 Week</MenuItem>
                <MenuItem value="This Month">This Month</MenuItem>
                <MenuItem value="Last Month">Last Month</MenuItem>
                <MenuItem value="Last 2 Months">Last 2 Months</MenuItem>
                </Select>
              </Box>
              <h1>{getRes?.totalAppointmentsCount}</h1>
              <Typography display={"flex"} alignItems={"center"} justifyContent={"space-between"} marginBottom={"26px"} className="appoint-title">
                <p>Missed Appointments</p>
                <p className="value">{getRes?.missedAppointments}
                </p>
              </Typography>
              <Typography display={"flex"} alignItems={"center"} justifyContent={"space-between"} className="appoint-title">
                <p>Completed Appointments</p>
                <p className="value">{getRes?.completedAppointments}</p>
              </Typography>
            </Box>
          </Grid>
          <Grid item xl={3} lg={6} sm={12} className="card-3">
            <Box sx={{ padding: "20px", borderRadius: "10px", backgroundColor: "#FFF5F3" }}>
              <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                <Box display={"flex"} alignItems={"center"}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="5" fill="#FF5E2A" />
                    <path d="M14.9499 6.4C14.7643 6.4 14.5862 6.32625 14.4549 6.19497C14.3237 6.0637 14.2499 5.88565 14.2499 5.7C14.2499 5.51435 14.3237 5.3363 14.4549 5.20503C14.5862 5.07375 14.7643 5 14.9499 5H17.7499C17.9356 5 18.1136 5.07375 18.2449 5.20503C18.3762 5.3363 18.4499 5.51435 18.4499 5.7V8.5C18.4499 8.68565 18.3762 8.8637 18.2449 8.99497C18.1136 9.12625 17.9356 9.2 17.7499 9.2C17.5643 9.2 17.3862 9.12625 17.2549 8.99497C17.1237 8.8637 17.0499 8.68565 17.0499 8.5V7.3898L12.9948 11.4449C12.8635 11.5761 12.6855 11.6499 12.4999 11.6499C12.3143 11.6499 12.1363 11.5761 12.005 11.4449L10.0499 9.4898L6.3448 13.1949C6.21278 13.3224 6.03596 13.393 5.85242 13.3914C5.66888 13.3898 5.49332 13.3162 5.36353 13.1864C5.23374 13.0566 5.16013 12.881 5.15853 12.6975C5.15694 12.5139 5.22749 12.3371 5.355 12.2051L9.555 8.0051C9.68627 7.87387 9.86429 7.80015 10.0499 7.80015C10.2355 7.80015 10.4135 7.87387 10.5448 8.0051L12.4999 9.9602L16.0601 6.4H14.9499ZM6.5499 16.2V18.3C6.5499 18.4857 6.47615 18.6637 6.34488 18.795C6.2136 18.9263 6.03555 19 5.8499 19C5.66425 19 5.4862 18.9263 5.35493 18.795C5.22365 18.6637 5.1499 18.4857 5.1499 18.3V16.2C5.1499 16.0143 5.22365 15.8363 5.35493 15.705C5.4862 15.5737 5.66425 15.5 5.8499 15.5C6.03555 15.5 6.2136 15.5737 6.34488 15.705C6.47615 15.8363 6.5499 16.0143 6.5499 16.2ZM10.0499 13.4C10.0499 13.2143 9.97615 13.0363 9.84488 12.905C9.7136 12.7737 9.53555 12.7 9.3499 12.7C9.16425 12.7 8.9862 12.7737 8.85493 12.905C8.72365 13.0363 8.6499 13.2143 8.6499 13.4V18.3C8.6499 18.4857 8.72365 18.6637 8.85493 18.795C8.9862 18.9263 9.16425 19 9.3499 19C9.53555 19 9.7136 18.9263 9.84488 18.795C9.97615 18.6637 10.0499 18.4857 10.0499 18.3V13.4ZM12.8499 14.1C13.0356 14.1 13.2136 14.1737 13.3449 14.305C13.4762 14.4363 13.5499 14.6143 13.5499 14.8V18.3C13.5499 18.4857 13.4762 18.6637 13.3449 18.795C13.2136 18.9263 13.0356 19 12.8499 19C12.6643 19 12.4862 18.9263 12.3549 18.795C12.2237 18.6637 12.1499 18.4857 12.1499 18.3V14.8C12.1499 14.6143 12.2237 14.4363 12.3549 14.305C12.4862 14.1737 12.6643 14.1 12.8499 14.1ZM17.0499 11.3C17.0499 11.1143 16.9762 10.9363 16.8449 10.805C16.7136 10.6737 16.5356 10.6 16.3499 10.6C16.1643 10.6 15.9862 10.6737 15.8549 10.805C15.7237 10.9363 15.6499 11.1143 15.6499 11.3V18.3C15.6499 18.4857 15.7237 18.6637 15.8549 18.795C15.9862 18.9263 16.1643 19 16.3499 19C16.5356 19 16.7136 18.9263 16.8449 18.795C16.9762 18.6637 17.0499 18.4857 17.0499 18.3V11.3Z" fill="white" />
                  </svg>
                  <h2>Total Patient</h2>
                </Box>
                <Select
                  className="single-select-dropdown"
                  name="searchType"
                  required
                  sx={{ width: "auto", minWidth: "150px", border: "solid", borderRadius: "6px", color: "#052F5D" }}
                  fullWidth
                  value={selectedPatients}  
                  onChange={(event)=>setSelectedPatients(event.target.value)} 
                >
                <MenuItem value="1 Week">1 Week</MenuItem>
                <MenuItem value="2 Week">2 Week</MenuItem>
                <MenuItem value="3 Week">3 Week</MenuItem>
                <MenuItem value="4 Week">4 Week</MenuItem>
                <MenuItem value="This Month">This Month</MenuItem>
                <MenuItem value="Last Month">Last Month</MenuItem>
                <MenuItem value="Last 2 Months">Last 2 Months</MenuItem>
                </Select>
              </Box>
              <h1>{getRes?.totalPatientsCount}</h1>
              <Typography sx={{ minHeight: "92px", maxWidth: "300px" }}>
                <p>Increase in data by 500 inpatients in the last 7 days</p>
              </Typography>
            </Box>
          </Grid>
          <Grid item xl={3} lg={6} sm={12} className="card-4">
            <Box sx={{ padding: "20px", borderRadius: "10px", backgroundColor: "#EAFFEC" }}>
              <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                <Box display={"flex"} alignItems={"center"}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="5" fill="#33BF49" />
                    <path d="M14.9499 6.4C14.7643 6.4 14.5862 6.32625 14.4549 6.19497C14.3237 6.0637 14.2499 5.88565 14.2499 5.7C14.2499 5.51435 14.3237 5.3363 14.4549 5.20503C14.5862 5.07375 14.7643 5 14.9499 5H17.7499C17.9356 5 18.1136 5.07375 18.2449 5.20503C18.3762 5.3363 18.4499 5.51435 18.4499 5.7V8.5C18.4499 8.68565 18.3762 8.8637 18.2449 8.99497C18.1136 9.12625 17.9356 9.2 17.7499 9.2C17.5643 9.2 17.3862 9.12625 17.2549 8.99497C17.1237 8.8637 17.0499 8.68565 17.0499 8.5V7.3898L12.9948 11.4449C12.8635 11.5761 12.6855 11.6499 12.4999 11.6499C12.3143 11.6499 12.1363 11.5761 12.005 11.4449L10.0499 9.4898L6.3448 13.1949C6.21278 13.3224 6.03596 13.393 5.85242 13.3914C5.66888 13.3898 5.49332 13.3162 5.36353 13.1864C5.23374 13.0566 5.16013 12.881 5.15853 12.6975C5.15694 12.5139 5.22749 12.3371 5.355 12.2051L9.555 8.0051C9.68627 7.87387 9.86429 7.80015 10.0499 7.80015C10.2355 7.80015 10.4135 7.87387 10.5448 8.0051L12.4999 9.9602L16.0601 6.4H14.9499ZM6.5499 16.2V18.3C6.5499 18.4857 6.47615 18.6637 6.34488 18.795C6.2136 18.9263 6.03555 19 5.8499 19C5.66425 19 5.4862 18.9263 5.35493 18.795C5.22365 18.6637 5.1499 18.4857 5.1499 18.3V16.2C5.1499 16.0143 5.22365 15.8363 5.35493 15.705C5.4862 15.5737 5.66425 15.5 5.8499 15.5C6.03555 15.5 6.2136 15.5737 6.34488 15.705C6.47615 15.8363 6.5499 16.0143 6.5499 16.2ZM10.0499 13.4C10.0499 13.2143 9.97615 13.0363 9.84488 12.905C9.7136 12.7737 9.53555 12.7 9.3499 12.7C9.16425 12.7 8.9862 12.7737 8.85493 12.905C8.72365 13.0363 8.6499 13.2143 8.6499 13.4V18.3C8.6499 18.4857 8.72365 18.6637 8.85493 18.795C8.9862 18.9263 9.16425 19 9.3499 19C9.53555 19 9.7136 18.9263 9.84488 18.795C9.97615 18.6637 10.0499 18.4857 10.0499 18.3V13.4ZM12.8499 14.1C13.0356 14.1 13.2136 14.1737 13.3449 14.305C13.4762 14.4363 13.5499 14.6143 13.5499 14.8V18.3C13.5499 18.4857 13.4762 18.6637 13.3449 18.795C13.2136 18.9263 13.0356 19 12.8499 19C12.6643 19 12.4862 18.9263 12.3549 18.795C12.2237 18.6637 12.1499 18.4857 12.1499 18.3V14.8C12.1499 14.6143 12.2237 14.4363 12.3549 14.305C12.4862 14.1737 12.6643 14.1 12.8499 14.1ZM17.0499 11.3C17.0499 11.1143 16.9762 10.9363 16.8449 10.805C16.7136 10.6737 16.5356 10.6 16.3499 10.6C16.1643 10.6 15.9862 10.6737 15.8549 10.805C15.7237 10.9363 15.6499 11.1143 15.6499 11.3V18.3C15.6499 18.4857 15.7237 18.6637 15.8549 18.795C15.9862 18.9263 16.1643 19 16.3499 19C16.5356 19 16.7136 18.9263 16.8449 18.795C16.9762 18.6637 17.0499 18.4857 17.0499 18.3V11.3Z" fill="white" />
                  </svg>
                  <h2>Overall Rooms</h2>
                </Box>
                <Select
                  className="single-select-dropdown"
                  name="searchType"
                  required
                  sx={{ width: "auto", minWidth: "150px", border: "solid", borderRadius: "6px", color: "#052F5D" }}
                  fullWidth
                  value={selectedRooms}  
                  onChange={(event)=>setSelectedRooms(event.target.value)} 
                >
                <MenuItem value="1 Week">1 Week</MenuItem>
                <MenuItem value="2 Week">2 Week</MenuItem>
                <MenuItem value="3 Week">3 Week</MenuItem>
                <MenuItem value="4 Week">4 Week</MenuItem>
                <MenuItem value="This Month">This Month</MenuItem>
                <MenuItem value="Last Month">Last Month</MenuItem>
                <MenuItem value="Last 2 Months">Last 2 Months</MenuItem>
                </Select>
              </Box>
              <h1>221</h1>
              <Typography display={"flex"} alignItems={"center"} justifyContent={"space-between"} className="general-rooms" borderBottom={"1px solid #D3EADE"}>
                <p>General Rooms</p>
                <p>111</p>
              </Typography>
              <Typography display={"flex"} alignItems={"center"} justifyContent={"space-between"} className="appoint-title">
                <p>Private Rooms</p>
                <p>210</p>
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid sx={{marginBottom: '30px'}}>
          <Paper sx={{ padding: 2, mt: 3,    background: '#dfe7fe', boxShadow: 'unset !important', maxHeight: '250px', overflowY: 'auto' }} className='cardStyle'>
            <Typography variant="h5" className='title'>Todays Appointment</Typography>
            {getRes?.appoinments && getRes?.appoinments.length !== 0 ? (
              getRes?.appoinments.map((data) =>
              (
                <Box sx={{
                  borderBottom: '1px solid #a6bed6',
                  paddingBottom: '16px',
                  marginBottom: '16px'
                }}>
                  <Grid container spacing={2}>
                    <Grid item lg={3} md={3} sm={6} xs={12}>
                      <Typography color="text.titleColor">Patient Name:</Typography>
                      <Typography sx={{ fontWeight: 500 }}  >{data?.patientInformation?.fName} {data?.patientInformation?.lName}</Typography>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12}>
                      <Typography color="text.titleColor">Gender:</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{convertToTitleCase(data?.patientInformation?.gender)}</Typography>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12}>
                      <Typography color="text.titleColor">Appointment Date and Time:</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{generateFullDate(data?.appoinments?.startTime)} ({getTime(data?.appoinments?.startTime)})</Typography>
                    </Grid>
                    <Grid  item lg={3} md={3} sm={6} xs={12}>
                      <Typography color="text.titleColor">Exam List:</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{data?.examList
                            .map((item) => item.examListModality.map((listItem) => listItem?.examName))
                            .flat()
                            .join(", ")}</Typography>
                    
                    </Grid>
                  </Grid>
                </Box>
              )
              )
            ) : null}
          </Paper>
        </Grid>

        <Grid>
          <Paper sx={{ padding: 2, mt: 3, background: '#fff0f0', boxShadow: 'unset !important',maxHeight: '250px', overflowY: 'auto' }} className='cardStyle'>
            <Typography variant="h5" className='title'>Declined Referral</Typography>
            {declineReferral && declineReferral.length !== 0  ? (
              declineReferral.map((data) =>
              (
                <Box sx={{
                  borderBottom: '1px solid #9e9b9b',
                  paddingBottom: '16px',
                  marginBottom: '16px'
                }}>
                  <Grid container spacing={2}>
                    <Grid item lg={2} md={2} sm={6} xs={12}>
                      <Typography color="text.titleColor">Patient Name:</Typography>
                      <Typography sx={{ fontWeight: 500 }} >{data?.patientId?.fName} {data?.patientId?.lName}</Typography>
                    </Grid>
                    <Grid item lg={2} md={2} sm={3} xs={12}>
                      <Typography color="text.titleColor">Gender:</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{convertToTitleCase(data?.patientId?.gender)}</Typography>
                    </Grid>
                    <Grid item lg={3} md={3} sm={3} xs={12}>
                      <Typography color="text.titleColor">Denial By</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{convertToTitleCase(data?.refferedToBranch?.name)}</Typography>
                    </Grid>
                    <Grid item lg={3} md={3} sm={3} xs={12}>
                      <Typography color="text.titleColor">Decline Date:</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{generateFullDate(data?.denialTimeString)} ({getTime(data?.denialTimeString)})</Typography>
                    </Grid>
                    <Grid item lg={2} md={2} sm={2} xs={12}>
                      <Typography color="text.titleColor">View Reason</Typography>
                      <Button onClick={()=>displayOrderDetailHandler(data)}>
                                            <VisibilityIcon />
                                        </Button>
                    </Grid>
                  </Grid>
                </Box>
              )
              )
            ) : null}
          </Paper>
        </Grid>

      </Box>

    </>

  )
}

export default AdminDashboard;