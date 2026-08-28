import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CheckTransaction from "./pages/CheckTransaction";
import CheckReturn from "./pages/CheckReturn";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
  path="/check-transaction"
  element={<CheckTransaction />}
/>
<Route
  path="/check-return"
  element={<CheckReturn />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;