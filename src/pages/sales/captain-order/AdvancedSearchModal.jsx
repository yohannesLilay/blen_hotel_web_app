import { useState } from "react";
import PropTypes from "prop-types";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const AdvancedSearchModal = ({
  isOpen,
  onClose,
  onSearch,
  getTemplate,
  searchQuery,
}) => {
  const {
    waiter: initialWaiter,
    captain_order_date: initialCaptainOrderDate,
    captain_order_status: initialCaptainOrderStatus,
    casher: initialCasher,
    facility_type: initialFacilityType,
  } = searchQuery || {};

  const [waiter, setWaiter] = useState(initialWaiter || null);
  const [captainOrderDate, setCaptainOrderDate] = useState(
    initialCaptainOrderDate ? dayjs(initialCaptainOrderDate) : null
  );
  const [captainOrderStatus, setCaptainOrderStatus] = useState(
    initialCaptainOrderStatus || ""
  );
  const [casher, setCasher] = useState(initialCasher || null);
  const [facilityType, setFacilityType] = useState(initialFacilityType || null);

  const handleSearchClick = () => {
    const searchQuery = {
      waiter: waiter?.id || null,
      captain_order_date: captainOrderDate
        ? captainOrderDate.format("YYYY-MM-DD")
        : null,
      captain_order_status: captainOrderStatus || null,
      casher: casher?.id || null,
      facility_type: facilityType?.id || null,
    };

    onSearch(searchQuery);
    onClose();
  };

  const handleClearClick = () => {
    setWaiter(null);
    setCaptainOrderDate(null);
    setCaptainOrderStatus("");
    setCasher(null);
    setFacilityType(null);

    const searchQuery = {
      waiter: null,
      captain_order_date: null,
      captain_order_status: null,
      casher: null,
      facility_type: null,
    };

    onSearch(searchQuery);
  };

  const hasInputValues =
    waiter || captainOrderDate || captainOrderStatus || casher || facilityType;

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
                label="Captain Order Date"
                variant="outlined"
                format="DD-MM-YYYY"
                maxDate={dayjs()}
                disableFuture
                fullWidth
                sx={{ width: "100%" }}
                value={captainOrderDate}
                name="captainOrderDate"
                id="captainOrderDate"
                onBlur={() => {}}
                clearable
                onChange={(date) => setCaptainOrderDate(date)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="captain-order-status-label">
                Captain Order Status
              </InputLabel>
              <Select
                labelId="captain-order-status-label"
                id="captainOrderStatus"
                variant="outlined"
                name="captainOrderStatus"
                value={captainOrderStatus}
                onChange={(e) => setCaptainOrderStatus(e.target.value)}
                label="Captain Order Status"
                fullWidth
                sx={{ width: "100%", textAlign: "start" }}
                endAdornment={
                  captainOrderStatus && (
                    <IconButton
                      size="small"
                      onClick={() => setCaptainOrderStatus("")}
                    >
                      <ClearOutlinedIcon />
                    </IconButton>
                  )
                }
              >
                <MenuItem value="" disabled>
                  Select a captain order status
                </MenuItem>
                {getTemplate?.captainOrderStatusOptions &&
                  Object.entries(getTemplate.captainOrderStatusOptions).map(
                    ([key, value]) => (
                      <MenuItem key={key} value={value}>
                        {key}
                      </MenuItem>
                    )
                  )}
              </Select>
            </FormControl>
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
              id="facilityType"
              options={getTemplate?.facilityTypeOptions || []}
              value={facilityType}
              onChange={(event, newValue) => setFacilityType(newValue)}
              getOptionLabel={(option) => option.name || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Facility Type"
                  variant="outlined"
                />
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
