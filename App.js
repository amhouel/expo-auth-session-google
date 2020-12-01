import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { View, Text, Button } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "Your_Google_Web_Client_ID.apps.googleusercontent.com",
    selectAccount: true,
  });

  const [userEmail, setUserEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const getUserEmail = async (token) => {
    const user = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const userData = await user.json();
    setUserEmail(userData.email);
    setIsLoading(false);
  };
  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      getUserEmail(authentication.accessToken);
    }
  }, [response, isLoading]);

  return (
    <View style={{alignItems:"center", paddingTop: 100}}>
      <Button
        disabled={!request}
        title="Select Account"
        onPress={() => {
          promptAsync().then(() => setIsLoading(true));
        }}
      />
      {isLoading ? (
        <Text style={{marginTop: 20}}>Loading...</Text>
      ) : (
        userEmail && <Text style={{marginTop: 20}}>Account selected: {userEmail}</Text>
      )}
    </View>
  );
}
