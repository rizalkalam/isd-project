import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await login(email, password);
    if (user) {
      const role = user.role;
      navigate(role === 'admin' ? '/admin/inventory' : '/student/discovery');
    }
  };

  return (
    <div className="page page-auth">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-chip">Library Management</div>
          <h1 className="auth-title">Selamat datang kembali</h1>
          <p className="auth-subtitle">Masuk untuk mengelola koleksi atau melihat katalog siswa.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="form-error">{error}</div>}

          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
