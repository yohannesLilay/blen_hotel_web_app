import { useState } from "react";
import PropTypes from "prop-types";
import {
  Autocomplete,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const AdvancedSearchModal = ({
  isOpen,
  onClose,
  onSearch,
  getTemplate,
  searchQuery,
}) => {
  const {
    waiter: initialWaiter,
    cash_receipt_date: initialCashReceiptDate,
    casher: initialCasher,
  } = searchQuery || {};

  const [waiter, setWaiter] = useState(initialWaiter || null);
  const [cashReceiptDate, setCashReceiptDate] = useState(
    initialCashReceiptDate ? dayjs(initialCashReceiptDate) : null
  );
  const [casher, setCasher] = useState(initialCasher || null);

  const handleSearchClick = () => {
    const searchQuery = {
      waiter: waiter?.id || null,
      cash_receipt_date: cashReceiptDate
        ? cashReceiptDate.format("YYYY-MM-DD")
        : null,
      casher: casher?.id || null,
    };

    onSearch(searchQuery);
    onClose();
  };

  const handleClearClick = () => {
    setWaiter(null);
    setCashReceiptDate(null);
    setCasher(null);

    const searchQuery = {
      waiter: null,
      cash_receipt_date: null,
      casher: null,
    };

    onSearch(searchQuery);
  };

  const hasInputValues = waiter || cashReceiptDate || casher;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          maxWidth: 1000,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h6">Advanced Search</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Cash Receipt Date"
                variant="outlined"
                format="DD-MM-YYYY"
                maxDate={dayjs()}
                disableFuture
                fullWidth
                sx={{ width: "100%" }}
                value={cashReceiptDate}
                name="cashReceiptDate"
                id="cashReceiptDate"
                onBlur={() => {}}
                clearable
                onChange={(date) => setCashReceiptDate(date)}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              id="waiter"
              options={getTemplate?.waiterStaffOptions || []}
              value={waiter}
              onChange={(even, newValue) => setWaiter(newValue)}
              getOptionLabel={(option) => option.name || null}
              renderInput={(params) => (
                <TextField {...params} label="Waiter" variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              id="casher"
              options={getTemplate?.casherEmployeeOptions || []}
              value={casher}
              onChange={(event, newValue) => setCasher(newValue)}
              getOptionLabel={(option) => option.name || null}
              renderInput={(params) => (
                <TextField {...params} label="Casher" variant="outlined" />
              )}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 1 }}>
          <Grid item>
            <Button variant="outlined" color="primary" onClick={onClose}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClearClick}
            >
              Clear
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchClick}
              disabled={!hasInputValues}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

AdvancedSearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  getTemplate: PropTypes.object.isRequired,
  searchQuery: PropTypes.object.isRequired,
};

export default AdvancedSearchModal;
