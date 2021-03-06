import React, { Component } from "react";
import { createAppContainer, createStackNavigator } from "react-navigation";

import { Provider } from "react-redux";
// import { Icon } from "react-native-elements";

import { getStore } from "./store";

import { PersistGate } from "redux-persist/integration/react";

import AuthScreen from "./screens/AuthScreen";
import ContactScreen from "./screens/ContactScreen";
import ChatScreen from "./screens/ChatScreen";
import SearchScreen from "./screens/SearchScreen";
import SettingsScreen from "./screens/SettingsScreen";

import LoadingWrapper from "./LoadingWrapper";

const MainNavigator = createStackNavigator(
  {
    auth: {
      screen: AuthScreen,
    },
    contacts: {
      screen: ContactScreen,
    },
    chat: {
      screen: ChatScreen,
    },
    search: {
      screen: SearchScreen,
    },
    settings: {
      screen: SettingsScreen,
    },
  },
  {
    backBehavior: "contacts",
    headerMode: "none",
    lazy: true,
    tabBarOptions: {},
  }
);

const AppContainer = createAppContainer(MainNavigator);

class App extends Component {
  render() {
    const { store, persistor } = getStore();
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <LoadingWrapper>
            <AppContainer />
          </LoadingWrapper>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
