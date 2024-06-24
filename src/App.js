import { Provider } from "react-redux";
import { store } from "./stores/store";
import { AppRoutes } from "./routes";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename="">
        <AppRoutes></AppRoutes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
