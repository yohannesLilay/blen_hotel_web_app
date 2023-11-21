import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Grid,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";

import MainCard from "src/components/MainCard";

const CashReceiptItemsModal = ({ isOpen, onModalClose, cashReceiptItems }) => {
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
      <Modal open={isOpen} onClose={onModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: 1200,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Grid item xs={12} md={7} lg={8}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">List of Items</Typography>
              </Grid>
              <Grid item></Grid>
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
              <Box sx={{ width: "99.8%", maxWidth: "100%", p: 1 }}>
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
                          <TableCell>{row.menu?.item}</TableCell>
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
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

CashReceiptItemsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired,
  cashReceiptItems: PropTypes.array.isRequired,
};

export default CashReceiptItemsModal;
