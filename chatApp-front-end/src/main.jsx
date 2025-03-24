import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import Authentication from "./components/AuthProvider";
import { Provider } from "react-redux";
import store from "../redux/store";

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
