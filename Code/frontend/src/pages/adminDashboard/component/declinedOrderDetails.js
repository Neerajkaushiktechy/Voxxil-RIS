import * as React from 'react';
import {Box, Typography, Modal} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { generateFullDate, getTime } from '../../../helper/dateTime'; 

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  pt: '10px',
  pr: '10px'
};

export default function DeclinedOrderDetails(props) {
  const { viewRadiologyModal, setViewRadiologyModal } = props;
  const {openViewRadiologyModal, orderDetails } = viewRadiologyModal;
  const handleClose = () => setViewRadiologyModal({
    openViewRadiologyModal:false,
    orderDetails:{}
  });

  return (
    <div>
      <Modal
        open={openViewRadiologyModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{
             display: 'flex',
             flexDirection: 'row-reverse',
          }}>
            <CancelIcon color="error" onClick={() => handleClose()} />
          </Box>
          
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Declined Details
          </Typography>
          <ul>
            <li>Declined By: {orderDetails?.denialBy?.name}</li>
            <li>Declined Date and Time: {generateFullDate(orderDetails?.denialTimeString)} ({getTime(orderDetails?.denialTimeString)})</li>
            <li>Reason for Declined: {orderDetails?.denialReasonText}</li>
            <li>Exams: {orderDetails?.examList?.map((item) => item.examListModality.map((listItem) => listItem?.examName))
                            .flat()
                            .join(", ")}</li>
          </ul>
        </Box>
      </Modal>
    </div>
  );
}
