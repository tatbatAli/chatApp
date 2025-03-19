import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import Authentication from "./components/AuthProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Authentication>
        <App />
      </Authentication>
    </BrowserRouter>
  </StrictMode>
);
