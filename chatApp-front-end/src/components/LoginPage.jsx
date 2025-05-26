import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, TextField, Button, Link } from "@mui/material";
import postingUserLoginData from "../../Hooks/postingUserLoginData";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loginSuccess,
  setUser,
  setUserEmail,
  setUserId,
} from "../../redux/userSlice";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [faildedMsg, setFaildedMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUserName = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);

  const submit = async () => {
    if ([username, password].some((field) => !field.trim())) {
      alert("Fill all required fields");
      return;
    }

    const dataObject = { username, email, password };

    setUsername("");
    setPassword("");
    setEmail("");
    setLoading(true);

    try {
      const loginData = await postingUserLoginData(dataObject);
      if (loginData.success) {
        dispatch(loginSuccess(loginData.accessToken));
        dispatch(setUserId(loginData.userId));
        dispatch(setUserEmail(loginData.email));
        dispatch(setUser(loginData.username));
        setSuccessMsg(loginData.msg);
        navigate("/HomePage");
      } else {
        setFaildedMsg(loginData.msg);
      }
    } catch (error) {
      console.log("Error sending data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Grid
        item
        xs={12}
        sx={{ backgroundColor: "lightblue", py: 4, px: 2, boxShadow: 2 }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Welcome Back
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Log In
          </Typography>
        </Box>
      </Grid>

      {/* Form */}
      <Grid container justifyContent="center" sx={{ mt: 6 }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            p: 4,
            backgroundColor: "#fff",
            boxShadow: 3,
            borderRadius: 3,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Username"
                variant="filled"
                value={username}
                onChange={handleUserName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                variant="filled"
                value={email}
                onChange={handleEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                variant="filled"
                value={password}
                onChange={handlePassword}
              />
            </Grid>
            <Grid item xs={12} textAlign="left">
              <Link href="/ForgetPwd" underline="hover" color="primary">
                Forgot Password?
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={submit}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </Grid>

            {successMsg && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    textAlign: "center",
                    backgroundColor: "green",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body1" color="white">
                    {successMsg}
                  </Typography>
                </Box>
              </Grid>
            )}

            {faildedMsg && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    textAlign: "center",
                    backgroundColor: "red",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body1" color="white">
                    {faildedMsg}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
}

export default LoginPage;
