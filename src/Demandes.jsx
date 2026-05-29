import React, { useState, useEffect } from 'react';

const API_URL = '/api';

const Demandes = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDemande, setNewDemande] = useState({ agent: '', type: '', priority: 'Moyenne' });

  const loadDemandes = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_URL}?request=demandes`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur chargement');
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDemandes(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}?request=demandes`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, statut: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Erreur mise à jour');
      loadDemandes();
    } catch (err) { alert(err.message); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}?request=demandes`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDemande),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Erreur ajout');
      setShowAddModal(false);
      setNewDemande({ agent: '', type: '', priority: 'Moyenne' });
      loadDemandes();
    } catch (err) { alert(err.message); }
  };

  const filteredRequests = requests.filter(req =>
    filterStatus === 'Tous' || req.statut === filterStatus
  );

  if (loading) return <div className="min-h-screen bg-[#000814] text-white p-8 flex items-center justify-center"><span className="animate-pulse text-blue-400 font-black uppercase tracking-widest text-xs">Chargement...</span></div>;
  if (error)   return <div className="min-h-screen bg-[#000814] text-red-400 p-8 font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-[#000814] text-white p-8 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-blue-500">Demandes Agents</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-blue-500/10 text-blue-400 text-[10px] px-3 py-1 rounded-full font-black uppercase border border-blue-500/20">
                {requests.filter(r => r.statut === 'En attente').length} Nouvelles requêtes
              </span>
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[2px]">Foundever Support System</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-blue-600/20 transition-all"
          >
            + Nouvelle Demande
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8 bg-[#0A192F]/50 p-6 rounded-[2rem] border border-gray-800/50 backdrop-blur-sm">
          <span className="text-[9px] font-black uppercase text-gray-500 tracking-[2px] mr-4">Statut :</span>
          {['Tous', 'En attente', 'Approuvé', 'Refusé'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all ${
                filterStatus === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="bg-[#0A192F] rounded-[2.5rem] overflow-hidden border border-gray-800 shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase text-gray-500 font-black tracking-widest border-b border-gray-800">
                <th className="py-6 px-10">Agent Info</th>
                <th>Type de Demande</th>
                <th>Priorité</th>
                <th>Statut</th>
                <th className="text-right px-10">Décision</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-all">
                  <td className="py-6 px-10">
                    <div className="font-black italic text-gray-200 text-sm tracking-tight">{req.agent}</div>
                    <div className="text-[9px] text-gray-500 uppercase">{req.created_at?.slice(0, 10)}</div>
                  </td>
                  <td className="font-bold text-blue-400 italic">{req.type_demande}</td>
                  <td>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                      req.priorite === 'Urgent' ? 'border-red-500/50 text-red-500' :
                      req.priorite === 'Haute'  ? 'border-orange-500/50 text-orange-500' : 'border-gray-600 text-gray-500'
                    }`}>
                      {req.priorite}
                    </span>
                  </td>
                  <td>
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase ${
                      req.statut === 'Approuvé' ? 'bg-green-500/10 text-green-400' :
                      req.statut === 'Refusé'   ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {req.statut}
                    </span>
                  </td>
                  <td className="py-6 px-10 text-right space-x-2">
                    {req.statut === 'En attente' && (
                      <>
                        <button onClick={() => handleStatusChange(req.id, 'Approuvé')}
                          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-black uppercase text-[8px] transition-all">
                          Accepter
                        </button>
                        <button onClick={() => handleStatusChange(req.id, 'Refusé')}
                          className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-xl font-black uppercase border border-red-600/20 text-[8px] transition-all">
                          Refuser
                        </button>
                      </>
                    )}
                    {req.statut !== 'En attente' && (
                      <button onClick={() => handleStatusChange(req.id, 'En attente')}
                        className="text-gray-600 hover:text-gray-400 text-[8px] font-black uppercase italic">
                        Réinitialiser
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRequests.length === 0 && (
            <div className="py-20 text-center text-gray-700 font-black uppercase italic text-xs tracking-widest">
              Aucune demande trouvée
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0A192F] w-full max-w-md rounded-[2.5rem] border border-blue-500/30 p-10 relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">✕</button>
            <h3 className="font-black italic uppercase text-blue-500 mb-6">Nouvelle Demande</h3>
            <form className="space-y-4" onSubmit={handleAdd}>
              <input required type="text" placeholder="Nom de l'agent"
                className="w-full bg-black/50 border border-gray-800 p-4 rounded-xl text-xs outline-none focus:border-blue-600"
                value={newDemande.agent} onChange={(e) => setNewDemande({ ...newDemande, agent: e.target.value })} />
              <input required type="text" placeholder="Type de demande"
                className="w-full bg-black/50 border border-gray-800 p-4 rounded-xl text-xs outline-none focus:border-blue-600"
                value={newDemande.type} onChange={(e) => setNewDemande({ ...newDemande, type: e.target.value })} />
              <select className="w-full bg-black/50 border border-gray-800 p-4 rounded-xl text-xs outline-none focus:border-blue-600 text-gray-300"
                value={newDemande.priority} onChange={(e) => setNewDemande({ ...newDemande, priority: e.target.value })}>
                <option value="Basse">Basse</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Haute">Haute</option>
                <option value="Urgent">Urgent</option>
              </select>
              <button type="submit" className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest mt-4">
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Demandes;