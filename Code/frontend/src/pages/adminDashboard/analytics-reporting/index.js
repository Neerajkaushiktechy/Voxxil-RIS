import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMainHeading } from "../../../redux/modules/mainHeading/slice";
import { Box, Grid, MenuItem, Select, Typography, Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import { getRequest } from "../../../redux/modules/analytics/slice";
import SummarizeIcon from '@mui/icons-material/Summarize';
import { Link } from "react-router-dom";

const Analytics = () => {
    const dispatch = useDispatch();
    const [selectedMonth, setSelectedMonth] = useState("thisMonth");
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    let { getRes } = useSelector(state => state.analytics);

    useEffect(() => {
        dispatch(setMainHeading("Analytics & Reporting"));
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
            setLoggedIn(true);
        } else {
            setPasswordModalOpen(true);
        }
        dispatch(getRequest({ month: selectedMonth }));
    }, [dispatch, selectedMonth]);

    const handleMonthChange = (event) => {
        const month = event.target.value;
        setSelectedMonth(month);
    };

    const handlePasswordSubmit = () => {
        const storedPassword = process.env.REACT_APP_ANALYTIC_AND_REPORTING_PASSWORD;
        if (password === storedPassword) {
            setLoggedIn(true);
            setPasswordModalOpen(false);
            localStorage.setItem("isLoggedIn", "true");
        } else {
            alert("Wrong password");
        }
    };

    return (
        <>
            {loggedIn &&
                <Box className="dashboard-cards">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px' }}>
                        <Typography sx={{ marginRight: '10px' }}>Filters</Typography>
                        <Select
                            className="single-select-dropdown"
                            name="searchType"
                            required
                            sx={{ minWidth: '150px', border: 'solid', borderRadius: '6px', color: '#052F5D' }}
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        >
                            <MenuItem value="thisMonth">This Month</MenuItem>
                            <MenuItem value="lastMonth">Last Month</MenuItem>
                            <MenuItem value="lastTwoMonths">Last 2 Months</MenuItem>
                        </Select>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xl={3} lg={6} sm={12} className="card-2">
                            <Box sx={{ padding: "20px", borderRadius: "10px", backgroundColor: "#EBECFC" }}>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                                    <Box display={"flex"} alignItems={"center"}>
                                        <SummarizeIcon sx={{ color: "#B80587" }} />
                                        <h2>Completed Reports</h2>
                                    </Box>
                                </Box>
                                <Typography>
                                    <h1>{getRes?.completedReports}</h1>
                                </Typography>
                                <Link to="/admin/image-report" style={{ textDecoration: 'none' }}>
                                    <Typography sx={{ fontWeight: 'bold', textDecoration: 'underline', color: "#B80587", cursor: 'pointer' }}>
                                        View All
                                    </Typography>
                                </Link>

                            </Box>
                        </Grid>
                        <Grid item xl={3} lg={6} sm={12} className="card-2">
                            <Box sx={{ padding: "20px", borderRadius: "10px", backgroundColor: "#FFF1FB" }}>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                                    <Box display={"flex"} alignItems={"center"}>
                                        <SummarizeIcon sx={{ color: "#B80587" }} />
                                        <h2>Modified Reports</h2>
                                    </Box>
                                </Box>
                                <Typography>
                                    <h1>{getRes?.modifiedReports}</h1>
                                </Typography>
                                <Link to="/admin/image-report" style={{ textDecoration: 'none' }}>
                                    <Typography sx={{ fontWeight: 'bold', textDecoration: 'underline', color: "#B80587" }}>
                                        View All
                                    </Typography>
                                </Link>
                            </Box>
                        </Grid>
                        <Grid item xl={3} lg={6} sm={12} className="card-3">
                            <Box sx={{ padding: "20px", borderRadius: "10px", backgroundColor: "#FFF5F3" }}>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                                    <Box display={"flex"} alignItems={"center"}>
                                        <SummarizeIcon sx={{ color: "#FF5E2A" }} />
                                        <h2>Incompleted Reports</h2>
                                    </Box>
                                </Box>
                                <Typography>
                                    <h1>{getRes?.incompletedReports}</h1>
                                </Typography>
                                <Link to="/admin/image-report" style={{ textDecoration: 'none' }}>
                                    <Typography sx={{ fontWeight: 'bold', textDecoration: 'underline', color: "#FF5E2A" }}>
                                        View All
                                    </Typography>
                                </Link>
                            </Box>
                        </Grid>
                        <Grid item xl={3} lg={6} sm={12} className="card-4">
                            <Box sx={{ padding: "20px", borderRadius: "10px", backgroundColor: "#EAFFEC" }}>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                                    <Box display={"flex"} alignItems={"center"}>
                                        <SummarizeIcon sx={{ color: "#33BF49" }} />
                                        <h2>Cancelled Appointments</h2>
                                    </Box>
                                </Box>
                                <Typography>
                                    <h1>{getRes?.cancelledAppointments}</h1>
                                </Typography>
                                <Link to="/admin/radiology" style={{ textDecoration: 'none' }}>
                                    <Typography sx={{ fontWeight: 'bold', textDecoration: 'underline', color: "#33BF49" }}>
                                        View All
                                    </Typography>
                                </Link>
                            </Box>
                        </Grid>
                        <Grid item xl={3} lg={6} sm={12} className="card-4">
                            <Box sx={{ padding: "20px", borderRadius: "10px", backgroundColor: "#feeaff" }}>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                                    <Box display={"flex"} alignItems={"center"}>
                                        <SummarizeIcon sx={{ color: "#ae33bf" }} />
                                        <h2>Top 5 Taken Exams</h2>
                                    </Box>
                                </Box>
                                <Typography sx={{ color: "#ae33bf", paddingTop: "5px" }}>
                                    {getRes?.topTakenExams?.map((item, index) => (
                                        <div key={index}>{item}</div>
                                    ))}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            }
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

export default Analytics;