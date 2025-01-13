import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PostHogProvider } from '@/contexts/PostHogContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import ResetPassword from '@/pages/ResetPassword';
import Index from '@/pages/Index';
import Create from '@/pages/Create';
import View from '@/pages/View';
import Stats from '@/pages/Stats';
import Admin from '@/pages/Admin';
import Templates from '@/pages/Templates';
import Archive from '@/pages/Archive';

function App() {
  return (
    <PostHogProvider>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
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
                path="/view/:id"
                element={
                  <ProtectedRoute>
                    <View />
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
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/templates"
                element={
                  <ProtectedRoute>
                    <Templates />
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
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </PostHogProvider>
  );
}

export default App;