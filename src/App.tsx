import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import { useMediaQuery } from "@mui/material";
import { NavBar } from "@hmxlabs/navbar";
import "./index.css";

// Lazy load the main Form component
const Form = lazy(() => import("./components/Form"));

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <NavBar
          isMobile={isMobile}
          mobileOpen={mobileOpen}
          onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
        />
        <Suspense fallback={<LoadingSpinner message="Loading application..." />}>
          <Routes>
            <Route path="/" element={<Form />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
