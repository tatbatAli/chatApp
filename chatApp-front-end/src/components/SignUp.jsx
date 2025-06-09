import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, TextField, Button, Link } from "@mui/material";
import postingUserSignUpData from "../../Hooks/postingUserSignUpData";
import usePwdValidation from "../../Hooks/usePwdValidation";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";

function SignUpPage() {
  const [userData, setUserData] = useState([]);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [verificationMsg, setVerificationMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
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
  const dispatch = useDispatch();

  const handleUserName = (e) => setUserName(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return err;

    const dataObject = { username: userName, email, password };
    setUserData([...userData, dataObject]);
    setUserName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");

    try {
      const bodyData = await postingUserSignUpData(dataObject);
      const user = bodyData.User_Data;
      dispatch(setUser(user.username));
      setVerificationMsg(bodyData.msg);
      setErrMsg("");
    } catch (error) {
      setVerificationMsg("");
      setErrMsg(error?.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
        overflow: "hidden",
      }}
    >
      <Grid container justifyContent="center">
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: "lightblue",
            py: 4,
            px: 2,
            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
          }}
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
              Welcome to Talka
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Sign Up
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={10} md={8} lg={6} xl={5} sx={{ mt: 4 }}>
          <Box
            component="form"
            onSubmit={submit}
            sx={{
              backgroundColor: "#fff",
              boxShadow: 3,
              borderRadius: 2,
              px: { xs: 2, sm: 4 },
              py: 4,
              mx: "auto",
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  variant="filled"
                  value={userName}
                  onChange={handleUserName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
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

              <Grid item xs={12} sm={6}>
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

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  variant="filled"
                  value={passwordConfirmation}
                  onChange={handlePasswordConfirmation}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ color: "gray", fontSize: "0.9rem" }}>
                  <strong>Password must include:</strong>
                  <ul
                    style={{ marginTop: 4, marginBottom: 4, paddingLeft: 20 }}
                  >
                    <li>At least 8 characters</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one lowercase letter</li>
                    <li>At least one number</li>
                    <li>One special character (e.g., @, $, %, *)</li>
                  </ul>
                  <p>Confirmation password must match exactly.</p>
                </Box>
              </Grid>

              <Grid item xs={12} textAlign="center">
                <Link href="/LoginPage" color="primary" underline="hover">
                  Already have an account? Log in
                </Link>
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  Create Account
                </Button>
              </Grid>

              {verificationMsg && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: "green",
                      borderRadius: 1,
                      textAlign: "center",
                    }}
                  >
                    <Typography color="white">{verificationMsg}</Typography>
                  </Box>
                </Grid>
              )}

              {errMsg && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: "red",
                      borderRadius: 1,
                      textAlign: "center",
                    }}
                  >
                    <Typography color="white">{errMsg}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignUpPage;
