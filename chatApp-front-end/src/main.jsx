import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import { Provider } from "react-redux";
import store from "../redux/store";
import Authentication from "./context/AuthProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Authentication>
          <App />
        </Authentication>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
