import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { handleGoogleRedirect } from './lib/googleAuth';

// Components
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Disclaimer from './pages/Disclaimer';
import Assessment from './pages/Assessment';
import Processing from './pages/Processing';
import Report from './pages/Report';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';

// Handle Google OAuth redirect on app startup
handleGoogleRedirect();

function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Pages with navigation header */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/processing" element={<Processing />} />
              <Route path="/report" element={<Report />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Auth pages without standard header */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
