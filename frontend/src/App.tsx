import './App.css';
import ForgotPassword from './components/ForgotPassword';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import HomeLayout from './layouts/HomeLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
