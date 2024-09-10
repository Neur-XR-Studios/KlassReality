import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { accessToken, refreshToken } from "./redux/features/counter/adminSlice";
import { useLocalStorage } from "./redux/useLocalStorage";
import { RefreshToken } from "./services/Index";

const TokenRefreshHandler = () => {
  const dispatch = useDispatch();
  const [, setAccessToken] = useLocalStorage("accessToken", null);
  const [, setRefreshToken] = useLocalStorage("refreshToken", null);
  const refreshtoken = useSelector((state) => state.admin.refreshToken);

  useEffect(() => {
    const tokenRefresh = async () => {
      try {
        const response = await RefreshToken({ refreshToken: refreshtoken });
        setAccessToken(response.access.token);
        dispatch(accessToken(response.access.token));

        setRefreshToken(response.refresh.token);
        dispatch(refreshToken(response.refresh.token));
      } catch (error) {
        console.error("Error refreshing token:", error);
        message.error("Error refreshing token. Please log in again.");
        // You can redirect to the login page or handle the error in your application logic
      }
    };

    tokenRefresh();
  }, [refreshtoken, dispatch, setAccessToken, setRefreshToken]);

  return {
    refreshtoken,
  }; // This component doesn't render anything visible
};

export default TokenRefreshHandler;
