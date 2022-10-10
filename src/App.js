import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store/store";
import DayjsUtils from "@date-io/dayjs";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AppTheming from "./theme";

function App() {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns} utils={DayjsUtils}>
        <AppTheming />
      </LocalizationProvider>
    </Provider>
  );
}

export default App;
