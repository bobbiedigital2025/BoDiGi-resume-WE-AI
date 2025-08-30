import React, { useState } from 'react';
import { useBackgroundService } from '../AppBackgroundProvider';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Placeholder for global admin setter
  // const { setIsAdmin } = useBackgroundService();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with real authentication logic
    if (email === 'your-admin-email@gmail.com' && password === 'your-password') {
      // setIsAdmin(true);
      window.location.href = '/'; // Redirect to home or admin page
    } else {
      setError('Invalid credentials');
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Integrate Google OAuth
    alert('Google login not yet implemented');
  };

  const handlePasskeyLogin = () => {
    // TODO: Integrate WebAuthn/passkey
    alert('Passkey login not yet implemented');
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
      <hr />
      <button onClick={handleGoogleLogin} style={{ marginTop: 8 }}>Login with Google</button>
      <button onClick={handlePasskeyLogin} style={{ marginTop: 8 }}>Login with Passkey (iPhone)</button>
    </div>
  );
};

export default AdminLogin;
