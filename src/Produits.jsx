import React from 'react';
import { useNavigate } from 'react-router-dom';

const Produits = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Jabra Evolve 65",
      type: "Sans-fil (Bluetooth)",
      image: `${import.meta.env.BASE_URL}Casque Jabra evolve 65.png`,
      features: ["Double connectivité", "Autonomie 14h", "Témoin lumineux (Busylight)"],
      sn_example: "SN-FTX-001238",
      status: "En stock"
    },
    {
      id: 2,
      name: "Jabra Biz 2300",
      type: "Filaire (USB)",
      image: `${import.meta.env.BASE_URL}Jabra biz 2300.jpg`,
      features: ["Microphone anti-bruit", "Bras pivotant 360°", "Confort ultra-léger"],
      sn_example: "SN-ELT-009872",
      status: "Disponible"
    }
  ];

  return (
    <div className="min-h-screen bg-[#000B1A] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-12 max-w-6xl mx-auto">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Nos Produits</h1>
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-2">Gestion du catalogue Casques</p>
        </div>
        
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {products.map((item) => (
          <div key={item.id} className="bg-[#0A192F] border border-gray-800 rounded-[2.5rem] p-8 hover:border-blue-600 transition-all group shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Image Section */}
              <div className="bg-[#0D2137] p-6 rounded-3xl border border-gray-800 w-full lg:w-48 h-48 flex items-center justify-center">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_10px_30px_rgba(37,99,235,0.3)]" 
                />
              </div>

              {/* Info Section */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-black italic uppercase tracking-tight">{item.name}</h2>
                  <span className="text-[8px] bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full font-bold uppercase">{item.status}</span>
                </div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4">{item.type}</p>
                
                <div className="space-y-2 mb-6">
                  {item.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-gray-300">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      {feat}
                    </div>
                  ))}
                </div>

                <div className="bg-[#0D2137]/50 p-3 rounded-xl border border-gray-800">
                  <p className="text-[8px] text-gray-500 uppercase mb-1 font-bold">S/N:</p>
                  <p className="text-xs font-mono text-blue-300">{item.sn_example}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Produits;