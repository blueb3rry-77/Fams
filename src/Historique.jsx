import React, { useState, useEffect } from 'react';

const API_URL = '/api';

const Historique = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const [total, setTotal] = useState(0);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_URL}?request=historique&limit=50&offset=0`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur chargement');
      setLogs(Array.isArray(data.logs) ? data.logs : []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(err.message || 'Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLogs(); }, []);

  const getActionStyle = (action) => {
    switch (action) {
      case 'Ajout':        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Modification': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Suppression':  return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Approbation':  return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Affectation':  return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:             return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) return <div className="min-h-screen bg-[#000814] text-white p-8 flex items-center justify-center"><span className="animate-pulse text-blue-400 font-black uppercase tracking-widest text-xs">Chargement...</span></div>;
  if (error)   return <div className="min-h-screen bg-[#000814] text-red-400 p-8 font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-[#000814] text-white p-8 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto">

        <div className="mb-12">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-blue-500">Journal d'Activité</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[3px]">
              Traçabilité des opérations Foundever — {total} entrées au total
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-[45px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-gray-800 to-transparent hidden md:block"></div>

          <div className="space-y-6">
            {logs.slice(0, visibleCount).map((log) => (
              <div key={log.id} className="relative flex flex-col md:flex-row gap-6 group">
                <div className="md:w-32 flex-shrink-0 pt-2">
                  <div className="text-[10px] font-black text-blue-400 uppercase italic leading-none">{log.date}</div>
                  <div className="text-[14px] font-bold text-gray-600 mt-1">{log.time}</div>
                </div>

                <div className="absolute left-[41px] top-3 h-2 w-2 rounded-full bg-[#000814] border-2 border-blue-500 z-10 hidden md:block group-hover:scale-150 transition-transform"></div>

                <div className="flex-1 bg-[#0A192F] border border-gray-800 p-6 rounded-[2rem] hover:border-blue-500/30 transition-all shadow-xl">
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase border ${getActionStyle(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-sm font-black italic text-gray-200 tracking-tight">{log.target}</span>
                    </div>
                    <div className="text-[9px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                      <span className="h-1 w-1 bg-gray-700 rounded-full"></span>
                      Par: <span className="text-gray-300">{log.user_nom}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs font-medium leading-relaxed italic">
                    "{log.details}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {visibleCount < logs.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount(c => c + 10)}
              className="bg-white/5 hover:bg-blue-600 hover:text-white text-gray-500 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[2px] border border-white/5 transition-all active:scale-95"
            >
              Charger plus d'historique
            </button>
          </div>
        )}
        {visibleCount >= logs.length && logs.length > 0 && (
          <div className="mt-12 text-center text-gray-700 text-[10px] font-black uppercase tracking-[2px] italic">
            Fin de l'historique récent
          </div>
        )}
      </div>
    </div>
  );
};

export default Historique;