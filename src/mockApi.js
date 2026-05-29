const originalFetch = window.fetch;

const initialCasques = [
  { id_casque: 1, numero_serie: 'SN-JAB-001', marque: 'Jabra', etat: 'Disponible', created_at: '2026-03-31 09:15:00' },
  { id_casque: 2, numero_serie: 'SN-JAB-002', marque: 'Jabra', etat: 'Affecté', created_at: '2026-03-31 09:15:00' },
  { id_casque: 3, numero_serie: 'SN-JAB-003', marque: 'Jabra', etat: 'Maintenance', created_at: '2026-03-31 09:15:00' },
  { id_casque: 4, numero_serie: 'SN-JAB-004', marque: 'Jabra', etat: 'Disponible', created_at: '2026-03-31 09:15:00' },
  { id_casque: 5, numero_serie: 'SN-JAB-005', marque: 'Logitech', etat: 'Disponible', created_at: '2026-03-31 09:15:00' },
  { id_casque: 6, numero_serie: 'SN-JAB-006', marque: 'Logitech', etat: 'Affecté', created_at: '2026-03-31 09:15:00' },
];

const initialDemandes = [
  { id: 1, agent: 'Sami Alami', type_demande: 'Nouveau Casque (Jabra 65)', priorite: 'Haute', statut: 'En attente', created_at: '2026-03-29 16:45:00' },
  { id: 2, agent: 'Nadia Tazi', type_demande: 'Mousses de rechange', priorite: 'Moyenne', statut: 'Approuvé', created_at: '2026-03-29 16:45:00' },
  { id: 3, agent: 'Karim Bennani', type_demande: 'Microphone non fonctionnel', priorite: 'Urgent', statut: 'Refusé', created_at: '2026-03-29 16:45:00' },
];

const initialHistorique = [
  { id: 1, action: 'Ajout', target: 'SN-JAB-001', user_nom: 'Admin_Salma', details: 'Nouveau Jabra Evolve 65 ajouté', created_at: '2026-03-31 09:15:00' },
  { id: 2, action: 'Modification', target: 'SN-JAB-004', user_nom: 'Admin_Jaouad', details: 'Changement utilisateur', created_at: '2026-03-30 14:20:00' },
];

if (!localStorage.getItem('fams_casques')) localStorage.setItem('fams_casques', JSON.stringify(initialCasques));
if (!localStorage.getItem('fams_demandes')) localStorage.setItem('fams_demandes', JSON.stringify(initialDemandes));
if (!localStorage.getItem('fams_historique')) localStorage.setItem('fams_historique', JSON.stringify(initialHistorique));

const ok = (data) => Promise.resolve({
  ok: true,
  json: () => Promise.resolve(data)
});

window.fetch = async (url, options) => {
  if (typeof url === 'string' && url.includes('/api')) {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 400));
    
    // Determine request URL parameters
    const urlString = url.startsWith('http') ? url : window.location.origin + url;
    const urlObj = new URL(urlString);
    const request = urlObj.searchParams.get('request');
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.parse(options.body) : null;

    if (request === 'auth') {
      if (method === 'POST') {
        if (body.email === 'admin@foundever.com' || body.email === 'it@foundever.com') {
          return ok({ success: true, user: { id: 1, nom: body.email.split('@')[0], email: body.email, role: body.email.startsWith('admin') ? 'admin' : 'it' } });
        }
        return ok({ success: false, message: 'Identifiants invalides (utilisez admin@foundever.com ou it@foundever.com)' });
      }
      if (method === 'GET') {
        return ok({ loggedIn: false });
      }
      if (method === 'DELETE') {
        return ok({ success: true });
      }
    }

    if (request === 'casques') {
      let casques = JSON.parse(localStorage.getItem('fams_casques'));
      if (method === 'GET') return ok({ success: true, data: casques });
      if (method === 'POST') {
        const newC = { id_casque: Date.now(), ...body, created_at: new Date().toISOString() };
        casques.push(newC);
        localStorage.setItem('fams_casques', JSON.stringify(casques));
        return ok({ success: true, id: newC.id_casque });
      }
      if (method === 'PUT') {
        casques = casques.map(c => c.id_casque == body.id_casque ? { ...c, ...body } : c);
        localStorage.setItem('fams_casques', JSON.stringify(casques));
        return ok({ success: true });
      }
      if (method === 'DELETE') {
        const id = urlObj.searchParams.get('id');
        casques = casques.filter(c => c.id_casque != id);
        localStorage.setItem('fams_casques', JSON.stringify(casques));
        return ok({ success: true });
      }
    }

    if (request === 'demandes') {
      let demandes = JSON.parse(localStorage.getItem('fams_demandes'));
      if (method === 'GET') return ok({ success: true, data: demandes });
      if (method === 'POST') {
        const newD = { id: Date.now(), ...body, created_at: new Date().toISOString() };
        demandes.push(newD);
        localStorage.setItem('fams_demandes', JSON.stringify(demandes));
        return ok({ success: true });
      }
      if (method === 'PUT') {
        demandes = demandes.map(d => d.id == body.id ? { ...d, statut: body.statut } : d);
        localStorage.setItem('fams_demandes', JSON.stringify(demandes));
        return ok({ success: true });
      }
    }

    if (request === 'historique') {
      return ok({ success: true, data: JSON.parse(localStorage.getItem('fams_historique')) });
    }
    
    return ok({ success: false, message: 'Unknown request' });
  }

  return originalFetch(url, options);
};
