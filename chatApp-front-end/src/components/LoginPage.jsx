import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, TextField, Button, Link } from "@mui/material";
import postingUserLoginData from "../../Hooks/postingUserLoginData";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, setUserId } from "../../redux/userSlice";
function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [faildedMsg, setFaildedMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUserName = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const submit = async () => {
    if ([username, password].some((field) => !field.trim())) {
      alert("fill the fields");
    } else {
      const dataObject = {
        username: username,
        email: email,
        password: password,
      };

      setUsername("");
      setPassword("");
      setEmail("");
      setLoading(true);

      try {
        const loginData = await postingUserLoginData(dataObject);
        if (loginData.success) {
          dispatch(loginSuccess(loginData.accessToken));
          setSuccessMsg(loginData.msg);
          console.log(loginData.userId);
          dispatch(setUserId(loginData.userId));
          navigate("/HomePage");
        } else {
          setSuccessMsg(loginData.msg);
          console.log(loginData.msg);
        }
      } catch (error) {
        console.log("err sending data", error);
      } finally {
        setLoading(false);
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
            <Typography variant="h4">Log in</Typography>
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
                  value={username}
                  onChange={handleUserName}
                />
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12} sx={{ color: "gray" }}>
                <Link href="/ForgetPwd" color="primary" underline="hover">
                  Forget Password
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

export default LoginPage;
