export const CLIENT_ID =
  "611542890412-vsde7t6jbui3t9d75m3d95kssle63gi6.apps.googleusercontent.com";

import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";

// Provided we wrap the app with the react oauth provider thing

const useGoogleAuthState = (scopes = undefined) => {
  const [loginResponse, setLoginResponse] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    console.log(loginResponse);
    console.log(userInfo);
  }, [loginResponse, userInfo]);

  // GET user info
  useEffect(() => {
    if (loginResponse) {
      try {
        fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${loginResponse.access_token}`
        ).then((response) => {
          if (response.ok) {
            const getUserInfo = async () => {
              const userInfoResponse = await response.json();
              setUserInfo(userInfoResponse);
            };
            getUserInfo();
          }
        });
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  }, [loginResponse]);

  const login = useGoogleLogin({
    scope: scopes,
    onSuccess: (res) => {
      setLoginResponse(res);
    },
  });

  const logout = () => {
    setLoginResponse(null);
    setUserInfo(null);
  };

  return { login, loginResponse, userInfo, logout };
};

export { useGoogleAuthState };
