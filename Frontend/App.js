import AppNavigation from "./src/navigation";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs()
export default function App() {
  return <AppNavigation />;
}
