import { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
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
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                id="password"
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
};

export default LoginForm;
