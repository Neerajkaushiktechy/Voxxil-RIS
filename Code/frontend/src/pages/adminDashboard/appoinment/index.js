// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import AppointmentCalender from "./appointmentCalender";
// import { setMainHeading } from '../../../redux/modules/mainHeading/slice';
// import RadiologyForm from '../radiology/form';
// import { setShowList } from '../../../redux/modules/showList/slice';
// import { Dialog } from '@mui/material';
// export default function Appointment() {
//     const dispatch = useDispatch();
//     const { currentBranch } = useSelector(state => state.branch);
//     const { showList } = useSelector(state => state.reduxShowList);
//     const [appoinmentDate, setAppoinmentDate] = useState(null);

//     const toggleList = () => { dispatch(setShowList(!showList)) }

//     useEffect(() => {
//         if (!currentBranch) { return }
//         dispatch(setShowList(true));
//     }, [dispatch, currentBranch])

//     useEffect(() => {
//         dispatch(setMainHeading("Appointment Scheduling"));
//     }, [dispatch])

//     useEffect(() => {
//         if (appoinmentDate) {
//             dispatch(setShowList(false));
//         }
//     }, [appoinmentDate, dispatch])

//     return (
//         <>
//             {showList ? <AppointmentCalender toggleList={toggleList} setAppoinmentDate={setAppoinmentDate} /> : <RadiologyForm toggleList={toggleList} appoinmentDate={appoinmentDate} />}
//         </>
//     )
// }


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentCalender from './appointmentCalender';
import { setMainHeading } from '../../../redux/modules/mainHeading/slice';
import RadiologyForm from '../radiology/form';
import { setShowList } from '../../../redux/modules/showList/slice';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function Appointment() {
    const dispatch = useDispatch();
    const { currentBranch } = useSelector(state => state.branch);
    const { showList } = useSelector(state => state.reduxShowList);
    const [appoinmentDate, setAppoinmentDate] = useState(null);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const toggleList = () => {
        dispatch(setShowList(!showList));
    };

    const handleConfirmDialogClose = (confirmed) => {
        setShowConfirmationDialog(false);
        if (confirmed) {
            dispatch(setShowList(false));
        }
    };

    useEffect(() => {
        if (!currentBranch) {
            return;
        }
        dispatch(setShowList(true));
    }, [dispatch, currentBranch]);

    useEffect(() => {
        dispatch(setMainHeading('Appointment Scheduling'));
    }, [dispatch]);

    useEffect(() => {
        if (appoinmentDate) {
            const currentDate = new Date();
            const selectedDate = new Date(appoinmentDate);
            if (selectedDate < currentDate && selectedDate.toDateString() !== currentDate.toDateString()) {
                setShowConfirmationDialog(true);
            } else {
                dispatch(setShowList(false));
            }
        }
    }, [appoinmentDate, dispatch]);


    return (
        <>
            {showList ? (
                <AppointmentCalender toggleList={toggleList} setAppoinmentDate={setAppoinmentDate} />
            ) : (
                <RadiologyForm toggleList={toggleList} appoinmentDate={appoinmentDate} />
            )}

            <Dialog open={showConfirmationDialog} onClose={() => handleConfirmDialogClose(false)}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    You are trying to create an appointment for a past date. Please select a valid future date.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleConfirmDialogClose(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

