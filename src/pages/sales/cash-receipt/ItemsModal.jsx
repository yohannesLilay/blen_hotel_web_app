import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CloseOutlined } from "@mui/icons-material";

import MainCard from "src/components/MainCard";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const CashReceiptItemsModal = ({ isOpen, onClose, cashReceiptItems }) => {
  const [rows, setRows] = useState(cashReceiptItems || []);

  useEffect(() => {
    setRows(cashReceiptItems || []);
  }, [cashReceiptItems]);

  const calculateTotalPrice = () => {
    return rows.reduce(
      (total, row) => total + row.quantity * row.unit_price,
      0
    );
  };

  return (
    <>
      <BootstrapDialog
        aria-labelledby="dialog-title"
        open={isOpen}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="dialog-title" variant="h5">
          List of Items
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
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>Menu Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit Price</TableCell>
                      <TableCell>Total Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <TableCell align="left">{index + 1}</TableCell>
                        <TableCell>
                          {row.menu?.item}
                          {row.menu?.item_local_name &&
                            ` (${row.menu.item_local_name})`}
                        </TableCell>
                        <TableCell>{row.quantity}</TableCell>
                        <TableCell>{row.unit_price} BIRR</TableCell>
                        <TableCell>
                          {row.quantity * row.unit_price} BIRR
                        </TableCell>
                      </TableRow>
                    ))}
                    {rows.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={3}></TableCell>
                        <TableCell align="right">
                          <strong>Total</strong>:
                        </TableCell>
                        <TableCell>{calculateTotalPrice()} BIRR</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </MainCard>
        </DialogContent>
        <DialogActions sx={{ m: 0, p: 2 }}>
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
    </>
  );
};

CashReceiptItemsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cashReceiptItems: PropTypes.array.isRequired,
};

export default CashReceiptItemsModal;
