/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import Config from "react-native-config";

// console.log("Environement: " + Config.NODE_ENV);
AppRegistry.registerComponent(appName, () => App);
