import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Authentication({ children }) {
  const [token, setToken] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/token");
        if (response.data.token.accessToken) {
          setToken(response.data.token.accessToken);
          setIsAuthenticated(true);
        } else {
          setToken(null);
          setIsAuthenticated(false);
          navigate("/SignUp");
        }
      } catch (error) {
        setToken(null);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        {
          Promise.reject(error);
        }
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401) {
          try {
            const newTokenResponse = await axios.post(
              "http://localhost:5000/auth/refreshToken",
              {},
              { withCredentials: true }
            );
            setToken(newTokenResponse.data.token);

            error.config.headers[
              "Authorization"
            ] = `Bearer ${newTokenResponse.data.token}`;

            console.log("this is refresh token inside the response", token);

            return axios(error.config);
          } catch (error) {
            setToken(null);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  if (!isAuthenticated) {
    null;
  }

  return children;
}

export default Authentication;
