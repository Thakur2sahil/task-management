import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ModalProvider } from "./components/modal/ModalContext.jsx";

createRoot(document.getElementById("root")).render(
  <ModalProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </ModalProvider>,
);
