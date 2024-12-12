import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, FormLabel, OutlinedInput, Table, TableHead, TableBody, TableRow, Button, Typography, Pagination} from "@mui/material";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { getPatientDataRequest } from "../../../../redux/modules/admin/patientProfile/slice";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useEffect, useState } from "react";


const tableHeading = ["First Name", "Last Name", "Email", "D.O.B", "Gender", "Action"];

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
// let pageCount = 0;
const SearchPatient = ({ openModal, setOpenModal, searchQuery, handleSearchInputChange, setPatient, getPatientRes, setOpenAddPatientModal, limit, page, setPage }) => {
    const dispatch = useDispatch();
   
    const [pageCount, setPageCount] = useState(0);
    useEffect(()=>{
        let count = getPatientRes?.dataCount / limit;
        if (count % 2 !== 0) {
            count = Math.ceil(count)
        }
        setPageCount(count)
    }, [getPatientRes?.dataCount]);
    return (
        <Dialog
            fullWidth={true}
            maxWidth={"lg"}
            open={openModal}
            onClose={() => { setOpenModal(!openModal) }}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">
                <FormControl fullWidth >
                    <FormLabel>Search patient by name</FormLabel>
                    <OutlinedInput className="inputfield" size='small' placeholder="search patient by name"
                        value={searchQuery?.name}
                        onChange={handleSearchInputChange}
                    />
                </FormControl>
            </DialogTitle>
            <DialogContent >

                <Table sx={{ minWidth: 700 }} aria-label="customized table" className="commonTable">
                    <TableHead>
                        <TableRow>
                            {tableHeading.map(elem => (<StyledTableCell key={elem}>{elem}</StyledTableCell>))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getPatientRes?.data?.length > 0 ?
                            getPatientRes?.data?.map(elem => (
                                <StyledTableRow key={elem._id}>
                                    <StyledTableCell ><Typography>{elem.fName}</Typography></StyledTableCell>
                                    <StyledTableCell ><Typography>{elem.lName || "-"}</Typography></StyledTableCell>
                                    <StyledTableCell ><Typography>{elem.email || "-"}</Typography></StyledTableCell>
                                    <StyledTableCell ><Typography>{elem.dob ? moment(elem.dob).format('DD-MM-YYYY') : "-"}</Typography></StyledTableCell>
                                    <StyledTableCell ><Typography textTransform="capitalize"> {elem.gender || "-"}</Typography></StyledTableCell>
                                    <StyledTableCell ><Button className="commonBtn" onClick={() => { setPatient(elem); dispatch(getPatientDataRequest({ type: "medicalHistory", id: elem._id })); setOpenModal(!openModal) }}>Select</Button></StyledTableCell>
                                </StyledTableRow>
                            ))
                            :
                            <StyledTableRow>
                                <StyledTableCell colSpan={tableHeading.length} align="left"><Typography>There is no data to show</Typography></StyledTableCell>
                            </StyledTableRow>
                        }
                    </TableBody>
                    {(getPatientRes?.dataCount > limit) && <Pagination count={pageCount} page={page} onChange={(event, value) => { setPage(value); }} />}
                </Table>

            </DialogContent>
            <DialogActions>
                <Button className="commonBtn" onClick={() => { setOpenModal(!openModal) }}>Cancel</Button>
                <Button className="commonBtn" onClick={() => { setOpenAddPatientModal(true); setOpenModal(!openModal) }}>Add New Patient</Button>
            </DialogActions>
        </Dialog>
    )
}
export default SearchPatient;