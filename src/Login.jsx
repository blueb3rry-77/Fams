import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginClick = async () => {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir email et mot de passe.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api?request=auth', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message || 'Identifiants incorrects.');
      }
    } catch (err) {
      setError('Erreur serveur. Vérifiez que PHP et MySQL sont démarrés.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginClick();
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 font-sans">
      <div className="flex flex-col md:flex-row bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-5xl w-full min-h-[550px]">
        <div className="w-full md:w-1/2 relative bg-gray-200">
          <img
            src="/Agent.png"
            alt="Foundever Tech"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/20 flex items-center justify-center p-8 text-center">
            <h2 className="text-white text-2xl font-black italic border-l-4 border-blue-500 pl-4 uppercase">
              Suivi Intelligent <br /> du Matériel
            </h2>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="flex flex-row items-center justify-center gap-3 mb-2">
              <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain" />
              <h1 className="text-4xl font-black italic text-[#1650cd] tracking-tighter">FAMS</h1>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">
              Foundever Asset Management System
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="text-left">
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1 ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>

            <div className="text-left">
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1 ml-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm font-semibold bg-red-50 border border-red-200 rounded-xl p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg hover:bg-blue-700 transition-all active:scale-95 mt-2 disabled:opacity-70"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;