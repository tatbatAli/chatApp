import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, TextField, Button } from "@mui/material";
import postingUserSignUpData from "../../Hooks/postingUserSignUpData";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { Link } from "@mui/material";

function SignUpPage() {
  const [userData, setUserData] = useState([]);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const dispatch = useDispatch();

  const handleUserName = (e) => {
    setUserName(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
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
        password: password,
        passwordConfirmation: passwordConfirmation,
      };

      setUserData([...userData, dataObject]);
      setUserName("");
      setPassword("");
      setPasswordConfirmation("");

      try {
        const bodyData = await postingUserSignUpData(dataObject);
        const user = bodyData.User_Data.username;
        dispatch(setUser(user));
        if (bodyData.success) {
          navigate("/HomePage");
        } else {
          console.log("sign up failed", bodyData.success);
        }
      } catch (error) {
        console.log("err sending user data", error);
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
              <Grid item xs={12}>
                <TextField
                  required
                  id="user-name"
                  label="UserName"
                  variant="filled"
                  value={userName}
                  onChange={handleUserName}
                />
              </Grid>
              <Grid item xs={12}>
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

              <Box sx={{ color: "gray", fontSize: "0.9rem", ml: 5 }}>
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

              <Grid item xs={12}>
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

              <Box sx={{ color: "gray", fontSize: "0.9rem", ml: 5 }}>
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
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignUpPage;
