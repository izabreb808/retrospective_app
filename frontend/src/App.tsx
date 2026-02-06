import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/login/login";
import { ProtectedRoute } from "./routes/ProtectedRoute";

import { DashboardLayout } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Retrospectives } from "./pages/Retrospectives";
import { RetrospectiveBoard } from "./pages/RetrospectiveBoard";
import { Team } from "./pages/Team";
import { Wheel } from "./pages/Wheel";
import { Statistics } from "./pages/Statistics";

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
          <Route path="retrospectives/:id" element={<RetrospectiveBoard />} />
          <Route path="team" element={<Team />} />
          <Route path="wheel" element={<Wheel />} />
          <Route path="statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
