import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Signin from "./pages/Signin";
import Signup from "./pages/SignUp";
import MainLayout from "./layouts/MainLayout";
import "react-tooltip/dist/react-tooltip.css";
import ServerIdPage from "./pages/ServerIdPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/servers/@me"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/servers/:serverId"
          element={
            <MainLayout>
              <ServerIdPage />
            </MainLayout>
          }
        />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
      </Routes>
    </Router>
  );
}

export default App;
