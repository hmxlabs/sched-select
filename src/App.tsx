import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from "./components/Form";
import { useMediaQuery } from "@mui/material";
import { NavBar } from "@hmxlabs/navbar";
import "./index.css";

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <>
      <NavBar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Form />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
