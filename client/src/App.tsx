import React from "react";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";

import { AuthProvider } from "./context/auth";

import DynamicRoute from "./util/DynamicRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<DynamicRoute element={<Home />} authenticated={true} />}
          />
          <Route
            path="/login"
            element={<DynamicRoute element={<Login />} authenticated={false} />}
          />
          <Route
            path="/register"
            element={
              <DynamicRoute element={<Register />} authenticated={false} />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
