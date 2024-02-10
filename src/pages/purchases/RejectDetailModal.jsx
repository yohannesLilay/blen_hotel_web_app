import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MainCard from "src/components/MainCard";
import { CloseOutlined } from "@mui/icons-material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const RejectDetailModal = ({ isOpen, onClose, dialogTitle, rejectDetail }) => {
  return (
    <BootstrapDialog
      open={isOpen}
      aria-labelledby="dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="dialog-title" variant="h5">
        {dialogTitle}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseOutlined />
      </IconButton>
      <DialogContent dividers>
        <MainCard content={false}>
          <Box sx={{ p: 1 }}>
            <Grid item xs={12}>
              <Box component="div" mb={1}>
                <span style={{ fontWeight: "bold" }}>Rejected By:</span>{" "}
                {rejectDetail?.rejected_by?.name}
              </Box>
              <Box component="div">
                <span style={{ fontWeight: "bold" }}>Rejection Reason:</span>{" "}
                {rejectDetail?.rejection_reason}
              </Box>
            </Grid>
          </Box>
        </MainCard>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent="space-between">
          <Grid item></Grid>
          <Grid item>
            <Button disableElevation variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </BootstrapDialog>
  );
};

RejectDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  rejectDetail: PropTypes.object.isRequired,
};

export default RejectDetailModal;
