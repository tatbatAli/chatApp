import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import { Provider } from "react-redux";
import store from "../redux/store";
import Authentication from "./context/AuthProvider";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <BrowserRouter>
        <Provider store={store}>
          <Authentication>
            <App />
          </Authentication>
        </Provider>
      </BrowserRouter>
    </SnackbarProvider>
  </StrictMode>
);
