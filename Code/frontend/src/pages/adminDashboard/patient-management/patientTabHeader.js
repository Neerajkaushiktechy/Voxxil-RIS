import React, { useState, useRef, useEffect } from "react";
import {
  Stack,
  Typography,
  Select,
  MenuItem,
  SvgIcon,
  InputBase,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@emotion/styled";
// const debounce = (callback, delay) => {
//     let timer;
//     return (...args) => {
//         clearTimeout(timer);
//         timer = setTimeout(() => callback(...args), delay);
//     };
// };

export default function PatientTabHeader({ handleSearchCallback }) {
  const [searchType, setSearchType] = useState(() => {
    const storedSearchType = localStorage.getItem("searchType");
    return storedSearchType || "fName";
  });
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    localStorage.setItem("searchType", searchType);
  }, [searchType]);

  const Search = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "10px 20px",
    borderRadius: "10px",
    backgroundColor: theme.palette.primary.extralight,
    border: "1px solid #ECECEC",
    marginRight: "30px",
    [theme.breakpoints.up("sm")]: {
      marginRight: "20px",
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    padding: "0 16px 0 0",
    pointerEvents: "none",
    "@media (max-width:1200px)": {
      padding: "0",
    },
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    fontSize: "18px",
    color: theme.palette.secondary.darkgrey,
    "& .MuiInputBase-input": {
      padding: "unset",
      transition: theme.transitions.create("width"),
      width: "auto",
      minWidth: "513px",
      "@media (max-width:1366px)": {
        maxWidth: "100px",
      },
      "@media (max-width:1200px)": {
        display: "none",
      },
    },
  }));

  useEffect(() => {
    if (searchText.trim().length === 0) {
      handleSearchCallback(searchType, searchText);
    }
  }, [searchText, searchType]);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems={"center"}
      spacing={{ xs: 0, lg: 2 }}
      mb="40px"
      sx={{ display: { sm: "flex", xs: "block" } }}
    >
      <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
        <Typography align="left" sx={{ marginRight: "10px" }}>
          Search By :
        </Typography>
      </Box>
      <Box sx={{ marginBottom: { sm: "0 !important", xs: "20px !important" } }}>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 800,
          }}
        >
          <Select
            name="searchType"
            required
            sx={{ width: "auto", minWidth: "150px", borderRadius: "8px" }}
            fullWidth
            onChange={(e) => setSearchType(e.target.value)}
            value={searchType}
            className="select-filter"
          >
            <MenuItem value="fName">First name</MenuItem>
            <MenuItem value="lName">Last name</MenuItem>
          </Select>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Patient by First Name or Last Name"
            inputProps={{ "aria-label": "search google maps" }}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <IconButton
            type="button"
            sx={{ p: "10px", backgroundColor: "rgba(0, 0, 0, 0.04)" }}
            aria-label="search"
            onClick={() => handleSearchCallback(searchType, searchText)}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
    </Stack>
  );
}
