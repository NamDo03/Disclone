import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import MainLayout from "./layouts/MainLayout";
import "react-tooltip/dist/react-tooltip.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChannelPage from "./pages/ChannelPage";

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
          path="/servers/:serverId/channels/:channelId"
          element={
            <MainLayout>
              <ChannelPage />
            </MainLayout>
          }
        />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
      />
    </Router>
  );
}

export default App;
