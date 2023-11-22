import React, { useRef } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TableContainer,
  Typography,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const PrintableContent = React.forwardRef(({ getPrintData }, ref) => {
  const { cash_receipt_number, casher, waiter, items } = getPrintData || {};

  const getCurrentDateTime = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-GB");
    const formattedTime = currentDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return { date: formattedDate, time: formattedTime };
  };

  const calculateAmounts = () => {
    const subTotalAmount = items?.reduce(
      (total, row) => total + row.quantity * row.unit_price,
      0
    );

    const taxAmount = subTotalAmount != null ? subTotalAmount * 0.15 : 0;

    const totalAmount =
      subTotalAmount !== null ? subTotalAmount + taxAmount : 0;

    return {
      subTotalAmount: subTotalAmount?.toFixed(2) || "0.00",
      taxAmount: taxAmount?.toFixed(2) || "0.00",
      totalAmount: totalAmount?.toFixed(2) || "0.00",
    };
  };

  const amounts = calculateAmounts();

  return (
    <Grid
      container
      spacing={3}
      sx={{
        marginTop: 2,
        marginX: 0.1,
        paddingX: 0.1,
      }}
      ref={ref}
    >
      <TableContainer>
        <Typography variant="h5" align="center" gutterBottom>
          BLEN HOTEL
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          TEL - +251923302158
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 0.5,
            marginRight: 25,
          }}
        >
          <div>
            <Typography>{getCurrentDateTime().date}</Typography>
          </div>
          <div style={{ alignItems: "flex-end" }}>
            <Typography>{getCurrentDateTime().time}</Typography>
          </div>
        </div>
        <Typography variant="h6" gutterBottom>
          ======== CASH INVOICE =========
        </Typography>
        <Typography sx={{ marginBottom: 0.5 }}>
          Invoice No: {cash_receipt_number || "--------"}
        </Typography>
        <Typography sx={{ marginBottom: 0.5 }}>
          Operator: {casher?.name || "--------"}
        </Typography>
        <Typography sx={{ marginBottom: 0.5 }}>
          Waiter: {waiter?.name || "--------"}
        </Typography>
        <Typography sx={{ marginTop: 1 }}>
          ---------------------------------------
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>
            <Typography variant="subtitle1">Description</Typography>
            <Typography>----------------------</Typography>
            {items?.map((item, index) => (
              <Typography key={index}>{item.menu.item}</Typography>
            ))}
          </div>
          <div style={{ textAlign: "right" }}>
            <Typography variant="subtitle1">Qty</Typography>
            <Typography>------</Typography>
            {items?.map((item, index) => (
              <Typography key={index}>*{item.quantity}*</Typography>
            ))}
          </div>
          <div style={{ textAlign: "right" }}>
            <Typography variant="subtitle1">&nbsp;</Typography>
            <Typography>--</Typography>
            {items?.map((item, index) => (
              <Typography key={index}>x</Typography>
            ))}
          </div>
          <div style={{ textAlign: "right" }}>
            <Typography variant="subtitle1">Price</Typography>
            <Typography>---------</Typography>
            {items?.map((item, index) => (
              <Typography key={index}>*{item.unit_price}</Typography>
            ))}
          </div>
        </div>
        <Typography>---------------------------------------</Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 0.5,
            marginRight: 25,
          }}
        >
          <div>
            <Typography>SUB TOTAL</Typography>
          </div>
          <div style={{ alignItems: "flex-end" }}>
            <Typography>*{amounts.subTotalAmount}</Typography>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 0.5,
            marginRight: 25,
          }}
        >
          <div>
            <Typography>TAX 15.00%</Typography>
          </div>
          <div style={{ alignItems: "flex-end" }}>
            <Typography>*{amounts.taxAmount}</Typography>
          </div>
        </div>
        <Typography>---------------------------------------</Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 0.5,
            marginRight: 25,
          }}
        >
          <div>
            <Typography>TOTAL</Typography>
          </div>
          <div style={{ alignItems: "flex-end" }}>
            <Typography>*{amounts.totalAmount}</Typography>
          </div>
        </div>
      </TableContainer>
    </Grid>
  );
});

const PrintCashReceiptModal = ({ isOpen, onClose, onPrint, getPrintData }) => {
  const componentRef = useRef();

  const handlePrintClick = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {},
    onAfterPrint: () => {},
    pageStyle: `
        @page {
            size: 80mm 180mm;
            margin: 5px;
        }
        @media print {
            body {
            size: 80mm 180mm;
            margin: 5px;
            }
        }
        `,
  });

  const handlePrint = () => {
    handlePrintClick();
    onPrint();
    onClose();
  };

  const customTheme = createTheme({
    typography: {
      fontFamily: "'Inconsolata', monospace !important",
    },
  });

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Confirm Print Cash Receipt</DialogTitle>
      <DialogContent sx={{ padding: "16px" }}>
        <p>Are you sure you want to print this Cash Receipt?</p>
        <div style={{ display: "none" }}>
          <ThemeProvider theme={customTheme}>
            <PrintableContent ref={componentRef} getPrintData={getPrintData} />
          </ThemeProvider>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PrintCashReceiptModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
  getPrintData: PropTypes.object.isRequired,
};

PrintableContent.propTypes = {
  getPrintData: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        menu: PropTypes.object.isRequired,
        quantity: PropTypes.number.isRequired,
        unit_price: PropTypes.string.isRequired,
      })
    ),
    cash_receipt_number: PropTypes.string,
    waiter: PropTypes.object,
    casher: PropTypes.object,
  }).isRequired,
};

PrintableContent.displayName = "PrintableContent";

export default PrintCashReceiptModal;
