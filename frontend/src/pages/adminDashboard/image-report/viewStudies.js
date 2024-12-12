import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { getStudiesRequest, resetGetStudies } from "../../../redux/modules/report/slice";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, tableCellClasses } from "@mui/material";
import styled from "@emotion/styled";

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

const tableHeading = ["Study Description","Accession Number","Study Date", "Action"];
const ViewStudies = ({itemData,setShowComponent,setSelectedStudy}) => {
    const dispatch = useDispatch();
    let { currentBranch } = useSelector(state => state.branch);
    let { loading, getStudiesRes } = useSelector(state => state.report);
    const [studiesList, setStudiesList] = useState(null);
    
    useEffect(() => {
        if (!currentBranch) { return }
        if(itemData?.orthancParentPatientId){
          dispatch(getStudiesRequest(itemData?.orthancParentPatientId));
        }
    }, [dispatch, currentBranch,itemData])

    useEffect(() => {
        if (getStudiesRes && getStudiesRes.success) {
            setStudiesList(getStudiesRes.data)
            dispatch(resetGetStudies()) 
        }
    }, [dispatch,getStudiesRes])

  return (
    <div>
          <TableContainer component={Paper} className='tableShadow' sx={{ marginTop: "40px" }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" className='commonTable'>
            <TableHead>
              <TableRow>
                {tableHeading.map(elem => (<StyledTableCell key={elem}>{elem}</StyledTableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
           
            {studiesList && 
              studiesList?.length > 0 ?
                studiesList?.map(elem => (
                  <StyledTableRow key={elem._id}>
                    <StyledTableCell align="left"><Typography>{elem?.MainDicomTags?.StudyDescription}</Typography></StyledTableCell>
                    <StyledTableCell align="left"><Typography>{elem?.MainDicomTags?.StudyDate ? elem?.MainDicomTags?.StudyDate :"-" }</Typography></StyledTableCell>
                    <StyledTableCell align="left"><Typography>{elem?.MainDicomTags?.AccessionNumber ? elem?.MainDicomTags?.AccessionNumber :"-" }</Typography></StyledTableCell>
                    <StyledTableCell align="left">
                        <Button onClick={()=>{
                          setSelectedStudy(elem)
                          setShowComponent("viewImages")}} className='commonBtn' variant="contained" >View Images</Button>
                        {/* <Button component="a" href={`${process.env.REACT_APP_ORTHANC_SERVER_URL}/stone-webviewer/index.html?study=${elem?.MainDicomTags?.StudyInstanceUID}`} target="_blank" className='commonBtn' variant="contained" >View Images</Button> */}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
                :
                <>
                  {loading ?
                    <StyledTableRow>
                    <StyledTableCell colSpan={tableHeading.length} align="left"><Typography>loading...</Typography></StyledTableCell>
                  </StyledTableRow>
                  :
                  <StyledTableRow>
                    <StyledTableCell colSpan={tableHeading.length} align="left"><Typography>There is no data to show</Typography></StyledTableCell>
                  </StyledTableRow>
                  }
                </>
              }
            </TableBody>
          </Table>
        </TableContainer>
    </div>
  )
}

export default ViewStudies