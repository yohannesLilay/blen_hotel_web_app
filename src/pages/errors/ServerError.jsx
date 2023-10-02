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
        500 Error
      </Typography>
      <Typography variant="h5" component="p" gutterBottom>
        Oops! Something went wrong on the server.
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
