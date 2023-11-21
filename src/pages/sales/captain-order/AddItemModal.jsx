import PropTypes from "prop-types";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Modal,
  Stack,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import MainCard from "src/components/MainCard";

const AddItemModal = ({ isOpen, onClose, onAdd, currentItem, getTemplate }) => {
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
            maxWidth: 800,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography variant="h5">Add Captain Order Item</Typography>

          <Box sx={{ p: 2 }}>
            <Formik
              initialValues={{
                quantity: currentItem?.quantity
                  ? currentItem.quantity.toString()
                  : "",
                menu: currentItem?.menu_id
                  ? getTemplate?.menuOptions.find(
                      (option) => option.id === currentItem.menu_id
                    )
                  : null,
              }}
              validationSchema={Yup.object().shape({
                quantity: Yup.number().required("Quantity is required"),
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
                            getOptionLabel={(option) => option.item}
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
                    <Grid
                      item
                      xs={12}
                      container
                      justifyContent="flex-end"
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
                          Add
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
