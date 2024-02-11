import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { enqueueSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";
import { Formik } from "formik";
import { CloudUploadOutlined, CloseOutlined } from "@mui/icons-material";
import MainCard from "src/components/MainCard";
import { Link } from "react-router-dom";

const UploadComponent = ({ setFieldValue }) => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      enqueueSnackbar("Invalid file type or size", {
        variant: "error",
      });
      return;
    }

    setFieldValue("file", acceptedFiles[0]);
    setUploadedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/xlsx": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "application/vnd.ms-excel": [],
    },
  });

  return (
    <>
      <div
        {...getRootProps()}
        className="dropzone"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "2px dashed #ccc",
          padding: "10px",
          borderRadius: "4px",
        }}
      >
        <input {...getInputProps()} />
        <div>
          <CloudUploadOutlined style={{ fontSize: 32, marginTop: "10px" }} />
        </div>
        <div>
          <p style={{ textAlign: "center" }}>
            Drag & Drop files here or click to select files
          </p>
        </div>
        {uploadedFile && (
          <p style={{ textAlign: "center" }}>{uploadedFile.name}</p>
        )}
      </div>
    </>
  );
};

UploadComponent.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ImportDialog = ({
  isOpen,
  onClose,
  onImport,
  dialogTitle,
  templateFile,
  templateFileName,
}) => {
  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = templateFile;
    link.download = templateFileName ? templateFileName : "template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        {({ handleSubmit, isSubmitting, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <MainCard content={false}>
                <Box sx={{ px: 2 }}>
                  {templateFile && (
                    <Grid container justifyContent="center">
                      <Typography variant="body1" align="center">
                        Note: To import please download the provided{" "}
                        <Link
                          onClick={handleDownloadTemplate}
                          download="template.xlsx"
                        >
                          template
                        </Link>{" "}
                        and use it.
                      </Typography>
                    </Grid>
                  )}
                </Box>

                <Box sx={{ p: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} justifyContent="center">
                      <UploadComponent setFieldValue={setFieldValue} />
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
                    Import
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

ImportDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  templateFile: PropTypes.string,
  templateFileName: PropTypes.string,
};

export default ImportDialog;
