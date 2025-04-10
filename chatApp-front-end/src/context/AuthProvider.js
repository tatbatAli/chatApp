import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authentication, loginSuccess, logOut } from "../../redux/userSlice";
import api from "../api/api";
function Authentication({ children }) {
  const accessT = useSelector((state) => state.userSlice.token);
  const isAuthenticated = useSelector(
    (state) => state.userSlice.isAuthenticated
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      if (accessT) {
        console.log(accessT);
        dispatch(authentication(true));
      } else {
        dispatch(authentication(false));
      }
    };

    fetchToken();
  }, [accessT]);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessT) {
          config.headers["Authorization"] = `Bearer ${accessT}`;
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
            const newTokenResponse = await api.post("auth/refreshToken");

            dispatch(loginSuccess(newTokenResponse.data.accessToken));

            error.config.headers[
              "Authorization"
            ] = `Bearer ${newTokenResponse.data.accessToken}`;

            return api(error.config);
          } catch (error) {
            dispatch(logOut());
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessT]);

  return children;
}

export default Authentication;
