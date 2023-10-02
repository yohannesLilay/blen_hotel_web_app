import { Container, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        400 Error
      </Typography>
      <Typography variant="h5" component="p" gutterBottom>
        Oops! The request was malformed or invalid.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        sx={{ marginTop: "1rem" }}
      >
        Go back to Home
      </Button>
    </Container>
  );
};

export default NotFound;
