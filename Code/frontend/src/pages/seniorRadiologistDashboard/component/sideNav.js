import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, } from "@mui/material"
import { NavLink, useLocation } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { setShowList } from "../../../redux/modules/showList/slice";
import { useDispatch } from "react-redux";

const CustomListButton = styled(ListItemButton)(({ theme, selected }) => ({
    backgroundColor: selected ? "#fff!important" : 'initial',
    color: selected ? theme.palette.primary.dark : '#fff',
    borderRadius: '14px',
    padding: '14px 24px',
    '&:hover': {
        backgroundColor: "#fff",
        color: theme.palette.primary.dark,
        '& path': {
            fill: theme.palette.primary.dark,
        }
    },
    '& path': {
        fill: selected ? theme.palette.primary.dark : '#fff',
    }
}));

const NavList = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const Toolbar = styled("div")(({ theme }) => ({
        borderBottom: "1px solid #F1F1F1",
    }));

    return (
        <div>
            <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "30px" }}>
                <img alt="LOGO" src={require('../../../assets/images/Dark-Logo.png')}></img>
            </Toolbar >
            <List sx={{ marginTop: "30px" }}>
                <ListItem disablePadding sx={{ marginBottom: "20px" }}>
                    <CustomListButton onClick={() => { dispatch(setShowList(true)) }} component={NavLink} to={`/seniorRadiologist`} selected={location.pathname === `/seniorRadiologist`}>
                        <ListItemIcon sx={{ width: "20px", height: "20px", marginRight: "20px", minWidth: "unset" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M11.1111 6.66667V0H20V6.66667H11.1111ZM0 11.1111V0H8.88889V11.1111H0ZM11.1111 20V8.88889H20V20H11.1111ZM0 20V13.3333H8.88889V20H0Z" fill="#052F5D" />
                            </svg>
                        </ListItemIcon>
                        <ListItemText className="ItemText" sx={{ margin: 0, }} primary={<Typography variant="sidebarlistitem">Dashboard</Typography>} />
                    </CustomListButton>
                </ListItem>
                <ListItem disablePadding sx={{ marginBottom: "20px" }}>
                    <CustomListButton onClick={() => { dispatch(setShowList(true)) }} component={NavLink} to={`/seniorRadiologist/patient-management`} selected={location.pathname === `/seniorRadiologist/patient-management`}>
                        <ListItemIcon sx={{ width: "20px", height: "20px", marginRight: "20px", minWidth: "unset" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10 3.5C10 5.4335 8.4335 7 6.5 7C4.5665 7 3 5.4335 3 3.5C3 1.5665 4.5665 0 6.5 0C8.4335 0 10 1.5665 10 3.5ZM0 10.7C0 8.572 4.3305 7.5 6.5 7.5C7.848 7.5 10.03 7.914 11.49 8.7375C10.5881 9.20903 9.80945 9.88554 9.21652 10.7127C8.62359 11.5398 8.23295 12.4945 8.076 13.5H0V10.7ZM13 9.5C13 9.36739 13.0527 9.24021 13.1464 9.14645C13.2402 9.05268 13.3674 9 13.5 9H15.5C15.6326 9 15.7598 9.05268 15.8536 9.14645C15.9473 9.24021 16 9.36739 16 9.5C16 9.63261 15.9473 9.75979 15.8536 9.85355C15.7598 9.94732 15.6326 10 15.5 10H15V11.035C15.5792 11.1181 16.1281 11.3458 16.596 11.697L17.293 11L17.1465 10.8535C17.0554 10.7592 17.005 10.6329 17.0062 10.5018C17.0073 10.3707 17.0599 10.2453 17.1526 10.1526C17.2453 10.0599 17.3707 10.0073 17.5018 10.0062C17.6329 10.005 17.7592 10.0554 17.8535 10.1465L18.8535 11.1465C18.9446 11.2408 18.995 11.3671 18.9938 11.4982C18.9927 11.6293 18.9401 11.7547 18.8474 11.8474C18.7547 11.9401 18.6293 11.9927 18.4982 11.9938C18.3671 11.995 18.2408 11.9446 18.1465 11.8535L18 11.707L17.303 12.404C17.6542 12.8719 17.8819 13.4208 17.965 14H19V13.5C19 13.3674 19.0527 13.2402 19.1464 13.1464C19.2402 13.0527 19.3674 13 19.5 13C19.6326 13 19.7598 13.0527 19.8536 13.1464C19.9473 13.2402 20 13.3674 20 13.5V15.5C20 15.6326 19.9473 15.7598 19.8536 15.8536C19.7598 15.9473 19.6326 16 19.5 16C19.3674 16 19.2402 15.9473 19.1464 15.8536C19.0527 15.7598 19 15.6326 19 15.5V15H17.965C17.8993 15.4587 17.7425 15.8997 17.504 16.297L18.5 17.293L18.6465 17.1465C18.7408 17.0554 18.8671 17.005 18.9982 17.0062C19.1293 17.0073 19.2547 17.0599 19.3474 17.1526C19.4401 17.2453 19.4927 17.3707 19.4938 17.5018C19.495 17.6329 19.4446 17.7592 19.3535 17.8535L18.3535 18.8535C18.2592 18.9446 18.1329 18.995 18.0018 18.9938C17.8707 18.9927 17.7453 18.9401 17.6526 18.8474C17.5599 18.7547 17.5073 18.6293 17.5062 18.4982C17.505 18.3671 17.5554 18.2408 17.6465 18.1465L17.793 18L16.869 17.0765C16.3502 17.5548 15.6985 17.8644 15 17.9645V19H15.5C15.6326 19 15.7598 19.0527 15.8536 19.1464C15.9473 19.2402 16 19.3674 16 19.5C16 19.6326 15.9473 19.7598 15.8536 19.8536C15.7598 19.9473 15.6326 20 15.5 20H13.5C13.3674 20 13.2402 19.9473 13.1464 19.8536C13.0527 19.7598 13 19.6326 13 19.5C13 19.3674 13.0527 19.2402 13.1464 19.1464C13.2402 19.0527 13.3674 19 13.5 19H14V17.965C13.4208 17.8819 12.8719 17.6542 12.404 17.303L11.707 18L11.8535 18.1465C11.9446 18.2408 11.995 18.3671 11.9938 18.4982C11.9927 18.6293 11.9401 18.7547 11.8474 18.8474C11.7547 18.9401 11.6293 18.9927 11.4982 18.9938C11.3671 18.995 11.2408 18.9446 11.1465 18.8535L10.1465 17.8535C10.0554 17.7592 10.005 17.6329 10.0062 17.5018C10.0073 17.3707 10.0599 17.2453 10.1526 17.1526C10.2453 17.0599 10.3707 17.0073 10.5018 17.0062C10.6329 17.005 10.7592 17.0554 10.8535 17.1465L11 17.293L11.697 16.596C11.3458 16.1281 11.1181 15.5792 11.035 15H10V15.5C10 15.6326 9.94732 15.7598 9.85355 15.8536C9.75979 15.9473 9.63261 16 9.5 16C9.36739 16 9.24021 15.9473 9.14645 15.8536C9.05268 15.7598 9 15.6326 9 15.5V13.5C9 13.3674 9.05268 13.2402 9.14645 13.1464C9.24021 13.0527 9.36739 13 9.5 13C9.63261 13 9.75979 13.0527 9.85355 13.1464C9.94732 13.2402 10 13.3674 10 13.5V14H11.035C11.1181 13.4208 11.3458 12.8719 11.697 12.404L11 11.707L10.8535 11.8535C10.7592 11.9446 10.6329 11.995 10.5018 11.9938C10.3707 11.9927 10.2453 11.9401 10.1526 11.8474C10.0599 11.7547 10.0073 11.6293 10.0062 11.4982C10.005 11.3671 10.0554 11.2408 10.1465 11.1465L11.1465 10.1465C11.2408 10.0554 11.3671 10.005 11.4982 10.0062C11.6293 10.0073 11.7547 10.0599 11.8474 10.1526C11.9401 10.2453 11.9927 10.3707 11.9938 10.5018C11.995 10.6329 11.9446 10.7592 11.8535 10.8535L11.707 11L12.404 11.697C12.8719 11.3458 13.4208 11.1181 14 11.035V10H13.5C13.3674 10 13.2402 9.94732 13.1464 9.85355C13.0527 9.75979 13 9.63261 13 9.5Z" fill="#052F5D" />
                            </svg>
                        </ListItemIcon>
                        <ListItemText className="ItemText" sx={{ margin: 0, }} primary={<Typography variant="sidebarlistitem">Patient Management</Typography>} />
                    </CustomListButton>
                </ListItem>
                <ListItem disablePadding sx={{ marginBottom: "20px" }}>
                    <CustomListButton onClick={() => { dispatch(setShowList(true)) }} component={NavLink} to={`/seniorRadiologist/appointment`} selected={location.pathname === `/seniorRadiologist/appointment`} >
                        <ListItemIcon sx={{ width: "20px", height: "20px", marginRight: "20px", minWidth: "unset" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M3.33333 8.33333C3.03865 8.33333 2.75603 8.4504 2.54766 8.65877C2.33929 8.86714 2.22222 9.14976 2.22222 9.44444V10.5556C2.22222 10.8502 2.33929 11.1329 2.54766 11.3412C2.75603 11.5496 3.03865 11.6667 3.33333 11.6667H4.44444C4.73913 11.6667 5.02174 11.5496 5.23012 11.3412C5.43849 11.1329 5.55556 10.8502 5.55556 10.5556V9.44444C5.55556 9.14976 5.43849 8.86714 5.23012 8.65877C5.02174 8.4504 4.73913 8.33333 4.44444 8.33333H3.33333ZM3.33333 9.44444V10.5556H4.44444V9.44444H3.33333ZM6.66667 9.44444C6.66667 9.14976 6.78373 8.86714 6.9921 8.65877C7.20048 8.4504 7.48309 8.33333 7.77778 8.33333H8.88889C9.18357 8.33333 9.46619 8.4504 9.67456 8.65877C9.88294 8.86714 10 9.14976 10 9.44444V10.5556C10 10.8502 9.88294 11.1329 9.67456 11.3412C9.46619 11.5496 9.18357 11.6667 8.88889 11.6667H7.77778C7.48309 11.6667 7.20048 11.5496 6.9921 11.3412C6.78373 11.1329 6.66667 10.8502 6.66667 10.5556V9.44444ZM7.77778 9.44444H8.88889V10.5556H7.77778V9.44444ZM12.2222 8.33333C11.9275 8.33333 11.6449 8.4504 11.4365 8.65877C11.2282 8.86714 11.1111 9.14976 11.1111 9.44444V10.5556C11.1111 10.8502 11.2282 11.1329 11.4365 11.3412C11.6449 11.5496 11.9275 11.6667 12.2222 11.6667H13.3333C13.628 11.6667 13.9106 11.5496 14.119 11.3412C14.3274 11.1329 14.4444 10.8502 14.4444 10.5556V9.44444C14.4444 9.14976 14.3274 8.86714 14.119 8.65877C13.9106 8.4504 13.628 8.33333 13.3333 8.33333H12.2222ZM12.2222 9.44444V10.5556H13.3333V9.44444H12.2222ZM2.22222 13.8889C2.22222 13.5942 2.33929 13.3116 2.54766 13.1032C2.75603 12.8948 3.03865 12.7778 3.33333 12.7778H4.44444C4.73913 12.7778 5.02174 12.8948 5.23012 13.1032C5.43849 13.3116 5.55556 13.5942 5.55556 13.8889V15C5.55556 15.2947 5.43849 15.5773 5.23012 15.7857C5.02174 15.9941 4.73913 16.1111 4.44444 16.1111H3.33333C3.03865 16.1111 2.75603 15.9941 2.54766 15.7857C2.33929 15.5773 2.22222 15.2947 2.22222 15V13.8889ZM4.44444 13.8889V15H3.33333V13.8889H4.44444ZM7.77778 12.7778C7.48309 12.7778 7.20048 12.8948 6.9921 13.1032C6.78373 13.3116 6.66667 13.5942 6.66667 13.8889V15C6.66667 15.2947 6.78373 15.5773 6.9921 15.7857C7.20048 15.9941 7.48309 16.1111 7.77778 16.1111H8.88889C9.18357 16.1111 9.46619 15.9941 9.67456 15.7857C9.88294 15.5773 10 15.2947 10 15V13.8889C10 13.5942 9.88294 13.3116 9.67456 13.1032C9.46619 12.8948 9.18357 12.7778 8.88889 12.7778H7.77778ZM8.88889 13.8889H7.77778V15H8.88889V13.8889Z" fill="white" />
                                <path d="M16.6667 14.7222C16.6667 14.5749 16.6081 14.4336 16.5039 14.3294C16.3998 14.2252 16.2585 14.1667 16.1111 14.1667C15.9638 14.1667 15.8225 14.2252 15.7183 14.3294C15.6141 14.4336 15.5556 14.5749 15.5556 14.7222V16.3411L16.2739 17.0594C16.3787 17.1606 16.519 17.2166 16.6647 17.2154C16.8103 17.2141 16.9497 17.1557 17.0527 17.0527C17.1557 16.9497 17.2141 16.8103 17.2154 16.6647C17.2166 16.519 17.1606 16.3787 17.0594 16.2739L16.6667 15.8811V14.7222Z" fill="white" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M3.33333 0.555556C3.33333 0.408213 3.39186 0.266905 3.49605 0.162719C3.60024 0.0585317 3.74155 0 3.88889 0C4.03623 0 4.17754 0.0585317 4.28173 0.162719C4.38591 0.266905 4.44444 0.408213 4.44444 0.555556V3.33333C4.44444 3.48068 4.50298 3.62198 4.60716 3.72617C4.71135 3.83036 4.85266 3.88889 5 3.88889C5.14734 3.88889 5.28865 3.83036 5.39284 3.72617C5.49702 3.62198 5.55556 3.48068 5.55556 3.33333V1.66667H11.1111V0.555556C11.1111 0.408213 11.1696 0.266905 11.2738 0.162719C11.378 0.0585317 11.5193 0 11.6667 0C11.814 0 11.9553 0.0585317 12.0595 0.162719C12.1637 0.266905 12.2222 0.408213 12.2222 0.555556V3.33333C12.2222 3.48068 12.2808 3.62198 12.3849 3.72617C12.4891 3.83036 12.6304 3.88889 12.7778 3.88889C12.9251 3.88889 13.0664 3.83036 13.1706 3.72617C13.2748 3.62198 13.3333 3.48068 13.3333 3.33333V1.66667H15C15.442 1.66667 15.8659 1.84226 16.1785 2.15482C16.4911 2.46738 16.6667 2.89131 16.6667 3.33333V12.2611C17.6397 12.4018 18.5235 12.9057 19.14 13.6716C19.7565 14.4374 20.0602 15.4084 19.9897 16.3891C19.9193 17.3697 19.4802 18.2873 18.7606 18.9573C18.0409 19.6272 17.0943 19.9998 16.1111 20C15.4841 20.0004 14.8663 19.849 14.3105 19.5588C13.7547 19.2686 13.2774 18.8481 12.9194 18.3333H1.66667C1.22464 18.3333 0.800716 18.1577 0.488155 17.8452C0.175595 17.5326 0 17.1087 0 16.6667V3.33333C0 2.89131 0.175595 2.46738 0.488155 2.15482C0.800716 1.84226 1.22464 1.66667 1.66667 1.66667H3.33333V0.555556ZM12.2222 16.1111C12.2221 15.1758 12.559 14.2718 13.1712 13.5647C13.7834 12.8576 14.6299 12.3948 15.5556 12.2611V6.66667H1.11111V16.6667C1.11111 16.814 1.16964 16.9553 1.27383 17.0595C1.37802 17.1637 1.51932 17.2222 1.66667 17.2222H12.3833C12.2762 16.8616 12.2219 16.4873 12.2222 16.1111ZM18.8889 16.1111C18.8889 16.8478 18.5962 17.5544 18.0753 18.0753C17.5544 18.5962 16.8478 18.8889 16.1111 18.8889C15.3744 18.8889 14.6679 18.5962 14.1469 18.0753C13.626 17.5544 13.3333 16.8478 13.3333 16.1111C13.3333 15.3744 13.626 14.6679 14.1469 14.1469C14.6679 13.626 15.3744 13.3333 16.1111 13.3333C16.8478 13.3333 17.5544 13.626 18.0753 14.1469C18.5962 14.6679 18.8889 15.3744 18.8889 16.1111Z" fill="white" />
                            </svg>
                        </ListItemIcon>
                        <ListItemText className="ItemText" sx={{ margin: 0, }} primary={<Typography variant="sidebarlistitem">Appointment Scheduling </Typography>} />
                    </CustomListButton>
                </ListItem>
                <ListItem disablePadding sx={{ marginBottom: "20px" }}>
                    <CustomListButton onClick={() => { dispatch(setShowList(true)) }} component={NavLink} to={`/seniorRadiologist/radiology`} selected={location.pathname === `/seniorRadiologist/radiology`}>
                        <ListItemIcon sx={{ width: "20px", height: "20px", marginRight: "20px", minWidth: "unset" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
                                <path d="M10 14.7368C11.1333 14.7368 12.3917 14.5 13.775 14.0263C15.1583 13.5526 17.2333 12.7193 20 11.5263V11.1316C20 10.2368 19.6583 9.51754 18.975 8.97368C18.2917 8.42982 17.5417 8.2807 16.725 8.52632C16.4417 8.61404 16.154 8.7193 15.862 8.8421C15.57 8.96491 15.1827 9.12281 14.7 9.31579C13.6833 9.77193 12.825 10.0877 12.125 10.2632C11.425 10.4386 10.7167 10.5263 10 10.5263C9.25 10.5263 8.525 10.4344 7.825 10.2505C7.125 10.0667 6.24167 9.74632 5.175 9.28947C4.775 9.11404 4.42933 8.96947 4.138 8.85579C3.84667 8.74211 3.56733 8.64105 3.3 8.55263C2.48333 8.27193 1.72933 8.40351 1.038 8.94737C0.346667 9.49123 0.000666667 10.2193 0 11.1316V11.4737C2.18333 12.5263 4.1 13.3333 5.75 13.8947C7.4 14.4561 8.81667 14.7368 10 14.7368ZM10 21.0526C12.3 21.0526 14.321 20.3902 16.063 19.0653C17.805 17.7404 18.984 16.0432 19.6 13.9737C17.4167 14.9561 15.5833 15.68 14.1 16.1453C12.6167 16.6105 11.25 16.8428 10 16.8421C8.73333 16.8421 7.28733 16.5919 5.662 16.0916C4.03667 15.5912 2.266 14.8765 0.35 13.9474C0.916667 16.1053 2.05833 17.8291 3.775 19.1189C5.49167 20.4088 7.56667 21.0533 10 21.0526ZM10 8.42105C8.9 8.42105 7.95833 8.00877 7.175 7.18421C6.39167 6.35965 6 5.36842 6 4.21053C6 3.05263 6.39167 2.0614 7.175 1.23684C7.95833 0.412281 8.9 0 10 0C11.1 0 12.0417 0.412281 12.825 1.23684C13.6083 2.0614 14 3.05263 14 4.21053C14 5.36842 13.6083 6.35965 12.825 7.18421C12.0417 8.00877 11.1 8.42105 10 8.42105Z" fill="white" />
                            </svg>
                        </ListItemIcon>
                        <ListItemText className="ItemText" sx={{ margin: 0, }} primary={<Typography variant="sidebarlistitem">Order Management</Typography>} />
                    </CustomListButton>
                </ListItem>
                <ListItem disablePadding sx={{ marginBottom: "20px" }}>
                    <CustomListButton onClick={() => { dispatch(setShowList(true)) }} component={NavLink} to={`/seniorRadiologist/procedure-tracking`} selected={location.pathname === `/seniorRadiologist/procedure-tracking`} >
                        <ListItemIcon sx={{ width: "20px", height: "20px", marginRight: "20px", minWidth: "unset" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                <path d="M17.0708 2.98136C13.1658 -0.923638 6.83375 -0.923638 2.92875 2.98136C-0.97625 6.88636 -0.97625 13.2184 2.92875 17.1234C6.83375 21.029 13.1658 21.029 17.0708 17.1234C20.9764 13.2184 20.9764 6.88636 17.0708 2.98136ZM8.39575 13.3857H4.33308V11.704H8.36575C8.42842 11.693 8.59875 11.631 8.71075 11.2797L8.79075 11.053L9.13708 12.0347C9.23784 12.3507 9.38621 12.6495 9.57708 12.9207C9.16508 13.269 8.70208 13.3857 8.39575 13.3857ZM13.5401 14.719V13.4097H11.6708C11.1498 13.4097 10.1741 13.077 9.77175 11.8297L9.24775 10.3467L8.71075 8.82536C8.59875 8.4737 8.42808 8.41203 8.36575 8.40103H4.33308V6.71936H8.39575C8.91708 6.71936 9.89242 7.05203 10.2954 8.29936L10.8194 9.78236L11.3564 11.3037C11.4678 11.6547 11.6384 11.717 11.7014 11.728H13.5401V10.4317L15.6664 12.5757L13.5401 14.719ZM13.5401 9.6727V8.37703H11.7014C11.6384 8.38803 11.4678 8.4507 11.3564 8.80136L11.2678 9.05203L10.9291 8.09436C10.8255 7.76625 10.6706 7.45663 10.4701 7.17703C10.8868 6.8157 11.3594 6.69536 11.6708 6.69536H13.5401V5.38536L15.6664 7.52936L13.5401 9.6727Z" fill="white" />
                            </svg>
                        </ListItemIcon>
                        <ListItemText className="ItemText" sx={{ margin: 0, }} primary={<Typography variant="sidebarlistitem">Procedure Tracking</Typography>} />
                    </CustomListButton>
                </ListItem>
                <ListItem disablePadding sx={{ marginBottom: "20px" }}>
                    <CustomListButton onClick={() => { dispatch(setShowList(true)) }} component={NavLink} to={`/seniorRadiologist/image-report`} selected={location.pathname === `/seniorRadiologist/image-report`} >
                        <ListItemIcon sx={{ width: "20px", height: "20px", marginRight: "20px", minWidth: "unset" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
                                <path d="M0 0.0526123V9.27771H19.2729V0.0526123H0ZM10.5125 5.58767H2.62812V3.74265H10.5125V5.58767ZM13.1406 5.58767C12.9673 5.58767 12.798 5.53356 12.6539 5.4322C12.5098 5.33083 12.3976 5.18675 12.3312 5.01819C12.2649 4.84962 12.2476 4.66414 12.2814 4.48519C12.3152 4.30624 12.3986 4.14186 12.5212 4.01285C12.6437 3.88383 12.7998 3.79597 12.9697 3.76038C13.1396 3.72478 13.3158 3.74305 13.4759 3.81287C13.6359 3.88269 13.7727 4.00093 13.869 4.15264C13.9653 4.30435 14.0166 4.4827 14.0166 4.66516C14.0166 4.90982 13.9243 5.14447 13.7601 5.31747C13.5958 5.49048 13.3729 5.58767 13.1406 5.58767ZM15.7687 5.58767C15.5955 5.58767 15.4261 5.53356 15.282 5.4322C15.138 5.33083 15.0257 5.18675 14.9594 5.01819C14.8931 4.84962 14.8757 4.66414 14.9095 4.48519C14.9433 4.30624 15.0268 4.14186 15.1493 4.01285C15.2718 3.88383 15.4279 3.79597 15.5978 3.76038C15.7678 3.72478 15.9439 3.74305 16.104 3.81287C16.264 3.88269 16.4009 4.00093 16.4971 4.15264C16.5934 4.30435 16.6448 4.4827 16.6448 4.66516C16.6448 4.90982 16.5525 5.14447 16.3882 5.31747C16.2239 5.49048 16.0011 5.58767 15.7687 5.58767ZM19.0013 16.0766L20 15.1541L19.124 13.5581L17.8537 14.0102C17.5724 13.7605 17.2524 13.5639 16.9076 13.429L16.6448 12.0452H14.8927L14.6299 13.4198C14.2851 13.5547 13.965 13.7513 13.6838 14.001L12.4135 13.5489L11.5375 15.1449L12.5361 16.0674C12.466 16.4513 12.466 16.8458 12.5361 17.2297L11.5375 18.1522L12.4135 19.7482L13.6838 19.2962C13.965 19.5458 14.2851 19.7424 14.6299 19.8773L14.8927 21.2703H16.6448L16.9076 19.8958C17.2524 19.7609 17.5725 19.5643 17.8537 19.3146L19.124 19.7666L20 18.1707L19.0013 17.2482C19.0714 16.8611 19.0714 16.4636 19.0013 16.0766ZM15.7687 18.5028C15.4222 18.5028 15.0834 18.3946 14.7953 18.1919C14.5072 17.9891 14.2826 17.701 14.15 17.3638C14.0174 17.0267 13.9827 16.6557 14.0503 16.2978C14.1179 15.9399 14.2848 15.6112 14.5298 15.3532C14.7748 15.0951 15.087 14.9194 15.4269 14.8482C15.7668 14.777 16.1191 14.8136 16.4392 14.9532C16.7594 15.0928 17.033 15.3293 17.2255 15.6327C17.418 15.9362 17.5208 16.2929 17.5208 16.6578C17.5194 17.1467 17.3344 17.6151 17.0061 17.9608C16.6778 18.3065 16.233 18.5013 15.7687 18.5028Z" fill="white" />
                                <path d="M9.63644 16.6578H2.62812V14.8128H9.894C10.3342 13.2674 11.3073 11.9512 12.622 11.1227H0V20.3478H10.7403C10.0209 19.2665 9.63547 17.978 9.63644 16.6578Z" fill="white" />
                            </svg>
                        </ListItemIcon>
                        <ListItemText className="ItemText" sx={{ margin: 0, }} primary={<Typography variant="sidebarlistitem">Image & Report</Typography>} />
                    </CustomListButton>
                </ListItem>
                <ListItem disablePadding sx={{ marginBottom: "20px" }}>
                    <CustomListButton component={NavLink} /* to={`/admin/radiology`} selected={location.pathname === `/admin/radiology`} */>
                        <ListItemIcon sx={{ width: "20px", height: "20px", marginRight: "20px", minWidth: "unset" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M0.697365 0.96769C1.14388 0.521174 1.74948 0.270325 2.38095 0.270325H13.8095C14.441 0.270325 15.0466 0.521175 15.4931 0.96769C15.9396 1.4142 16.1905 2.01981 16.1905 2.65128V8.84175H18.0952C18.6004 8.84175 19.0849 9.04243 19.4421 9.39964C19.7993 9.75686 20 10.2413 20 10.7465V18.8418C20 19.4732 19.7491 20.0788 19.3026 20.5253C18.8561 20.9719 18.2505 21.2227 17.619 21.2227H2.38095C1.74948 21.2227 1.14388 20.9719 0.697365 20.5253C0.25085 20.0788 0 19.4732 0 18.8418V2.65128C0 2.01981 0.25085 1.4142 0.697365 0.96769ZM16.1905 19.3179H17.619C17.7453 19.3179 17.8665 19.2678 17.9558 19.1785C18.0451 19.0892 18.0952 18.968 18.0952 18.8418V10.7465H16.1905V19.3179ZM3.80952 4.07985C3.28354 4.07985 2.85714 4.50624 2.85714 5.03223C2.85714 5.55821 3.28354 5.98461 3.80952 5.98461H7.61905C8.14503 5.98461 8.57143 5.55821 8.57143 5.03223C8.57143 4.50624 8.14503 4.07985 7.61905 4.07985H3.80952ZM3.80952 7.41318C3.28354 7.41318 2.85714 7.83958 2.85714 8.36556C2.85714 8.89155 3.28354 9.31794 3.80952 9.31794H9.52381C10.0498 9.31794 10.4762 8.89155 10.4762 8.36556C10.4762 7.83958 10.0498 7.41318 9.52381 7.41318H3.80952Z" fill="white" />
                            </svg>
                        </ListItemIcon>
                        <ListItemText className="ItemText" sx={{ margin: 0, }} primary={<Typography variant="sidebarlistitem">Billing & Invoicing</Typography>} />
                    </CustomListButton>
                </ListItem>
                <ListItem disablePadding sx={{ marginBottom: "20px" }}>
                    <CustomListButton onClick={() => { dispatch(setShowList(true)) }} component={NavLink} to={`/admin/anlytics-reporting`} selected={location.pathname === `/admin/anlytics-reporting`} >
                        <ListItemIcon sx={{ width: "20px", height: "20px", marginRight: "20px", minWidth: "unset" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
                                <path d="M20 18.2227H0V0.222717H2V16.2227H4V14.2227H8V16.2227H10V13.2227H14V16.2227H16V14.2227H20V18.2227ZM16 11.2227H20V13.2227H16V11.2227ZM10 3.22272H14V6.22272H10V3.22272ZM14 12.2227H10V7.22272H14V12.2227ZM4 7.22272H8V9.22272H4V7.22272ZM8 13.2227H4V10.2227H8V13.2227Z" fill="white" />
                            </svg>
                        </ListItemIcon>
                        <ListItemText className="ItemText" sx={{ margin: 0, }} primary={<Typography variant="sidebarlistitem">Analytics & Reporting</Typography>} />
                    </CustomListButton>
                </ListItem>
                {/* <ListItem disablePadding sx={{ marginBottom: "20px" }}>
                    <CustomListButton onClick={() => { dispatch(setShowList(true)) }} component={NavLink} to={`/seniorRadiologist/settings`} selected={location.pathname.includes("/seniorRadiologist/settings")} >
                        <ListItemIcon sx={{ width: "20px", height: "20px", marginRight: "20px", minWidth: "unset" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                <path d="M9 0.222717C10.1935 0.222717 11.3381 0.696823 12.182 1.54074C13.0259 2.38465 13.5 3.52924 13.5 4.72272C13.5 5.91619 13.0259 7.06078 12.182 7.9047C11.3381 8.74861 10.1935 9.22272 9 9.22272C7.80653 9.22272 6.66193 8.74861 5.81802 7.9047C4.97411 7.06078 4.5 5.91619 4.5 4.72272C4.5 3.52924 4.97411 2.38465 5.81802 1.54074C6.66193 0.696823 7.80653 0.222717 9 0.222717ZM9 11.4727C13.9725 11.4727 18 13.4865 18 15.9727V18.2227H0V15.9727C0 13.4865 4.0275 11.4727 9 11.4727Z" fill="white" />
                            </svg>
                        </ListItemIcon>
                        <ListItemText className="ItemText" sx={{ margin: 0, }} primary={<Typography variant="sidebarlistitem">Settings</Typography>} />
                    </CustomListButton>
                </ListItem> */}
            </List>
        </div>
    )
};

const SideNav = ({ drawerWidth, handleDrawerToggle, mobileOpen }) => {

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, display: { lg: "none", xl: "block" } }}
            aria-label="mailbox folders"
        >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
                //   container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{

                    display: { xs: 'block', sm: 'block', lg: "block", xl: "block" },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'primary.main', padding: "40px 30px" },
                }}
            >
                <NavList />
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'none', lg: 'none', xl: "block" },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'primary.main', padding: "40px 30px" },
                }}
                open
            >
                <NavList />
            </Drawer>
        </Box>
    )
}

export default SideNav