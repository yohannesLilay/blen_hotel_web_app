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
          <Typography variant="h5">Add Purchase Order Item</Typography>

          <Box sx={{ p: 2 }}>
            <Formik
              initialValues={{
                quantity: currentItem?.quantity
                  ? currentItem.quantity.toString()
                  : "",
                product: currentItem?.product_id
                  ? getTemplate?.productOptions.find(
                      (option) => option.id === currentItem.product_id
                    )
                  : null,
                unit_price: currentItem?.unit_price
                  ? currentItem.unit_price
                  : "",
                remark: currentItem?.remark ? currentItem.remark : "",
              }}
              validationSchema={Yup.object().shape({
                quantity: Yup.number().required("Quantity is required"),
                unit_price: Yup.number().required("Unit Price is required"),
                remark: Yup.string(),
                product: Yup.object()
                  .shape({
                    id: Yup.number().required("Product is required"),
                  })
                  .required("product"),
              })}
              onSubmit={async (values, { setStatus, setSubmitting }) => {
                try {
                  const itemData = {
                    id: Math.random().toString(36),
                    product_id: values.product?.id,
                    quantity: parseInt(values.quantity),
                    unit_price: parseFloat(values.unit_price),
                    remark: values.remark,
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
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          error={Boolean(touched.product && errors.product)}
                        >
                          <Autocomplete
                            disablePortal
                            id="product"
                            options={getTemplate?.productOptions || []}
                            value={values.product || null}
                            onChange={(event, newValue) => {
                              handleChange({
                                target: { name: "product", value: newValue },
                              });
                            }}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Product"
                                variant="outlined"
                                error={Boolean(
                                  touched.product && errors.product
                                )}
                              />
                            )}
                          />
                        </FormControl>
                        {touched.product && errors.product && (
                          <Typography variant="body2" color="error">
                            {errors.product}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="unit_price"
                          value={values.unit_price}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          label="Unit Price"
                          error={Boolean(
                            touched.unit_price && errors.unit_price
                          )}
                        />
                        {touched.unit_price && errors.unit_price && (
                          <Typography variant="body2" color="error">
                            {errors.unit_price}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="remark"
                          value={values.remark}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          label="Remark"
                          error={Boolean(touched.remark && errors.remark)}
                        />
                        {touched.remark && errors.remark && (
                          <Typography variant="body2" color="error">
                            {errors.remark}
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
    quantity: PropTypes.string.isRequired,
    product_id: PropTypes.string.isRequired,
    unit_price: PropTypes.string.isRequired,
    remark: PropTypes.string.isRequired,
  }),
};

export default AddItemModal;
