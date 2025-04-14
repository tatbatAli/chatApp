import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, TextField, Button } from "@mui/material";
import { Link } from "@mui/material";
import postingUserSignUpData from "../../Hooks/postingUserSignUpData";
import usePwdValidation from "../../Hooks/usePwdValidation";
import { useDispatch } from "react-redux";
import { setUser, setUserId } from "../../redux/userSlice";

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

  const handleUserName = (e) => {
    setUserName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log(validateForm());
      return err;
    }

    const dataObject = {
      username: userName,
      email: email,
      password: password,
    };

    setUserData([...userData, dataObject]);
    setUserName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");

    try {
      const bodyData = await postingUserSignUpData(dataObject);
      const user = bodyData.User_Data;
      dispatch(setUser(user.username));
      console.log("signup was ", bodyData.success);
      setVerificationMsg(bodyData.msg);
    } catch (error) {
      setErrMsg(bodyData.msg || "Something went wrong");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{ backgroundColor: "lightblue", color: "black" }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h4">Sign In</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            component="form"
            onSubmit={submit}
            sx={{
              "& .MuiTextField-root": { m: 2, width: "40ch" },
              p: 4,
              width: "50%",
              height: "auto",
              margin: "auto",
              boxShadow: 3,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  required
                  id="user-name"
                  label="UserName"
                  variant="filled"
                  value={userName}
                  onChange={handleUserName}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  id="email"
                  label="Email"
                  type="email"
                  variant="filled"
                  value={email}
                  onChange={handleEmail}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  id="password"
                  label="Password"
                  type="password"
                  variant="filled"
                  value={password}
                  onChange={handlePassword}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  id="password-confirmation"
                  label="Password Confirmation"
                  type="password"
                  variant="filled"
                  value={passwordConfirmation}
                  onChange={handlePasswordConfirmation}
                />
              </Grid>

              <Box
                sx={{ color: "gray", fontSize: "0.9rem", ml: 5, width: "100%" }}
              >
                Your password must include:
                <ul>
                  <li>At least 8 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                  <li>
                    At least one special character (e.g., @, $, !, %, *, ?, &)
                  </li>
                </ul>
              </Box>

              <Box
                sx={{ color: "gray", fontSize: "0.9rem", ml: 5, width: "100%" }}
              >
                The confirmation password must match the password exactly.
              </Box>

              <Grid item xs={12} sx={{ color: "gray" }}>
                <Link href="/LoginPage" color="primary" underline="hover">
                  Log-in
                </Link>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  onSubmit={submit}
                >
                  Submit
                </Button>
              </Grid>
              {verificationMsg && (
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
                      {verificationMsg}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {errMsg && (
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
                      {errMsg}
                    </Typography>
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
