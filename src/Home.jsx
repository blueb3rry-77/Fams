import React, { useState } from 'react';

const Home = () => {
  const [showChat, setShowChat] = useState(false);
  const [step, setStep] = useState('start');
  const [currentSolution, setCurrentSolution] = useState([]);

  const pannes = {
    micro: {
      label: "Le micro ne fonctionne pas",
      steps: [
        "1. Vérifiez si le bouton Mute est activé sur le câble.",
        "2. Allez dans Paramètres Son > Entrée > Sélectionnez 'Jabra Link'.",
        "3. Testez le micro sur une autre application (Teams/Zoom)."
      ]
    },
    audio: {
      label: "Pas de son (Audio muet)",
      steps: [
        "1. Augmentez le volume directement sur le casque.",
        "2. Vérifiez que le casque est bien branché au port USB.",
        "3. Redémarrez le service 'Audio Windows' dans les services."
      ]
    },
    bluetooth: {
      label: "Problème de Bluetooth",
      steps: [
        "1. Maintenez le bouton Bluetooth du casque pendant 3 secondes.",
        "2. Supprimez le casque des appareils couplés et reconnectez-le.",
        "3. Mettez à jour le firmware via Jabra Direct."
      ]
    }
  };

  const handleDiagnosis = (key) => {
    setCurrentSolution(pannes[key].steps);
    setStep('solution');
  };

  const resetChat = () => {
    setStep('start');
    setCurrentSolution([]);
  };

  return (
    <div className="min-h-screen bg-[#000814] text-white font-sans overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <div className="relative h-[85vh] flex items-center px-10 lg:px-20 overflow-hidden border-b border-white/5">
        <div className="relative z-10 max-w-3xl">
          <span className="text-blue-500 font-black uppercase tracking-[0.6em] text-[10px] mb-4 block animate-pulse">
            Official Foundever IT Portal
          </span>
          <h1 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-8">
            Superior <br /> <span className="text-gray-500 hover:text-blue-600 transition-colors duration-500">Audio Hub</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl font-medium border-l-4 border-blue-600 pl-6 backdrop-blur-sm bg-black/5 py-2">
            Bienvenue sur <span className="text-white font-bold">FAMS</span>. La plateforme centralisée pour l'inventaire, le suivi des affectations et la maintenance technique Jabra.
          </p>
        </div>

        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[60%] opacity-30 lg:opacity-100 pointer-events-none">
          <img 
            src={`${import.meta.env.BASE_URL}Jabra evolve professionnel.jpg`} 
            alt="Jabra Headset" 
            className="w-full h-auto drop-shadow-[0_0_80px_rgba(37,99,235,0.4)] animate-float"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-10 lg:px-20 -translate-y-1/2 z-20 relative">
        {[
          { label: "Casques en Stock", val: "124" },
          { label: "Affectations", val: "89" },
          { label: "En Réparation", val: "12" },
          { label: "Disponibilité", val: "94%" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#0A192F] border border-white/5 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-black italic text-blue-500">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* 3. Section: Contact & Support */}
      <div className="py-24 px-10 lg:px-20 bg-gradient-to-b from-[#0A192F]/30 to-transparent">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-black italic uppercase mb-6 tracking-tighter">Assistance <span className="text-blue-600">&</span> Support</h2>
            <p className="text-gray-400 mb-10 leading-relaxed text-lg">
              Une panne ? Un besoin de matériel ? Notre support technique FAMS intervient pour assurer la continuité de votre production.
            </p>
            <div className="space-y-6">
              <div className="group flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600/10 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-all">📧</div>
                <span className="text-gray-300 font-bold uppercase text-[11px] tracking-widest">support.it@foundever.com</span>
              </div>
              <div className="group flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600/10 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-all shrink-0">📍</div>
                <span className="text-gray-400 font-medium text-xs leading-relaxed">
                  Bd Al Qods, CasaNearShore Park, shore 9B, <br />
                  <span className="text-blue-500 font-black">Sidi Maarouf, Casablanca 20190</span>
                </span>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[2.6rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0A192F] border border-gray-800 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-blue-600/40 animate-bounce">🤖</div>
                <div>
                  <h4 className="font-black uppercase italic text-md tracking-widest">FAMS Virtual Assistant</h4>
                  <p className="text-[10px] text-green-500 font-black uppercase flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Système Opérationnel
                  </p>
                </div>
              </div>
              
              <div className="bg-[#000814]/50 border border-white/5 rounded-2xl p-6 mb-8 text-sm text-gray-400 italic leading-relaxed">
                "Besoin d'un diagnostic rapide pour votre Jabra Evolve ? Je suis là pour vous guider étape par étape."
              </div>
              
              <button 
                onClick={() => { setShowChat(true); resetChat(); }}
                className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-600/20"
              >
                Démarrer le Dépannage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* الـ Chatbot Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-[#000814]/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-[#0A192F] w-full max-w-lg rounded-[3rem] border border-blue-500/20 overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.15)]">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-blue-600/5">
              <h3 className="font-black italic uppercase tracking-widest text-xs text-blue-500">Diagnostic Système</h3>
              <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-white transition-colors">✕</button>
            </div>

            <div className="p-10 min-h-[350px] flex flex-col justify-center">
              {step === 'start' ? (
                <div className="space-y-8">
                  <p className="text-gray-400 text-center text-sm font-medium">Quel dysfonctionnement constatez-vous ?</p>
                  <div className="grid gap-3">
                    {Object.keys(pannes).map((key) => (
                      <button 
                        key={key}
                        onClick={() => handleDiagnosis(key)} 
                        className="bg-white/5 hover:bg-blue-600 p-5 rounded-2xl border border-white/5 transition-all text-left flex justify-between items-center group"
                      >
                        <span className="text-[10px] font-black uppercase tracking-wider">{pannes[key].label}</span>
                        <span className="text-blue-500 group-hover:text-white transition-transform group-hover:translate-x-2">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-blue-500/20"></div>
                    <h4 className="text-blue-500 font-black uppercase text-[10px] tracking-widest px-4">Protocole de Résolution</h4>
                    <div className="h-px flex-1 bg-blue-500/20"></div>
                  </div>
                  <div className="space-y-3">
                    {currentSolution.map((s, i) => (
                      <div key={i} className="bg-[#000814]/50 p-5 rounded-2xl text-[11px] text-gray-300 border border-white/5 italic leading-relaxed hover:border-blue-500/30 transition-colors">
                        {s}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={resetChat}
                    className="w-full mt-6 py-4 rounded-xl text-[9px] font-black uppercase text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                  >
                    ← Retourner aux options
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(2deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Home;