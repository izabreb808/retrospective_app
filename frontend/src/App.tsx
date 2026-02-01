import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./components/login/login";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Dashboard } from "./pages/dashboard";
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  //  <div style={{ marginTop: "100px", padding: "20px", fontFamily: "Arial" }}>
  //     <h1>Make your retro easy</h1>
  //     <Login />
  //   </div>
  )
}

export default App
