import './App.css';
import LoginForm from './components/LoginForm';
import HomeLayout from './layouts/HomeLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<LoginForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
