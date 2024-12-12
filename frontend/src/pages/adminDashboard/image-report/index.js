import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DicomViewer from './DwvComponent';
import { setShowList } from '../../../redux/modules/showList/slice';
import ReportForm from './reportForm';
import { Box, Button } from '@mui/material';
import { getGenerateReportPDFRequest, resetGetParentPatient, resetGetStudies, resetGetStudiesImages } from '../../../redux/modules/report/slice';
import RadiologyList from './list';
import ViewReport from './viewReport';
import { setMainHeading } from '../../../redux/modules/mainHeading/slice';
import { USER_ROLE_DEFAULT } from '../../../constants/Constant';

const ImageReport = () => {
  const dispatch = useDispatch();
  const { currentBranch } = useSelector(state => state.branch)
  const { showList } = useSelector(state => state.reduxShowList)
  let { getStudiesRes, getParentPatientRes, getStudiesImagesRes ,generateReportPDFRes} = useSelector(state => state.report);
  let { userData } = useSelector(state => state.auth);
  const [showComponent, setShowComponent] = useState(null);
  const [itemData, setItemData] = useState({});
  useEffect(() => {
    dispatch(setMainHeading("Image & Report"))
    if (getParentPatientRes) {
      if (getParentPatientRes?.success) {
        setItemData({
          ...itemData,
          studyData: getParentPatientRes?.data ? getParentPatientRes?.data : null,
          seletedpatient: { ...itemData.seletedpatient, orthancParentPatientId: getParentPatientRes.data }
        })
      }
      else {
        setItemData({
          ...itemData,
          parentPatientResError: "Patient Files not Found Please Check Pac Server",
        })
      }
      dispatch(resetGetParentPatient())
    }

    if (getStudiesRes) {
      if (getStudiesRes.success) {
        setItemData({
          ...itemData,
          studyData: getStudiesRes.data
        })
      }
      dispatch(resetGetStudies())
    }

    if (getStudiesImagesRes) {
      if (getStudiesImagesRes.success) {
        setItemData({
          ...itemData,
          studyImages: getStudiesImagesRes.data
        })
      }
      dispatch(resetGetStudiesImages())
    }

  }, [dispatch, getParentPatientRes, getStudiesImagesRes, getStudiesRes, setShowComponent, itemData])

  useEffect(() => {
    if (showComponent) {
      dispatch(setShowList(false))
    }
  }, [dispatch, showComponent])

  useEffect(() => {
    if (showList) {
      setShowComponent(false)
    }
  }, [showList])

  useEffect(() => {
    if (currentBranch) {
      setShowComponent(false)
    }
  }, [dispatch, currentBranch])

  const handleDownloadPdf = async () => {
    try {
      if(itemData){
       const payload={
        reportId:itemData?.reportData?._id,
        patientId:itemData?.seletedpatient?._id,
        studyImages:itemData?.studyImages
      }
      await  dispatch(getGenerateReportPDFRequest(payload));
      }
    } catch (error) {
        console.error('Error downloading PDF:', error);
    }
};

  if (showComponent === "viewFiles") {
    return (
      <>
        <Box mb={3}>
          <Button className='commonBtn' variant="contained" onClick={() => { setShowComponent(null); }} > Back </Button>
        </Box>
        <DicomViewer itemData={itemData} setShowComponent={setShowComponent} />
      </>
    )
  }
  // if(showComponent === "viewStudies"){ return (
  //   <>
  //     <Box mb={3}>
  //       <Button className='commonBtn' variant="contained" onClick={() => { setShowComponent(null); }} > Back </Button>
  //     </Box>
  //    <ViewStudies itemData={itemData} setShowComponent={setShowComponent} setSelectedStudy={setSelectedStudy}/>
  //   </>
  // )}
  // else if(showComponent === "viewImages"){ return (
  //   <>
  //     <Box mb={3}>
  //       <Button className='commonBtn' variant="contained" onClick={() => { setShowComponent("viewStudies"); }} > Back </Button>
  //       {/* <Button className='commonBtn' variant="contained" onClick={() => { setShowComponent("createReport"); }} > Create Report </Button> */}
  //     </Box>
  //     <ViewImages selectedStudy={selectedStudy} itemData={itemData} setShowComponent={setShowComponent}/>
  //   </>
  // )}
  else if (showComponent === "createReport") {
    return (
      <>
        <Box mb={3} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button className='commonBtn' variant="contained" onClick={() => { setShowComponent(null); }}> Back </Button>
          {userData.role !== USER_ROLE_DEFAULT.PATIENT && <Button component="a" href={`${process.env.REACT_APP_ORTHANC_SERVER_URL}/stone-webviewer/index.html?study=${itemData?.studyData?.orthancStudyInstanceUID}`} disabled={!itemData?.studyData?.orthancStudyInstanceUID} target="_blank" className='commonBtn commonBtn-dark' variant="contained">
            {itemData?.studyData?.orthancStudyInstanceUID ? "Open Dicom" : "Loading..."}
          </Button>}
        </Box>
        <ReportForm itemData={itemData} setShowComponent={setShowComponent} setItemData={setItemData} />
      </>
    )
  }
  else if (showComponent === "viewReport") {
    return (
      <>
        <Box mb={3} sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
          <Button className='commonBtn' variant="contained" onClick={() => { setShowComponent(null); }}> Back</Button>
          <Button className='commonBtn' variant="contained" onClick={handleDownloadPdf}>Download Pdf</Button>
        </Box>
        <ViewReport itemData={itemData} />
      </>
    )
  }
  else { return <RadiologyList setItemData={setItemData} setShowComponent={setShowComponent} itemData={itemData} /> }
}

export default ImageReport;