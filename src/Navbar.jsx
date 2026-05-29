import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout, user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path
      ? 'text-white border-b-4 border-blue-600'
      : 'text-gray-400 hover:text-white border-b-4 border-transparent';

  const handleLogoutClick = async () => {
    await onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-[#000814] h-20 px-8 flex items-center sticky top-0 z-50 shadow-2xl border-b border-white/5 font-sans">
      <div className="max-w-[1600px] mx-auto w-full flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/accueil')}>
          <img
            src={`${import.meta.env.BASE_URL}logo foundevr.png`}
            alt="Logo"
            className="w-12 h-12 object-contain drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]"
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none text-white">
              Fams
            </h1>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-blue-500 mt-1">
              Foundever Asset Management
            </span>
          </div>
        </div>

        <div className="flex gap-8 items-center h-20">
          <Link to="/accueil" className={`flex items-center h-full px-2 text-[10px] font-black uppercase tracking-widest transition-all ${isActive('/accueil')}`}>
            Accueil
          </Link>

          <Link to="/produits" className={`flex items-center h-full px-2 text-[10px] font-black uppercase tracking-widest transition-all ${isActive('/produits')}`}>
            Produits
          </Link>

          <Link to="/dashboard" className={`flex items-center h-full px-2 text-[10px] font-black uppercase tracking-widest transition-all ${isActive('/dashboard')}`}>
            Inventaire
          </Link>

          <Link to="/demandes" className={`flex items-center h-full px-2 text-[10px] font-black uppercase tracking-widest transition-all ${isActive('/demandes')}`}>
            Demandes
          </Link>

          <Link to="/it-interface" className={`flex items-center h-full px-2 text-[10px] font-black uppercase tracking-widest transition-all ${isActive('/it-interface')}`}>
            Service IT 🔧
          </Link>

          <Link to="/historique" className={`flex items-center h-full px-2 text-[10px] font-black uppercase tracking-widest transition-all ${isActive('/historique')}`}>
            Historique
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user?.nom && (
            <span className="text-xs text-gray-300 font-semibold hidden lg:block">
              {user.nom}
            </span>
          )}

          <button
            onClick={handleLogoutClick}
            className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;