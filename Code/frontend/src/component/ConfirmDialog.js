import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const ConfirmDialog = (props) => {
    const {message, handleConfirmDialogClose, handleConfirmDialogConfirm, showConfirmationDialog} = props;
    return (
        <Dialog open={showConfirmationDialog} onClose={() => handleConfirmDialogClose(false)}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>{message}</DialogContent>
            <DialogActions>
                <Button onClick={() => handleConfirmDialogClose(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => handleConfirmDialogConfirm(true)} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog;