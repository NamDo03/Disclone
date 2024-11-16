import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import MainLayout from "./layouts/MainLayout";
import "react-tooltip/dist/react-tooltip.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChannelPage from "./pages/ChannelPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomeLayout from "./layouts/HomeLayout";
import PersonalMessage from "./pages/PersonalMessage";
import JoinServer from "./pages/JoinServer";
import PageNotFound from "./pages/PageNotFound";
import VideoCall from "./components/Call/VideoCall";
import { CallProvider } from "./redux/callContext";

function App() {
  return (
    <CallProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomeLayout>
                  <HomePage />
                </HomeLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/servers/:serverId/channels/:channelId"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ChannelPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/servers/:serverId"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ChannelPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/DM/:directMessageId"
            element={
              <ProtectedRoute>
                <HomeLayout>
                  <PersonalMessage />
                </HomeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/invite/:serverId"
            element={
              <ProtectedRoute>
                <JoinServer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/servers/:serverId/channels/:channelId/voice"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <VideoCall />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <PageNotFound />
              </ProtectedRoute>
            }
          />
          <Route
            path="/page-not-found"
            element={
              <ProtectedRoute>
                <PageNotFound />
              </ProtectedRoute>
            }
          />
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
    </CallProvider>
  );
}

export default App;
