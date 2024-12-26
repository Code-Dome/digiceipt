import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Create from "@/pages/Create";
import View from "@/pages/View";
import Archive from "@/pages/Archive";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import Stats from "@/pages/Stats";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { PostHogProvider } from "@/contexts/PostHogContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Footer } from "@/components/Footer";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <PostHogProvider>
            <div className="min-h-screen flex flex-col">
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/create"
                    element={
                      <ProtectedRoute>
                        <Create />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/view"
                    element={
                      <ProtectedRoute>
                        <View />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/archive"
                    element={
                      <ProtectedRoute>
                        <Archive />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/stats"
                    element={
                      <ProtectedRoute>
                        <Stats />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
              <Footer />
            </div>
            <Toaster />
          </PostHogProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;