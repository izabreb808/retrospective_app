import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/login/login";
import { ProtectedRoute } from "./routes/ProtectedRoute";

import { DashboardLayout } from "./pages/dashboard";
import { Home } from "./pages/Home";
import { Retrospectives } from "./pages/Retrospectives";
import { Team } from "./pages/Team";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="retrospectives" element={<Retrospectives />} />
          <Route path="team" element={<Team />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
