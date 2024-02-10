import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Typography,
  Grid,
  TextareaAutosize,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CloseOutlined } from "@mui/icons-material";
import * as Yup from "yup";
import { Formik } from "formik";
import MainCard from "src/components/MainCard";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const RejectModal = ({ isOpen, onClose, dialogTitle, dialogAction, onAdd }) => {
  return (
    <BootstrapDialog
      aria-labelledby="dialog-title"
      open={isOpen}
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
      <Formik
        initialValues={{
          rejection_reason: "",
        }}
        validationSchema={Yup.object().shape({
          rejection_reason: Yup.string().required(
            "Rejection Reason is required"
          ),
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {
            onAdd({
              rejection_reason: values.rejection_reason,
            });
            onClose();

            setStatus({ success: false });
            setSubmitting(false);
          } catch (err) {
            setStatus({ success: false });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <MainCard content={false}>
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                      <Stack spacing={1}>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={6}
                          variant="outlined"
                          name="rejection_reason"
                          value={values.rejection_reason}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Rejection Reason"
                          error={
                            touched.rejection_reason &&
                            String(Boolean(errors.rejection_reason))
                          }
                        />
                        {touched.rejection_reason &&
                          errors.rejection_reason && (
                            <Typography variant="body2" color="error">
                              {errors.rejection_reason}
                            </Typography>
                          )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </MainCard>
            </DialogContent>
            <DialogActions>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Button disableElevation variant="outlined" onClick={onClose}>
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    disableElevation
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {dialogAction}
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </form>
        )}
      </Formik>
    </BootstrapDialog>
  );
};

RejectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  dialogAction: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default RejectModal;
