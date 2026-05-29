import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login';
import Home from './Home';
import Produits from './Produits';
import Dashboard from './Dashboard';
import Demandes from './Demandes';
import Historique from './Historique';
import InterfaceIT from './InterfaceIT';
import Navbar from './Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

  const checkSession = async () => {
    try {
      const res = await fetch('/api?request=auth', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();
      setIsLoggedIn(!!data.loggedIn);
      setUser(data.user ?? null);
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogin = (loggedUser) => {
    setIsLoggedIn(true);
    setUser(loggedUser ?? null);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api?request=auth', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch (error) {
      console.error('Erreur logout :', error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000814] text-white">
        Chargement...
      </div>
    );
  }

  return (
    <Router>
      {isLoggedIn && <Navbar onLogout={handleLogout} user={user} />}

      <Routes>
        <Route
          path="/"
          element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/accueil" />}
        />

        <Route
          path="/accueil"
          element={isLoggedIn ? <Home user={user} /> : <Navigate to="/" />}
        />

        <Route
          path="/produits"
          element={isLoggedIn ? <Produits /> : <Navigate to="/" />}
        />

        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/demandes"
          element={isLoggedIn ? <Demandes /> : <Navigate to="/" />}
        />

        <Route
          path="/historique"
          element={isLoggedIn ? <Historique /> : <Navigate to="/" />}
        />

        <Route
          path="/it-interface"
          element={isLoggedIn ? <InterfaceIT /> : <Navigate to="/" />}
        />

        <Route path="*" element={<Navigate to={isLoggedIn ? '/accueil' : '/'} />} />
      </Routes>
    </Router>
  );
}

export default App;