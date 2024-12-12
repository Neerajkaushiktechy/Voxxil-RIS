import { Dialog, Button,  DialogTitle, DialogContent, DialogContentText, DialogActions, Typography } from '@mui/material';


const HocModal = ({ open, onClose, children }) => {
    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            {children}
        </Dialog>
    );
};

const DeleteConfirmationModal = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Confirm Deletion
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this item?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} autoFocus> Confirm </Button>
            </DialogActions>
        </Dialog>
    );
};

const ViewConfirmationModal = ({ open, onClose, onConfirm ,description}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
            <div style={{  backgroundColor: 'white', margin: '10px auto', width: '400px' }}>
                <DialogContentText >
                    <div style={{}}>
                    <Typography variant="h6">Examination Content</Typography>
                    <Typography variant="body1">{description ? description :"Description not available"}</Typography>
                    </div>
                </DialogContentText>
              </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewConfirmationModal;

export {
    HocModal,
    DeleteConfirmationModal,
    ViewConfirmationModal,
};