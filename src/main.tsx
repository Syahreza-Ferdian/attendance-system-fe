import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />

    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "18px",
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
        },
      }}
    />
  </StrictMode>,
);
