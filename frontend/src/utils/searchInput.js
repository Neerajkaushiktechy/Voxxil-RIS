import { SvgIcon, InputBase } from "@mui/material";
import styled from "@emotion/styled";
import searchDebounce from "./searchDebouncing";

const Search = styled('div')(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "10px 20px",
    borderRadius: "10px",
    backgroundColor: theme.palette.primary.extralight,
    border: '1px solid #ECECEC',
    marginRight: "30px",
    [theme.breakpoints.up('sm')]: {
        marginRight: '20px',
        width: "auto",
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    display: "flex",
    padding: "0 16px 0 0",
    pointerEvents: 'none',
    '@media (max-width:1200px)': {
        padding: '0',
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    fontSize: "18px",
    color: theme.palette.secondary.darkgrey,
    '& .MuiInputBase-input': {
        padding: "unset",
        transition: theme.transitions.create('width'),
        width: 'auto',
        minWidth: '513px',
        '@media (max-width:1366px)': {
            maxWidth: '100px',
        },
        '@media (max-width:1200px)': {
            display: 'none',
        },
    },
}));
const SearchInput = ({ setSearchQuery }) => {
    const debouncedSearch = searchDebounce((query)=>{setSearchQuery(query)}, 300);

    return (
        <Search onChange={(e) => { debouncedSearch(e.target.value); }}>
            <SearchIconWrapper>
                <SvgIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" sx={{ width: "16px", height: "16px" }}>
                        <path d="M13.5244 12.6895L15.834 14.9979C15.9417 15.1094 16.0013 15.2588 16 15.4138C15.9986 15.5689 15.9364 15.7172 15.8268 15.8268C15.7172 15.9364 15.5689 15.9986 15.4138 16C15.2588 16.0013 15.1094 15.9417 14.9979 15.834L12.6883 13.5244C11.179 14.8175 9.22751 15.4758 7.24334 15.3611C5.25917 15.2464 3.39654 14.3676 2.0463 12.9092C0.696062 11.4508 -0.0368252 9.52612 0.00142535 7.539C0.0396759 5.55189 0.846091 3.65682 2.25145 2.25145C3.65682 0.846091 5.55189 0.0396759 7.539 0.00142535C9.52612 -0.0368252 11.4508 0.696062 12.9092 2.0463C14.3676 3.39654 15.2464 5.25917 15.3611 7.24334C15.4758 9.22751 14.8175 11.179 13.5244 12.6883V12.6895ZM7.68704 14.1914C9.4121 14.1914 11.0665 13.5061 12.2863 12.2863C13.5061 11.0665 14.1914 9.4121 14.1914 7.68704C14.1914 5.96198 13.5061 4.30758 12.2863 3.08778C11.0665 1.86798 9.4121 1.1827 7.68704 1.1827C5.96198 1.1827 4.30758 1.86798 3.08778 3.08778C1.86798 4.30758 1.1827 5.96198 1.1827 7.68704C1.1827 9.4121 1.86798 11.0665 3.08778 12.2863C4.30758 13.5061 5.96198 14.1914 7.68704 14.1914Z" fill="#797878" />
                    </svg>
                </SvgIcon>
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search " inputProps={{ 'aria-label': 'search' }}/>
        </Search>
    )
}

export default SearchInput