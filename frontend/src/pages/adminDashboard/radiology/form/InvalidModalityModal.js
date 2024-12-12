import * as React from 'react';
import {Box, Typography, Modal} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel'

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
  p: 4,
  pt: '10px',
  pr: '10px'
};

export default function InvalidModalityModal(props) {
  const handleClose = () => props.setDisplayErrorExamModal(false);

  return (
    <div>
      <Modal
        open={props.open}
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
            Please add the Modality for following Exams:
          </Typography>
          <ul>
            {props.unselectedModalityExams.map(exam=><li>{exam}</li>)}
          </ul>
        </Box>
      </Modal>
    </div>
  );
}
