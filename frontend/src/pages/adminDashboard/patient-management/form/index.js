
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import BasicInfo from './basicInfo';
import Insurance from './insurance';
import Physician from './physician';
import MedicalHistory from './medicalHistory';
import LifeStyleInfo from './lifeStyle';
import Acknowledgement from './acknowledgement';
import { getMasterDataRequest } from '../../../../redux/modules/admin/patientProfile/slice';
import { resetPostPatientAcknowledgement, resetPutPatientAcknowledgement } from '../../../../redux/modules/admin/patientAcknowledgement/slice';
import { resetPostPatientInformation, resetPut } from '../../../../redux/modules/admin/patientInformation/slice';
import { resetPostPatientInsurance, resetPutPatientInsurance } from '../../../../redux/modules/admin/patientInsurance/slice';
import { resetPostPatientPhysician, resetPutPatientPhysician } from '../../../../redux/modules/admin/patientPhysician/slice';
import { resetPostPatientMedicalHistory, resetPutMedicalHistory } from '../../../../redux/modules/admin/patientMedicalHistory/slice';
import { resetPostPatientLifeStyle, resetPutPatientLifeStyle } from '../../../../redux/modules/admin/patientLifeStyle/slice';
import { toast } from 'react-toastify';
const steps = [
    'Basic Information',
    'Insurance',
    'Physician',
    'Medical History',
    'LifeStyle',
    'Consents & Acknowledgements',
];

export default function FormStepper({ itemData, toggleList, }) {
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        basicInfo: {},
        insurance: {},
        physician: {},
        medicalHistory: {},
        lifeStyleInfo: {},
        acknowledgement: {},
    });
    
    let { putRes, postRes } = useSelector(state => state.patientInformation);
    let { putRes: putInsurance, postRes: postInsurance } = useSelector(state => state.patientInsurance);
    let { putRes: putPhysician, postRes: postPhysician } = useSelector(state => state.patientPhysician);
    let { putRes: putMedicalHistory, postRes: postMedicalHistory } = useSelector(state => state.patientMedicalHistory);
    let { putRes: putLifeStyle, postRes: postLifeStyle } = useSelector(state => state.patientLifeStyle);
    let { putRes: putAcknowledgement, postRes: postAcknowledgement } = useSelector(state => state.patientAcknowledgement);

    useEffect(() => {
        dispatch(getMasterDataRequest());
        
    }, [dispatch, putRes, postRes, toggleList]);


    useEffect(() => {
        if (postRes && postRes?.success) {
            localStorage.setItem("pId", postRes?.pId)
            toast(postRes.message);
            dispatch(resetPostPatientInformation());
        }
        if (putRes && putRes?.success) {
            toast(putRes.message)
            dispatch(resetPut())
        }
        if (postInsurance && postInsurance?.success) {
            toast(postInsurance.message)
            dispatch(resetPostPatientInsurance())
        }
        if (putInsurance && putInsurance?.success) {
            toast(putInsurance.message)
            dispatch(resetPutPatientInsurance())
        }
        if (postPhysician && postPhysician?.success) {
            toast(postPhysician.message)
            dispatch(resetPostPatientPhysician())
        }
        if (putPhysician && putPhysician?.success) {
            toast(putPhysician.message)
            dispatch(resetPutPatientPhysician())
        }
        if (postMedicalHistory && postMedicalHistory?.success) {
            toast(postMedicalHistory.message)
            dispatch(resetPostPatientMedicalHistory())
        }
        if (putMedicalHistory && putMedicalHistory?.success) {
            toast(putMedicalHistory.message)
            dispatch(resetPutMedicalHistory())
        }
        if (postLifeStyle && postLifeStyle?.success) {
            toast(postLifeStyle.message)
            dispatch(resetPostPatientLifeStyle())
        }
        if (putLifeStyle && putLifeStyle?.success) {
            toast(putLifeStyle.message)
            dispatch(resetPutPatientLifeStyle())
        }
        if (postAcknowledgement && postAcknowledgement?.success) {
            toast(postAcknowledgement.message)
            dispatch(resetPostPatientAcknowledgement())
            toggleList()
        }
        if (putAcknowledgement && putAcknowledgement?.success) {
            toast(putAcknowledgement.message)
            dispatch(resetPutPatientAcknowledgement())
            toggleList()
        }
    }, [dispatch,toggleList, postRes, putRes, postInsurance, putInsurance, postPhysician, putPhysician, postMedicalHistory, putMedicalHistory, postLifeStyle, putLifeStyle, postAcknowledgement, putAcknowledgement])

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    

    const handleStepChange = (stepData) => {
        setFormData({ ...formData, ...stepData });
        handleNext();
    };
    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} nonLinear>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                {activeStep === steps.length ? (
                    <div>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                    </div>
                ) : (
                    <div>
                        {activeStep === 0 && (
                            <BasicInfo onNext={handleStepChange} formData={formData.basicInfo} itemData={itemData} toggleList={toggleList} />
                        )}
                        {activeStep === 1 && (
                            <Insurance onNext={handleStepChange} formData={formData.insurance} onBack={handleBack} patientId={itemData?._id} itemData={itemData?.patientInsurance?.[0]} toggleList={toggleList} />
                        )}
                        {activeStep === 2 && (
                            <Physician onNext={handleStepChange} formData={formData.physician} onBack={handleBack} patientId={itemData?._id} itemData={itemData?.patientPhysician?.[0]} toggleList={toggleList} />
                        )}
                        {activeStep === 3 && (
                            <MedicalHistory onNext={handleStepChange} formData={formData.medicalHistory} onBack={handleBack} patientId={itemData?._id} itemDataId={itemData?._id} itemData={itemData?.patientMedicalHistory?.[0]} toggleList={toggleList} />
                        )}
                        {activeStep === 4 && (
                            <LifeStyleInfo onNext={handleStepChange} formData={formData.lifeStyleInfo} onBack={handleBack} patientId={itemData?._id} itemData={itemData?.patientLifeStyleInfo?.[0]} toggleList={toggleList} />
                        )}
                        {activeStep === 5 && (
                            <Acknowledgement onNext={handleStepChange} formData={formData.acknowledgement} onBack={handleBack} patientId={itemData?._id} itemData={itemData?.patientAcknowledgement?.[0]} toggleList={toggleList} />
                        )}
                    </div>
                )}
            </div>
        </Box>
    );
}
