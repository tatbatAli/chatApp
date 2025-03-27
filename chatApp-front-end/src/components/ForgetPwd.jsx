import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import api from "../api/api";

function ForgetPwd() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Forgot Password
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "300px" }}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 2, backgroundColor: "#3bb19b" }}
        >
          Send Reset Link
        </Button>
      </Box>
      {message && <Typography color="green">{message}</Typography>}
      {error && <Typography color="red">{error}</Typography>}
    </Box>
  );
}

export default ForgetPwd;
