import PropTypes from "prop-types";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Stack,
  TextField,
  Typography,
  Grid,
  IconButton,
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

const AddItemModal = ({ isOpen, onClose, onAdd, currentItem, getTemplate }) => {
  return (
    <>
      <BootstrapDialog
        aria-labelledby="dialog-title"
        open={isOpen}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="dialog-title" variant="h5">
          Add Captain Order Item
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
            quantity: currentItem?.quantity
              ? currentItem.quantity.toString()
              : 1,
            menu: currentItem?.menu_id
              ? getTemplate?.menuOptions.find(
                  (option) => option.id === currentItem.menu_id
                )
              : null,
          }}
          validationSchema={Yup.object().shape({
            quantity: Yup.number()
              .required("Quantity is required")
              .min(1, "Quantity must be at least 1"),
            menu: Yup.object()
              .shape({
                id: Yup.number().required("Menu is required"),
              })
              .required("menu"),
          })}
          onSubmit={async (values, { setStatus, setSubmitting }) => {
            try {
              const itemData = {
                id: Math.random().toString(36),
                menu_id: values.menu?.id,
                quantity: parseInt(values.quantity),
              };

              onAdd(itemData);
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
                  <Box sx={{ p: 1 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={12}>
                        <Stack spacing={1}>
                          <FormControl
                            fullWidth
                            variant="outlined"
                            error={Boolean(touched.menu && errors.menu)}
                          >
                            <Autocomplete
                              id="menu"
                              options={getTemplate?.menuOptions || []}
                              value={values.menu || null}
                              onChange={(event, newValue) => {
                                handleChange({
                                  target: { name: "menu", value: newValue },
                                });
                              }}
                              getOptionLabel={(option) =>
                                `${option.item}${
                                  option.item_local_name
                                    ? ` (${option.item_local_name})`
                                    : ""
                                }`
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Menu"
                                  variant="outlined"
                                  error={Boolean(touched.menu && errors.menu)}
                                />
                              )}
                            />
                          </FormControl>
                          {touched.menu && errors.menu && (
                            <Typography variant="body2" color="error">
                              {errors.menu}
                            </Typography>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            name="quantity"
                            type="number"
                            inputProps={{ min: "1" }}
                            value={values.quantity}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Quantity"
                            error={Boolean(touched.quantity && errors.quantity)}
                          />
                          {touched.quantity && errors.quantity && (
                            <Typography variant="body2" color="error">
                              {errors.quantity}
                            </Typography>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </MainCard>
              </DialogContent>
              <DialogActions sx={{ m: 0, p: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Button
                      disableElevation
                      variant="outlined"
                      onClick={onClose}
                    >
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
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </DialogActions>
            </form>
          )}
        </Formik>
      </BootstrapDialog>
    </>
  );
};

AddItemModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  getTemplate: PropTypes.object.isRequired,
  currentItem: PropTypes.shape({
    quantity: PropTypes.number.isRequired,
    menu_id: PropTypes.number.isRequired,
  }),
};

export default AddItemModal;
