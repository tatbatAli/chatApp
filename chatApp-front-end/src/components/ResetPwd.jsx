import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import usePwdValidation from "../../Hooks/usePwdValidation";

function ResetPwd() {
  const [resetPwdData, setResetPwdData] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const {
    password,
    passwordConfirmation,
    setPassword,
    setPasswordConfirmation,
    handlePassword,
    handlePasswordConfirmation,
    validateForm,
    err,
  } = usePwdValidation();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const resetPwdObject = {
      password: password,
    };
    setResetPwdData([...resetPwdData, resetPwdObject]);
    setMessage("");
    setError("");
    setPassword("");
    setPasswordConfirmation("");

    try {
      const respone = await api.post(`auth/${id}/resetPwd`, resetPwdObject, {
        withCredentials: true,
      });
      console.log(respone.data.success, respone.data.msg);
      setMessage(respone.data.msg);
    } catch (error) {
      console.log("there's an err changing pwd", error);
      setError("Something went wrong!!");
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
        Reset Password
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "300px" }}>
        <TextField
          fullWidth
          label="New Password"
          variant="outlined"
          margin="normal"
          type="password"
          value={password}
          onChange={handlePassword}
          required
        />
        <TextField
          fullWidth
          label="Confirm Password"
          variant="outlined"
          margin="normal"
          type="password"
          value={passwordConfirmation}
          onChange={handlePasswordConfirmation}
          required
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 2, backgroundColor: "lightblue" }}
        >
          Reset Password
        </Button>
      </Box>
      {message && <Typography color="green">{message}</Typography>}
      {error && <Typography color="red">{error}</Typography>}
    </Box>
  );
}

export default ResetPwd;
