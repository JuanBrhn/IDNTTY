const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '2160401',
  key: '3f2e85fafca817cc9e2c',
  secret: 'f1eb0f6cf58ac138b3d1',
  cluster: 'eu',
  useTLS: true
});

// Contador por pantalla en memoria
let contadores = {};
let totalConectados = 0;

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    const { pantalla } = req.body || {};
    if (!pantalla) return res.status(400).json({ error: 'Falta pantalla' });

    if (!contadores[pantalla]) contadores[pantalla] = 0;
    contadores[pantalla]++;

    // Emitir actualización al control en tiempo real
    await pusher.trigger('idntty-control', 'confirmacion', {
      pantalla: pantalla,
      llegados: contadores[pantalla]
    });

    return res.status(200).json({ ok: true, llegados: contadores[pantalla] });
  }

  if (req.method === 'GET') {
    const { pantalla } = req.query || {};
    return res.status(200).json({
      pantalla: pantalla || null,
      llegados: pantalla ? (contadores[pantalla] || 0) : contadores
    });
  }

  // Resetear contadores
  if (req.method === 'DELETE') {
    contadores = {};
    await pusher.trigger('idntty-control', 'confirmacion', { pantalla: null, llegados: 0, reset: true });
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
