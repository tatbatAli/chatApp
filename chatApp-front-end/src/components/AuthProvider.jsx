import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authentication, loginSuccess } from "../../redux/userSlice";
import api from "../api/api";
function Authentication({ children }) {
  const [token, setToken] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const accessT = useSelector((state) => state.userSlice.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      if (accessT) {
        console.log(accessT);
        setToken(accessT);
        setIsAuthenticated(true);
        dispatch(authentication(true));
      } else {
        setToken(null);
        setIsAuthenticated(false);
        dispatch(authentication(false));
      }
    };

    fetchToken();
  }, [accessT]);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
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

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401) {
          try {
            const newTokenResponse = await api.post(
              "auth/refreshToken",
              {},
              { withCredentials: true }
            );
            setToken(newTokenResponse.data.accessToken);

            error.config.headers[
              "Authorization"
            ] = `Bearer ${newTokenResponse.data.accessToken}`;

            return api(error.config);
          } catch (error) {
            setToken(null);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token, isAuthenticated]);

  return children;
}

export default Authentication;
