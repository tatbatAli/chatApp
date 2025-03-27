import { useEffect, useState } from "react";
import api from "../api/api";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

function EmailVerify() {
  const [validUrl, setValidUrl] = useState(false);
  const navigate = useNavigate();
  const { id, token } = useParams();

  const handlLoginClick = () => {
    navigate("/LoginPage");
  };

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const url = `auth/${id}/verify/${token}`;
        const verifyRoute = await api.get(url);
        setValidUrl(verifyRoute.data.success);
        console.log(verifyRoute.data.msg);
      } catch (error) {
        setValidUrl(error.verifyRoute.data.success);
        console.log(error.verifyRoute.data.msg);
      }
    };

    verifyEmail();
  }, [id, token]);

  return (
    <Box>
      {validUrl ? (
        <Box sx={useStyles.container}>
          <img src="/success.jpeg" alt="success img" />
          <Button
            sx={useStyles.greenBtn}
            variant="contained"
            onClick={handlLoginClick}
          >
            Login
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography>401 Not Authorized</Typography>
        </Box>
      )}
    </Box>
  );
}
const useStyles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  greenBtn: {
    border: "none",
    outline: "none",
    padding: "12px 0",
    backgroundColor: "#3bb19b",
    borderRadius: "20px",
    width: "180px",
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default EmailVerify;
