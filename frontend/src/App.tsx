import './App.css';
import ForgotPassword from './components/ForgotPassword';
import LoginForm from './components/LoginForm';
import ProtectedRoutes from './components/ProtectedRoutes';
import RegisterForm from './components/RegisterForm';
import HomeLayout from './layouts/HomeLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Terms from './pages/Terms';
import VerifyEmail from './pages/VerifyEmail';
import ResetPasswordMessage from './pages/ResetPasswordMessage';
import ResetPassword from './components/ResetPassword';
import Home from './pages/Home';
import Home2 from './pages/Home2';
//import ProtectResetPasswordRoutes from './components/ProtectResetPasswordRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home2 />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          {/* <Route path="" element={<ProtectResetPasswordRoutes />}> */}
          <Route
            path="reset-password-message"
            element={<ResetPasswordMessage />}
          />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        {/* </Route> */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/dashboard" element={<ProtectedRoutes />}>
          <Route index element={<Dashboard />} />
        </Route>
        {/* prev home */}
        <Route path="prev-home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
