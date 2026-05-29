import React, { useState } from 'react';

const InterfaceIT = () => {
  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false); 
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanResult(null);
    
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        id: "SN-JB-2026-9901", 
        name: "Jabra Evolve 65 MS Stereo",
        status: "En Stock",
        location: "Foundever - Zone A"
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#000814] text-white p-6 lg:p-10 font-sans relative">
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              IT <span className="text-blue-500 text-5xl">HUB</span> 
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.5em] mt-2">Foundever Asset Management</p>
          </div>
          
          <div className="flex gap-10">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest">System Status</p>
              <p className="text-sm font-mono font-bold text-green-500">ONLINE</p>
            </div>
            <div className="text-right border-l border-white/10 pl-10">
              <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Total S/N</p>
              <p className="text-sm font-mono font-bold text-blue-500">1,245</p>
            </div>
          </div>
        </div>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "En Stock", val: "124", color: "text-blue-500", icon: "📦" },
            { label: "En Réparation", val: "18", color: "text-orange-500", icon: "🔧" },
            { label: "Assignés", val: "850", color: "text-green-500", icon: "🎧" },
            { label: "Alertes", val: "03", color: "text-red-500", icon: "⚠️" }
          ].map((s, i) => (
            <div key={i} className="bg-[#0A192F] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between shadow-xl">
              <div>
                <p className="text-[9px] font-black uppercase text-gray-500 mb-1">{s.label}</p>
                <h3 className={`text-2xl font-black ${s.color}`}>{s.val}</h3>
              </div>
              <span className="text-2xl opacity-30">{s.icon}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: ACTIONS --- */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-900 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
              <h2 className="text-xs font-black uppercase text-white mb-8 italic tracking-widest relative z-10">Opérations IT</h2>
              <div className="space-y-4 relative z-10">
                <button onClick={() => setShowModal(true)} className="w-full bg-white text-blue-900 py-5 rounded-2xl font-black uppercase text-[11px] hover:shadow-xl transition-all active:scale-95">
                   Nouvelle Affectation
                </button>
                <button onClick={() => setShowScanner(true)} className="w-full bg-black/20 border border-white/20 text-white py-5 rounded-2xl font-black uppercase text-[11px] hover:bg-black/40 transition-all">
                   Scanner Inventaire (S/N)
                </button>
              </div>
            </div>

            <div className="bg-[#0A192F] border border-white/5 p-8 rounded-[2.5rem]">
              <h2 className="text-[10px] font-black uppercase text-gray-500 mb-8 italic tracking-widest">Répartition Matériel</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] mb-3 font-bold uppercase"><span>Jabra (Active S/N)</span><span className="text-blue-400">70%</span></div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[70%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-3 font-bold uppercase"><span>Logitech (Active S/N)</span><span className="text-purple-400">20%</span></div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full w-[20%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: TABLE --- */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#0A192F] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <h3 className="text-sm font-black uppercase italic text-gray-300 tracking-widest font-mono">Inventory Tracking</h3>
                </div>
                <button className="text-[10px] text-gray-500 font-black hover:text-white uppercase tracking-tighter">Refresh List</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-black/30 text-[9px] uppercase font-black text-gray-600 tracking-widest border-b border-white/5">
                    <tr>
                      <th className="py-6 px-10">Serial Number (S/N)</th>
                      <th>Agent Affecté</th>
                      <th>État</th>
                      <th className="text-right px-10">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-medium">
                    {[
                      { sn: "SN-442988122", agent: "Mohamed EL AMRI", status: "Diagnostic", color: "text-orange-500", bg: "bg-orange-500/10" },
                      { sn: "SN-990112340", agent: "Sami ALAMI", status: "Hors Service", color: "text-red-500", bg: "bg-red-500/10" },
                      { sn: "SN-112003341", agent: "Ibtissam RAJI", status: "Opérationnel", color: "text-green-500", bg: "bg-green-500/10" }
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-7 px-10 font-mono text-blue-400 font-bold">{row.sn}</td>
                        <td className="font-bold text-gray-300 uppercase">{row.agent}</td>
                        <td><span className={`${row.bg} ${row.color} px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest`}>{row.status}</span></td>
                        <td className="text-right px-10">
                          <button className="bg-white/5 hover:bg-blue-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all">Histo</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL 1: AFFECTATION --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#0A192F] w-full max-w-md p-12 rounded-[3.5rem] border border-blue-500/30">
            <h2 className="text-3xl font-black italic uppercase text-white mb-2 tracking-tighter">Affectation</h2>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-10 text-center">Lier un S/N à un matricule</p>
            <div className="space-y-6">
              <input type="text" placeholder="Entrez le S/N du casque..." className="w-full bg-black/40 border border-gray-800 p-6 rounded-3xl text-sm outline-none focus:border-blue-500 font-mono text-white" />
              <input type="text" placeholder="Matricule Agent..." className="w-full bg-black/40 border border-gray-800 p-6 rounded-3xl text-sm outline-none focus:border-blue-500 font-mono text-white" />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 font-black uppercase text-[10px] text-gray-500">Fermer</button>
                <button onClick={() => setShowModal(false)} className="flex-[2] bg-blue-600 py-5 rounded-3xl font-black uppercase text-[10px] shadow-xl shadow-blue-600/30">Valider</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: SCANNER --- */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[110] p-6">
          <div className="bg-[#0A192F] w-full max-w-lg p-10 rounded-[3.5rem] border border-blue-500/20 text-center relative overflow-hidden">
            <h2 className="text-2xl font-black italic uppercase mb-2">Laser S/N Scan</h2>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-8">Simulation lecture Code à barres</p>

            <div className="relative w-full aspect-video bg-black/60 rounded-3xl mb-8 flex items-center justify-center border-2 border-dashed border-white/10 overflow-hidden">
              {isScanning ? (
                <div className="w-full h-full relative">
                  <div className="absolute w-full h-1 bg-blue-500 shadow-[0_0_20px_#3b82f6] animate-scan-line"></div>
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-500/5 animate-pulse">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">Searching S/N...</span>
                  </div>
                </div>
              ) : scanResult ? (
                <div className="p-8 text-left w-full animate-in zoom-in duration-300">
                   <p className="text-blue-500 font-black text-[10px] uppercase mb-2">S/N Détecté :</p>
                   <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <p className="text-xl font-black italic text-white uppercase">{scanResult.name}</p>
                      <p className="text-[12px] font-mono text-blue-400 mt-2 font-bold">{scanResult.id}</p>
                      <div className="flex justify-between mt-6 border-t border-white/5 pt-4">
                        <span className="bg-green-500/20 text-green-500 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase">{scanResult.status}</span>
                        <span className="text-[9px] font-bold text-gray-600 uppercase italic">{scanResult.location}</span>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-20">
                  <span className="text-6xl mb-4">📷</span>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Scanner le S/N du casque</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={() => {setShowScanner(false); setScanResult(null);}} className="flex-1 font-black uppercase text-[10px] text-gray-500">Quitter</button>
              {!scanResult ? (
                <button onClick={handleStartScan} className="flex-[2] bg-blue-600 py-5 rounded-3xl font-black uppercase text-[10px] shadow-lg shadow-blue-600/30">Lancer Scan</button>
              ) : (
                <button onClick={() => setScanResult(null)} className="flex-[2] bg-white text-blue-900 py-5 rounded-3xl font-black uppercase text-[10px]">Autre Scan</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- CSS ANIMATIONS --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-line {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          position: absolute;
          width: 100%;
          animation: scan-line 2s linear infinite;
        }
      `}} />
    </div>
  );
};

export default InterfaceIT;