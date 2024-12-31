import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Login from "./components/Login.jsx";
import { AuthProvider, PrivateRoute } from './authprovider.jsx';
import MainLayout from './MainLayout'; // You'll need to move the MainLayout component to a separate file

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
