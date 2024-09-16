import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const credentials = { email, password };

    setEmail('');
    setPassword('');

    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/auth/login`,
        credentials,
      );

      console.log('login response: ', response);
    } catch (error) {
      console.log('login failed: ', error);
    }
  };

  return (
    <>
      <h1>Welcome to PlanCraftr</h1>
      <div className="container">
        <div className="login">
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
