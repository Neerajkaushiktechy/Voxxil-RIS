import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getParentPatientRequest, getStudiesRequest } from "../../../../redux/modules/report/slice";
import PatientInfo from "../patientInfo";
import { Box, Button, Card, Grid, Typography } from "@mui/material";

const DicomViewer = ({ itemData, setShowComponent }) => {
  const dispatch = useDispatch();
  let { loading } = useSelector(state => state.report);
  
  useEffect(() => {
    if(!itemData?.parentPatientResError && !itemData?.studyData?.orthancStudyInstanceUID)
    if (!itemData?.seletedpatient?.orthancParentPatientId) {
      dispatch(getParentPatientRequest({
        patientID: itemData?.seletedpatient?._id,
        orthancPatientId: itemData?.seletedpatient?.orthancPatientId,
        orderId : itemData?.orderId
      }));
    }else{
      dispatch(getStudiesRequest({ orthancParentPatientId : itemData?.seletedpatient?.orthancParentPatientId,orderId : itemData?.orderId}));
    }
  }, [dispatch, itemData])

  return (
    <>
      {itemData?.seletedpatient && <PatientInfo patient={itemData?.seletedpatient} />}
      {loading && <Typography sx={{ color: "primary.dark", fontSize: "30px", fontWeight: "600", textAlign: "center" }}>Fetching Data please wait Images...</Typography>}
      {itemData?.parentPatientResError && <Typography sx={{ color: "primary.dark", fontSize: "30px", fontWeight: "600", textAlign: "center" }}>{itemData?.parentPatientResError}</Typography>}
      
      {itemData.studyData?.orthancStudyInstanceUID &&
        <>
          <Box mt={2} mb={2}>
            <Button sx={{ marginRight: 3 }} component="a" href={`${process.env.REACT_APP_ORTHANC_SERVER_URL}/stone-webviewer/index.html?study=${itemData?.studyData?.orthancStudyInstanceUID}`} target="_blank" className='commonBtn' variant="contained" disabled={loading}>{loading ? "loading..." : "Open in new Tab"}</Button>
            <Button onClick={() => { setShowComponent("createReport") }} className='commonBtn' variant="contained" disabled={loading}>{loading ? "loading..." : "Create Report"}</Button>
          </Box>

          <Card className='cardStyle' sx={{ marginTop: "40px" }}>
            <Typography className='title'>Study Detail</Typography>
            <Grid container spacing={2}>
              <Grid item sm={2} xs={6} >
                <Typography color="text.secondary">Study Description</Typography>
                <Typography>{itemData?.studyData?.orthancStudyDescription || "-"}</Typography>
              </Grid>
        
              <Grid item sm={4} xs={6} className='girdMarginBottom'>
                <Typography color="text.secondary">Accession Number</Typography>
                <Typography>{itemData?.orderId || "-"}</Typography>
              </Grid>
            </Grid>
          </Card>
         
          <iframe title="Dcm Files" style={{ width: "100%", height: "80vh" }} src={`${process.env.REACT_APP_ORTHANC_SERVER_URL}/stone-webviewer/index.html?study=${itemData?.studyData?.orthancStudyInstanceUID}`} allowFullScreen />
        </>
      }
    </>
  );
};

export default DicomViewer;