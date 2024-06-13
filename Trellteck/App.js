import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./src/pages/Login";
import MainPage from "./src/pages/MainPage";
import BoardPage from "./src/pages/BoardPage";

import { appTheme } from "./src/config/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: appTheme.background,
          height: "100%",
        }}
      >
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={Login}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="MainPage"
            component={MainPage}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="BoardPage"
            component={BoardPage}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}
