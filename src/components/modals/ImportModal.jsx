import PropTypes from "prop-types";
import { Box, Button, Modal, Typography, Grid } from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import MainCard from "src/components/MainCard";
import { CloudUploadOutlined } from "@mui/icons-material";

const ImportDialog = ({ isOpen, onClose, onImport, dialogContent }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <MainCard sx={{ mt: 2 }} content={false}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography variant="h5">{dialogContent}</Typography>

          <Box sx={{ p: 2 }}>
            <Formik
              initialValues={{
                file: null,
              }}
              validationSchema={Yup.object().shape({
                file: Yup.mixed().required("File is required"),
              })}
              onSubmit={async (values, { setStatus, setSubmitting }) => {
                try {
                  const fileData = new FormData();
                  fileData.append("file", values.file);

                  onImport(fileData);
                  onClose();

                  setStatus({ success: true });
                  setSubmitting(false);
                } catch (err) {
                  setStatus({ success: false });
                  setSubmitting(false);
                }
              }}
            >
              {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} justifyContent="center">
                      <input
                        type="file"
                        id="file"
                        name="file"
                        style={{ display: "none" }}
                        accept=".xlsx"
                        onChange={(event) => {
                          setFieldValue("file", event.currentTarget.files[0]);
                        }}
                      />
                      <Box sx={{ display: "block" }}>
                        <label htmlFor="file">
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            component="span"
                          >
                            <CloudUploadOutlined />
                            Upload File
                          </Button>
                        </label>
                      </Box>
                      <Box sx={{ marginTop: 2 }}>
                        <p>
                          {values.file ? values.file.name : "No file selected"}
                        </p>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      container
                      justifyContent="center"
                      spacing={1}
                    >
                      <Grid item>
                        <Button
                          disableElevation
                          fullWidth
                          variant="outlined"
                          onClick={onClose}
                        >
                          Cancel
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          disableElevation
                          fullWidth
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={isSubmitting}
                          sx={{ marginRight: 5 }}
                        >
                          Import
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      </MainCard>
    </Modal>
  );
};

ImportDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  dialogContent: PropTypes.string.isRequired,
};

export default ImportDialog;
