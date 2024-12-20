import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import SideNav from "../pages/juniorRadiologistDashboard/component/sideNav";
import Header from "../pages/juniorRadiologistDashboard/component/header";
const drawerWidth = 400;

const JuniorRadiologistLayout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex',minHeight: "100vh" }} >
            <Header drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
            <SideNav drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} /> 
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, maxWidth: "100%", overflowX: "hidden" }} >
                <Toolbar sx={{ marginBottom: 5 }} className="main-toolbar" />
                {children}
            </Box>
        </Box>
    )
}

export default JuniorRadiologistLayout;