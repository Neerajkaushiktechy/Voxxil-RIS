import { AppBar, Avatar, Box, Button, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
// import { AppBar, Avatar, Box, Button, IconButton, InputBase, Menu, MenuItem, Stack, SvgIcon, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRequest } from "../../../redux/modules/branch/slice";
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
    navLink: "seniorRadiologist/edit-profile",
  },
  {
    navIcon: <InboxIcon />,
    navText: "Settings",
    navLink: "seniorRadiologist/settings",
  }
];

const Header = ({ drawerWidth, handleDrawerToggle }) => {
  const dispatch = useDispatch();
  let { currentBranch } = useSelector(state => state.branch);
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
            {/* <Box>
            <Search className="search_sm">
              <SearchIconWrapper>
                <SvgIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" sx={{ width: "16px", height: "16px" }}>
                    <path d="M13.5244 12.6895L15.834 14.9979C15.9417 15.1094 16.0013 15.2588 16 15.4138C15.9986 15.5689 15.9364 15.7172 15.8268 15.8268C15.7172 15.9364 15.5689 15.9986 15.4138 16C15.2588 16.0013 15.1094 15.9417 14.9979 15.834L12.6883 13.5244C11.179 14.8175 9.22751 15.4758 7.24334 15.3611C5.25917 15.2464 3.39654 14.3676 2.0463 12.9092C0.696062 11.4508 -0.0368252 9.52612 0.00142535 7.539C0.0396759 5.55189 0.846091 3.65682 2.25145 2.25145C3.65682 0.846091 5.55189 0.0396759 7.539 0.00142535C9.52612 -0.0368252 11.4508 0.696062 12.9092 2.0463C14.3676 3.39654 15.2464 5.25917 15.3611 7.24334C15.4758 9.22751 14.8175 11.179 13.5244 12.6883V12.6895ZM7.68704 14.1914C9.4121 14.1914 11.0665 13.5061 12.2863 12.2863C13.5061 11.0665 14.1914 9.4121 14.1914 7.68704C14.1914 5.96198 13.5061 4.30758 12.2863 3.08778C11.0665 1.86798 9.4121 1.1827 7.68704 1.1827C5.96198 1.1827 4.30758 1.86798 3.08778 3.08778C1.86798 4.30758 1.1827 5.96198 1.1827 7.68704C1.1827 9.4121 1.86798 11.0665 3.08778 12.2863C4.30758 13.5061 5.96198 14.1914 7.68704 14.1914Z" fill="#797878" />
                  </svg>
                </SvgIcon>
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search for…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box> */}

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
                {/* {getRes?.data?.map((item) => (
                <MenuItem key={item._id} onClick={() => { ChangeBranch({ name: item.name, id: item._id }); handleCloseBranchMenu() }}>
                  <Button color="primary">
                    {item.name}
                  </Button>
                </MenuItem>
              ))} */}
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