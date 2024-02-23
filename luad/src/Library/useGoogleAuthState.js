import { useState, useEffect } from "react";

function initializeClient(
  clientID,
  scopes,
  callback = (response) => {
    console.log(response);
  }
) {
  const client = google.accounts.oauth2.initTokenClient({
    client_id: clientID,
    scope: scopes.join(" "),
    callback: callback,
  });
  client.requestAccessToken();
}

// ! ===========================================================

const useGoogleAuthState = (clientID, scopes) => {
  const [user, setUser] = useState(undefined);
  const [accessToken, setAccessToken] = useState(undefined);
  const [accessTokenResponse, setAccessTokenResponse] = useState(undefined);

  const authorize = () => {
    initializeClient(clientID, scopes, (response) => {
      setAccessTokenResponse(response);
    });
  };

  useEffect(() => {
    if (accessTokenResponse) {
      setAccessToken(accessTokenResponse?.access_token);
      try {
        fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessTokenResponse.access_token}`
        ).then((response) => {
          if (response.ok) {
            const getUserInfo = async () => {
              const userInfo = await response.json();
              setUser(userInfo);
            };
            getUserInfo();
          }
        });
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  }, [accessTokenResponse]);

  return { user, accessToken, accessTokenResponse, authorize };
};

export default useGoogleAuthState;
