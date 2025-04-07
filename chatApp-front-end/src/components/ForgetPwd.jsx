import { useEffect, useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import api from "../api/api";
import { useParams } from "react-router-dom";

function ForgetPwd() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const url = `auth/forgetPwd`;
      const forgetRoute = await api.post(
        url,
        { email },
        {
          withCredentials: true,
        }
      );
      console.log(forgetRoute.data.success, forgetRoute.data.msg);
      setMessage(forgetRoute.data.msg);
    } catch (error) {
      console.log(error.forgetRoute?.data?.msg);
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mt: 2, backgroundColor: "lightblue" }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </Box>
      {message && <Typography color="green">{message}</Typography>}
      {error && <Typography color="red">{error}</Typography>}
    </Box>
  );
}

export default ForgetPwd;
