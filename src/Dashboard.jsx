import React, { useEffect, useMemo, useState } from 'react';

const API_URL = '/api';

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newItem, setNewItem] = useState({
    numero_serie: '',
    marque: '',
    etat: 'Disponible',
  });

  const loadCasques = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`${API_URL}?request=casques`, {
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur chargement inventaire');
      }

      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCasques();
  }, []);

  const openEditModal = (item) => {
    setCurrentItem({
      id_casque: item.id_casque,
      numero_serie: item.numero_serie,
      marque: item.marque,
      etat: item.etat,
    });
    setShowEditModal(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}?request=casques`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erreur ajout casque');
      }

      setShowAddModal(false);
      setNewItem({
        numero_serie: '',
        marque: '',
        etat: 'Disponible',
      });

      loadCasques();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}?request=casques`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentItem),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erreur modification casque');
      }

      setShowEditModal(false);
      setCurrentItem(null);
      loadCasques();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Supprimer ce casque ?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}?request=casques&id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erreur suppression casque');
      }

      loadCasques();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredData = useMemo(() => {
    return inventory.filter((item) => {
      const sn = (item.numero_serie || '').toLowerCase();
      const marque = (item.marque || '').toLowerCase();
      const etat = item.etat || '';

      const matchesSearch =
        sn.includes(searchTerm.toLowerCase()) ||
        marque.includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === 'Tous' ||
        etat === activeFilter ||
        (activeFilter === 'En service' && etat === 'Affecté') ||
        (activeFilter === 'En réparation' && etat === 'Maintenance');

      return matchesSearch && matchesFilter;
    });
  }, [inventory, searchTerm, activeFilter]);

  if (loading) {
    return <div className="min-h-screen bg-[#000814] text-white p-8">Chargement...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#000814] text-red-400 p-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#000814] text-white p-8 lg:p-12 font-sans relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-blue-500">
              Inventory Hub
            </h2>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[2px] mt-2">
              {inventory.length} TOTAL ASSETS
            </p>
          </div>

          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full bg-[#0A192F] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-xs focus:border-blue-500 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-4 opacity-40">🔍</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#0A192F]/50 p-6 rounded-[2rem] border border-gray-800/50">
          <div className="flex items-center gap-2">
            {['Tous', 'En service', 'En réparation'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-blue-600/20 transition-all"
          >
            + Ajouter Nouveau
          </button>
        </div>

        <div className="bg-[#0A192F] rounded-[2.5rem] overflow-hidden border border-gray-800 shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase text-gray-500 font-black tracking-widest border-b border-gray-800">
                <th className="py-6 px-10">Détails</th>
                <th>Marque</th>
                <th>État</th>
                <th className="text-right px-10">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {filteredData.map((item) => (
                <tr key={item.id_casque} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-all">
                  <td className="py-6 px-10">
                    <div className="font-black italic text-gray-200 text-sm">{item.numero_serie}</div>
                    <div className="text-[9px] text-blue-500 font-bold uppercase">
                      ID: {item.id_casque}
                    </div>
                  </td>
                  <td className="font-bold text-gray-400 italic">{item.marque}</td>
                  <td>
                    <span
                      className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase ${
                        item.etat === 'Disponible'
                          ? 'bg-green-500/10 text-green-400'
                          : item.etat === 'Maintenance'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-blue-500/10 text-blue-400'
                      }`}
                    >
                      {item.etat}
                    </span>
                  </td>
                  <td className="py-6 px-10 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="bg-white/5 hover:bg-blue-600 text-blue-400 hover:text-white px-4 py-2 rounded-xl font-black uppercase border border-white/10 text-[8px] transition-all"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(item.id_casque)}
                      className="bg-white/5 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-xl font-black uppercase border border-white/10 text-[8px] transition-all"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 px-10 text-center text-gray-500">
                    Aucun casque trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0A192F] w-full max-w-md rounded-[2.5rem] border border-blue-500/30 p-10 relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              ✕
            </button>

            <h3 className="font-black italic uppercase text-blue-500 mb-6">Ajout Rapide</h3>

            <form className="space-y-4" onSubmit={handleAdd}>
              <input
                required
                type="text"
                placeholder="Numéro de série"
                className="w-full bg-black/50 border border-gray-800 p-4 rounded-xl text-xs outline-none focus:border-blue-600"
                value={newItem.numero_serie}
                onChange={(e) => setNewItem({ ...newItem, numero_serie: e.target.value })}
              />

              <input
                required
                type="text"
                placeholder="Marque"
                className="w-full bg-black/50 border border-gray-800 p-4 rounded-xl text-xs outline-none focus:border-blue-600"
                value={newItem.marque}
                onChange={(e) => setNewItem({ ...newItem, marque: e.target.value })}
              />

              <select
                className="w-full bg-black/50 border border-gray-800 p-4 rounded-xl text-xs outline-none focus:border-blue-600 text-gray-300"
                value={newItem.etat}
                onChange={(e) => setNewItem({ ...newItem, etat: e.target.value })}
              >
                <option value="Disponible">Disponible</option>
                <option value="Affecté">Affecté</option>
                <option value="Maintenance">Maintenance</option>
              </select>

              <button
                type="submit"
                className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest mt-4"
              >
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && currentItem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0A192F] w-full max-w-md rounded-[2.5rem] border border-green-500/30 p-10 relative shadow-2xl">
            <button onClick={() => setShowEditModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              ✕
            </button>

            <h3 className="font-black italic uppercase text-green-400 mb-6 tracking-widest">
              Modifier Matériel
            </h3>

            <form className="space-y-4" onSubmit={handleUpdate}>
              <div>
                <label className="text-[9px] uppercase text-gray-500 font-bold mb-1 block ml-2">
                  Numéro de série
                </label>
                <input
                  required
                  type="text"
                  value={currentItem.numero_serie}
                  className="w-full bg-black/50 border border-gray-800 p-4 rounded-xl text-xs outline-none focus:border-green-500"
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, numero_serie: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-[9px] uppercase text-gray-500 font-bold mb-1 block ml-2">
                  Marque
                </label>
                <input
                  required
                  type="text"
                  value={currentItem.marque}
                  className="w-full bg-black/50 border border-gray-800 p-4 rounded-xl text-xs outline-none focus:border-green-500"
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, marque: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-[9px] uppercase text-gray-500 font-bold mb-1 block ml-2">
                  État du matériel
                </label>
                <select
                  className="w-full bg-black/50 border border-gray-800 p-4 rounded-xl text-xs outline-none focus:border-green-500 text-gray-300"
                  value={currentItem.etat}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, etat: e.target.value })
                  }
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Affecté">Affecté</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest mt-4 shadow-lg shadow-green-600/20"
              >
                Mettre à jour
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;