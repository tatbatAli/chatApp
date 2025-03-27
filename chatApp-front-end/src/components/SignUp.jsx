import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, TextField, Button } from "@mui/material";
import postingUserSignUpData from "../../Hooks/postingUserSignUpData";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess, setUser } from "../../redux/userSlice";
import { Link } from "@mui/material";

function SignUpPage() {
  const [userData, setUserData] = useState([]);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [verificationMsg, setVerificationMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();

  const handleUserName = (e) => {
    setUserName(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordConfirmation = (e) => {
    setPasswordConfirmation(e.target.value);
  };

  const navigate = useNavigate();

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_./\'":])[A-Za-z\d!@#$%^&*()_./\'":]{8,}$/;

  const submit = async () => {
    if (
      [userName, password, passwordConfirmation].some((field) => !field?.trim())
    ) {
      alert("fill the fields");
    } else if (
      password !== passwordConfirmation ||
      !passwordPattern.test(password)
    ) {
      alert("invalid password");
    } else {
      const dataObject = {
        username: userName,
        email: email,
        password: password,
        passwordConfirmation: passwordConfirmation,
      };

      setUserData([...userData, dataObject]);
      setUserName("");
      setPassword("");
      setEmail("");
      setPasswordConfirmation("");

      try {
        const bodyData = await postingUserSignUpData(dataObject);
        const user = bodyData.User_Data.username;
        dispatch(setUser(user));
        if (bodyData.success) {
          console.log("signup was ", bodyData.success);
          setVerificationMsg(bodyData.message);
        } else {
          console.log("sign up failed", bodyData.success, bodyData.data);
        }
      } catch (error) {
        console.log("err sending user data", error.bodyData.error);
      }
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
                  onClick={submit}
                >
                  Submit
                </Button>
              </Grid>
              {verificationMsg ? (
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
              ) : (
                ""
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignUpPage;
