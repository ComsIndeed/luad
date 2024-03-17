export const CLIENT_ID =
  "611542890412-vsde7t6jbui3t9d75m3d95kssle63gi6.apps.googleusercontent.com";

import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";

const useGoogleAuthState = (scopes = undefined) => {
  const [loginResponse, setLoginResponse] = useState(
    JSON.parse(sessionStorage.getItem("loginResponse")) || null
  );
  const [userInfo, setUserInfo] = useState(null);

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

  // Store loginResponse in sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem("loginResponse", JSON.stringify(loginResponse));
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
    sessionStorage.removeItem("loginResponse"); // Remove loginResponse from sessionStorage on logout
  };

  return { login, loginResponse, userInfo, logout };
};

export { useGoogleAuthState };
