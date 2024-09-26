import './App.css';
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
