import { AppBar, Avatar, Box, Button, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
// import { AppBar, Avatar, Box, Button, IconButton, InputBase, Menu, MenuItem, Stack, SvgIcon, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRequest, currentBranch as currentBranchSlice, resetGet } from "../../../redux/modules/branch/slice";
import { getRequest as getProfileRequest } from "../../../redux/modules/profile/slice";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import LogoutIcon from '@mui/icons-material/Logout';
import { logoutRequest } from "../../../redux/modules/auth/authSlice";
import styled from "@emotion/styled";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NotificationsIcon from '@mui/icons-material/Notifications';
const settingsList = [
  {
    navIcon: <InboxIcon />,
    navText: "Edit Profile",
    navLink: "admin/edit-profile",
  },
  {
    navIcon: <InboxIcon />,
    navText: "Settings",
    navLink: "admin/settings",
  }
];

const Header = ({ drawerWidth, handleDrawerToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let { getRes, currentBranch } = useSelector(state => state.branch);
  let { mainHeading } = useSelector(state => state.mainHeading);
  let { getRes: profileData } = useSelector(state => state.profile);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElBranch, setAnchorElBranch] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenBranchMenu = (event) => {
    setAnchorElBranch(event.currentTarget);
  };
  const handleCloseBranchMenu = () => {
    setAnchorElBranch(null);
  };

  useEffect(() => {
    dispatch(getRequest());
    dispatch(getProfileRequest())
  }, [dispatch])


  useEffect(() => {
    if (getRes?.success && !getRes?.data?.length > 0 && location.pathname !== "/add/branch") {
      navigate("/add/branch")
      dispatch(resetGet());
    }
  }, [getRes, location, navigate, dispatch])



  const ChangeBranch = (data) => {
    dispatch(currentBranchSlice(data))
  }

  const Toolbar = styled('div')(({ theme }) => ({
    padding: "30px",
    backgroundColor: theme.palette.secondary.light,
    '@media (max-width:768px)': {
      padding: '20px',
    },
  }));

  return (
    <AppBar color="transparent" position="fixed" sx={{ width: { xl: `calc(100% - ${drawerWidth}px)`, fontLanguageOverride: '100%' }, ml: { lg: `${drawerWidth}px`, md: '0', }, boxShadow: "unset" }}>
      <Toolbar>

        <Stack direction="row" spacing={1} sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }} className="header-wrapper">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'block', md: 'block', lg: 'block', xl: "none" }, }}
            >
              <MenuIcon />
            </IconButton>
            <Typography color={"primary.dark"} variant="h3" noWrap component="div"
              sx={{
                fontWeight: "600",
                fontSize: { lg: "32px", md: "24px", sm: "24px", xs: "20px" },
              }}>
              {mainHeading}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }} className="header-icons">
            <NotificationsIcon
              sx={{
                backgroundColor: "secondary.light",
                color: "primary.main",
                padding: "10px 10px",
                borderRadius: "6px",
                marginRight: "10px",
                boxShadow: "0px 1px 10px 0px rgba(160, 160, 160, 0.40)"
              }}>
            </NotificationsIcon>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
              <IconButton onClick={handleOpenBranchMenu} sx={{ position: 'relative', width: "100%", padding: "12px 12px", "&:hover": { backgroundColor: "unset" } }}>
                <Avatar sx={{ height: "22px", maxWidth: "32px", borderRadius: "4px", marginRight: "10px" }} alt={profileData?.data?.firstName} src={require('../../../assets/images/Flag Icon.png')} />
                <Typography noWrap sx={{ fontSize: "18px", fontWeight: "600", color: "primary.dark", marginRight: "10px", display: { sm: "block", xs: "none" } }}>{currentBranch?.name}</Typography>
                <Box sx={{ transform: anchorElBranch ? "rotate(-180deg)" : "rotate(0deg)", height: "30px" }}>
                  <KeyboardArrowDownIcon sx={{ color: 'primary.dark', fontSize: '30px' }}></KeyboardArrowDownIcon>
                </Box>

              </IconButton>
              <Menu
                className="branchMenu"
                anchorEl={anchorElBranch}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElBranch)}
                onClose={handleCloseBranchMenu}
              >
                {getRes?.data?.map((item) => (
                  <MenuItem key={item._id} onClick={() => { ChangeBranch({ name: item.name, id: item._id }); handleCloseBranchMenu() }}>
                    <Button color="primary">
                      {item.name}
                    </Button>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 0, position: 'relative' }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ width: "100%", padding: "12px 12px", "&:hover": { backgroundColor: "unset" } }}>
                <Avatar sx={{ height: "28px", width: "28px", borderRadius: "4px", marginRight: "10px" }} src={require('../../../assets/images/Avatar.png')} />
                <Typography noWrap sx={{ fontSize: "18px", fontWeight: "600", color: "primary.dark", marginRight: "10px", display: { sm: "block", xs: "none" } }}>{profileData?.data?.firstName} {profileData?.data?.lastName}</Typography>
                <Box sx={{ transform: anchorElUser ? "rotate(-180deg)" : "rotate(0deg)", height: '30px' }}>
                  <KeyboardArrowDownIcon sx={{ color: 'primary.dark', fontSize: '30px' }}></KeyboardArrowDownIcon>
                </Box>
              </IconButton>
              <Menu
                className="adminMenu"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settingsList.map((item) => (
                  <MenuItem key={item.navText} onClick={handleCloseUserMenu}>
                    <Button color="primary" startIcon={item.navIcon} component={Link} to={item.navLink}>
                      {item.navText}
                    </Button>
                  </MenuItem>
                ))}
                <MenuItem onClick={handleCloseUserMenu}>
                  <Button color="primary" startIcon={<LogoutIcon />} onClick={() => { dispatch(logoutRequest()) }} >
                    Logout
                  </Button>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
export default Header;