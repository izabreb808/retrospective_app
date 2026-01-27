import './App.css'
import React from "react";
import { Register } from "./components/register/register";
import { Login } from "./components/login/login";
function App() {

  return (
   <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Demo Użytkownicy</h1>
      <Register />
      <hr />
      <Login />
    </div>
  )
}

export default App
