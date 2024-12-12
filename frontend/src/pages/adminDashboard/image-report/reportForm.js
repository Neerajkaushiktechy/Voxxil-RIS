import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ExamsRadiologyReport from "../radiology/reviewReport/examsRadiologyReport";
import ImagingRadiologyReport from "../radiology/reviewReport/imagingRadiologyReport";
import DiagnosisRadiologyReport from "../radiology/reviewReport/diagnosisRadiologyReport"
import { useDispatch, useSelector } from "react-redux";
import { getParentPatientRequest, resetPostReport } from "../../../redux/modules/report/slice";
import { toast } from "react-toastify";
import PatientInfo from "./patientInfo";
import { USER_ROLE_DEFAULT } from "../../../constants/Constant";

const ReportForm = ({ itemData, setItemData, setShowComponent }) => {
  const dispatch = useDispatch();
  let { userData } = useSelector(state => state.auth);
  let { postReportRes, putReportRes } = useSelector(state => state.report);

  const [currentStep, setCurrentStep] = useState(1);
  const [saveType, setSaveType] = useState(1);

  useEffect(() => {
    if (!itemData?.orthancParentPatientId && !itemData?.parentPatientResError) {
      dispatch(getParentPatientRequest({
        radiologyId: itemData?.radiologyId,
        orthancPatientId: itemData?.orthancPatientId,
        orderId: itemData?.orderId
      }));
    }
  }, [dispatch ])

  useEffect(() => {
    if (postReportRes) {
      if (postReportRes?.success) {
        setItemData({
          ...itemData,
          reportData: postReportRes.data
        })
        if (saveType === "exit") {
          setShowComponent(null);
        } else if (saveType === "next") {
          handleNext();
        }
      }
      toast(postReportRes?.message);
      dispatch(resetPostReport())
    }
    if (putReportRes) {
      if (putReportRes?.success) {
        setItemData({
          ...itemData,
          reportData: putReportRes.data
        })
        if (saveType === "exit") {
          setShowComponent(null);
        } else if (saveType === "next") {
          handleNext();
        }
      }
      toast(putReportRes?.message);
      dispatch(resetPostReport())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, postReportRes, saveType, setShowComponent])

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <Typography sx={{ color: "primary.dark", fontSize: "30px", fontWeight: "600", textAlign: "center" }}> {userData.role !== USER_ROLE_DEFAULT.PATIENT ?'Create Report' :null}</Typography>
      {itemData?.seletedpatient && <Box sx={{ marginBottom: 5 }}>{userData.role !== USER_ROLE_DEFAULT.PATIENT && <PatientInfo patient={itemData?.seletedpatient} />}</Box>}
      {currentStep === 1 && <ExamsRadiologyReport itemData={itemData} onNext={handleNext} setSaveType={setSaveType} />}
      {currentStep === 2 && <ImagingRadiologyReport itemData={itemData} onNext={handleNext} onBack={handleBack} setSaveType={setSaveType} />}
      {currentStep === 3 && <DiagnosisRadiologyReport itemData={itemData} onBack={handleBack} setSaveType={setSaveType} />}
    </>
  )
}

export default ReportForm;