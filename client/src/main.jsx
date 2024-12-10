import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "@/components/ui/toaster";
import AppLayout from "./Layouts/AppLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

import ContactPage from "./pages/ContactPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";

// import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="contact-us" element={<ContactPage />} />
        <Route path="/app/login" element={<LoginPage />} />
        <Route path="/app/search" element={<SearchPage />} />
        <Route path="app" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
